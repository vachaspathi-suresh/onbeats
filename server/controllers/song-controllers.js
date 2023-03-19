const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const Song = require("../models/song-model");
const User = require("../models/user-model");

const getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find({});
    const songnames = songs.map((song) => {
      return {
        songId: song.id,
        songname: song.songname,
        cover: song.coverlocation,
        song: song.songlocation,
        lyrics: song.lyrics,
        movie: song.moviename,
        artist: song.artist,
      };
    });
    res.status(200).json({ songnames });
  } catch (err) {
    return next(
      new HttpError("Unable to find Songs, please try again later.", 500)
    );
  }
};

const createPlayList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Playlist Name, please select another.", 422)
    );
  }
  let user;
  try {
    user = await User.findById(req.userData.userID);
  } catch (err) {
    return next(
      new HttpError("Unable to Create Playlist, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }
  const newplaylist = {
    playlistname: req.body.playlistname,
    playlistsongs: [],
  };
  try {
    user.playlists.push(newplaylist);
    await user.save();
  } catch (err) {
    return next(
      new HttpError("Unable to Create Playlist, please try again later.", 500)
    );
  }
  res.status(200).json({ playlistname: newplaylist.playlistname });
};

const addToPlayList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Playlist or Song, please select another.", 422)
    );
  }
  let user;
  try {
    user = await User.findById(req.userData.userID).populate("playlists");
  } catch (err) {
    return next(
      new HttpError("Unable to Add to Playlist, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }
  let song;
  try {
    song = await Song.findById(req.body.songId);
  } catch (err) {
    return next(
      new HttpError("Unable to Add to Playlist, please try again later.", 500)
    );
  }
  if (!song) {
    return next(new HttpError("Song not found", 404));
  }
  try {
    user.playlists = user.playlists.map((p) => {
      if (p.playlistname === req.body.playlistname) {
        p.playlistsongs = p.playlistsongs.filter(
          (s) => s.toString() !== req.body.songId
        );
        p.playlistsongs.push(song);
      }
      return p;
    });
    await user.save();
  } catch (err) {
    return next(
      new HttpError("Unable to Add to Playlist, please try again later.", 500)
    );
  }
  res.status(200).json({ playlists: user.playlists });
};

const getPlaylistNames = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userID);
  } catch (err) {
    return next(
      new HttpError("Unable to Create Playlist, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }
  try {
    const listnames = user.playlists.map((list) => {
      return list.playlistname;
    });
    res.status(200).json({ listnames });
  } catch (err) {
    return next(
      new HttpError("Unable to Create Playlist, please try again later.", 500)
    );
  }
};

const getPlaylists = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userID).populate(
      "playlists.playlistsongs"
    );
  } catch (err) {
    return next(
      new HttpError("Unable to Create Playlist, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }
  try {
    const listnames = user.playlists.map((list) => {
      return {
        playlistname: list.playlistname,
        playlistsongs: list.playlistsongs.map((song) => ({
          songId: song.id,
          songname: song.songname,
          cover: song.coverlocation,
          song: song.songlocation,
          lyrics: song.lyrics,
          movie: song.moviename,
          artist: song.artist,
        })),
      };
    });
    res.status(200).json({ listnames });
  } catch (err) {
    return next(
      new HttpError("Unable to Create Playlist, please try again later.", 500)
    );
  }
};

const changePlaylistName = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Playlist, please select another.", 422));
  }
  let user;
  try {
    user = await User.findById(req.userData.userID);
  } catch (err) {
    return next(
      new HttpError("Unable to Change Title, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  try {
    user.playlists = user.playlists.map((p) => {
      if (p.playlistname === req.body.playlistname) {
        p.playlistname = req.body.newplaylistname;
      }
      return p;
    });
    await user.save();
  } catch (err) {
    return next(
      new HttpError("Unable to Change Title, please try again later.", 500)
    );
  }
  res.status(200).json({ playlists: user.playlists });
};

const removeFromPlayList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Playlist or Song, please select another.", 422)
    );
  }
  let user;
  try {
    user = await User.findById(req.userData.userID).populate("playlists");
  } catch (err) {
    return next(
      new HttpError(
        "Unable to Remove from Playlist, please try again later.",
        500
      )
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }
  try {
    user.playlists = user.playlists.map((p) => {
      if (p.playlistname === req.body.playlistname) {
        p.playlistsongs = p.playlistsongs.filter(
          (s) => s.toString() !== req.body.songId
        );
      }
      return p;
    });
    await user.save();
  } catch (err) {
    return next(
      new HttpError(
        "Unable to Remove from Playlist, please try again later.",
        500
      )
    );
  }
  res.status(200).json({ playlists: user.playlists });
};

