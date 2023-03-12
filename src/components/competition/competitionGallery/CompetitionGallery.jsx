// import { useNavigate, useParams } from 'react-router-dom';
// import { useFirestore } from '../../../services/competition';
// import { useEffect, useState } from 'react';
// import { CompetitionPosts } from './CompetitionPosts/CompetitionPosts';
// import { CountDown } from './competitionTime/CountDown';
// import "./CompetitionGallery.css"
// import { CreatePost } from './CompetitionPosts/createPost/CreatePost';
// import { getCompetitionPosts } from '../../../services/post';
// export function CompetitionGallery() {
//   const { id } = useParams();
//   const { data: posts, dataById: competition, isLoading, error, updateDocument, getCompetitionById, fetchData, getUserByEmail, userData: loggedInData } = useFirestore();
//   const navigate = useNavigate();
//   const [addPost, setAddPost] = useState(false);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [index, setIndex] = useState(null)
//   useEffect(() => {
//     fetchCompetition();
//     fetchData("posts");
//   }, [id]);
//   useEffect(() => {
//     fetchData("posts");
//     getUserLoggedIn()
//   }, [])
//   useEffect(() => {
//     setFilteredPosts(getCompetitionPosts(posts, id))
//     if (posts) {
//       console.log("competition posts", posts);
//     }
//   }, [posts]);

//   useEffect(() => {
//     console.log("logged in data ", loggedInData);
//     if (loggedInData) {
//       setIndex(loggedInData[0].votedFor.findIndex(obj => obj.competitionId === id));
//     }
//   }, [loggedInData])

//   async function getUserLoggedIn() {

//     const userLocalstorage = JSON.parse(localStorage.getItem('user'))
//     await getUserByEmail(userLocalstorage.email);
//   }



//   async function fetchCompetition() {
//     try {
//       await getCompetitionById(id, "competition");
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }


//   async function handleVoted() {
//     if (index === -1) {
//       const newObj = { competitionId: id, times: 1, voted: true }
//       try {
//         loggedInData[0].votedFor.push(newObj);
//         await updateDocument(loggedInData[0].id, loggedInData[0], "users");
//       } catch (error) {
//         alert(error.message)
//       }
//     }
//     getUserByEmail(loggedInData[0].email);
//   }
//   async function addedPostHandle() {
//     await fetchData("posts");
//     setAddPost(false)
//   }
//   return (
//     loggedInData && posts ?
//       <div className='competition-posts'>
//         {competition ? <div >
//           <CountDown onTestWinner={addedPostHandle} competitionId={id} finishDate={competition.finishDate} competition={competition} posts={filteredPosts} />
//         </div> : null}
//         <div className='addPost-button'>
//           {/* <button onClick={() => { setAddPost(true) }}>Add Post</button> */}
//           <button className="vote-Button" disabled={competition.active === false} title={competition.active === false ? "competition finished" : "add post"} onClick={() => { setAddPost(true) }}>Add Post</button>
//           {addPost ?
//             <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: "center", gap: "1rem" }}>
//               <CreatePost competitionId={id} userId={1} setAddPost={setAddPost} addedPost={addedPostHandle} />
//               <button onClick={() => { setAddPost(false) }}>Close</button>
//             </div>
//             : null}
//         </div>
//         <div className='posts-wrappper'>
//           {loggedInData && index != null ? filteredPosts.map((post) => {
//             return <CompetitionPosts voted={index > -1 ? loggedInData[0].votedFor[index].voted : false} key={post.id} post={post} competition={competition} competitionId={id} updateVoted={handleVoted} />
//           }
//           ) : null}
//         </div>
//       </div>
//       : null

//   );
// }

import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useFirestore } from "../../../services/competition";
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Gallery from 'react-photo-gallery';
import { getCompetitionPosts } from '../../../services/post';
import "./CompetitionGallery.css"
import { CountDown } from './competitionTime/CountDown';
import { CreatePost } from './CompetitionPosts/createPost/CreatePost';
const storage = getStorage();

