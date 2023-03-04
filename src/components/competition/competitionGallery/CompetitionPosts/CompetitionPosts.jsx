import { useEffect, useState } from "react";
import { useFirestore } from "../../../../services/competition";
import { ImageComponent } from "../../imageComponent/Imgage";









import { useNavigate } from "react-router";
export function CompetitionPosts({ post, competition, id }) {
  const { updateDocument, isLoading } = useFirestore()
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()


  async function voteHandle() {
    //after that we need to check user that voted only 1 time 

    post.votes = post.votes + 1;
    try {
      await updateDocument(post.id, post, "posts");
    } catch (e) {
      console.log(e.message);
    }
  }


  return (
    <div>
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
          <h1>userImg</h1>
          <h1>userName</h1>
        </div>
        {isLoading ? <h4>loading..</h4> : <div>
          <h2 className="details">
            User ID: {post.userId} | Votes: {post.votes}
          </h2>
        </div>}
        <div>
          <button onClick={voteHandle}>Vote</button>
        </div>
      </div>
    </div>
  )
}