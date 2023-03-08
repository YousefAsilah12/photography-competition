import { useEffect, useState } from "react";
import { useFirestore } from "../../../../services/competition";
import { ImageComponent } from "../../imageComponent/Imgage";









import { useNavigate } from "react-router";
export function CompetitionPosts({ post, competition, id, voted, updateVoted, competitionId }) {
  const { updateDocument, isLoading, dataById: user, loadAll, getCompetitionById } = useFirestore()
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  console.log("voted", voted);
  useEffect(() => {
    getCompetitionById(post.userId, "users");
    console.log(competitionId);
  }, [])

  async function voteHandle() {
    //after that we need to check user that voted only 1 time 

    if (voted) return
    post.votes += 1
    try {
      await updateDocument(post.id, post, "posts");
      updateVoted()
    } catch (e) {
      console.log(e.message);
    }
  }
  return (
    user &&
    <div className="post-styling">
      <div onClick={() => { navigate(`/post-details/${post.id}`) }}>
        <div key={post.competitionId} className="post-container">
          <div>
            <h2 className="title">{post.title}</h2>
            <p className="description">{post.description}</p>
          </div>
          <ImageComponent location="postsImage" imageName={post.imageUrl}></ImageComponent>
        </div>
      </div>
      <div className="post-content">
        <div className="user">
          <img src={user.avatar} alt="" />
          <h1>{user.userName}</h1>
        </div>
        {isLoading ? <h4>loading..</h4> : <div>
          <h2 className="details">
            <small>votes:</small>  {post.votes}
          </h2>
        </div>}
        <div>
          <button className="vote-Button" disabled={voted || competition.active === false} title={voted ? "alreadyVoted" : competition.active === false ? "competition finished" : "vote"} onClick={voteHandle}>
            Vote
          </button>
        </div>
      </div>
    </div >
  )
}