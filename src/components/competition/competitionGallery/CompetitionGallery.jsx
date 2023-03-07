import { useNavigate, useParams } from 'react-router-dom';
import { useFirestore } from '../../../services/competition';
import { useEffect, useState } from 'react';
import { CompetitionPosts } from './CompetitionPosts/CompetitionPosts';
import { CountDown } from './competitionTime/CountDown';
import "./CompetitionGallery.css"
import { CreatePost } from './CompetitionPosts/createPost/CreatePost';
import { getCompetitionPosts } from '../../../services/post';
export function CompetitionGallery() {
  const { id } = useParams();
  const { data: posts, dataById: competition, isLoading, error, updateDocument, getCompetitionById, fetchData, getUserByEmail, userData: loggedInData } = useFirestore();
  const navigate = useNavigate();
  const [addPost, setAddPost] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [index, setIndex] = useState(null)
  useEffect(() => {
    fetchCompetition();
    fetchData("posts");
  }, [id]);
  useEffect(() => {
    fetchData("posts");
    getUserLoggedIn()
  }, [])
  useEffect(() => {
    setFilteredPosts(getCompetitionPosts(posts, id))
    if (posts) {
      console.log("competition posts", posts);
    }
  }, [posts]);

  useEffect(() => {
    console.log("logged in data ", loggedInData);
    if (loggedInData) {
      setIndex(loggedInData[0].votedFor.findIndex(obj => obj.competitionId === id));
    }
  }, [loggedInData])

  async function getUserLoggedIn() {

    const userLocalstorage = JSON.parse(localStorage.getItem('user'))
    await getUserByEmail(userLocalstorage.email);
  }

  // if (addPost === true) {
  //   return <div className='add-post'>
  //     <CreatePost competitionId={id} userId={1} setAddPost={setAddPost} />
  //     <button onClick={() => { setAddPost(false) }}>close</button>
  //   </div>
  // }


  async function fetchCompetition() {
    try {
      await getCompetitionById(id, "competition");
    } catch (error) {
      console.log(error);
    }
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }


  async function handleVoted() {
    if (index === -1) {
      const newObj = { competitionId: id, times: 1, voted: true }
      try {
        loggedInData[0].votedFor.push(newObj);
        await updateDocument(loggedInData[0].id, loggedInData[0], "users");
      } catch (error) {
        alert(error.message)
      }
    }
    getUserByEmail(loggedInData[0].email);
  }
  function addedPostHandle() {
    fetchData("posts");
  }
  return (
    loggedInData && posts ?
      <div className='competition-posts'>
        {competition ? <div >
          <CountDown competitionId={id} finishDate={competition.finishDate} competition={competition} posts={filteredPosts} />
        </div> : null}
        <div className='addPost-button'>
          {/* <button onClick={() => { setAddPost(true) }}>Add Post</button> */}
          <button onClick={() => { setAddPost(true) }}>Add Post</button>
          {addPost ?
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: "center", gap: "1rem" }}>
              <CreatePost competitionId={id} userId={1} setAddPost={setAddPost} addedPost={addedPostHandle} />
              <button onClick={() => { setAddPost(false) }}>Close</button>
            </div>
            : null}
        </div>
        <div className='posts-wrappper'>
          {loggedInData && index != null ? filteredPosts.map((post) => {
            return <CompetitionPosts voted={index > -1 ? loggedInData[0].votedFor[index].voted : false} key={post.id} post={post} competition={competition} competitionId={id} updateVoted={handleVoted} />
          }
          ) : null}
        </div>
      </div>
      : null

  );
}
