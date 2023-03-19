const songControllers = require("../controllers/song-controllers");
const authCheck = require("../middle-wares/auth-check");

const router = require("express").Router();
const { check } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const songStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("res")) {
      fs.mkdirSync("res");
    }

    if (!fs.existsSync("res/songs")) {
      fs.mkdirSync("res/songs");
    }
    if (!fs.existsSync("res/covers")) {
      fs.mkdirSync("res/covers");
    }
    var ext = path.extname(file.originalname);
    if (ext === ".mp3") cb(null, "res/songs");
    else cb(null, "res/covers");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const songUpload = multer({
  storage: songStorage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".mp3" && ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("Invalid files uploaded!"));
    }

    cb(null, true);
  },
});

router.post("/get-songs", songControllers.getSongs);
router.use(authCheck);
router.post(
  "/admin-add-songs",
  songUpload.fields([
    {
      name: "song",
      maxCount: 1,
    },
    {
        name:"cover",
        maxCount:1,
    },
  ]),
  songControllers.adminAddSong
);
router.post("/admin-delete-song",songControllers.adminDeleteSong);
router.post("/admin-update-song",songControllers.adminUpdateSong);
router.post(
  "/create-playlist",
  [check("playlistname").not().isEmpty()],
  songControllers.createPlayList
);
router.post(
  "/add-to-playlist",
  [check("playlistname").not().isEmpty(), check("songId").not().isEmpty()],
  songControllers.addToPlayList
);
router.post("/get-playlist-names", songControllers.getPlaylistNames);
router.post("/get-playlists", songControllers.getPlaylists);
router.post(
  "/change-playlist-name",
  [
    check("playlistname").not().isEmpty(),
    check("newplaylistname").not().isEmpty(),
  ],
  songControllers.changePlaylistName
);
router.post(
  "/remove-from-playlist",
  [check("playlistname").not().isEmpty(), check("songId").not().isEmpty()],
  songControllers.removeFromPlayList
);
router.post(
  "/delete-playlist",
  [check("playlistname").not().isEmpty()],
  songControllers.deletePlayList
);
module.exports = router;
