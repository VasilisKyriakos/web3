function register() {
    let email = $('#email').val();
    let username = $('#username').val();
    let password = $('#password').val();

    // Here, we could add client-side validation for the password, but remember server-side validation is essential!
    if (!isValidPassword(password)) {
        alert("Password does not meet the requirements."+ password);
        return;
    }

    $.ajax({
        url: './php/register.php',
        type: 'POST',
        data: {
            email: email,
            username: username,
            password: password
        },
        success: function(response) {
            if (response.includes('Registration successful!')) {
                alert('Registered successfully. You can now login.');
                window.location.href = "login.html"; // Assuming this is the name of your login page.
            } else {
                alert(response);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Registration failed:", textStatus, errorThrown);
        }
    });
}

function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(password);
}
