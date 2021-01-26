import express from "express";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import cors from "cors";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import bodyParser from "body-parser";
import path from "path";
import Pusher from "pusher";
import router from "./routes.js";

//for store images
Grid.mongo = mongoose.mongo;

const app = express();
//port for heroku
const port = process.env.PORT || 9000;

//middleware
const pusher = new Pusher({
  appId: "1142946",
  key: "e74b127fe5a7fae4c4cb",
  secret: "f2ba303da5621f532614",
  cluster: "eu",
  useTLS: true,
});
app.use(bodyParser.json());
app.use(cors());
app.use(cookieSession({ keys: ["qWxVHjh7J2DlPOi9"] }));

const mongoURL = `mongodb+srv://reactadmin:reactadmin@cluster0.uvdyq.mongodb.net/reactMyAdminDb?retryWrites=true&w=majority`;

const conn = mongoose.createConnection(mongoURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once("open", () => {
  console.log("connected to Database");
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});
//storge for images
const storage = new GridFsStorage({
  url: mongoURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `image-${Date.now()}${path.extname(file.originalname)}`;
      //save image to images collection
      const fileInfo = {
        filename: filename,
        bucketName: "images",
      };
      resolve(fileInfo);
      reject((err) => console.log(err));
    });
  },
});

const upload = multer({ storage });

mongoose.connect(mongoURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("DB connected");
  //listening for change
  const changeStream = mongoose.connection.collection("posts").watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      pusher.trigger("posts", "inserted", {
        change: change,
      });
    } else {
      console.log("error triggering PUSHER!");
    }
  });
});

//routes
app.use(router);

//listen
app.listen(port, () => console.log(`listen at PORT ${port}`));
