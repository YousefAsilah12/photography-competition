









import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { routerUser, routesAdmin, notLoggedINUser } from '../data/siteData'
import { useFirestore } from '../services/competition'
import "./sideBar.css"
export const SideBar = () => {
  const [Routes, setRoutes] = useState(routerUser)
  const { isLoading, error, userData, getUserByEmail } = useFirestore()
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
    if (userData) {
      if (userData[0].rule === "admin") {
        setRoutes(routesAdmin)
      }
      else if (userData[0].rule === "user") {
        setRoutes(routerUser)
      }
    }
  }, [userData])
  return <div className='side-bar-contaienr'>
    <nav className='sidebar-items'>
      {Routes.map((route, index) => {
        return <div key={index}>
          <Link to={route.path} >
            {route.label}
          </Link>
        </div>
      })}

    </nav>
  </div>
}