//constants used to define dimensions of theater
const num_of_rows = 10;
const seats_per_row = 15;

//one for test and one for production
// const url = "http://default-environment.47bjjmtcf6.us-east-2.elasticbeanstalk.com";
const url = "http://localhost:8081";

//parses the query string, binds reserve_btn, and builds the seating chart
$(document).ready(function() {
    //parse query string to get theater number, movie time, and movie title
    var query_parts = parse_query(window.location.href);
    
    //bind reserve seats button event listener
    document.getElementById("reserve_btn").addEventListener("click", function() {
        reserve_seats(query_parts["theater"], query_parts["time"], query_parts["title"]);
    });

    //make request to get already reserved seats and build table
    var req = new XMLHttpRequest();
    req.open("GET", url + "/seats/" + query_parts["theater"] + "/" + query_parts["time"], true);
    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400){
            //already reserved seats for this theater and time
            var response = JSON.parse(req.responseText);
            //add title and time to top of view
            document.getElementById("title_time").innerHTML = decodeURI(query_parts["title"]) + " at " + format_time(query_parts["time"]);
            //create seating chart
            //pattern looks like A 1 2 3 ... A
            //                   B 1 2 3 ... B
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
            //disables already reserved seats
            if (response.length > 0) {
                for (var j = 0; j < response.length; j++) {
                    disable_seat(response[j]);
                }
            }
        }
        else {
            console.log("Error getting reserved seats");
        }
    });
    req.send();
});


//checks that the value of 2 elements is the same
//alters the message displayed to user if element values do not match
//@param: element_1 - the first element
//@param: element_2 - the second element
function check_elements_match(element_1, element_2) {
    if (element_1.value !== element_2.value) {
        element_2.setCustomValidity(element_1.title + " and " + element_2.title + " must match.");
        element_2.reportValidity();
    }
    else {
        element_2.setCustomValidity("");
    }
}


//disables button and marks it as reserved
//@param: seat - seat object from server used to get the id of the td corresponding to that seat
function disable_seat(seat) {
    seat_id = seat.row + "-" + seat.seat_num;
    document.getElementById(seat_id).firstChild.disabled = true;
    document.getElementById(seat_id).classList.add("reserved_seat");
}


//changes time from HHMMSS to HH:MM
//no effect if time already in HH:MM form
//@param: time - time in HHMMSS format
//@return ftime - time in HH:MM format
function format_time(time) {
    if (time.length == 6) {
        var ftime = time.substring(0, 2);
        ftime += ":";
        ftime += time.substring(2, 4);
        return ftime;
    }
    else {
        return time;
    }
}


//parses the query string into key:value pairs.  
//taken from https://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
//@param: url - the url string
//@return: query_string - object containing key:value pairs of query string values.  if ?theater=1 then query_parts["theater"] = 1
function parse_query(url){
    var query_string = {};
    url.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) { query_string[$1] = $3; }
    );
    return query_string;
}


//finds all selected seats and makes POST request to server to display checkout
//@param: theater - theater number of movie
//@param: time - time of movie
//@param: title - title of movie
function reserve_seats(theater, time, title) {
    //returns seats in a live HTMLCollection, so convert to array to avoid headaches
    var seats = Array.from(document.getElementsByClassName("selected_seat"));
    //make sure they select at least 1 seat to reserve
    if (seats.length == 0) {
        alert("You didn't select any seats!");
        return;
    }
    var req = new XMLHttpRequest();
    req.open("POST", url + "/checkout", true);
    req.setRequestHeader("Content-Type", "application/json");
    //create object to send in post
    var payload = {};
    payload.seats = [seats.length];
    payload.theater = theater;
    payload.time = time;
    payload.title = decodeURI(title);
    for (var i = 0; i < seats.length; i++) {
        //split id to get row and seat_num
        var id_parts = seats[i].id.split("-");
        payload.seats[i] = {};
        payload.seats[i].theater = theater;
        payload.seats[i].row = id_parts[0];
        payload.seats[i].seat_num = id_parts[1];
        //format time for better display
        payload.seats[i].time = format_time(time);
    }
    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
            //load template that is returned
            $("html").html(req.responseText);
            //bind function to make sure email address matches its confirmation box
            document.getElementById("email_dup").onchange = function() {check_elements_match(document.getElementById("email"), document.getElementById("email_dup"));};
            //attach seats as hidden input to form to allow for easier submitting to server
            document.getElementById("seats_input").value = JSON.stringify(payload.seats);
        }
        else {
            console.log(req.status);
        }
    });
    req.send(JSON.stringify(payload));
}


//switches seat between selected and not selected before user reserves
//@param: button - the button that is clicked that represents the seat
function toggle_seat(button) {
    var cell = button.parentElement;
    if (cell.classList.contains("selected_seat")) {
        cell.classList.remove("selected_seat");
    }
    else {
        cell.classList.add("selected_seat");
    }
}