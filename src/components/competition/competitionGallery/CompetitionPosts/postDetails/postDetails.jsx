




import { useNavigate, useParams } from "react-router";
import "./postDetails.css"
import { useEffect, useState } from "react";
import { useFirestore } from "../../../../../services/competition";
import { ImageComponent } from "../../../imageComponent/Imgage";
import { FaTrash } from 'react-icons/fa';
export const PostDetails = () => {
  const { id } = useParams();
  const { getCompetitionById, dataById: post, isLoading, error, updateDocument, getUserByEmail, deleteDocument, userData: loggedInUser } = useFirestore();
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({ ...post });
  const navigate = useNavigate();

  useEffect(() => {

    getPostById()
    const email = JSON.parse(localStorage.getItem("user")).email;
    getUserByEmail(email)
  }, [id])
  async function getPostById() {
    try {
      await getCompetitionById(id, "posts")
      console.log(post);
    } catch (error) {
      alert(error.message)
    }
  }
  if (error) {
    return <p>Sorry, there was an error loading the post.</p>;
  }
  if (!post) {
    return <p>Sorry, we couldn't find that post.</p>;
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!post.comments) post.comments = [];

    try {

      post.comments.push({ comment: comment, userName: loggedInUser[0].userName, avatar: loggedInUser[0].avatar });
      console.log("postbeforeUpdateComment", post);
      await updateDocument(id, post, "posts")
    } catch (error) {
      alert(error.message)
    }
  }
  const handleEdit = () => {
    setIsEditing(true)
    setEditedPost({ ...post });

  }
  const handleSave = async () => {
    try {
      await updateDocument(id, editedPost, "posts");
      setIsEditing(false);
      await getPostById();
    } catch (error) {
      alert(error.message);
    }
  }
  const handleCancel = () => {
    setIsEditing(false)
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  async function handleDelte() {
    try {
      console.log("id to delete", id);
      await deleteDocument(id, "posts");
      navigate(-1);
    } catch (e) {
      alert(e.message);
    }
  }
  async function deleteComment(comment) {

    post.comments.splice(post.comments.indexOf(comment), 1);
    try {
      await updateDocument(id, post, "posts")

    } catch (error) {
      alert(error.message)
    }
  }
  return (loggedInUser) && (<div className="full-detail-page">
    <div className="post-details-container">
      <div className="left-details-side">
        {isEditing ? (
          <div className="edit-wrapper">
            <div className="post-edit-form">
              <div className="post-edit-form-input">
                <label htmlFor="title">edit title</label>
                <input
                  type="text"
                  name="title"
                  value={editedPost.title}
                  onChange={handleInputChange}
                />                </div>
              <div className="post-edit-form-input">
                <label htmlFor="description">edit description</label>
                <textarea
                  name="description"
                  value={editedPost.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <h4 style={{ color: "red" }}>image in competition cant be changed</h4>
          </div>
        ) : (
          <div className="post-info">
            {/* <h2>post by: {loggedInUser[0].userName}</h2> */}
            <div className="post-info-line">
              <h1>{post.title}</h1>
              <p>{post.votes} votes</p>
            </div>
            <p>{post.description}</p>
          </div>
        )}
        <div className="post-deitails-img">
          {post.imageUrl ? (
            <ImageComponent
              location="postsImage"
              imageName={post.imageUrl}
            ></ImageComponent>
          ) : null}
        </div>
      </div>
      <div className="displaycol">
        <div>
          <h2>Comments</h2>
          <div className="comments">
            {post.comments &&
              post.comments.map((comment, index) => (
                <div className="comment" key={index}>
                  <div className="user-info">
                    <div>
                      <img src={comment.avatar} alt={comment.userName} />
                      <p>{comment.userName}</p>
                    </div>
                    {(loggedInUser[0] && post.userId === loggedInUser[0].id || loggedInUser[0].rule === "admin") && <button onClick={() => { deleteComment(comment) }} className="deleteButtonDetails"><FaTrash /></button>}
                  </div>
                  <p>{comment.comment}</p>

                </div>
              ))}
          </div>
        </div>
        {isEditing ? (
          <div className="form-editPost">
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="form-editPost">
            {(loggedInUser[0] && post.userId === loggedInUser[0].id || loggedInUser[0].rule === "admin") && <button type="button" onClick={handleEdit}> Edit Post  </button>}
            {(loggedInUser[0] && post.userId === loggedInUser[0].id || loggedInUser[0].rule === "admin") && <button button style={{ background: "red" }} onClick={() => { handleDelte(post.id) }} type="delete">Delete Post</button>}
          </div>
        )}
        <form className="form-addComment" onSubmit={handleCommentSubmit}>
          {isLoading ? (
            <div className="loading-center"><h5>loading...</h5></div>
          ) : (
            <label>
              Add a comment:
              <input
                type="text"
                placeholder="comment...."
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </label>
          )}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div >

  );
}
