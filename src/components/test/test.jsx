
import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useFirestore } from "../../services/competition";
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Gallery from 'react-photo-gallery';
import "./test.css"

const storage = getStorage();
function MyGallery() {
  const { data: posts, fetchData } = useFirestore();
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData("posts");
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      Promise.all(
        posts.map(async (post) => {
          console.log(post);
          const imageRef = ref(storage, `postsImage/${post.imageUrl}`);
          const url = await getDownloadURL(imageRef);
          return {
            id: post.id,
            src: url,
            width: post.width / 2,
            height: post.height / 2,
            title: post.title,
            caption: post.description
          };
        })
      ).then((photos) => setPhotos(photos));
      console.log(photos);
    }
  }, [posts]);

  const handleClick = (event, { photo, index }) => {
    // Navigate to a new page when an image is clicked
    navigate(`/post-details/${photo.id}`);
  };

  return (
    <div className='LayoutGallery'>
      <Gallery photos={photos} onClick={handleClick} />
    </div>
  );
}

export default MyGallery;
