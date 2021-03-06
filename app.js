
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

function updateSheet(rowId, val, workbook, col) {
    console.log(rowId);
    var z = workbook.sheet(0).find(rowId);
    //const util = require('util')
    // console.log(util.inspect(z, false, null))
    var c = col + z[0].rowNumber();
    console.log(c);
    workbook.sheet("Sheet1").cell(c).value(val);

}

//sample get request code
app.get("/data", function (req, res) {
    var query = url.parse(req.url, true).query;
    var formData = JSON.parse(query.formData);
    console.log(formData);

    var path = 'template.xlsx';

    XlsxPopulate.fromFileAsync(path).then(workbook => {
        // Modify the workbook.
        for (var i = 0; i < formData.length; i++) {
            //TODO: skip if value is empty
            if (formData[i]['name'].includes('total-')) {
                var sub = formData[i]['name'].substring(6);
                console.log('substring: ' + sub);
                updateSheet(sub, formData[i]['value'], workbook, 'C');
            } else if (formData[i]['name'].includes('serv-')) {
                var sub = formData[i]['name'].substring(5);
                console.log('substring: ' + sub);
                updateSheet(sub, formData[i]['value'], workbook, 'B');
            } else {
                updateSheet(formData[i]['name'], formData[i]['value'], workbook, 'D');
            }
        }

        //TODO: Naming stuff
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