const deletePlayList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Playlist, please select another.", 422));
  }
  let user;
  try {
    user = await User.findById(req.userData.userID).populate("playlists");
  } catch (err) {
    return next(
      new HttpError("Unable to Delete Playlist, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }
  try {
    user.playlists = user.playlists.filter(
      (p) => p.playlistname !== req.body.playlistname
    );
    await user.save();
  } catch (err) {
    return next(
      new HttpError("Unable to Delete Playlist, please try again later.", 500)
    );
  }
  res.status(200).json({ playlists: user.playlists });
};

const adminAddSong = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userID);
  } catch (err) {
    return next(
      new HttpError("Unable to Add Song, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }
  if (user.userprivilege !== "adm") {
    return next(new HttpError("Invalid Authorization", 404));
  }
  let lyrics =
    req.body.lyrics && req.body.lyrics.trim().length > 3
      ? req.body.lyrics
      : "Lyrics Not Available";
  const newSong = new Song({
    songname: req.body.name,
    songlocation: req.files.song[0].path.split("\\")[2],
    coverlocation: req.files.cover[0].path.split("\\")[2],
    lyrics: lyrics,
    artist: req.body.artist,
    moviename: req.body.movie,
    length: "3:33",
  });
  try {
    await newSong.save();
  } catch (err) {
    return next(
      new HttpError("Adding Song failed, please try again later.", 500)
    );
  }
  res.status(200).json({ status: "success" });
};

const adminDeleteSong = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userID);
  } catch (err) {
    return next(
      new HttpError("Unable to Delete Song, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }
  if (user.userprivilege !== "adm") {
    return next(new HttpError("Invalid Authorization", 404));
  }
  let song;
  try {
    song = await Song.findById(req.body.songId);
  } catch (err) {
    return next(
      new HttpError("Unable to Delete Song, please try again later.", 500)
    );
  }
  if (!song) {
    return next(new HttpError("Song not found", 404));
  }

  try {
    await Song.findByIdAndDelete(req.body.songId, () => {}).clone();
    fs.unlinkSync("res/covers/" + song.coverlocation);
    fs.unlinkSync("res/songs/" + song.songlocation);

    res.status(200).json({ status: "success" });
  } catch (err) {
    return next(
      new HttpError("Unable to Delete Song, please try again later.", 500)
    );
  }
};

const adminUpdateSong = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userID);
  } catch (err) {
    return next(
      new HttpError("Unable to Update Song, please try again later.", 500)
    );
  }
  if (!user) {
    return next(new HttpError("User not found", 404));
  }
  if (user.userprivilege !== "adm") {
    return next(new HttpError("Invalid Authorization", 404));
  }
  let song;
  try {
    song = await Song.findById(req.body.songId);
  } catch (err) {
    return next(
      new HttpError("Unable to Update Song, please try again later.", 500)
    );
  }
  if (!song) {
    return next(new HttpError("Song not found", 404));
  }

  try {
    const { field, newValue } = req.body;
    if (field === "songname") song.songname = newValue;
    else if (field === "movie") song.moviename = newValue;
    else if (field === "artist") song.artist = newValue;
    else if (field === "lyrics") song.lyrics = newValue;
    else return next(new HttpError("Invalid Field To Update", 404));

    await song.save();

    res.status(200).json({ status: "success" });
  } catch (err) {
    return next(
      new HttpError("Unable to Update Song, please try again later.", 500)
    );
  }
};

exports.getSongs = getSongs;
exports.createPlayList = createPlayList;
exports.addToPlayList = addToPlayList;
exports.getPlaylistNames = getPlaylistNames;
exports.getPlaylists = getPlaylists;
exports.changePlaylistName = changePlaylistName;
exports.removeFromPlayList = removeFromPlayList;
exports.deletePlayList = deletePlayList;
exports.adminAddSong = adminAddSong;
exports.adminDeleteSong = adminDeleteSong;
exports.adminUpdateSong = adminUpdateSong;
