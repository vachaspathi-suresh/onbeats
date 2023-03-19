const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  playlistname:{
    type:String,
    required:true,
  },
  playlistsongs:[{type: mongoose.Types.ObjectId,ref:"Song"}],
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  avatarImage: {
    type: String,
    required: true,
  },
  playlists: [{type:playlistSchema}],
  userprivilege:{
    type:String,
    required:true,
  },
  expiredate:{
    type: Date,
    required: true,
  },
  stripeCustomer:{
    type:String,
    required:true,
  },
  stripeSuscription:{
    type:String,
    required:true,
  }
});

module.exports = mongoose.model("User", userSchema);
