var express = require("express");
var router = express.Router();
var campground = require("../models/campgrounds");
var middleware = require("../middleware");

router.get("/campgrounds", function (req, res) {
  campground.find({}, function (err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/campgrounds.ejs", { campgrounds: campgrounds });
    }
  });
});

router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function (req, res) {
  campground
    .findById(req.params.id)
    .populate("comments")
    .exec(function (err, campground) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground: campground });
      }
    });
});

router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.desc;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newcampground = {
    name: name,
    image: image,
    description: desc,
    author: author
  };
  campground.create(newcampground, function (err, newlycreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});
// edit route

router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwner,
  (req, res) => {
    campground.findById(req.params.id, (err, campground) => {
      if (err) {
        res.redirect("back");
      } else {
        res.render("campgrounds/edit", { campground: campground });
      }
    });
  }
);

// update route

router.put("/campgrounds/:id", middleware.checkCampgroundOwner, (req, res) => {
  campground.findOneAndUpdate(
    req.params.id,
    req.body.campground,
    (err, campground) => {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

//destroy route

router.delete(
  "/campgrounds/:id",
  middleware.checkCampgroundOwner,
  (req, res) => {
    campground.findByIdAndRemove(req.params.id, (err, campground) => {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        req.flash("success", "Deleted!");
        res.redirect("/campgrounds");
      }
    });
  }
);

module.exports = router;
