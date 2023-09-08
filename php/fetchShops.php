<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);



header('Content-Type: application/json');
include "connector.php"; 

$response = ['status' => '', 'data' => [], 'message' => ''];

$query = "SELECT id, lat, lon, name FROM shops";
$result = mysqli_query($link, $query);

if (!$result) {
    $response['status'] = 'error';
    $response['message'] = "Database query failed: " . mysqli_error($link);
} else {
    $shops = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $shops[] = $row;
    }
    $response['status'] = 'success';
    $response['data'] = $shops;
}

echo json_encode($response);

mysqli_close($link);
?>
