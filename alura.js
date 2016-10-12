var cheerio = require("cheerio");
var request = require("request");
//var async = require("async");

//var https = require("https");

module.exports = {
    getName: function(){ return "alura"; },
    getCourses: function(callback) {

        var responseObj = [];

        var options = {
            method: 'GET',
            uri: "https://www.alura.com.br/cursos-online-business" ,
            gzip: true
        }

        request(options, function(error, response, body) {
            if (error || response.statusCode != 200) {
                throw "Error while getting courses from alura"
            }

            var $ = cheerio.load(body);

            $(".subcategoria-wrapper").each(function() {

                var categoria = $(this).attr("data");
                var grupo = $(this).attr("data-grupo");
            
                $(this).find(".cursoCard").each(function(){
                    var tituloCurso = $(this).find(".cursoCard-nome").text();
                    var nivelCurso = $(this).find(".cursoCard-infos-dificuldade").text();
                    var tempoCurso = $(this).find(".cursoCard-infos-tempoEstimado").text();

                    responseObj.push({
                        title: tituloCurso,
                        level: nivelCurso,
                        duration: tempoCurso,
                        category: categoria,
                        group: grupo
                    })
                });


            });

            callback(responseObj);
        });
        
    }
}


