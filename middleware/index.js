var campground = require("../models/campgrounds"),
  comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please, login first!");
  res.redirect("/login");
};

middlewareObj.checkCommentOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        req.flash("error", "Item not found!");
        res.redirect("back");
      } else {
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You're not allowed to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You're not allowed to do that!");
    res.redirect("back");
  }
};

middlewareObj.checkCampgroundOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    campground.findById(req.params.id, (err, campground) => {
      if (err) {
        req.flash("error", "Item not found");
        res.redirect("back");
      } else {
        if (campground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You're not allowed to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");
  }
};

module.exports = middlewareObj;
