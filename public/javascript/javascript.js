function toggle_seat(button) {
    var cell = button.parentElement;
    if (cell.classList.contains("selected_seat")) {
        cell.classList.remove("selected_seat");
    }
    else {
        cell.classList.add("selected_seat");
    }
}