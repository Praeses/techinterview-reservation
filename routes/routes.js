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
  
  router.get("/seats/:theater/:time", function(req, res, next) {
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
