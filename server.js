var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = process.env.PORT || 3000;


var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapingHw";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req, res) {

  axios.get("https://www.nytimes.com/section/nyregion?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=N.Y.&WT.nav=page").then(function (response) {

    var $ = cheerio.load(response.data);


    $("div.story-body").each(function (i, element) {

      var result = {};


      // var image = $(element).children().children().children("img").attr("src");
      // var headline = $(element).children("a").text().replace(/\s+/g, " ");
      // var summary = $(element).children().find("p").text();
      // var url = $(element).children("a").attr("href");


      result.image = $(this)
        .children().children().children("img").attr("src");
      result.headline = $(this)
        .children("a").text().replace(/\s+/g, " ");
      result.summary = $(this)
        .children().find("p").text();
      result.url = $(this)
        .children("a").attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {

          console.log("DB_ARTICLE***********", dbArticle);
        })
        .catch(function(err) {

          return res.json(err);
        });

      
    });
    // res.send();
  });
});


app.get("/articles", function(req, res) {

  db.Article.find({})
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
});


app.get("/articles/:id", function(req, res) {

  db.Article.findOne({ _id: req.params.id })

    .populate("notes")
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
});


app.post("/comments/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
