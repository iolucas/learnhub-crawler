var cheerio = require("cheerio");
var request = require("request");
var async = require("async");

//var https = require("https");

module.exports = {
    getName: function(){ return "mva"; },
    getCourses: function(callback) {

        var responseObj = [];

        var reqData = {"SelectCriteria":[{"SelectOnField":"LCID","SelectTerm":"1046","SelectMatchOption":2}],"DisplayFields":[],"SortOptions":[{"SortOnField":"Relevance","SortOrder":1}],"SearchKeyword":"","UILangaugeCode":1046,"UserLanguageCode":1046}

        var asyncQueue = async.queue(function(reqUrl, taskcallback) {

            var options = {
                method: 'POST',
                json: true,
                uri: reqUrl ,
                body: reqData
            }

            request(options, function(error, response, body) {
                if(error)
                    throw error;

                for(var i = 0; i < body.results.length; i++) {
                    var result = body.results[i];

                    responseObj.push(copyParameters(result, [
                        "courseLevel", 
                        "courseName",
                        "languageCode",
                        "courseShortDescription",
                        "courseDuration",
                        "tags",
                        "audiences",
                        "technologies",
                        "technologiesCategory",
                        "topics"
                    ]));
                }

                taskcallback();
            });

        }, 10);

        asyncQueue.drain = function() {
            callback(responseObj);
        }

        asyncQueue.push([
            "https://api-mlxprod.microsoft.com/sdk/search/v1.0/5/courses?$skip=0&$top=500",
            //"https://api-mlxprod.microsoft.com/sdk/search/v1.0/5/courses?$skip=500&$top=500",
            //"https://api-mlxprod.microsoft.com/sdk/search/v1.0/5/courses?$skip=1000&$top=500",
            //"https://api-mlxprod.microsoft.com/sdk/search/v1.0/5/courses?$skip=1500&$top=500",
            //"https://api-mlxprod.microsoft.com/sdk/search/v1.0/5/courses?$skip=2000&$top=500",
            //"https://api-mlxprod.microsoft.com/sdk/search/v1.0/5/courses?$skip=2500&$top=500"
        ]);
    }
}




function copyParameters(obj, parameters) {
    var returnObj = {}

    for(var i = 0; i < parameters.length; i++) {
        var param = parameters[i];
        if(obj[param] != undefined) {
            if(typeof obj[param] == 'string')
                returnObj[param] = obj[param];
            else
                returnObj[param] = JSON.stringify(obj[param]);  
        }
    }

    return returnObj;
}


