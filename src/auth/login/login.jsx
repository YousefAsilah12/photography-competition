



import { useEffect, useState } from "react"
import { useFirestore } from "../../services/competition"
import { useNavigate } from 'react-router-dom'
import "./login.css"
export const Login = ({ onLogin }) => {
  const { data: users, isLoading, error, fetchData } = useFirestore()
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchData("users")
  }, [])

  function checkIfLoggedIn() {
    const user = JSON.parse(localStorage.getItem("user"))

    console.log(user);
    if (!user) {
      navigate("/login")
      return
    }
    if (user.email && user.password) {
      if (userFound(user.email, user.password)) {
        onLogin()
        navigate("/competitions-list")
      }
    }
  }


  function userFound(email, password) {
    const user = users.find(user => user.email === email && user.password === password)
    if (user) {
      return true
    }
    else {
      setMessage("user not found")
      return
    }
  }
  function loginHandle(e) {
    e.preventDefault()
    setMessage("")
    if (!password || !email) {
      setMessage("All fields are required")
      return
    }
    if (userFound(email, password)) {
      localStorage.setItem("user", JSON.stringify({ email, password }))
      onLogin()
      navigate("/competitions-list")
    }
  }
  return <div className="login-page">
    <div className="backdrop-login"></div>
    <div>
      <form className="form-login" onSubmit={loginHandle}>
        <div className="form-container">
          <div className="login-form-group">
            <h1 >Login Form</h1>

          </div>
          <div>

            <div className="login-form-group">
              <label htmlFor="email">Email</label>
              <input onChange={(e) => { setEmail(e.target.value) }} type="email" name="email" id="email" />
            </div>
            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <input onChange={(e) => { setPassword(e.target.value) }} type="password" name="password" id="password" />
            </div>
            <div>
              {message ? <h1>{message}</h1> : null}
            </div>
            <div className="login-form-group">
              <input type="submit" value="Login" className="login-submite-button" />
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
}