export function CompetitionGallery() {
  const [photos, setPhotos] = useState([]);
  const { id } = useParams();
  const { data: posts, dataById: competition, isLoading, error, updateDocument, getCompetitionById, fetchData, getUserByEmail, userData: loggedInData } = useFirestore();
  const navigate = useNavigate();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [addPost, setAddPost] = useState(false);
  const [index, setIndex] = useState(null)
  useEffect(() => {
    fetchCompetition();
    fetchData("posts");
  }, [id]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchData("posts");
      getUserByEmail(user.email);
    }
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      setFilteredPosts(getCompetitionPosts(posts, id));
    }
  }, [posts]);
  useEffect(() => {


    console.log("logged in data ", loggedInData);
    if (loggedInData) {
      const res = loggedInData[0].votedFor.findIndex(obj => obj.competitionId === id);
      console.log("index", res);
      setIndex(res)
    }
  }, [loggedInData])
  useEffect(() => {

    if (filteredPosts.length > 0) {
      Promise.all(
        filteredPosts.map(async (post) => {
          console.log(post);
          const imageRef = ref(storage, `postsImage/${post.imageUrl}`);
          const url = await getDownloadURL(imageRef);
          return {
            id: post.id,
            src: url,
            width: post.width,
            height: post.height,
            title: post.title,
            votes: post.votes,
            comments: post.comments,
            competitionId: post.competitionId,
            description: post.description,
            userId: post.userId,
            imageUrl: post.imageUrl,
          };
        })
      ).then((photos) => setPhotos(photos));
      console.log(photos);
    }
  }, [filteredPosts]);

  const handleClick = (event, { photo, index }) => {
    // Navigate to a new page when an image is clicked
    navigate(`/post-details/${photo.id}`);
  };
  async function fetchCompetition() {
    try {
      await getCompetitionById(id, "competition");
    } catch (error) {
      console.log(error);
    }
  }
  if (isLoading) {
    return <div className="loading-center"> <h1>Loading...</h1></div>
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  async function addedPostHandle() {
    await fetchData("posts");
    setAddPost(false)
  }
  function Photo({ photo, onClick }) {
    return (
      <div className="photo-container ">
        <img src={photo.src} width={photo.width} height={photo.height} alt={photo.title} onClick={(e) => onClick(e, { photo })} />
        <div className='postLine'>
          {/* <div className="photo-title">{photo.title}</div> */}
          <h3>votes: {photo.votes}</h3>
          {(loggedInData[0]) && <button title={competition.active === false ? "competition completed" : (loggedInData[0] && index > -1 && loggedInData[0].votedFor[index].voted) ? 'already voted' : "vote"} disabled={competition.active === false ? true : index > -1 ? loggedInData[0].votedFor[index].voted : false} className='vote-btn' onClick={() => handleVoted(photo)}>Vote</button>
          }
        </div>
      </div>
    );
  }
  async function handleVoted(post) {

    if (index === -1) {
      const newObj = { competitionId: id, times: 1, voted: true }
      try {
        loggedInData[0].votedFor.push(newObj);
        await updateDocument(loggedInData[0].id, loggedInData[0], "users");
        delete post.src;
        post.votes += 1
        await updateDocument(post.id, post, "posts");
      } catch (error) {
        alert(error.message)
      }
    }
    getUserByEmail(loggedInData[0].email);
  }
  async function addedPostHandle() {
    await fetchData("posts");
    setAddPost(false)
  }
  return (
    <div className='countDownSmallScreen' style={{ width: "100%" }}>
      <div>
        {competition ? <div >
          <CountDown user={loggedInData[0]} onTestWinner={addedPostHandle} competitionId={id} finishDate={competition.finishDate} competition={competition} posts={filteredPosts} />
        </div> : null}
      </div>
      <div>

        <div className='addPost-button postCenter'>
          {/* <button onClick={() => { setAddPost(true) }}>Add Post</button> */}
          <button className="vote-btn" disabled={competition.active === false} title={competition.active === false ? "competition finished" : "add post"} onClick={() => { setAddPost(true) }}>Add Post</button>
          {addPost ?
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: "center", gap: "1rem" }}>
              <CreatePost competitionId={id} userId={1} setAddPost={setAddPost} addedPost={addedPostHandle} />
              <button onClick={() => { setAddPost(false) }}>Close</button>
            </div>
            : null}
        </div>
      </div>
      <div className='imageGallery' >
        {photos.length > 0 && (
          <div style={{ width: "100%", padding: "5%" }}>
            <Gallery photos={photos} onClick={handleClick} renderImage={(props) => <Photo {...props} onClick={handleClick} />} />          </div>
        )}
      </div>
    </div>
  );
}


// import React, { useState } from 'react';
// import Gallery from 'react-photo-gallery';
// import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
// import { MdClose } from 'react-icons/md';
// import { Modal, ModalGateway } from 'react-images';

// const photos = [
//   {
//     src: 'https://picsum.photos/id/1018/1000/600/',
//     width: 1000,
//     height: 600
//   },
//   {
//     src: 'https://picsum.photos/id/1015/1000/600/',
//     width: 1000,
//     height: 600
//   },
//   {
//     src: 'https://picsum.photos/id/1019/1000/600/',
//     width: 1000,
//     height: 600
//   },
//   {
//     src: 'https://picsum.photos/id/1020/1000/600/',
//     width: 1000,
//     height: 600
//   }
// ];

// export const CompetitionGallery = () => {
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(0);

//   const openModal = (index) => {
//     setCurrentImage(index);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setCurrentImage(0);
//     setModalIsOpen(false);
//   };

//   const nextImage = () => {
//     setCurrentImage(currentImage + 1);
//   };

//   const prevImage = () => {
//     setCurrentImage(currentImage - 1);
//   };

//   return (
//     <div >
//       <Gallery photos={photos} onClick={(e, { index }) => openModal(index)} />
//       <ModalGateway>
//         {modalIsOpen && (
//           <Modal onClose={closeModal}>
//             <div className="modal">
//               <button className="modal-close" onClick={closeModal}>
//                 <MdClose />
//               </button>
//               <button className="modal-next" onClick={nextImage}>
//                 <FiZoomIn />
//               </button>
//               <button className="modal-prev" onClick={prevImage}>
//                 <FiZoomOut />
//               </button>
//               <img src={photos[currentImage].src} alt="" />
//             </div>
//           </Modal>
//         )}
//       </ModalGateway>
//     </div>
//   );
// };

