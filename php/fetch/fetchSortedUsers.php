<?php
include "../connector.php"; 

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = ['status' => '', 'data' => [], 'message' => ''];

$query = "SELECT * FROM `users` ORDER BY total_points DESC"; // Modify the query to sort by total_points in descending order

$result = mysqli_query($link, $query);

if ($result) {
    $response['status'] = 'success';
    while ($row = mysqli_fetch_assoc($result)) {
        $response['data'][] = $row;
    }
} else {
    $response['status'] = 'error';
    $response['message'] = mysqli_error($link);
}

echo json_encode($response);

mysqli_close($link);
?>
