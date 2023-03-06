import { NavBar } from "./NavBar";
import { SideBar } from "./sidBar";


import { Outlet } from "react-router";




export function Bars() {
  return (
    <div>
      <NavBar />
      <div className="sideBar_leyout">
        <SideBar />
        <Outlet />
      </div>
    </div>
  )
}