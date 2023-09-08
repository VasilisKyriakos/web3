// Function to fetch shops and log them to console
function loadShops() {
    console.log("hey");
    $.ajax({
        url: './php/fetchShops.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                console.log(response.data);
            } else {
                console.error("Failed to fetch shops: ", response.message);
            }
        },
        error: function(err) {
            console.error("Error: ", err);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loadShopsButton").addEventListener("click", function() {
        loadShops();
    });
});
