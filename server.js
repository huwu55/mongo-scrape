var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Routes

app.get("/", function(req, res){
    res.render("pages/index");
});

app.post("/scrape", function(req, res){
    axios.get("https://www.nytimes.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        var results = [];
        $("article").each(function(i, element) {

            var title = $(element).children().children().children().children().children($("h2")).text();
            if (title != ""){
                var summary = $(element).children().children().children().children($("p")).text();
                if (summary === ""){
                    summary = $(element).children().children().children().children($("ul")).text();
                }
                var link = $(element).find("a").attr("href");
            
                // Save these results in an object that we'll push into the results array we defined earlier
                results.push({
                    //element: $(element).children().children()
                    headline: title,
                    summary: summary,
                    link: link
                });
            }
        });
        //console.log(results[0].element);
        res.send(results);
    });
});

app.get("/saved", function(req, res){
    res.render("pages/savedArticles");
});

app.post("/saved/:id", function(req, res){
    
});

app.post("/addNote", function(req, res){

});

app.post("/clear", function(req, res){

});

app.listen(PORT, function() {
    console.log("Server started on port", PORT);
});