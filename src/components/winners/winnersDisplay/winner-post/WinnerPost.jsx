import { useEffect, useState } from "react";
import { ImageComponent } from "../../../competition/imageComponent/Imgage";




import "./Winner-post.css"
import { useFirestore } from "../../../../services/competition";
import { useNavigate } from "react-router";

export function WinnerPost({ post, onDelete,onBuyReload }) {
  const { isLoading, error, deleteDocument, deleteUnique, getUserByEmail, userData: user,updateDocument } = useFirestore()
  console.log("post form oo", post);
  const [price, setPrice] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const userLocalstorage = JSON.parse(localStorage.getItem("user"));
    if (!userLocalstorage) {
      const confirm = window.confirm("You must be logged in to buy an image");
      if (confirm) {
        navigate("/login");
      }
      else {
        window.close();
      }
    }
    getUserByEmail(userLocalstorage.email)
  }, [])


  async function handleDelete() {
    try {
      console.log("currpost", post);

      await deleteUnique(post.id, "winners")
      onDelete()
    } catch (error) {
      console.log(error.message)
    }
  }
  if (isLoading) return <h1>loading....</h1>;

  async function handleBuyNow() {
    console.log("userBuyNow", user);
    const u = user[0]
    try {
      u.buyedImages.push(post.imageUrl)
       updateDocument(u.id,u,"users")
       deleteUnique(post.id, "winners")
      alert("image moved to you profile page")
      onBuyReload()
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div className="post-show-container">

      <div className="post-header">
        <h3>title: {post.title}</h3>
        <h2>desctiption: {post.description}</h2>
      </div>
      <div className="post-img">
        <ImageComponent location="postsImage" imageName={post.imageUrl} />
      </div>
      <div className="post-footer">
        <div className="post-price"> <span>{post.votes * 20}</span> $</div>
        <div className="buttons-line">
          <button onClick={handleBuyNow} className="buy-btn">Buy Now</button>
          <button onClick={handleDelete} className="delete-button-winner" >delete</button>
        </div>
      </div>
    </div>
  );

}