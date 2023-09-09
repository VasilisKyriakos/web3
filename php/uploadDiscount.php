<?php
include "connector.php"; // This should connect to your database

$response = [
    "status" => "error",
    "message" => ""
];

$userId = $_POST['user_id'];
$shopId = $_POST['shop_id'];
$productName = $_POST['product_name'];
$price = $_POST['price'];
$dateOfEntry = $_POST['date_of_entry'];


$sql = "INSERT INTO discounts (user_id, shop_id, product_name, price, date_of_entry) VALUES ('$userId', '$shopId', '$productName', '$price', '$dateOfEntry')";

if (mysqli_query($link, $sql)) {
    $response["status"] = "success";
    $response["message"] = "Discount uploaded successfully!";
} else {
    $response["message"] = "Error: " . mysqli_error($link);
}

mysqli_close($link);
echo json_encode($response);
?>
