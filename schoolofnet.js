var cheerio = require("cheerio");
var request = require("request");

module.exports = {
    getName: function(){ return "schoolofnet"; },
    getCourses: function(callback) {

        var responseObj = [];

        request("https://www.schoolofnet.com/cursos/", function(error, response, body) {
            if (error || response.statusCode != 200) {
                throw "Error while getting courses from school of net"
            }

            var $ = cheerio.load(body);

            $(".content_courses").each(function(){
                var tituloCurso = $(this).find("h2").text();
                var tempoCurso = $(this).find(".text-right").text();
                //var numAulas = $(this).find(".text-center").text();

                responseObj.push({
                    title: tituloCurso,
                    duration: tempoCurso
                })
            });

            callback(responseObj);
        });
    }
}