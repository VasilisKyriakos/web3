<?php

header('Content-Type: application/json');

include "connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = array(
    'status' => 'error',
    'message' => 'User ID is not set.'
);

if(isset($_POST['user_id'],$_POST['shop_id'],$_POST['product_name'],$_POST['product_price'])) {
    $userId = (int)$_POST['user_id'];
    $shopId = $_POST['shop_id'];
    $productName = $_POST['product_name'];
    $productPrice = (int)$_POST['product_price'];

    $response['status'] = 'success';
    $response['message'] = "User ID {$userId} is set
                            Shop ID {$shopId} is set.
                            Product Name {$productName} is set.
                            Product Price {$productPrice} is set.";
}

    $query = "INSERT INTO discounts (user_id, shop_id, product_name, price) VALUES ('$userId', '$shopId', '$productName', '$productPrice')";

    if(mysqli_query($link, $query)) {
        $response['status'] = 'success';
        $response['message'] = "Discount uploaded successfully!";
    } else {
        $response['message'] = "Database error: " . mysqli_error($link);
    }

    echo json_encode($response);

?>

