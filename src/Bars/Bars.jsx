import { useState } from "react";
import { NavBar } from "./NavBar";
import { SideBar } from "./sidBar";
import { Outlet } from "react-router";

export function Bars() {
  const [toggled, setToggled] = useState(false);
  function handleToggle() {
    setToggled(!toggled);
  }
  return (
    <div>
      <div className="background" style={{ backgroundColor: "black", color: "white" }}>
        <div className="navbar" style={{ zIndex: "1" }}>
          <NavBar toggle={handleToggle} />
        </div>
        <div className={toggled?"toggledSideBar-outlet":"page-side-outlet"} >
          <div style={{ zIndex: "3" }} className={toggled ? "toggledSideBar" : "sideBar"}>
            <SideBar />
          </div>
          <div className="Outlet" style={{ paddingTop: "10vh", zIndex: "0" }}>
            <Outlet />
          </div>
        </div>
      </div>


    </div>
  );
}
