import { useEffect } from "react"
import { siteData } from "../data/siteData"
import { useFirestore } from "../services/competition"
import { useNavigate } from "react-router"











import "./NavBar.css"
import { FaBars } from 'react-icons/fa';
export const NavBar = ({toggle}) => {
  const { isLoading, error, userData: user, getUserByEmail } = useFirestore()
  const navigate = useNavigate()
  useEffect(() => {
    const userLoggedIn = JSON.parse(localStorage.getItem("user")).email
    if (userLoggedIn) {
      getUserByEmail(userLoggedIn)
    }
  }, [])
  function loginHandle() {
    navigate("/login")
  }
  function handleLogout() {
    navigate("/competitions-list")
    localStorage.removeItem("user")
  }
  function handleSidebarToggle() {
    toggle()
  }
  return <nav className="nav-container">
    <div style={{cursor:"pointer"}} onClick={handleSidebarToggle}>
      <FaBars size="40" />
    </div>
    <div className="image">
      <img alt={siteData.title}
        src={siteData.logo}
      />
    </div>
    <div className="button">
      {user ? <button onClick={loginHandle} className="logout-button">Logout</button> :
        <button onClick={() => { handleLogout }} className="login-button">Login</button>}

    </div>
  </nav>
}