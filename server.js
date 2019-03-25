// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// var bodyParser = require("body-parser");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");
// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express App
var app = express();

// Require our routes
// var routes = require("./routes");
var Note = require("./models/Note.js");
var mongoHeadlines = require("./models/Article.js");
//var scrape = require("./scraper")

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect Handlebars to our Express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//connect to mongodb 
app.get("/scrape", function (req, res) {
  axios.get("https://www.foxnews.com")
    .then(function(res){
        const $ = cheerio.load(res.data);
        console.log("scraping this")
        let article = [];
        $(".info").each(function(i, element){
            var title = $(element)
            .children(".info-header")
            .children(".title")
            .children("a").text();
            var link = $(element) 
            .children(".info-header")
            .children(".title")
            .children("a").attr("href");
            var summary = $(element).children(".content").children(".related").children("ul").children(".related-item").children("a").text()
            if (title && link && summary){
                var data = {
                    title: title,
                    link: link,
                    summary: summary
                }
                article.push(data)
            }
        })
        console.log(article);
        // database insert code here and put the "return mongoHeadliness" in the callback
        db.mongoHeadlines.create(result)
        .then(function(article) {
          // View the added result in the console
          console.log(article);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });


        
        // return mongoHeadliness;
    
// Route for getting all mongoHeadliness from the db
app.get("/articles", function(req, res) {
    // Grab every document in the mongoHeadliness collection
    db.mongoHeadlines.find({})
      .then(function(dbmongoHeadlines) {
        // If we were able to successfully find mongoHeadliness, send them back to the client
        res.json(dbmongoHeadlines);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific mongoHeadlines by id, populate it with it's note
  app.get("/Article/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.mongoHeadlines.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbmongoHeadlines) {
        // If we were able to successfully find an mongoHeadlines with the given id, send it back to the client
        res.json(dbmongoHeadlines);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an mongoHeadlines's associated Note
  app.post("/mongoHeadliness/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
   
        return db.mongoHeadlines.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true }
        );
      })
      .then(function(dbmongoHeadlines) {
        // If we were able to successfully update an mongoHeadlines, send it back to the client
        res.json(dbmongoHeadlines);
      })
})

// Have every request go through our route middleware
// app.use(routes);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
})
;
  