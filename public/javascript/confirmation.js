$(document).ready(function() {
    console.log("test");
    document.getElementById("confirm_btn").addEventListener("click", function() {
        test();
    });
});

function test() {
    var value = document.getElementById("confirm_btn").value;
    console.log(value);
}

