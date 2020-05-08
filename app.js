var express = require("express"),
  app = express(),
  bodyparser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  localStrat = require("passport-local"),
  User = require("./models/user"),
  methodOverride = require("method-override"),
  campground = require("./models/campgrounds"),
  comment = require("./models/comment"),
  seeddb = require("./seed"),
  flash = require("connect-flash");

//routes
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/auth");

app.use(bodyparser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

//passport config

app.use(
  require("express-session")({
    secret: "this the password for my website",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//using routes
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen("5500", "localhost", function() {
  console.log("server has started!");
});
