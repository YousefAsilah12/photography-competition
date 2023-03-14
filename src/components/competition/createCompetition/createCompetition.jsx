import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./createForm.css"
import { useFirestore } from '../../../services/competition';
import { storage } from '../../../firebase/firebaseConfig';
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid"
import { compressImage } from '../../../services/imgResize';
import { isDateUpToToday, isFinishAfterStart } from "../../../services/date"
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
    return <div className='loading-center'><h1>Loading...</h1></div>;
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
      setMessage({ error: false, message: 'compressing ....' });
      setMessage({ error: false, message: 'uploading.....' });
      const compressedImage = await compressImage(imageFile, 0.1);
      const response = await uploadBytes(compressedImage, compressImage)
      // const response = await uploadBytes(imageRef, imageFile)
      console.log("response", response);
      imageUrlRef.current = response.metadata.name;
      return true;
    } catch (error) {
      alert("field to upload the image")
    }
    return false
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title) {
      setMessage({ error: true, message: 'Title is required' });
      return;
    }
    else if (!description) {
      setMessage({ error: true, message: 'Description is required' });
      return;
    }
    else if (!startDate) {
      setMessage({ error: true, message: 'Start date is required' });
      return;
    }
    else if (!isDateUpToToday(startDate)) {
      setMessage({ error: true, message: 'you cant choose date in the past' });
      return;
    }
    else if (!finishDate) {
      setMessage({ error: true, message: 'Finish date is required' });
      return;
    }
    else if (!isFinishAfterStart(startDate, finishDate)) {
      setMessage({ error: true, message: 'finish date cant be before start date !' });
      return;
    }

    const addedImg = await handleImageAsFile()
    if (!addedImg) {
      setMessage({ error: true, message: 'Image could not be uploaded' });
      return
    }
    else if (!imageUrlRef.current) {
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
      setMessage({ error: false, message: 'loading....' });
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

        <label htmlFor="image-url">select image</label>
        <input type="file" placeholder='select' id="image-url" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>

      <button type="submit" className='btn-add-post'>Create Competition</button>
      {message.message ? <h1 style={{ color: 'white' }} >{message.message}</h1> : null}
    </form>
  );
};

