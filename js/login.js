function login() {
    let username = $('#usernameLogin').val(); // Assuming you have an input with id "usernameLogin" for the username.
    let password = $('#passwordLogin').val();

    $.ajax({
        url: './php/login.php',
        type: 'POST',
        data: {
            username: username,
            password: password
        },
        success: function(response) {
            if (response.includes('Login successful!')) {
                alert('Logged in successfully.');
                window.location.href = "index.html";
            } else {
                alert(response);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Login failed:", textStatus, errorThrown);
        }
    });
}
