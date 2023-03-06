import { Children, useState } from 'react'
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
function App() {
  const router = createBrowserRouter(
    [
      {
        path: "", element: <Bars />, children: [
          { path: "/", element: <CompetitionWraper /> },
          { path: "/create-competition", element: <CompetitionWraper /> },
          { path: "", element: <Login /> },
          { path: "/competitions-list", element: <CompetitionsDisplay /> },
          { path: "/competition-gallery/:id", element: <CompetitionGallery /> },
          { path: "/post-details/:id", element: <PostDetails /> },
          { path: "/winner-posts", element: <WinnersDisplay /> },
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          { path: "/user-profile", element: <UserProfile /> },
        ]
      }]
  );
  return (
    // style={{backgroundImage:`url(${siteData.logo})`}}
    <div className="App background" >
      <RouterProvider router={router} />  
    </div>
  );

}

export default App
