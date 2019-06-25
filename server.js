var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
const fetch = require('node-fetch');
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

// if scrape already: show all scraped articles from db that marked save: false
app.get("/", function(req, res){
    db.Article.find({saved : false}).then(dbArticle => {
        res.render("pages/index", {
            articles : dbArticle
        });
    });
});

// scrape articles from nyt and insert them into mongo db as save: false
app.post("/scrape", function(req, res){
    db.Comment.deleteMany({}, (err)=>{
        if (err) return console.log(err);

        db.Article.deleteMany({}, (err)=>{
            if (err) return console.log(err);
            
            fetch('https://www.nytimes.com/')
                .then(res => res.text())
                .then(response=>{
                    //console.log(response);
                    var results = [];
                    var $ = cheerio.load(response);
                    $("article").each(function(i, element){
                        //console.log(element);
                        var title = $(element).children().children().children().children().children($("h2")).text();
                        var summary = $(element).children().children().children().children($("p")).text();
                        if (summary === ""){
                            summary = $(element).children().children().children().children($("ul")).text();
                        }
                        if (title != "" && summary != ""){
                            var url = $(element).find("a").attr("href");
                            
                            // Save these results in an object that we'll push into the results array we defined earlier

                            results.push({
                                headline: title,
                                summary: summary,
                                url: `https://www.nytimes.com${url}`,
                                saved: false
                            });
                        }
                    });

                    db.Article.insertMany(results)
                        .then(()=>{
                            //console.log("then");
                            db.Article.find({saved : false})
                                .then(dbArticle => {
                                    res.send(dbArticle);
                                })
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
                
        });
    });
});

// find article by id and mark it as save
app.get("/saved", function(req, res){
    //res.render("pages/savedArticles");
    db.Article.find({saved : true}).then(dbArticle => {
        res.render("pages/savedArticles", {
            articles : dbArticle
        });
    });
});

// show all saved articles
app.post("/saved/:id", function(req, res){
    var id = req.params.id;
    db.Article.update(
        { _id : id},
        {saved : true},
        () => {
            res.send(true);
        }
    );
});

// mark saved article as save: false
app.post("/unsaved/:id", function(req, res){
    var id = req.params.id;
    //console.log("post",id);
    db.Article.update(
        { _id : id},
        {saved : false},
        () => {
            res.send(true);
        }
    );
});

// show all comments
app.post("/showComments/:id", function(req, res){
    var id = req.params.id;

    // db.Article.find({_id : id})
    //     .populate("comments")
    //     .then(dbArticle => {
    //         res.send(dbArticle.comments);
    //     })
    //     .catch(err => {
    //         return console.log(err);
    //     });

    db.Comment.find({}).then(comments => {
        res.send(comments);
    });
});

// add comment
app.post("/addComment/:articleID", function(req, res){
    var id = req.params.articleID;

    //console.log(req.body.comment);
    db.Comment.create({body : req.body.comment})
        .then(dbComment => {
            //console.log(dbComment);
            db.Article.findOneAndUpdate(
                {_id : id}, 
                {comments : dbComment._id}, //{$push: {comment : dbComment._id}}, 
                { new : true}
            )
            .then(() => {
                res.send(dbComment._id);
            });
        })
        .catch(err => {
            return console.log(err);
        });
});

// delete a comment
app.post("/deleteComment/:commentID", function(req, res){
    var commentID = req.params.commentID;
    var articleID = req.params.articleID;

    db.Comment.deleteOne({_id : commentID})
        // .then(dbComment => {
        //     return db.Article.findOneAndDelete(
        //         {id : articleID}, 
        //         {pop this from comments}
        //         { new : true}
        //     );
        // })
        // .then((dbArticle) => {
        //     res.send(true);
        // })
        .catch(err => {
            return console.log(err);
        });
});

// clear all articles and comments from db
app.post("/clear", function(req, res){
    db.Comment.deleteMany({}, (err)=>{
        if (err) return console.log(err);
        db.Article.deleteMany({}, (err)=>{
            if (err) return console.log(err);
            res.send(true);
        });
    });
});

app.listen(PORT, function() {
    console.log("Server started on port", PORT);
});