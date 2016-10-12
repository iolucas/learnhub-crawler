// Crawling bot for Udemy Courses

// Course Areas:
// Desenvolvimento
// Negócios
// TI E Software
// Produtividade no escritório
// Desenvolvimento Pessoal
// Design
// Marketing
// Estilo de Vida
// Fotografia
// Saúde e Fitness
// Treinamento de professores
// Música
// Acadêmicos
// Idioma
// Preparação para teste

var request = require("request");
var async = require("async");
var json2csv = require('json2csv');
var fs = require("fs");

//"https://www.udemy.com/api-2.0/channels/1640/courses"

var courseAreasChannels = [
    { channel: 1640, area: "development" },
    { channel: 1624, area: "business" },
    { channel: 1646, area: "it-and-software" },
    { channel: 1644, area: "office-productivity" },
    { channel: 1648, area: "personal-development" },
    { channel: 1626, area: "design" },
    { channel: 1642, area: "marketing" },
    { channel: 1630, area: "lifestyle" },
    { channel: 1628, area: "photography" },
    { channel: 1632, area: "health-and-fitness" },
    { channel: 1634, area: "teacher-training" },
    { channel: 1636, area: "music" },
    { channel: 1652, area: "academics" },
    { channel: 1638, area: "Language" },
    { channel: 1650, area: "test-prep" }
]

var fields = [
    '_class',
    'avg_rating_recent',
    'content_info',
    'id',
    'image_125_H',
    'image_240x135',
    'image_304x171',
    'image_480x270',
    'input_features',
    'instructional_level',
    'is_paid',
    'is_wishlisted',
    'num_published_lectures',
    'num_reviews',
    'num_subscribers',
    'predictive_score',
    'price',
    'promotion_price',
    'published_time',
    'published_title',
    'relevancy_score',
    'title',
    'url'
];

//Create download queue
var mainAsyncQueue = async.queue(function(courseChannel, callback) {

    downloadCourseData(courseChannel, function(area) {
        console.log("DONE " + area);
        callback();
    });

}, 1);

//On queue is done
mainAsyncQueue.drain = function() {
    console.log("DONE ALL.");
}

//Push data to download queue
mainAsyncQueue.push(courseAreasChannels);



function downloadCourseData(courseChannel, callback) {

    var channel = courseChannel.channel;
    var area = courseChannel.area;

    var numberOfWroteCourses = 0;

    var courseResults = [];

    var urlQueueFillFlag = false;

    var asyncQueue = async.queue(function(url, taskCallback) {

        console.log("Getting url: " + url);

        request.get(url, function (error, response, body) {
            if (error || response.statusCode != 200) {
                console.log(error);
                console.log(response);
                throw "Error while getting page.";
            }

            //Parse response to json
            var resultObj = JSON.parse(body);

            courseResults = courseResults.concat(resultObj.results);

            //if(resultObj.next)
                //asyncQueue.push(resultObj.next);

            //If the url queue is not filled yet, fill it
            if(!urlQueueFillFlag) {
                //Calc how many pages
                var numberOfPages = Math.ceil(resultObj.count / resultObj.results.length);

                //Create page urls
                for(var i = 2; i <= numberOfPages; i++) {
                    var pageUrl = url + "?page=" + i;
                    asyncQueue.push(pageUrl);
                }

                urlQueueFillFlag = true;
            }

            numberOfWroteCourses += resultObj.results.length;
            console.log("Done " + numberOfWroteCourses + " of " + resultObj.count);

            taskCallback();
        });

    }, 20);

    //On the queue is empty
    asyncQueue.drain = function() {

        //Get csv string
        var csvResults = json2csv({ 
            data: courseResults, 
            fields: fields
        });        

        //Write reponse on files
        fs.appendFileSync("csvs/udemy-" + area + ".csv", csvResults + "\n");

        callback(area);
    }

    asyncQueue.push("https://www.udemy.com/api-2.0/channels/" + channel + "/courses");
}

