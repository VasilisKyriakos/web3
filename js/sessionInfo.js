function getUsername() {
    $.ajax({
        url: './php/sessionInfo.php', // Updated path to session_handler.php
        type: 'POST',
        data: {},
        success: function(response) {
                document.getElementById('username').textContent = response.username;
                console.log("SessionInfo response: "+response.username)
           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error checking session:", textStatus, errorThrown);
        }
    });
}

function getUserId(){
    $.ajax({
        url: './php/sessionInfo.php', // Updated path to session_handler.php
        type: 'POST',
        data: {},
        success: function(response) {
            console.log("Session info id: " +response.id);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error checking session:", textStatus, errorThrown);
        }
    });
}

function clearSession(){
    $.ajax({
        url: './php/userAuthentication/logout.php', // Updated path to session_handler.php
        type: 'POST',
        data: {},
        success: function() {
            window.location.href = "login.html";
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error checking session:", textStatus, errorThrown);
        }
    });
}