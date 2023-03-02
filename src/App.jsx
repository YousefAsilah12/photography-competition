import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router,Routes, Route, Link } from "react-router-dom";
import './App.css'
import { CompetitionWraper } from './components/competition/competitionPage/competitionPage'
import { CompetitionsDisplay } from './components/competition/competitionsDisplay/competitionsDisplay';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/create-competition" element={<CompetitionWraper />} />
        <Route path="/competitions-list" element={<CompetitionsDisplay />} />
      </Routes>
    </Router>
  )

}

export default App
