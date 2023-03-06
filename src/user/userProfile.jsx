import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { useFirestore } from "../services/competition";

import "./userProfile.css"
import Avatar from "react-avatar"
import { ImageComponent } from "../components/competition/imageComponent/Imgage";
import { isEqual } from 'lodash';
export function UserProfile() {
  const navigate = useNavigate()
  const { isLoading, error, getUserByEmail, userData: user, updateDocument, fetchData, data: users } = useFirestore()

  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [newUsers, setNewUsers] = useState([]);
  useEffect(() => {
    const userLoggedIn = JSON.parse(localStorage.getItem("user"));
    if (!userLoggedIn) {
      const confirm = window.confirm("You must be logged in to buy an image");
      if (confirm) {
        navigate("/login");
      }
      else {
        window.close();
      }
    }
    getUserByEmail(userLoggedIn.email)
  }, [])

  useEffect(() => {
    if (user) {
      setAvatar(user[0].avatar);
      setUsername(user[0].userName);
      setEmail(user[0].email);
    }
    fetchData("users")
  }, [user]);

  useEffect(() => {
    setNewUsers(users.filter(u => !isEqual(u, user[0])))
  }, [users])

  const handleEditButtonClick = () => {
    setEditMode(true);
  };

  const handleSaveButtonClick = async () => {
    // TODO: Save changes to database
    setEditMode(false);
    const prevUserName = user[0].userName;
    const prevAvatar = user[0].avatar;

    user[0].userName = username;
    user[0].avatar = avatar;
    if (checkIncludes(username, "userName") === false) {
      setUsername(prevUserName);
      return;
    }

    try {
      await updateDocument(user[0].id, user[0], "users");
      setMessage("prfileUpdated");
      setTimeout(() => {
        setMessage("")
      }, 2000);
      localStorage.setItem(
        "user",
        JSON.stringify({ email: user[0].email, password: user[0].password })
      );
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading) return <h1>loading</h1>
  function checkIncludes(property, type) {
    let chosen;
    if (type === "userName") chosen = "userName";
    if (type === "email") chosen = "email";
    const res = newUsers.find((u) => u[chosen] === property);
    if (res) {
      setMessage(res[chosen] + " is already taken");
      return false;
    }
    return true;
  }

  return (
    <div className="profileWrapper">
      {user && (
        <>
          <div className="user-profile-information">
            <div className="avatar-container">
              <div className="user-avatar">
                <Avatar src={avatar} size="100" />
              </div>
              {editMode && (
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              )}
            </div>
            <div className="username-container">
              <h2>{username}</h2>
              {editMode && (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}
            </div>
            <div className="email-container">
              <p>{email}</p>
            </div>
            {!editMode && (
              <button onClick={handleEditButtonClick}>Edit</button>
            )}
            {message ? <h3 style={{ color: "red" }}>{message}</h3> : null}
            {editMode && (
              <div>
                <button onClick={handleSaveButtonClick}>Save</button>
                <button onClick={() => { setEditMode(false) }}>cancel</button>
              </div>
            )}
          </div>
          <div>
            <h1>Buyed Images</h1>
          </div>
          <ul className="list-of-bought-images">
            {user[0].buyedImages.map((image, index) => (
              <div className="profile-bought-images" key={index}>
                <ImageComponent canDownload={true} location="postsImage" imageName={image} />
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
