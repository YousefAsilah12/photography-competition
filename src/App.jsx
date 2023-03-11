import { Children, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import { CompetitionWraper } from './components/competition/competitionPage/competitionPage'
import { CompetitionsDisplay } from './components/competition/competitionsDisplay/competitionsDisplay';
import { CompetitionGallery } from './components/competition/competitionGallery/CompetitionGallery';
import { PostDetails } from './components/competition/competitionGallery/CompetitionPosts/postDetails/postDetails';
import { WinnersDisplay } from './components/winners/winnersDisplay/WinnersDisplay';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { UserProfile } from './user/userProfile';
import { siteData } from './data/siteData';
import { Bars } from './Bars/Bars';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useFirestore } from './services/competition';
import ImageGallery from './components/test/test';
function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const { getUserByEmail, userData } = useFirestore()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      getUserByEmail(user.email)
    }
  }, [])
  useEffect(() => {
    if (userData) {
      setUserLoggedIn(true);
    }
  }, [userData])

  function handleLogin() {
    console.log("appHandleLogin");
    setUserLoggedIn(true);
  }


  const router = createBrowserRouter(
    [
      {
        path: "", element: <Bars />, children: [
          { path: "/", element: <CompetitionsDisplay /> },
          { path: "/create-competition", element: userLoggedIn && <CompetitionWraper /> },
          { path: "/competitions-list", element: <CompetitionsDisplay /> },
          { path: "/competition-gallery/:id", element: userLoggedIn && <CompetitionGallery /> },
          { path: "/post-details/:id", element: userLoggedIn && < PostDetails /> },
          { path: "/winner-posts", element: userLoggedIn && <WinnersDisplay /> },
          { path: "/user-profile", element: userLoggedIn && <UserProfile /> },
        ]
      },
      { path: "/login", element: <Login onLogin={handleLogin} /> },
      { path: "/register", element: <Register /> },
      { path: "/test", element: <ImageGallery /> },
    ]
  );
  return (
    // style={{backgroundImage:`url(${siteData.logo})`}}
    <div className="App background" >
      <RouterProvider router={router} />
    </div>
  );

}

export default App
