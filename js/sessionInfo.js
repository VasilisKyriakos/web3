function getUsername() {
    $.ajax({
        url: './php/sessionInfo.php', // Updated path to session_handler.php
        type: 'GET',
        dataType: 'json',
        success: function(response) {
                document.getElementById('username').textContent = response.username;
                console.log("SessionInfo response: "+ response.username)
           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error checking session:", textStatus, errorThrown);
        }
    });
}

function getUserId(){
    $.ajax({
        url: './php/sessionInfo.php', // Updated path to session_handler.php
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log("Session info id: " + response.id);
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

function sessionActive(){
    
    $.ajax({
        url: './php/sessionInfo.php', // Updated path to session_handler.php
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if(response.username == "Guest" && response.id == "-1"){
                window.location.href = "login.html";
            }
            console.log("Session info id: " + response.id);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            window.location.href = "login.html";
            console.error("Error checking session:", textStatus, errorThrown);
        }
    });

}

function isAdmin(){
    console.log("Checking for admin");
    $.ajax({
        url: './php/sessionInfo.php', // Updated path to session_handler.php
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if(response.isAdmin != "1"){
                window.location.href = "index.html";
                console.log("Session info isAdmin: " + response.isAdmin);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            window.location.href = "index.html";
            console.error("Error checking session:", textStatus, errorThrown);
        }
    });
}

function adminButtons(){
    $.ajax({
        url: './php/sessionInfo.php', // Updated path to session_handler.php
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if(response.isAdmin != "1"){
                $("#uploadNavItem").hide();
                $("#chartsNavItem").hide();
                $("#leaderboardNavItem").hide();
            }else{
                $("#uploadNavItem").show();
                $("#chartsNavItem").show();
                $("#leaderboardNavItem").show();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            window.location.href = "index.html";
            console.error("Error checking session:", textStatus, errorThrown);
        }
    });
}