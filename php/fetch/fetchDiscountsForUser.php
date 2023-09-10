<?php

include "../connector.php"; 

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$response = ['status' => '', 'data' => [], 'message' => ''];
$user_id = $_SESSION['id'];

$query = "SELECT * FROM discounts WHERE user_id = $user_id";

$result = mysqli_query($link, $query);

if (!$result) {
    $response['status'] = 'error';
    $response['message'] = "Database query failed: " . mysqli_error($link);
} else {
    $discounts = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $discounts[] = $row;
    }
    $response['status'] = 'success';
    $response['data'] = $discounts;
}

echo json_encode($response);

mysqli_close($link);



?>


