import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import fileDownload from 'react-file-download';

const storage = getStorage();

export function ImageComponent(props) {
  const imageName = props.imageName;
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canDownload, setCanDownload] = useState(false);
  async function fetchImage() {

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
    if (props.canDownload) {
      setCanDownload(props.canDownload)
    }
  }, []);

  const handleImageDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  function downloadFile(url, fileName) {
    // Create a link element and set its href attribute to the download URL
    const link = document.createElement('a');
    link.href = url;

    // Set the link element's download attribute to the filename you want to save the file as
    link.download = fileName;

    // Click the link to download the file
    document.body.appendChild(link);
    link.click();

    // Clean up the link element
    document.body.removeChild(link);
  }


  if (isLoading) {
    return <p>Loading image...</p>;
  }

  if (error) {
    return <p>Error loading image: {error.message}</p>;
  }

  if (!imageUrl) {
    return null;
  }

  return <>
    <img src={imageUrl} alt="Uploaded image" />
    {canDownload ? <div style={{ display: 'block' }}> <button onClick={() => downloadFile(imageUrl, imageName)}>Download</button> </div> : null}
  </>
}
