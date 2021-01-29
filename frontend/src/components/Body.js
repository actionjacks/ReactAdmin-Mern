import React, { useState, useEffect } from "react";
import axios from "../axios";
import { useParams } from "react-router-dom";
import Post from "./Post";

import Pusher from "pusher-js";
const pusher = new Pusher("e74b127fe5a7fae4c4cb", {
  cluster: "eu",
});

function Body() {
  const [postsData, setPostsData] = useState([]);

  const syncFeed = () => {
    axios.get("/retrieve/posts").then((res) => {
      console.log(res.data);
      setPostsData(res.data);
    });
  };

  useEffect(() => {
    const channel = pusher.subscribe("posts");
    channel.bind("inserted", function (data) {
      syncFeed();
    });
  });

  useEffect(() => {
    syncFeed();
  }, []);

  return (
    <div className="body">
      {postsData.map((item) => (
        <Post
          key={item._id}
          postTitle={item.postTitle}
          postContents={item.postContents}
        />
      ))}
    </div>
  );
}

export default Body;
