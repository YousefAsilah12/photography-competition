





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

  useEffect(() => {
    console.log("winners array ", winners)

  }, [winners])

  async function handleDelete() {
    alert("newData after delete")
    await fetchData("winners")
  }
  function handleBuyedImage() {
    fetchData("winners")
  }
  if (winners.length === 0) {
    return <h1>no images to sell</h1>
  }
  return (
    (winners.length > 0) ? (
      <div className="winner-posts-wrapper">
        {winners.map((post, index) => (
          <div className="winner-post" key={post.id}>
            <WinnerPost onBuyReload={handleBuyedImage} onDelete={handleDelete} post={post} />
          </div>
        ))}
      </div>
    ) : (
      <div className="loading-center"><h3>Loading...</h3></div>
    )
  );
}