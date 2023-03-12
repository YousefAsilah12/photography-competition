import { useState, useEffect } from "react";
import { NavBar } from "./NavBar";
import { SideBar } from "./sidBar";
import { Outlet } from "react-router";
import { siteData } from "../data/siteData";

export function Bars() {
  const [toggled, setToggled] = useState(false);

  // Add a useEffect hook to detect screen width and toggle the sidebar accordingly

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 756) {
        setToggled(true);
      } 
      // else {
      //   setToggled(false);
      // }
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial state based on the screen width
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleToggle() {
    setToggled(!toggled);
  }
  return (
    <div>
      <div
      >
        <div className="navbar" style={{ zIndex: "1" }}>
          <NavBar toggle={handleToggle} />
        </div>
        <div className={toggled ? "toggledSideBar-outlet" : "page-side-outlet"}>
          <div style={{ zIndex: "3" }} className={`sideBarParent ${toggled ? "toggledSideBar" : "sideBar"} `}>
            <SideBar toggle={handleToggle} />
          </div>
          <div className="Outlet" style={{ paddingTop: "1vh", zIndex: "0" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
