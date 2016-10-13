//Coursera courses crawling bot

var fs = require("fs");
var request = require("request");
var json2csv = require('json2csv');
var async = require("async");

var fields = [
    "id", 
    "slug", 
    "name", 
    "primaryLanguages", 
    "subtitleLanguages", 
    "partnerLogo", 
    "instructorIds", 
    "partnerIds", 
    "photoUrl", 
    "certificates", 
    "description", 
    "startDate", 
    "workload", 
    "previewLink", 
    "specializations", 
    "s12nIds", 
    "domainTypes", 
    "categories"
]

var url = "https://api.coursera.org/api/courses.v1?fields=" + fields.join(","); 



//https://api.coursera.org/api/courses.v1?start=0&limit=1&fields=primaryLanguages,subtitleLanguages,partnerLogo,instructorIds,partnerIds,photoUrl,certificates,description,startDate,workload,previewLink,specializations,s12nIds,domainTypes,categories


var courseArray = [];

var urlsCreated = false;

var asyncQueue = async.queue(function(url, callback) {

    downloadCourseData(url, function(result) {

        //Append new course elements to the course array
        courseArray = courseArray.concat(result.elements);

        //If the urls have not been created yet, 
        if(!urlsCreated) {
            var numberOfCourses = result.paging.total;
            var resultsPerPage = 100;
            var numberOfPages = Math.ceil(numberOfCourses / resultsPerPage);

            for(var i = 1; i < numberOfPages; i++) {
                var newUrl = url + "&start=" + i*resultsPerPage + "&limit=" + resultsPerPage;
                asyncQueue.push(newUrl);     
            }

            urlsCreated = true;
        }        

        callback();
    });

}, 10);

//On queue is empty
asyncQueue.drain = function() {

    //Get csv string
    var csvResults = json2csv({ 
        data: courseArray, 
        fields: fields
    });   

    //Write reponse on files
    fs.writeFileSync("csvs/coursera-courses.csv", csvResults);

    console.log("DONE COURSERA")
}

asyncQueue.push(url);

function downloadCourseData(url, callback) {

    request(url, function(error, response, body) {
        if (error || response.statusCode != 200) {
            console.log(error);
            console.log(response.statusCode);
            throw "Error while getting courses from coursera."
        }

        var resultObj = JSON.parse(body);

        // var courseArray = [];

        //Get csv string
        // var csvResults = json2csv({ 
        //     data: resultObj.elements, 
        //     fields: fields
        // });   

        // //Write reponse on files
        // fs.writeFileSync("csvs/coursera-courses.csv", csvResults);

        // console.log("DONE COURSERA")

        callback(resultObj);
    });
}