import React from "react";
import "./Post.css";

function Post({ postTitle, postContents }) {
  return (
    <div className="post">
      <h3>{postTitle}</h3>
      <p>{postContents}</p>
    </div>
  );
}

export default Post;
