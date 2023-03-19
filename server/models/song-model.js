const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  songname: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  songlocation: {
    type: String,
    required: true,
    unique: true,
    max: 10,
  },
  coverlocation: {
    type: String,
    required: true,
    min: 8,
  },
  lyrics: {
    type: String,
  },
  artist:{
    type:String,
    min:3,
    max:20,
  },
  moviename:{
    type:String,
    min:3,
    max:20,
  },
  length:{
    type:String,
    required:true,
  }
});

module.exports = mongoose.model("Song", songSchema);
