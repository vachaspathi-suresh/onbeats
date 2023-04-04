const songControllers = require("../controllers/song-controllers");
const authCheck = require("../middle-wares/auth-check");

const router = require("express").Router();
const { check } = require("express-validator");

router.post("/get-songs", songControllers.getSongs);
router.use(authCheck);
router.post("/admin-add-songs", songControllers.adminAddSong);
router.post("/admin-delete-song", songControllers.adminDeleteSong);
router.post("/admin-update-song", songControllers.adminUpdateSong);
router.post("/get-image-upload-url", songControllers.getImageUploadUrl);
router.post("/get-song-upload-url", songControllers.getSongUploadUrl);
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
