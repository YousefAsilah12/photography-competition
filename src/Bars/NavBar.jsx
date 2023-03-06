import { useEffect } from "react"
import { siteData } from "../data/siteData"
import { useFirestore } from "../services/competition"
import { useNavigate } from "react-router"











import "./NavBar.css"
export const NavBar = () => {
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
  return <nav className="nav-container">
    <div></div>
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