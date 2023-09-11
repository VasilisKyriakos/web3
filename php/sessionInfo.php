<?php
// Start the session (if not already started)
session_start();

$response = [
    'id' => '',
    'username' => '',
];
// Check if a user is logged in
if (isset($_SESSION['username'])) {
    $response['username'] = $_SESSION['username']; 
    $response['id'] = $_SESSION['id']; 
    $response['isAdmin'] =$_SESSION['isAdmin'];

} else {
    $response['username'] = 'Guest';
    $response['id'] = '-1'; 
    $response['isAdmin'] = '-1';
}

echo json_encode($response);
?>
