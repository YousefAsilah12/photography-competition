import React, { useState, useEffect } from "react";
import Countdown from 'react-countdown';
import "./countDown.css"
import { useFirestore } from "../../../../services/competition";
import { updateDoc } from "firebase/firestore";
export function CountDown({ onTestWinner, finishDate, competition, competitionId, posts }) {

  const { isLoading, error, data: winners, fetchData, addDocument, updateDocument } = useFirestore()

  useEffect(() => {
    fetchData("winners")
  }, [])
  // Define a renderer function to format the countdown
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render something when the countdown is complete
      if (posts.length > 0 && competition.active === true) { checkForWinner() }
      return <div>
        <span>Countdown finished!</span>;
      </div>
    } else {
      // Render the countdown
      return (
        <div className="time-container">
          <button disabled={!competition.active || posts.length === 0} title={!competition.active ? "competition finished" : posts.length === 0 ? "no posts" : "checkwinner"} className="vote-btn" onClick={checkForWinner}>testWinner</button>

          <div className="time-row"><span>{days}</span> : days</div>
          <div><span>{hours}</span> : hours</div>
          <div><span>{minutes}</span> : minutes</div>
          <div><span>{seconds}</span> : seconds</div>

        </div>
      )
    }
  }
  function ifIncludes(max) {
    for (const winner of winners) {
      if (winner.id === max.id) {
        return true;
      }
    }
    return false;
  }

  async function checkForWinner() {
    
    let max = posts[0]
    posts.forEach((item, index) => {
      if (item.votes > max.votes) {
        max = item
      }
    })
    const isIncludes = ifIncludes(max)
    if (isIncludes === true) {
      alert("already exist")
      return
    }

    // post winner to winners array
    try {

      await addDocument(max, "winners")
      competition.active = false
      console.log(competition);
      await updateDocument(competitionId, competition, "competition")
      onTestWinner()
      alert("addedWInner")
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="countdownStyle">
      {competition.active === true ? <Countdown date={finishDate} renderer={renderer} /> :
        <h1 style={{ color: "black" }}>competition finished</h1>}
    </div>)
}

