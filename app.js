var express = require("express");
var handlebars = require("express-handlebars").create({defaultLayout:"main"});
var path = require("path");
var mysql = require("mysql");
var db = require('./config/dbconnect');
var bodyParser = require("body-parser");
var routes = require("./routes/routes");

var app = express();

//serve static files
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

//port 8081 for aws
app.set("http_port", 8081);

app.use("/", routes);

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