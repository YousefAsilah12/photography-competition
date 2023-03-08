import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import { routerUser, routesAdmin, notLoggedINUser } from '../data/siteData'
import { useFirestore } from '../services/competition'
import "./sideBar.css"
import Avatar from "react-avatar"
import { useNavigate } from 'react-router';
export const SideBar = () => {
  const [Routes, setRoutes] = useState(routerUser)
  const { isLoading, error, userData, getUserByEmail } = useFirestore()
  const [user, setUser] = useState("")
  const location = useLocation()
  const navigtate = useNavigate()

  useEffect(() => {
    const userLoggedIn = JSON.parse(localStorage.getItem('user'))
    if (!userLoggedIn) {
      setRoutes(notLoggedINUser)
    }
    if (userLoggedIn) {
      getUserByEmail(userLoggedIn.email)
    }
  }, [])


  useEffect(() => {
    debugger
    if (userData) {
      if (userData[0].rule === "admin") {
        setRoutes(routesAdmin)
      }
      else if (userData[0].rule === "user") {
        setRoutes(routerUser)
      }
      setUser(userData[0])
    }
  }, [userData])

  return (
    <div className='side-bar-contaienr'>
      {user ? <div onClick={() => { navigtate("/user-profile") }} className='user-info-sideBar' >
        <Avatar src={user.avatar} size="100" round={true} />
        <h1 >{user.userName}</h1>
        {user.rule === "admin" && <h1 className='userRule'>{user.rule}</h1> }
      </div> : null}
      <nav className='sidebar-items'>
        {Routes.map((route, index) => {
          const selected = location.pathname === route.path ? 'selected' : '';
          return (
            <div key={index}>
              <NavLink
                className={`nav-item ${selected}`}
                to={route.path}
              >
                {route.label}
              </NavLink>
            </div>
          )
        })}
      </nav>
    </div>
  );
}
