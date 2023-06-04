import { useState } from "react";
import Settings from "../home/Dashboard/Settings";
import IconButton from "./IconButton";

export default function Nav() {
  const [ settingOpen, setSettingOpen ] = useState(false);

  const settingClick = () => {
    setSettingOpen((prev) => !prev);
  }

  const closeSettings = () => {
    setSettingOpen(false);
  }

  return (
    <div className="nav-container">
      <nav className="nav-bar">
        <div className="nav-left">
          <div className="logo">PLACEHOLDER LOGO</div>
        </div>
        <div className="nav-right">
          <IconButton buttonName="Stickers" />
          <IconButton buttonName="Settings" handleClick={settingClick}/>
            { settingOpen && <Settings handleClick={closeSettings} />}
          <IconButton buttonName="Mute" />
        </div>
      </nav>
    </div>
  );
}