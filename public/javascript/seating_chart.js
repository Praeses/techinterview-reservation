//This file builds the table into the template and contains functions changing seat status.

//constants
const num_of_rows = 10;
const seats_per_row = 15;

//one for test and one for production
// const url = "http://default-environment.47bjjmtcf6.us-east-2.elasticbeanstalk.com";
const url = "http://localhost:8081";

//when document loads, create table based on above constants
//table has col of letters, then cols of seats, then col of letters
//button in table cell allows functionality
$(document).ready(function() {
    //parse query string
    var query_parts = parse_query(window.location.href);
    
    //bind reserve seats button event listener
    document.getElementById("reserve_btn").addEventListener("click", function() {
        confirm_seats(query_parts["theater"], query_parts["time"]);
    });

    //build table
    var req = new XMLHttpRequest();
    req.open("GET", url + "/seats/" + query_parts["theater"] + "/" + query_parts["time"], true);
    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            for (var i = 0; i < num_of_rows; i++) {
                var row = document.createElement("tr");
                var row_cell = document.createElement("td");
                row_cell.innerHTML = String.fromCharCode(65 + i);
                document.getElementById("seat_tbody").appendChild(row);
                row.appendChild(row_cell);
                for (var j = 0; j < seats_per_row; j++) {
                    var seat_cell = document.createElement("td");
                    seat_cell.classList.add("seat");
                    seat_cell.id = String.fromCharCode(65 + i) + "-" + (j + 1);
                    var button = document.createElement("button");
                    button.classList.add("btn");
                    button.innerHTML = j + 1;
                    button.onclick = function() {toggle_seat(this)};
                    seat_cell.appendChild(button);
                    row.appendChild(seat_cell);
                }
                var row_cell_2 = document.createElement("td");
                row_cell_2.innerHTML = String.fromCharCode(65 + i);
                row.appendChild(row_cell_2);
            }
            //seats is a global variable added by the template 
            //this disables already reserved seats
            if (response.length > 0) {
                for (var j = 0; j < response.length; j++) {
                    disable_seat(response[j]);
                }
            }
        }
        else {
            console.log("woops");
        }
    });
    req.send();
});

function parse_query(url){
    var query_string = {};
    url.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) { query_string[$1] = $3; }
    );
    return query_string;
}

//switches seat between selected and not selected before user reserves
function toggle_seat(button) {
    var cell = button.parentElement;
    if (cell.classList.contains("selected_seat")) {
        cell.classList.remove("selected_seat");
    }
    else {
        cell.classList.add("selected_seat");
    }
}

//disables button and marks it as reserved
//seat is a seat object used to get the id of the td corresponding to that seat
function disable_seat(seat) {
    seat_id = seat.row + "-" + seat.seat_num;
    document.getElementById(seat_id).firstChild.disabled = true;
    document.getElementById(seat_id).classList.add("reserved_seat");
}


function reserve_seats(payload) {
    var req = new XMLHttpRequest();
    req.open("POST", url + "/seats", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
            window.location.href = url + "/confirmation";
        }
        else {
            console.log(req.status);
        }
    });
    req.send(JSON.stringify(payload));
}

//finds all selected seats and makes POST request to server to display confirmation
//theater = theater number of movie
//time = time of movie
function confirm_seats(theater, time) {
    //returns seats in a live HTMLCollection
    var seats = document.getElementsByClassName("selected_seat");
    var req = new XMLHttpRequest();
    req.open("POST", url + "/checkout", true);
    req.setRequestHeader("Content-Type", "application/json");
    var payload = {};
    payload.seats = [seats.length];
    for (var i = 0; i < seats.length; i++) {
        var result = seats[i].id.split("-");
        payload.seats[i] = {};
        payload.seats[i].theater = theater;
        payload.seats[i].row = result[0];
        payload.seats[i].seat_num = result[1];
        payload.seats[i].time = format_time(time);
    }
    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
            $("html").html(req.responseText);
            document.getElementById("confirm_btn").addEventListener("click", function() {
                reserve_seats(payload);
            });
        }
        else {
            console.log(req.status);
        }
    });
    req.send(JSON.stringify(payload));
}

function build_confirmation_string(theater, time, seats) {
    var confirmation_string = "You are reserving the following seats: ";
    for (var i = 0; i < seats.length; i++) {
        confirmation_string += seats[i].row + "-" + seats[i].seat_num + ", ";
    }
    confirmation_string = confirmation_string.substring(0, confirmation_string.lastIndexOf(", "));
    confirmation_string += " at " + format_time(time) + " in theater " + theater + ".";
    return confirmation_string;
}

function format_time(time) {
    var ftime = time.substring(0, 2);
    ftime += ":";
    ftime += time.substring(2, 4);
    return ftime;
}