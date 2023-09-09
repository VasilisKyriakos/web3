<?php
include "connector.php";
session_start();

$username = $_POST['username'];
$password = $_POST['password'];

// Hash the password or use an appropriate method of encrypting it for comparison with the stored hashed password

$result = mysqli_query($link, "SELECT * FROM users WHERE username = '$username' AND password = '$password'");
$row = mysqli_fetch_assoc($result);
if(mysqli_num_rows($result) > 0) {
    // Create session or cookies as necessary
    $_SESSION['username'] = $username;
    $_SESSION['userId'] = $row['id'];
    echo "Login successful!";
} else {
    echo "Incorrect username or password.";
}

mysqli_close($link);
?>
