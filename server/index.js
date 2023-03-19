require("dotenv").config();

const userRoutes = require("./routes/user-routes");
const songRoutes = require("./routes/song-routes");
const HttpError = require("./models/http-error");
const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/songdata/cover", express.static(path.join("res", "covers")));
app.get("/api/songsdata/song/:path", function (req, res) {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const audiopath = "./res/songs/" + req.params.path;
  const audioSize = fs.statSync(audiopath).size;

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, audioSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${audioSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mpeg",
  };

  res.writeHead(206, headers);
  const audioStream = fs.createReadStream(audiopath, { start, end });

  audioStream.pipe(res);
});
app.use("/api/auth", userRoutes);
app.use("/api/songs", songRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => {
    try {
      app.listen(process.env.PORT || 5000, () => {
        console.log("Server is up and listening");
      });
    } catch (err) {
      console.error(err);
    }
  })
  .catch((err) => {
    console.log("ERROR_CONNECTING_DATABASE", err);
  });
