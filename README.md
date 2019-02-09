# Mongo-Scrape

This is a Mongo-Scrape, New York Times Edition.

It will scrape all articles on New York Times main page, show headline and summary of articles.

Once scraping is done, all these information will store in mongodb.

User can be able to click on headlines to NYT page and read on, and also be able to save this article.

This app also intented to let users leave comments for each saved article; comments will be store in mongodb.
    1. user will be able to add/delete comments
    1. there is a population from the database collection articles to the other collection comments

However, due to difficulty of building population, the notes can only be added to the database without population. 

Click here to the deployed app: https://mongo-scrape-huilingwu.herokuapp.com/
