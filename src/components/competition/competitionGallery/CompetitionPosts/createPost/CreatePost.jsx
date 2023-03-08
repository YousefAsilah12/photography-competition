









import { useEffect, useRef, useState } from "react";
import "./CreatePost.css"
import { storage } from "../../../../../firebase/firebaseConfig";
import { useFirestore } from "../../../../../services/competition";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid"
import { useNavigate } from 'react-router-dom';
import { compressImage } from "../../../../../services/imgResize";
export function CreatePost({ competitionId, userId, addedPost }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [postMessage, setPostMessage] = useState("");
  const imageUrlRef = useRef('');
  const navigate = useNavigate();
  const { data: users, addDocument, isLoading, error, fetchData } = useFirestore();
  const { userData: user, getUserByEmail } = useFirestore();
  useEffect(() => {
    fetchData();
    getUserByEmail(JSON.parse(localStorage.getItem("user")).email)
  }, [])

  async function handleImageAsFile() {


    setPostMessage('loading ....');

    const collectionName = "postsImage/"
    if (imageFile === null) return
    //v4 function using uuid library to generate unique id
    const imageLocattion = imageFile.name + v4()
    const imageRef = ref(storage, collectionName + imageLocattion)
    try {
      setPostMessage('compressing the image.....')
      const compressedImage = await compressImage(imageFile, 0.1);
      setPostMessage('uploading........')
      const response = await uploadBytes(imageRef, imageFile)
      imageUrlRef.current = response.metadata.name;
      return true
    } catch (error) {
      alert("field to upload the image")
    }
    return false
  }

  async function submiteForm(event) {
    event.preventDefault();

    if (!user) {
      alert("to have to login first")
      return
    }
    if (!title) {
      setPostMessage("please enter title")
      return
    }
    else if (!description) {
      setPostMessage("please enter description")
      return
    }
    else if (!imageFile) {
      setPostMessage("please enter image file")
      return
    }
    const addedImg = await handleImageAsFile()
    if (!addedImg) {
      setPostMessage("image cant be uploaded")
      return
    }
    if (!imageUrlRef) {
      setPostMessage("image cant be uploaded")
      return
    }
    if (addedImg == true) {
      const postObj = {
        title,
        description,
        imageUrl: imageUrlRef.current,
        userId: user[0].id,
        competitionId,
        votes: 0,
        comments: []
      }
      try {
        setPostMessage('loading........')
        const result = await addDocument(postObj, "posts")
        setPostMessage('post created successfully');
        addedPost()
        setDescription("")
        setImageFile("")
        setTitle("")
        imageUrlRef.current = ""
        setPostMessage("")
      } catch (error) {
        setPostMessage(error.message)
      }
    }
    else {
      return;
    }
  }
  return <form className="formWrapper" onSubmit={submiteForm}>

    <div className="create-post-formGroup">
      <label htmlFor="title">title</label>
      <input type="text" id="title" name="title" onChange={(e) => setTitle(e.target.value)} />
    </div>
    <div className="create-post-formGroup">
      <label htmlFor="description">description</label>
      <textarea type="text" id="description" name="description" onChange={(e) => setDescription(e.target.value)} />
    </div>
    <div className="create-post-formGroup">
      <label htmlFor="Image">Image</label>
      <input type="file" id="image" name="image" onChange={(e) => setImageFile(e.target.files[0])} />
    </div>
    <button type="submit" >add post</button>

    {postMessage ? <h2 style={{ color: "white" }}>{postMessage}</h2> : null}
  </form>
}