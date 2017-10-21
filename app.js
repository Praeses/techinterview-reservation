var express = require("express");
var handlebars = require("express-handlebars").create({defaultLayout:"main"});
var path = require("path");
var mysql = require("mysql");
var db = require('./config/dbconnect');
var bodyParser = require("body-parser");

var app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("http_port", 8081);

app.get("/", function(req, res, next) {
  res.render("home");
});

app.get("/clear_res", function(req, res, next) {
  db.pool.query("TRUNCATE TABLE seat_reservation.seats", function(err) {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  })
});

app.get("/movies", function(req, res, next) {
  res.render("movies");
});


app.get("/seating_chart", function(req, res, next) {
  res.render("seating_chart");
});

app.post("/seats", function(req, res, next) {
  var seats = [];
  for (var i = 0; i < req.body.seats.length; i++) {
    seats[i] = [4];
    seats[i][0] = req.body.seats[i].theater;
    seats[i][1] = req.body.seats[i].row;
    seats[i][2] = req.body.seats[i].seat_num;
    seats[i][3] = req.body.seats[i].time;
  }
  db.pool.query("INSERT INTO seat_reservation.seats (theater, row, seat_num, movie_time) VALUES ?", [seats], function (err, result) {
    if (err) {
      next(err)
      return;
    }
    res.sendStatus(201);
  });
});

app.get("/seats", function(req, res, next) {
  db.pool.query("SELECT row, seat_num FROM seat_reservation.seats WHERE movie_time = ? AND theater = ?", [req.query.time, req.query.theater], function(err, results, fields) {
    if (err) {
      next(err);
      return;
    }
    payload = {};
    payload.seats = results;
    res.send(payload);
  });
});

app.get("/seats/:theater/:time", function(req, res, next) {
  db.pool.query("SELECT row, seat_num FROM seat_reservation.seats WHERE movie_time = ? AND theater = ?", [req.params.time, req.params.theater], function(err, results, fields) {
    if (err) {
      next(err);
      return;
    }
    payload = {};
    payload.theater = req.params.theater;
    payload.time = req.params.time;
    if (results.length) {
      payload.seats = results;
    }
      res.render("seating_chart", payload);
  });
});

// app.get("/seats/:theater/:time", function(req, res, next) {
//   payload = {};
//   payload.time = req.params.time;
//   payload.theater = req.params.theater;
//   res.render("seating_chart", payload);
// });

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