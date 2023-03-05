

import { useEffect, useState } from "react"
import "./register.css"
import { useFirestore } from "../../services/competition"
import { useNavigate } from 'react-router-dom'
export function Register() {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repassword, setrePassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const { isLoading, error, addDocument, data: users, fetchData, addedData: addedUser } = useFirestore()
  useEffect(() => {
    fetchData("users")
  }, [])


  if (isLoading) return <h1>Loading...</h1>
  if (error) return <h1>{error}</h1>

  function checkUserIncluded(newUser) {
    const userNameFound = users.find(user => user.userName === newUser.userName)
    const userEmailFound = users.find(user => user.email === newUser.email)
    if (userNameFound) {
      setMessage("username does exist")
      return true
    }
    if (userEmailFound) {
      setMessage("email does exist")
      return true
    }

    return false
  }
  async function registerHandle(e) {
    e.preventDefault()
    setMessage("")
    if (userName === "" || email === "" || password === "" || repassword === "") {
      setMessage("All fields are required")
      return
    }
    if (password !== repassword) {
      setMessage("passwords not match !")
      return
    }
    const registerObject = {
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      buyedImages: [],
      email,
      password,
      userName,
      rule: "user",
      voted: false,
    }
    if (checkUserIncluded(registerObject)) return
    try {
      await addDocument(registerObject, "users")
      if (addedUser) {
        afterLogin()
      }
    } catch (e) {
      setMessage(e.message)
    }
    function afterLogin() {
      const confirmMove = window.confirm("your accound created move to login ?");
      if (confirmMove) {
        navigate("/login")
      } else {
        setEmail("")
        setPassword("")
        setMessage("")
        setrePassword("")
        setUserName("")
        window.close();
      }
    }


  }
  return <form className="form-register" onSubmit={registerHandle}>
    <div className="register-form-group">
      <h1>register Form</h1>
    </div>
    <div className="register-form-group">
      <label htmlFor="userName">user name</label>
      <input onChange={(e) => setUserName(e.target.value)} type="text" maxLength="16" min="3" required name="userName" id="userName" />
    </div>
    <div className="register-form-group">
      <label htmlFor="email">Email</label>
      <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" required id="email" />
    </div>
    <div className="register-form-group">
      <label htmlFor="password">Password</label>
      <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" required id="password" />
    </div>
    <div className="register-form-group">
      <label htmlFor="re-password">retype password</label>
      <input onChange={(e) => setrePassword(e.target.value)} type="password" name="re-password" required id="re-password" />
    </div>
    <div className="register-form-group">
      <input type="submit" value="submit" className="register-submite-button" />
    </div>
    {message ? <h3>{message}</h3> : null}
  </form>
}