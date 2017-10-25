var express = require("express");
var router = express.Router();
var db = require('../config/dbconnect');

module.exports = router;

router.get("/", function(req, res, next) {
    res.render("home");
});


//for all the routes below
//@param: req - request object which contains data from client
//@param: res - response object used to send data to client
//@param: next - function used to pass error to error handling functions

//triggered when clear reservations button clicked in dev ops
//clears table of all reservations
router.get("/clear_res", function(req, res, next) {
  db.pool.query("TRUNCATE TABLE seat_reservation.seats", function(err) {
    if (err) {
      next(err);
      return;
    }
    res.render("dev_tools");
  })
});

//receives data about the seats being reserved and renders checkout page
router.post("/checkout", function(req, res, next) {
  payload = {};
  payload.seats = req.body.seats;
  payload.theater = req.body.theater;
  payload.time = req.body.time;
  payload.title = req.body.title;
  res.render("checkout", payload);
});

//renders dev_tools page
router.get("/dev_tools", function(req, res, next) {
  res.render("dev_tools");
});

// renders movie/showtime listings
router.get("/movies", function(req, res, next) {
  res.render("movies");
});

//seating chart base template
router.get("/seating_chart", function(req, res, next) {
  res.render("seating_chart");
});

//adds reserved seats to database
router.post("/seats", function(req, res, next) {
  //data must be in nested array for bulk mysql insert
  var json_seats = JSON.parse(req.body.seats);
  var seats = [];
  for (var i = 0; i < json_seats.length; i++) {
    seats[i] = [4];
    seats[i][0] = json_seats[i].theater;
    seats[i][1] = json_seats[i].row;
    seats[i][2] = json_seats[i].seat_num;
    seats[i][3] = json_seats[i].time;
  }
  db.pool.query("INSERT INTO seat_reservation.seats (theater, row, seat_num, movie_time) VALUES ?", [seats], function (err, result) {
    if (err) {
      //throws error if any seat already reserved to solve race condition
      //send user to seats_taken page with theater, time, title so seats_taken can send back to the seating chart
      if (err.code == "ER_DUP_ENTRY") {
        payload = {};
        payload.theater = seats[0][0];
        payload.time = seats[0][3];
        payload.title = req.body.movie_title;
        res.render("seats_taken", payload);
        return;
      }
      else {
        next(err)
        return;
      }
    }
    //if successfully added, render confirmation page
    var payload = {};
    payload.email = req.body.email;
    res.render("confirmation", payload);
  });
});
  
//gets all the seats that are already reserved for that time and theater
router.get("/seats/:theater/:time", function(req, res, next) {
  db.pool.query("SELECT row, seat_num FROM seat_reservation.seats WHERE movie_time = ? AND theater = ?", [req.params.time, req.params.theater], function(err, results, fields) {
    if (err) {
      next(err);
      return;
    }
    res.json(results);
  });
});
