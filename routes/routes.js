var express = require("express");
var router = express.Router();
var db = require('../config/dbconnect');

module.exports = router;

router.get("/", function(req, res, next) {
    res.render("home");
});

router.get("/clear_res", function(req, res, next) {
    db.pool.query("TRUNCATE TABLE seat_reservation.seats", function(err) {
      if (err) {
        next(err);
        return;
      }
      res.render("dev_tools");
    })

  });

router.post("/checkout", function(req, res, next) {
  payload = {};
  payload.seats = req.body.seats;
  payload.theater = req.body.theater;
  payload.time = req.body.time;
  payload.title = req.body.title;
  res.render("checkout", payload);
});

router.get("/confirmation", function(req, res, next) {
  res.render("confirmation");
});
  
router.get("/dev_tools", function(req, res, next) {
  res.render("dev_tools");
});

router.get("/movies", function(req, res, next) {
  res.render("movies");
});


router.get("/seating_chart", function(req, res, next) {
  res.render("seating_chart");
});

router.post("/seats", function(req, res, next) {
  db.pool.query("SELECT * FROM seat_reservation.seats WHERE ")
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
      if (err.code == "ER_DUP_ENTRY") {
        payload = {};
        payload.theater = seats[0][0];
        payload.time = seats[0][3];
        res.render("seats_taken", payload);
        return;
      }
      else {
        next(err)
        return;
      }
    }
    var payload = {};
    payload.email = req.body.email;
    res.render("confirmation", payload);
  });
});
  
router.get("/seats/:theater/:time", function(req, res, next) {
  db.pool.query("SELECT row, seat_num FROM seat_reservation.seats WHERE movie_time = ? AND theater = ?", [req.params.time, req.params.theater], function(err, results, fields) {
    if (err) {
      next(err);
      return;
    }
    res.json(results);
  });
});
