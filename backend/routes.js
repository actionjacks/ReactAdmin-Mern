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

export default router;
