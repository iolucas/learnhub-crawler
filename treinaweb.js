var cheerio = require("cheerio");
var request = require("request");

module.exports = {
    getName: function(){ return "treinaweb"; },
    getCourses: function(callback) {

        var responseObj = [];

        request("https://www.treinaweb.com.br/cursos-online", function(error, response, body) {
            if (error || response.statusCode != 200) {
                throw "Error while getting courses from treinaweb"
            }

            var $ = cheerio.load(body);

            $(".product-thumb-description").each(function(){
                var tituloCurso = $(this).find(".product-thumb-title").text();
                var nivelCurso = $(this).find(".product-thumb-nivel").text();

                responseObj.push({
                    title: tituloCurso,
                    level: nivelCurso
                })
            });

            callback(responseObj);
        });
    }
}