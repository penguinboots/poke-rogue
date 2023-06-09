import IconButton from "./IconButton";
import { useGameState } from "@/utils/context/GameStateContext";
import localFont from "next/font/local";

const vt = localFont({ src: "../../public/fonts/VT323-Regular.ttf" });

export default function Nav(props) {
  const {
    mode,
    isMusicPlaying,
    handleMusicToggle,
    windowTitle,
  } = props;
  const { gameState, windowToggle } = useGameState();

  return (
    <div className="nav-container">
      <nav className="nav-bar">
        <div className="nav-left">
          <div
            className="logo"
            style={{
              fontFamily: vt.style.fontFamily,
            }}
          >
            {mode === "DASH"
              ? windowTitle
              : gameState.currentRoom.name.toUpperCase()}
          </div>
        </div>
        <div className="nav-right">
          <IconButton
            buttonName="ACHIEVEMENTS"
            handleClick={() => windowToggle("achievements")}
          />
          <IconButton
            buttonName="SETTINGS"
            handleClick={() => windowToggle("settings")}
          />
          <IconButton
            buttonName={isMusicPlaying ? "MUTE_OFF" : "MUTE_ON"}
            handleClick={handleMusicToggle}
          />
        </div>
      </nav>
    </div>
  );
}
