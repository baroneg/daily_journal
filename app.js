require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.use('/favicon.ico', express.static('assets/favicon.ico'));

mongoose.connect(process.env.MONGO_URI);

const today = new Date();

const options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
};

const day = today.toLocaleDateString("en-GB", options);

const postSchema = {
  title: String,
  content: String,
  timeStamp: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", function (req, res) {

  Post.find({}).sort({
    _id: -1
  }).exec(function (err, posts) {
    res.render("home", {
      posts: posts,
      date: day,
    });
    if (err) {
      console.log("Something went wrong.");
    }
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/about", function (req, res) {
  res.render("about", {
    abtContent: aboutContent
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contContent: contactContent
  });
});


app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.titleInput,
    content: req.body.textInput,
    timeStamp: day
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
      timestamp: post.timeStamp
    });
  });

});

app.post("/delete/:id", function (req, res) {

  Post.findByIdAndRemove(req.params.id, function (err) {
    if (!err) {
      console.log("Post Successfully deleted.");
      res.redirect("/");
    } else {
      console.log("Error");
    }
  });
});


app.get("/edit/:id", function (req, res) {

  const requestedPostId = req.params.id;

  Post.findOne({
    _id: requestedPostId
  }, function (err, post) {
    if (!err) {
      res.render("edit", {
        title: post.title,
        content: post.content,
        post: post,
      });
    } else {
      console.log("Something went wrong.")
    }
  });
});


app.post("/edit/:id", function (req, res) {

  const requestedPostId = req.params.id;

  Post.findByIdAndUpdate({
    _id: requestedPostId
  }, {
    title: req.body.titleInput,
    content: req.body.textInput
  }, function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.log("Something went wrong.")
    }
  });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started Successfully");
});