import mongoose from "mongoose";

const postModel = mongoose.Schema({
  postTitle: String,
  postContents: String,
});

export default mongoose.model("posts", postModel);
