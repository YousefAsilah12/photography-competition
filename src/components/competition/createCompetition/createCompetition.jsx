import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./createForm.css"
import { useFirestore } from '../../../services/competition';
import { storage } from "../../../firebase/firebaseConfig"
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid"
export const CreateCompetition = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [imageFile, setImageFile] = useState('');
  const imageUrlRef = useRef('');
  const [message, setMessage] = useState({ error: false, message: '' });
  const navigate = useNavigate();
  const { addDocument, isLoading, error } = useFirestore('competition');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }


  async function handleImageAsFile() {
    
    setMessage({ error: false, message: 'loading ....' });

    const collectionName = "competitionImages/"
    if (imageFile === null) return
    //v4 function using uuid library to generate unique id
    const imageLocattion = imageFile.name + v4()
    const imageRef = ref(storage, collectionName + imageLocattion)
    try {
      const response = await uploadBytes(imageRef, imageFile)
      console.log("response", response);
      imageUrlRef.current = response.metadata.name;
      return true
    } catch (error) {
      alert("field to upload the image")
    }
    return false
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const addedImg = await handleImageAsFile()

    if (addedImg == true) {
      if (!title) {
        setMessage({ error: true, message: 'Title is required' });
        return;
      }
      if (!description) {
        setMessage({ error: true, message: 'Description is required' });
        return;
      }
      if (!startDate) {
        setMessage({ error: true, message: 'Start date is required' });
        return;
      }
      if (!finishDate) {
        setMessage({ error: true, message: 'Finish date is required' });
        return;
      }
      if (!imageUrlRef.current) {
        setMessage({ error: true, message: 'Image URL is required' });
        return;
      }
      const competitionObj = {
        title,
        description,
        startDate,
        finishDate,
        imageUrl: imageUrlRef.current,
        participants: [],
        posts: [],
        winners: [],
        active: true,
      };

      try {
        await addDocument(competitionObj, "competition");
        setMessage({ error: false, message: 'Competition created successfully' });
        navigate('/competitions-list');
        setTitle('');
        setDescription('');
        setStartDate('');
        setFinishDate('');
        setMessage({ error: false, message: '' });
      } catch (e) {
        setMessage({ error: true, message: e.message });
      }
    }
  }
  return (
    <form className='formWrapper' onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>

      <div>

        <label htmlFor="start-date">Start Date</label>
        <input type="datetime-local" id="start-date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
      </div>

      <div>

        <label htmlFor="finish-date">Finish Date</label>
        <input type="datetime-local" id="finish-date" value={finishDate} onChange={(event) => setFinishDate(event.target.value)} />
      </div>

      <div>

        <label htmlFor="image-url">Image URL</label>
        <input type="file" id="image-url" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>

      <button type="submit">Create Competition</button>
      {message.message ? <h1 className={message.error ? "error" : "success"}>{message.message}</h1> : null}
    </form>
  );
};

