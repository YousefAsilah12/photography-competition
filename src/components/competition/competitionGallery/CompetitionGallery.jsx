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
  }, [posts]);

  useEffect(() => {
    console.log("logged in data ", loggedInData);
  }, [loggedInData])

  async function getUserLoggedIn() {
    debugger
    const userLocalstorage = JSON.parse(localStorage.getItem('user'))
    await getUserByEmail(userLocalstorage.email);
  }

  if (addPost === true) {
    return <div className='add-post'>
      <CreatePost competitionId={id} userId={1} setAddPost={setAddPost} />
      <button onClick={() => { setAddPost(false) }}>close</button>
    </div>
  }


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
    debugger
    loggedInData[0].voted = true;
    await updateDocument(loggedInData[0].id, loggedInData[0], "users");

  }
  return (
    loggedInData ?
      <div>
        {competition ? <div>
          <CountDown competitionId={id} finishDate={competition.finishDate} competition={competition} posts={filteredPosts} />
        </div> : null}
        <div className='addPost-button'>
          <button onClick={() => { setAddPost(true) }}>Add Post</button>
        </div>
        <div className='posts-wrappper'>
          {loggedInData ? filteredPosts.map((post) => {
            return <CompetitionPosts voted={loggedInData[0].voted} key={post.id} post={post} competition={competition} updateVoted={handleVoted} />
          }
          ) : null}
        </div>
      </div>
      : null

  );
}
