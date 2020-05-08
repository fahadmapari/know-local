var express = require("express");
var router = express.Router();
var campground = require("../models/campgrounds"),
  comment = require("../models/comment");
var middleware = require("../middleware");

router.get(
  "/campgrounds/:id/comment/new",
  middleware.isLoggedIn,
  (req, res) => {
    campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/new", { campground: campground });
      }
    });
  }
);

router.post("/campgrounds/:id/comment", middleware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong!")
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Review Added!")
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//edit comments

router.get(
  "/campgrounds/:id/:comment_id/edit",
  middleware.checkCommentOwner,
  (req, res) => {
    comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/edit", {
          comment: comment,
          campground_id: req.params.id
        });
      }
    });
  }
);

//update comment

router.put(
  "/campgrounds/:id/:comment_id",
  middleware.checkCommentOwner,
  (req, res) => {
    comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      (err, comment) => {
        if (err) {
          res.redirect("back");
        } else {
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  }
);

// delete
router.delete(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwner,
  (req, res) => {
    comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect("/campgrounds/" + req.params.id);
      } else {
        req.flash("success", "Deleted!");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

module.exports = router;
