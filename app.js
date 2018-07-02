
var url = require('url');

var http = require("http");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const XlsxPopulate = require('xlsx-populate');
require('ejs');


var app = express();
app.set("views", path.resolve(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/')));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
    res.render("index");
});

app.set('port', (process.env.PORT || 5000));

//sample get request code
app.get("/data", function (req, res) {
    var query = url.parse(req.url, true).query;
    var formData = JSON.parse(query.formData);
    console.log(formData);

    //TODO: excel stuff
    var path = 'template.xlsx';
    XlsxPopulate.fromFileAsync(path).then(workbook => {
        // Modify the workbook.
        workbook.sheet("Sheet1").cell("B2").value(formData[0]['value']);

        // Write to file.
        return workbook.toFileAsync("./out.xlsx");
    });

    var callback = query.callback;
    var t = wrap(JSON.stringify("bats"), callback);
    res.end(t);
});

app.use(function (req, res) {
    res.status(404).render("404");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

function wrap(txt, callb) {
    return callb + "(" + txt + ")";
}