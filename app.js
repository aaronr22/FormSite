
var url = require('url');

var http = require("http");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
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
// app.get("/sendMessage", function (req, res) {
//   sendMsg();
//   var query = url.parse(req.url, true).query;
//   var callback = query.callback;
//   var t = wrap(JSON.stringify("bats"), callback);
//   res.end(t);
// });

app.use(function (req, res) {
  res.status(404).render("404");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

function wrap(txt, callb) {
  return callb + "(" + txt + ")";
}