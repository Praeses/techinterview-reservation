//constants
const num_of_rows = 10;
const seats_per_row = 15;

// create table on page load
$(document).ready(function() {
    var url = window.location.href;
    var parts = url.split("?");
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:8081/seats?" + parts[1], true);
    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
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
            for (var j = 0; j < response.seats.length; j++) {
                disable_seat(response.seats[j]);
            }
        }
        else {
            console.log("getting reserved seats failed");
        }
    });
    req.send();
});

function toggle_seat(button) {
    var cell = button.parentElement;
    if (cell.classList.contains("selected_seat")) {
        cell.classList.remove("selected_seat");
    }
    else {
        cell.classList.add("selected_seat");
    }
}

function disable_seat(seat) {
    seat_id = seat.row + "-" + seat.seat_num;
    document.getElementById(seat_id).firstChild.disabled = true;
    document.getElementById(seat_id).classList.add("reserved_seat");
}

function reserve_seats(theater_num) {
    var url = window.location.href;
    var parts = url.split("time=");
    var seats = document.getElementsByClassName("selected_seat");
    var req = new XMLHttpRequest();
    req.open("POST", "http://localhost:8081/seats", true);
    req.setRequestHeader("Content-Type", "application/json");
    var payload = {};
    payload.seats = [seats.length];
    for (var i = 0; i < seats.length; i++) {
        var result = seats[i].id.split("-");
        payload.seats[i] = {};
        payload.seats[i].theater = theater_num;
        payload.seats[i].row = result[0];
        payload.seats[i].seat_num = result[1];
        payload.seats[i].time = parts[1];
    }
    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
            //remove selected_seat must be last due to HTMLCollection being live
            while (seats.length > 0) {
                seats[0].classList.add("reserved_seat");
                seats[0].firstChild.disabled = true;
                seats[0].classList.remove("selected_seat");
            }
        }
        else {
            console.log(req.status);
        }
    });
    req.send(JSON.stringify(payload));
}