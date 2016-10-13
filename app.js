var fs = require("fs");
var json2csv = require('json2csv');

//var courseModule = require("./treinaweb");
//https://www.treinaweb.com.br/
//var courseModule = require("./alura");
//https://www.alura.com.br/
//var courseModule = require("./mva");
//https://mva.microsoft.com/search/SearchResults.aspx#!index=2&lang=1046
//var courseModule = require("./schoolofnet");
//https://www.schoolofnet.com/cursos/

//var courseModule = require("./lifeglobal");
//http://www.life-global.org/

//ToDos
//http://www.educamundo.com.br/cursos-online
//https://www.profissionaisti.com.br/curso-gratuito/
//http://pro.tecmundo.com.br/educacao/86868-dinheiro-54-cursos-online-tecnologia-gratuitos-portugues.htm
//http://www.impacta.com.br/
//http://oedb.org/open/
//http://exame.abril.com.br/tecnologia/noticias/13-cursos-gratuitos-para-quem-trabalha-com-tecnologia
//http://canaldoensino.com.br/blog/100-cursos-online-de-tecnologia-gratis
//http://www.brasilmaisti.com.br/index.php/pt-br/cursos-online/dashboard-cursos
//http://www.algaworks.com/
//http://www.cursoemvideo.com/
//http://www.eduk.com.br/cursos-online
//http://www.kroton.com.br/
//http://minicursos.acessasp.sp.gov.br/cursos/devkids/?nome_curso=devkids
//https://www.codecademy.com/
//https://www.iped.com.br/programacao-e-desenvolvimento/gratis
//http://www.cursou.com.br/informatica/programacao/
//http://www.eupossoprogramar.com/
//http://www.fiap.com.br/FIAPx/cursos
//https://en.wikipedia.org/wiki/Massive_open_online_course


courseModule.getCourses(function(courses){
    console.log(courses);

    saveAsCsv(courses);
});


function saveAsCsv(jsonCollection) {

    //Get fields
    var fields = []
    for(var i = 0; i < jsonCollection.length; i++) {
        var jsonObj = jsonCollection[i];

        for(key in jsonObj) {
            if(fields.indexOf(key) == -1)
                fields.push(key);
        }
    }

    var csvFile = json2csv({ data: jsonCollection, fields: fields });

    // var csvLines = [];

    // //Write csv header
    // csvLines.push("sep=;")
    // csvLines.push(fields.join(";"));

    // //Write csv lines
    // for(var i = 0; i < jsonCollection.length; i++) {
    //     var jsonObj = jsonCollection[i];

    //     var lineValues = [];

    //     for(var j = 0; j < fields.length; j++) {
    //         var field = fields[j];

    //         //If the field does not exists in this json, push an empty value
    //         lineValue = jsonObj[field] || "";
    //         lineValue = lineValue.replace(new RegExp(";", "g"), ".");
    //         lineValue = lineValue.replace(new RegExp("\n\r", "g"), " ");
    //         lineValue = lineValue.replace(new RegExp("\n", "g"), " ");
    //         lineValue = lineValue.replace(new RegExp("\r", "g"), " ");
    //         lineValues.push(lineValue);
    //     }

    //     csvLines.push(lineValues.join(";")); 
    // }

    // //Join lines with carriages returns and new lines chars
    // var csvFile = csvLines.join("\r\n");

    //save the file as csv
    fs.writeFileSync("csvs/" + courseModule.getName() + parseInt(Math.random()*100000000) + ".csv", csvFile, 'ascii');

    console.log('Csv Saved.');
}




