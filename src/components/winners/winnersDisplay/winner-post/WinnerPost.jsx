import { useEffect, useState } from "react";
import { ImageComponent } from "../../../competition/imageComponent/Imgage";




import "./Winner-post.css"
import { useFirestore } from "../../../../services/competition";
export function WinnerPost({ post,onDelete }) {
  const { isLoading, error, deleteDocument,deleteUnique } = useFirestore()
  console.log("post form oo", post);
  const [price, setPrice] = useState(null);
  async function handleDelete() {
    try {
      console.log("currpost",post);

      await deleteUnique(post.id, "winners")
      onDelete()
    } catch (error) {
      console.log(error.message)
    }
  }
  if (isLoading) return <h1>loading....</h1>;
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
        <div className="post-price">Price: {post.votes * 20}$</div>
        <div className="buttons-line">
          <button className="buy-btn">Buy Now</button>
          <button onClick={handleDelete} style={{ backgroundColor: "red" }}>delete</button>
        </div>
      </div>
    </div>
  );

}