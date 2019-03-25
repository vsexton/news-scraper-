var axios = require("axios");
var cheerio = require("cheerio");

//import database

var scrape = function(){

    axios.get("https://www.foxnews.com")
    .then(function(res){
        const $ = cheerio.load(res.data);
        console.log("scraping this")
        let articles = [];
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
                articles.push(data)
            }
        })
        console.log(articles);
        // database insert code here and put the "return articles" in the callback
        return articles;
    })
}
module.exports = scrape; 
