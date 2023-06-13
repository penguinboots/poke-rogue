import React, { createContext, useContext, useState } from 'react';
import { dungeon } from '@/game/pregenerated/dungeon1';

const GameStateContext = createContext();

// Context state
export function useGameState() {
  return useContext(GameStateContext);
}

// Provider component
export function GameStateProvider({ children }) {
  const { mimikyu } = require("../../game/pregenerated/fakePlayer");
  const player = mimikyu;

  // General dungeon position states
  const [gameState, setGameState] = useState({
    currentFloor: dungeon.floor_1,
    currentRoom: dungeon.floor_1.room_1,
    roomType: dungeon.floor_1.room_1.type,
    opponent: dungeon.floor_1.room_1.opponent,
    player: player,
  });

  // Battle history logs
  const [battleHistory, setBattleHistory] = useState([]);

  // State managing allowable user actions
  const [turnMode, setTurnMode] = useState('player');

  // Battle result state
  const [battleWon, setBattleWon] = useState(false);

  // State managing Play-related popup windows
  const [popup, setPopup] = useState({
    intro: false,
    victory: false,
    defeat: false,
    treasure: false,
  });

  // Currently active animations for player and opponent
  const [sprites, setSprites] = useState({
    player: "idle",
    opponent: "idle",
    playerBuff: null,
    opponentBuff: null,
  });

  // States managing character animations
  const [gifReloadKeyPlayer, setGifReloadKeyPlayer] = useState(0);
  const [gifReloadKeyOpponent, setGifReloadKeyOpponent] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showOpponent, setShowOpponent] = useState(false);

  // State managing music per room
  const [selectedMusic, setSelectedMusic] = useState("00_pokemon_center.mp3");

  // State managing VS splash
  const [splash, setSplash] = useState(false);

  // Show splash, hide splash
  function flashSplash() {
    setSplash(true);
    setTimeout(() => {
      setSplash(false);
    }, 2500);
  }

  // Sets state to the first room of next floor, sets opponent, resets player HP/stats
  function nextFloor(nextFl) {
    const nextFloor = dungeon[nextFl];
    setGameState((prev) => ({
      ...prev,
      currentFloor: nextFloor,
      currentRoom: nextFloor.room_1,
      opponent: nextFloor.room_1.opponent,
      player: player,
    }));
    setBattleWon(false);
  }

  // Sets state to next room, resets player HP/stats, 
  function nextRoom() {
    if (gameState.currentRoom.next_room) {
      const nextRoom = gameState.currentFloor[gameState.currentRoom.next_room];
      setGameState((prev) => ({
        ...prev,
        currentRoom: nextRoom,
        roomType: nextRoom.type,
        opponent: nextRoom.opponent,
        player: player,
      }));
    } else {
      nextFloor(gameState.currentFloor.next_floor);
    }
    setBattleWon(false);
    setPopup({
      intro: false,
      victory: false,
      defeat: false,
      treasure: false,
    });
  }

  // Reset room progress to beginning (called from defeat popup)
  function loseGame() {
    setGameState({
      currentFloor: dungeon.floor_1,
      currentRoom: dungeon.floor_1.room_1,
      roomType: dungeon.floor_1.room_1.type,
      opponent: dungeon.floor_1.room_1.opponent,
      player: player,
    });
    setBattleWon(false);
    setPopup({
      intro: false,
      victory: false,
      defeat: false,
      treasure: false,
    });
  }

  // Sets current_hp in state for target to new value
  // Returns calculated new value using old state for combat processing
  const dealDamage = (target, amt) => {
    setGameState((prev) => ({
      ...prev,
      [target]: {
        ...prev[target],
        current_hp: Math.floor(prev[target]["current_hp"] - amt),
      },
    }));
    return (Math.floor(gameState[target].current_hp - amt));
  }

  // Sets current_hp in state for target to new value
  const dealHeal = (target, amt) => {
    setGameState((prev) => ({
      ...prev,
      [target]: {
        ...prev[target],
        current_hp: Math.floor(prev[target]["current_hp"] + amt),
      },
    }));
  }

  // Set state for sprite, given the character and action (idle, attack, hit)
  const playAnim = (char, anim) => {
    setSprites((prev) => ({
      ...prev,
      [char]: anim,
    }));
  }

  // Provide the state and functions through the context
  const value = {
    gameState,
    setGameState,
    turnMode,
    setTurnMode,
    battleWon,
    setBattleWon,
    popup,
    setPopup,
    sprites,
    setSprites,
    playAnim,
    nextRoom,
    dealDamage,
    dealHeal,
    battleHistory,
    setBattleHistory,
    gifReloadKeyPlayer,
    setGifReloadKeyPlayer,
    gifReloadKeyOpponent,
    setGifReloadKeyOpponent,
    showPlayer,
    setShowPlayer,
    showOpponent,
    setShowOpponent,
    loseGame,
    selectedMusic,
    setSelectedMusic,
    splash,
    setSplash,
    flashSplash,
  };
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );

}

export default GameStateContext;
