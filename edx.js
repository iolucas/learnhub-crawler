//EDX courses crawling bot

var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var json2csv = require('json2csv');
var async = require("async");


var url = "https://www.edx.org/api/v1/catalog/search?selected_facets[]=content_type_exact%3Acourserun&page_size=1300";

var fields = [
    // 'title',
    // 'url',
    // 'projects',
    // 'level',
    // 'description',
    // 'affiliates',
    // 'languages',
    // 'thumbnail'
    "availability",
    "content_type",
    "end",
    "enrollment_end",
    "enrollment_start",
    "full_description",
    "image_url",
    "key",
    "language",
    "level_type",
    "marketing_url",
    "number",
    "org",
    "pacing_type",
    "partner",
    "seat_types",
    "start",
    "short_description",
    "published",
    "title",
    "transcript_languages",
    "type"
]



request(url, function(error, response, body) {
    if (error || response.statusCode != 200) {
        console.log(error);
        console.log(response.statusCode);
        throw "Error while getting courses from edx."
    }

    var resultObj = JSON.parse(body);

    // var courseArray = [];


    //Get csv string
    var csvResults = json2csv({ 
        data: resultObj.objects.results, 
        fields: fields
    });   

    //Write reponse on files
    fs.writeFileSync("csvs/edx-courses.csv", csvResults);

    console.log("DONE EDX")

});