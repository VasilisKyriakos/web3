<?php
include "../connector.php"; 
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if(!isset($_SESSION['id'])){
    echo "User ID not set in session!";
    exit;
}
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $userId = $_SESSION['id'];
    $username = $_POST["username"];
    $password = $_POST["password"];  // Hash the password securely
    if(!empty(trim($username)) && !empty(trim($password))){
        $query = "UPDATE users SET username = '$username', password = '$password' WHERE id = '$userId'";
    }else if(!empty(trim($username))){
        $query = "UPDATE users SET username = '$username' WHERE id = '$userId'";
    }else if(!empty(trim($password))){
        $query = "UPDATE users SET password = '$password' WHERE id = '$userId'";
    }

    
    if(mysqli_query($link, $query)) {
        echo "Registration successful!";
        $_SESSION['username'] = $username;
    } else {
        echo "Error: " . $query . "<br>" . mysqli_error($link);
    }
}

mysqli_close($link);
?>

