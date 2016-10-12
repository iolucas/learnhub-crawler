var cheerio = require("cheerio");
var request = require("request");

module.exports = {
    getName: function(){ return "lifeglobal"; },
    getCourses: function(callback) {

        var responseObj = [];

        request("http://www.life-global.org/", function(error, response, body) {
            if (error || response.statusCode != 200) {
                throw "Error while getting courses from lifeglobal"
            }

            var $ = cheerio.load(body);

            //All grid div
            $(".row.margin-bottom-30").each(function(){

                //Column div
                $(this).children(".col-md-2").each(function() {
                    //Get column title
                    var categoria = $(this).find("h3").text().replace("/\n/g", "").trim();

                    //Column rows text div
                    $(this).find(".field-content").each(function(){
                        var title = $(this).text().replace("/\n/g", "").trim();
                        if(title)
                            responseObj.push({
                                title: title,
                                category: categoria
                            })
                    });
                });
            });

            callback(responseObj);
        });
    }
}