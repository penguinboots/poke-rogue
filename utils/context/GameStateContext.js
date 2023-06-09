import React, { createContext, useContext, useEffect, useState } from 'react';
import { dungeon } from '@/game/pregenerated/dungeon1';
import { items } from '@/game/data/items';
import achievements from '@/game/data/achievements'
import useIsMenuOpen from "@/utils/hooks/isMenuOpen";
import { achievementFetcher } from '@/game/helpers/combat/achievementFetcher';
import { getAchievements } from '@/prisma/helpers/getAchievements';
import { useUser } from '@auth0/nextjs-auth0/client';
import { earnAchievement } from '@/prisma/helpers/earnAchievement';

const defaultAchievements = Object.values(achievements)
const GameStateContext = createContext();

// Context state
export function useGameState() {
  return useContext(GameStateContext);
}

// Provider component
export function GameStateProvider({ children }) {
  const { user, isLoading } = useUser();

  const { mimikyu } = require("../../game/pregenerated/fakePlayer");
  const player = mimikyu;

  // Inventory
  const [itemList, setItemList] = useState(items)

  // General dungeon position states
  const [gameState, setGameState] = useState({
    currentFloor: dungeon.floor_1,
    currentRoom: dungeon.floor_1.room_1,
    roomType: dungeon.floor_1.room_1.type,
    opponent: dungeon.floor_1.room_1.opponent,
    player: player,
    itemList: itemList,
    achievements: defaultAchievements
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

  // Use menu hook
  const { isMenuOpen, setMenuOpen, windowToggle, windowClose } = useIsMenuOpen();

  // Show splash, hide splash
  function flashSplash() {
    setSplash(true);
    setTimeout(() => {
      setSplash(false);
    }, 2500);
  }

  // Fetch all user achievements, set into state
  // Called from Play useEffect
  async function fetchUserAchievements() {
    const response = await getAchievements(user);
    if (response && response.achievements) {
      const { achievements } = response;
      setGameState((prev) => ({
        ...prev,
        achievements: achievements
      }));
    }
  }
  const [earnedAchievement, setEarnedAchievement] = useState();
  // Keeps roomAchievement updated to achievement for current room
  const [roomAchievement, setRoomAchievement] = useState(achievementFetcher(gameState.currentRoom.achievement));
  useEffect(() => {
    setRoomAchievement(achievementFetcher(gameState.currentRoom.achievement));
  }, [gameState.currentRoom])

  // Check if user has achievement, if not - award achievement, show popup
  function handleAchievement(achievement) {
    if (gameState.achievements && achievement) {
      let matchingAchievement = false;
      for (const userAchievement of gameState.achievements) {
        if (userAchievement.name === achievement.name) {
          matchingAchievement = userAchievement;
          break;
        }
      }
      if (matchingAchievement.collected === false) {
        setEarnedAchievement(matchingAchievement);
        windowToggle("achievementPop");
        earnAchievement(user, achievement.name);
        setTimeout(() => windowClose("achievementPop"), 2000);
      }
    }
  };

  // Sets state to the first room of next floor, sets opponent, resets player HP/stats
  function nextFloor(nextFl) {
    const nextFloor = dungeon[nextFl];
    setGameState((prev) => ({
      ...prev,
      currentFloor: nextFloor,
      currentRoom: nextFloor.room_1,
      opponent: nextFloor.room_1.opponent,
      player: {
        ...prev.player,
        current_hp: gameState.player.stats.hp,
        statChanges: player.statChanges
      }
    }));
    setBattleHistory([]);
    setMenuOpen(prev => ({
      ...prev,
      achievements: false,
      settings: false,
      editMoves: false,
      inventory: false,
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
        player: {
          ...prev.player,
          current_hp: gameState.player.stats.hp,
          statChanges: player.statChanges
        }
      }));
      setBattleHistory([]);
      setMenuOpen(prev => ({
        ...prev,
        achievements: false,
        settings: false,
        editMoves: false,
        inventory: false,
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

  // FOR TESTING: Skips to snorlax3
  function skipToBoss() {
    setGameState((prev) => ({
      ...prev,
      currentFloor: dungeon.floor_3,
      currentRoom: dungeon.floor_3.room_5,
      roomType: dungeon.floor_3.room_5.type,
      opponent: dungeon.floor_3.room_5.opponent,
      player: {
        ...prev.player,
        current_hp: gameState.player.stats.hp,
        statChanges: player.statChanges
      }
    }));
  }

  // Reset room progress to beginning (called from defeat popup)
  function loseGame() {
    setGameState((prev) => ({
      ...prev,
      currentFloor: dungeon.floor_1,
      currentRoom: dungeon.floor_1.room_1,
      roomType: dungeon.floor_1.room_1.type,
      opponent: dungeon.floor_1.room_1.opponent,
      player: {
        ...prev.player,
        current_hp: gameState.player.stats.hp,
        statChanges: player.statChanges
      }
    }));
    setBattleHistory([]);
    setBattleWon(false);
    setPopup({
      intro: false,
      victory: false,
      defeat: false,
      treasure: false,
    });
  }

  // Reset room progress to beginning (called from game-end room)
  function winGame() {
    setGameState((prev) => ({
      ...prev,
      currentFloor: dungeon.floor_1,
      currentRoom: dungeon.floor_1.room_1,
      roomType: dungeon.floor_1.room_1.type,
      opponent: dungeon.floor_1.room_1.opponent,
      player: {
        ...prev.player,
        current_hp: gameState.player.stats.hp,
        statChanges: player.statChanges
      }
    }));
    setBattleHistory([]);
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
        current_hp: Math.max(Math.floor(prev[target]["current_hp"] - amt), 0),
      },
    }));
    return (Math.floor(gameState[target].current_hp - amt));
  }

  // Sets current_hp in state for target to new value
  const dealHeal = (target, amt) => {
    setGameState((prev) => {
      const maxHP = prev[target]["stats"]["hp"];
      return {
        ...prev,
        [target]: {
          ...prev[target],
          current_hp: Math.min(Math.floor(prev[target]["current_hp"] + amt), maxHP)
        },
      };
    });
  };

  // Set statChanges
  const changeStat = (target, obj) => {
    setGameState((prev) => ({
      ...prev,
      [target]: {
        ...prev[target],
        statChanges: {
          "attack": Math.max(Math.min(prev[target].statChanges["attack"] + obj["attack"], 6), -6),
          "defense": Math.max(Math.min(prev[target].statChanges["defense"] + obj["defense"], 6), -6),
          "special-attack": Math.max(Math.min(prev[target].statChanges["special-attack"] + obj["special-attack"], 6), -6),
          "special-defense": Math.max(Math.min(prev[target].statChanges["special-defense"] + obj["special-defense"], 6), -6),
          "speed": Math.max(Math.min(prev[target].statChanges["speed"] + obj["speed"], 6), -6),
        }
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
    changeStat,
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
    isMenuOpen,
    windowToggle,
    windowClose,
    skipToBoss,
    winGame,
    handleAchievement,
    roomAchievement,
    setRoomAchievement,
    fetchUserAchievements,
    earnedAchievement,
    setEarnedAchievement
  };
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );

}

export default GameStateContext;
