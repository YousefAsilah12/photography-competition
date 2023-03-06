import React, { useState, useEffect } from "react";
import Countdown from 'react-countdown';
import "./countDown.css"
import { useFirestore } from "../../../../services/competition";
import { updateDoc } from "firebase/firestore";
export function CountDown({ finishDate, competition, competitionId, posts }) {

  const { isLoading, error, data: winners, fetchData, addDocument } = useFirestore()

  useEffect(() => {
    fetchData("winners")
  }, [])
  // Define a renderer function to format the countdown
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render something when the countdown is complete

      return <div>
        <span>Countdown finished!</span>;
      </div>
    } else {
      // Render the countdown
      return (
        <div className="time-container">
          <button onClick={checkForWinner}>testWinner</button>
          <div>{days} : days</div>
          <div>{hours} : hours</div>
          <div>{minutes} : minutes</div>
          <div>{seconds} : seconds</div>
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
      alert("addedWInner")
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="countdownStyle">
      <Countdown date={finishDate} renderer={renderer} />
    </div>)
}

