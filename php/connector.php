<?php
$host = 'localhost';
$db   = 'database';
$user = 'root';
$pass = '';

// Create connection
$link = mysqli_connect($host, $user, $pass, $db);

// Check connection
if (!$link) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
