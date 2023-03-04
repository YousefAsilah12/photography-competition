









import { useEffect, useRef, useState } from "react";
import "./CreatePost.css"
import { storage } from "../../../../../firebase/firebaseConfig";
import { useFirestore } from "../../../../../services/competition";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid"
import { useNavigate } from 'react-router-dom';
export function CreatePost({ competitionId, userId }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [postMessage, setPostMessage] = useState("");
  const imageUrlRef = useRef('');
  const { addDocument, isLoading, error } = useFirestore();



  async function handleImageAsFile() {
    debugger
    setPostMessage('loading ....');

    const collectionName = "postsImage/"
    if (imageFile === null) return
    //v4 function using uuid library to generate unique id
    const imageLocattion = imageFile.name + v4()
    const imageRef = ref(storage, collectionName + imageLocattion)
    try {
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
    const addedImg = await handleImageAsFile()
    if (addedImg == true) {
      const postObj = {
        title,
        description,
        imageUrl: imageUrlRef.current,
        userId,
        competitionId,
        votes: 0,
        comments: []
      }
      try {
        const result = await addDocument(postObj,"posts")
        setPostMessage('post created successfully');
        setTimeout(() => {
          setDescription("")
          setImageFile("")
          setTitle("")
          imageUrlRef.current = ""
          setPostMessage("")
        }, 2000);
      } catch (error) {
        setPostMessage(error.message)
      }
    }
    else {
      return;
    }
  }
  return <form className="create-post-style" onSubmit={submiteForm}>

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

    {postMessage ? <h1>{postMessage}</h1> : null}
  </form>
}