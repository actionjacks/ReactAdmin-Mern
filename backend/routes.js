import express from "express";
//mangoose modals
import postModel from "./mongoModels/postModel.js";
const router = express.Router();

router.get("/", (req, res) => res.status(200).send("app is running"));

router.post("/upload/post", (req, res) => {
  const dbPost = req.body;

  postModel.create(dbPost, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// retrieve all posts
router.get("/retrieve/posts", (req, res) => {
  postModel.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      data.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
      res.status(200).send(data);
    }
  });
});

//retrieve one post
router.get(`/retrieve/post`, (req, res) => {
  const id = req.query.id;

  console.log(id);
  postModel.findOne({ _id: id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(data);
    }
  });
});

//delete one post
router.delete(`/delete/post`, (req, res) => {
  const id = req.query.id;

  postModel.findOneAndDelete({ _id: id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(data);
    }
  });
});

export default router;
