//constants
const num_of_rows = 10;
const seats_per_row = 20;

//create table on page load
$(document).ready(function() {
    for (var i = 0; i < num_of_rows; i++) {
        var row = document.createElement("tr");
        var row_cell = document.createElement("td");
        row_cell.innerHTML = String.fromCharCode(65 + i);
        document.getElementById("seat_tbody").appendChild(row);
        row.appendChild(row_cell);
        for (var j = 0; j < seats_per_row; j++) {
            var seat_cell = document.createElement("td");
            seat_cell.classList.add("seat");
            seat_cell.id = String.fromCharCode(65 + i) + (j + 1);
            var button = document.createElement("button");
            button.classList.add("btn");
            button.innerHTML = j + 1;
            button.onclick = function() {toggle_seat(this)};
            seat_cell.appendChild(button);
            row.appendChild(seat_cell);
        }
    }
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

function reserve_seats() {
    var seats = document.getElementsByClassName("selected_seat");

}