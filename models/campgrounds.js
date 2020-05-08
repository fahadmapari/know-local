var mongoose = require("mongoose");
var comments = require("./comment");

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment"
    }
  ],
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String
  }
});

var campground = mongoose.model("campground", campgroundSchema);

module.exports = campground;
