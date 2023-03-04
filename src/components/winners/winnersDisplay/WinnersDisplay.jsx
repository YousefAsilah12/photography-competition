





import { useEffect, useState } from "react"
import { useFirestore } from "../../../services/competition"
import "./WinnersDisplay.css"
import { WinnerPost } from "./winner-post/WinnerPost"
export function WinnersDisplay() {
  const { isLoading, error, fetchData, data: winners } = useFirestore()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchData("winners")
  }, [])

useEffect(()=>{
  console.log("winners array ",winners)
  
},[winners])

  async function handleDelete() {
    alert("newData after delete")
    await fetchData("winners")
  }
  return (
    winners.length > 0 ? (
      <div className="winner-posts-wrapper">
        {winners.map((post, index) => (
          <div className="winner-post" key={post.id}>
            <WinnerPost onDelete={handleDelete} post={post} />
          </div>
        ))}
      </div>
    ) : (
      <div>Loading...</div>
    )
  );
}