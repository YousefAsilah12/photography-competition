import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

export function ImageComponent(props) {
  const imageName = props.imageName;
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchImage() {
    debugger
    setIsLoading(true);
    setError(null);

    try {
      console.log(imageName);
      if (!imageName) {
        return <p>No image name provided.</p>;
      }
      
      const imageRef = ref(storage, `${props.location}/${imageName}`);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchImage();
  }, []);

  if (isLoading) {
    return <p>Loading image...</p>;
  }

  if (error) {
    return <p>Error loading image: {error.message}</p>;
  }

  if (!imageUrl) {
    return null;
  }

  return <img src={imageUrl} alt="Uploaded image" />;
}
