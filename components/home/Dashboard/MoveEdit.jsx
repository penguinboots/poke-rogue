import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFan,
  faArrowsLeftRight,
} from "@fortawesome/free-solid-svg-icons";
import MoveItem from "@/components/common/MoveItem";
import { useGameState } from "@/utils/context/GameStateContext";
import { moveFetcher } from "@/game/helpers/combat";
import { padMoves } from "@/utils/helpers/padMoves";
import { getMoves } from "@/prisma/helpers/getMoves";
import { useUser } from "@auth0/nextjs-auth0/client";
import { changeMoves } from "@/prisma/helpers/changeMoves";
import localFont from "next/font/local";

const vt = localFont({ src: "../../../public/fonts/VT323-Regular.ttf" });

export default function MoveEdit(props) {
  const { gameState, setGameState } = useGameState();
  const { user, error, isLoading } = useUser();

  // Introduce state for available moves, as array of objects
  const [knownMoveObjs, setKnownMoveObjs] = useState([]);

  // Generates array of move objects from array of move name strings
  const activeMoveObjs = [];
  gameState.player.moves.forEach((moveString) => {
    activeMoveObjs.push(moveFetcher(moveString));
  });

  // Initial state of chosenMoves (left of menu) is player moves (objects) from state
  const [chosenMoveObjs, setChosenMoveObjs] = useState(activeMoveObjs);

  // Fetch a new moves variable using a helper
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db_data = await getMoves(user);
        const db_moves = db_data.moves;

        const knownMoves = db_moves.filter(
          (db_move) => db_move.collected === true
        );
        const knownMoveObjects = knownMoves.map((move) =>
          moveFetcher(move.name)
        );
        setKnownMoveObjs(knownMoveObjects);
      } catch (error) {
        console.error("Error fetching moves:", error);
      }
    };

    fetchData();
  }, [user]);

  // Add new move to chosenMoves state if length < 4 and contains no duplicates
  function chooseNewMove(move) {
    if (chosenMoveObjs.length === 4) {
      console.log("Too many moves");
    } else if (chosenMoveObjs.some((moveObj) => moveObj === move)) {
      console.log("Move already exists");
    } else {
      setChosenMoveObjs((prev) => [...prev, move]);
    }
  }

  // Remove move from choseMoves state, reset length
  function removeChosenMove(move) {
    setChosenMoveObjs((prev) => {
      const newChosen = prev.filter((moveObj) => moveObj !== move);
      newChosen.length = Math.max(newChosen.length, 0);
      return newChosen;
    });
  }

  // Take array of move objects, return array of move names
  const chosenMoveStr = chosenMoveObjs
    .map((obj) => obj.name)
    .filter((name) => name !== null);

  // Generates MoveItems from array of move objects (chosen moves) in state
  const activeMoveItems = padMoves(
    Object.values(chosenMoveObjs).map((move) => {
      if (move) {
        return (
          <button key={move.name} onClick={() => removeChosenMove(move)}>
            <MoveItem id={move.name} move={move} loc="moveEdit" />
          </button>
        );
      }
    }),
    "button"
  );

  // Generates MoveItems from array of move objects (known moves) in state
  const knownMoveItems = Object.values(knownMoveObjs).map((move) => {
    if (move) {
      return (
        <button key={move.name} onClick={() => chooseNewMove(move)}>
          <MoveItem id={move.name} move={move} loc="moveEdit" />
        </button>
      );
    }
  });

  return (
    <div className="popup move-edit-window">
      <div className="close-window" onClick={props.handleClose}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <h2
        style={{
          fontFamily: vt.style.fontFamily,
        }}
      >
        EDIT MOVES
      </h2>
      <div className="move-edit-menu">
        <div className="moves-selected-container">
          <h3
            style={{
              fontFamily: vt.style.fontFamily,
            }}
          >
            SELECTED
          </h3>
          <div className="moves-selected">{activeMoveItems}</div>
        </div>
        <div className="move-arrows">
          <FontAwesomeIcon icon={faArrowsLeftRight} />
        </div>
        <div className="moves-avail-container">
          <h3
            style={{
              fontFamily: vt.style.fontFamily,
            }}
          >
            AVAILABLE
          </h3>
          {knownMoveItems.length > 0 ? (
            <div className="moves-avail">{knownMoveItems}</div>
          ) : (
            <>
              <FontAwesomeIcon className="spinner" icon={faFan} />
              <h4
                style={{
                  fontFamily: vt.style.fontFamily,
                  fontSize: "16px"
                }}
              >
                LOADING...
              </h4>
            </>
          )}
        </div>
      </div>
      <div className="window-controls">
        <button
          className={`save${Object.keys(chosenMoveObjs).length === 0 ? ' disabled' : ''}`}
          disabled={Object.keys(chosenMoveObjs).length === 0}
          onClick={() => {
            if (Object.keys(chosenMoveObjs).length === 0) {
              return; // Do nothing if there are no chosen moves
            }
            changeMoves(user, chosenMoveStr);
            props.handleClose();
            setGameState((prev) => ({
              ...prev,
              player: {
                ...prev.player,
                moves: chosenMoveStr,
              },
            }));
          }}
        >
          SAVE
        </button>
        <button className="cancel" onClick={props.handleClose}>
          CANCEL
        </button>
      </div>
    </div>
  );
}
