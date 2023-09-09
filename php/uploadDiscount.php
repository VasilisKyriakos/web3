<?php
include "connector.php"; // This should connect to your database
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = [
    "status" => "error",
    "message" => ""
];

$userId = (int)$_POST['user_id'];
$shopId = (int)$_POST['shop_id'];
$productName = $_POST['product_name'];
$price = (int)$_POST['price'];

$sql = "INSERT INTO discounts (user_id, shop_id, product_name, price) VALUES ('$userId', '$shopId', '$productName', '$price')";

if (mysqli_query($link, $sql)) {
    $response["status"] = "success";
    $response["message"] = "Discount uploaded successfully!";
} else {
    $response["message"] = "Error: " . mysqli_error($link);
}

echo json_encode($response);
?>
