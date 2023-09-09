<?php
// Start the session (if not already started)
session_start();

// Check if a user is logged in
if (isset($_SESSION['user'])) {
    $username = $_SESSION['user']['username']; // Replace 'username' with the key in your session containing the username
    echo $username; // Return the username
} else {
    echo "Guest"; // Return "Guest" if no user is logged in
}
?>
