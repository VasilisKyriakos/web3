<?php

include "../connector.php"; 

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$response = ['status' => '', 'data' => [], 'message' => ''];
$user_id = $_SESSION['id'];

$query = "SELECT * 
    FROM likes 
    JOIN 
        discounts
    ON 
        likes.dicount_id = discounts.discount_id    
    WHERE likes.user_id = $user_id";

$result = mysqli_query($link, $query);

if (!$result) {
    $response['status'] = 'error';
    $response['message'] = "Database query failed: " . mysqli_error($link);
} else {
    $likes = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $likes[] = $row;
    }
    $response['status'] = 'success';
    $response['data'] = $likes;
    $response['message'] = $user_id;
}

echo json_encode($response);

mysqli_close($link);



?>


