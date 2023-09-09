function sessionInfo() {
    $.ajax({
        url: './php/sessionInfo.php', // Updated path to session_handler.php
        type: 'POST',
        data: {},
        success: function(response) {
            if (response !== 'Guest') { // Check if the response is not 'Guest'
                document.getElementById('username').textContent = response;
                console.log("SessionInfo response: "+response)
            } else {
                document.getElementById('username').textContent = response;
                alert('No user logged in.'); // Guest or no user logged in
                console.log("SessionInfo response: "+response)
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error checking session:", textStatus, errorThrown);
        }
    });
}
