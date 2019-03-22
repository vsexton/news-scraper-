var axios = require("axios");
var cheerio = require("cheerio");
var scrape = function(){

    return axios.get("https://www.foxnews.com")
    .then(function(res){
        const $ = cheerio.load(res.data);
        console.log("scraping this")
        let aritcles = [];
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
                aritcles.push(data)
            }
        })
        console.log(aritcles);
        return aritcles;
    })
}
module.exports = scrape;