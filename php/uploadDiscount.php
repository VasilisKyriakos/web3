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

// Check if data exists
if(isset($_POST['user_id'], $_POST['shop_id'], $_POST['product_name'], $_POST['price'])) {
    $userId = $_POST['user_id'];
    $shopId = $_POST['shop_id'];
    $productName = $_POST['product_name'];
    $price = $_POST['price'];

    // Use prepared statements to avoid SQL injection
    $stmt = $link->prepare("INSERT INTO discounts (user_id, shop_id, product_name, price ) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iisss", $userId, $shopId, $productName, $price);

    if ($stmt->execute()) {
        $response["status"] = "success";
        $response["message"] = "Discount uploaded successfully!";
    } else {
        $response["message"] = "Error: " . $stmt->error;
    }

    $stmt->close();

} else {
    $response["message"] = "Required fields are missing.";
}

echo json_encode($response);
?>
