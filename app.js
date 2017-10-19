var express = require("express");
var handlebars = require("express-handlebars").create({defaultLayout:"main"});
var path = require("path");
var mysql = require("mysql");
var db = require('./config/dbconnect');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("http_port", 8081);

app.get("/", function(req, res) {
    res.render("seating_chart");
});

app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
  });
  
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
  });

  app.listen(app.get('http_port'), function(){
    console.log('Express http started on localhost:' + app.get('http_port') + '; press Ctrl-C to terminate.');
});