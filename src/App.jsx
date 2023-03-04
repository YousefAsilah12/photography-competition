import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import { CompetitionWraper } from './components/competition/competitionPage/competitionPage'
import { CompetitionsDisplay } from './components/competition/competitionsDisplay/competitionsDisplay';
import { CompetitionGallery } from './components/competition/competitionGallery/CompetitionGallery';
import { PostDetails } from './components/competition/competitionGallery/CompetitionPosts/postDetails/postDetails';
import { WinnersDisplay } from './components/winners/winnersDisplay/WinnersDisplay';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/create-competition" element={<CompetitionWraper />} />
        <Route path="/competitions-list" element={<CompetitionsDisplay />} />
        <Route path="/competition-gallery/:id" element={<CompetitionGallery />} />
        <Route path="/post-details/:id" element={<PostDetails />} />
        <Route path="/winner-posts" element={<WinnersDisplay />} />
      </Routes>
    </Router>
  )

}

export default App
