<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
include "connector.php"; 

$response = ['status' => '', 'data' => [], 'message' => ''];

if (!isset($_GET['shop_id'])) {
    $response['status'] = 'error';
    $response['message'] = "Missing shop_id parameter.";
    echo json_encode($response);
    exit;
}

$shop_id = mysqli_real_escape_string($link, $_GET['shop_id']);

$query = "SELECT * FROM discounts WHERE shop_id = $shop_id";
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


