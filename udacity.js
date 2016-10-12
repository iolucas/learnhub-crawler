//Udacity courses crawling bot

var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var json2csv = require('json2csv');

var fields = [
    'title',
    'url',
    'projects',
    'level',
    'description',
    'affiliates',
    'languages',
    'thumbnail'
]


var courses = [];


request("https://in.udacity.com/courses/all/", function(error, response, body) {
    if (error || response.statusCode != 200) {
        throw "Error while getting courses from udacity."
    }

    var $ = cheerio.load(body);

    $(".course-summary-card").each(function() {

        var thumbnail = $(this).children(".col-sm-3").find("img").attr("src");
        var title = $(this).children(".col-sm-9").find("a[data-course-title]").text().trim();
        var url = $(this).children(".col-sm-9").find("a[data-course-title]").attr("href");
        var projects = $(this).children(".col-sm-9").find("strong[data-course-project]").text().trim();
        var level = $(this).children(".col-sm-9").find("span[data-course-level-label]").text().trim();
        var description = $(this).children(".col-sm-9").find("div[data-course-short-summary]").text().trim();
        var affiliates = $(this).children(".col-sm-9").find("strong[data-course-affiliates-list]").text().trim();
        
        var languages = [];
        $(this).children(".col-sm-9").find(".catalog-flags").find("img").each(function(){ 
            languages.push($(this).attr("alt"));        
        });

        courses.push({
            'title': title,
            'url': url,
            'projects': projects,
            'level': level,
            'description': description,
            'affiliates': affiliates,
            'languages': languages,
            'thumbnail':thumbnail
        });
    });

    //Get csv string
    var csvResults = json2csv({ 
        data: courses, 
        fields: fields
    });   

    //Write reponse on files
    fs.writeFileSync("csvs/udacity.csv", csvResults);

    console.log("DONE UDACITY")
});

