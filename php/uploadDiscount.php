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

    // Get the product ID
    $queryProduct = "SELECT id FROM products WHERE name = '$productName'";
    $resultProduct = mysqli_query($link, $queryProduct);
    $product = mysqli_fetch_assoc($resultProduct);
    $productId = $product['id'];

    // Check the average price of the previous day
    $yesterday = date("Y-m-d", strtotime("-1 day"));
    $queryPriceYesterday = "SELECT price as avgPrice FROM prices WHERE product_id = '$productId' AND date = '$yesterday'";
    $resultPriceYesterday = mysqli_query($link, $queryPriceYesterday);
    $priceDataYesterday = mysqli_fetch_assoc($resultPriceYesterday);
    $avgPriceYesterday = $priceDataYesterday['avgPrice'];

    // Check the average price of the previous week
    $lastWeekStart = date("Y-m-d", strtotime("-7 days"));
    $lastWeekEnd = date("Y-m-d", strtotime("-1 days"));
    $queryPriceLastWeek = "SELECT AVG(price) as avgPrice FROM prices WHERE product_id = '$productId' AND date BETWEEN '$lastWeekStart' AND '$lastWeekEnd'";
    $resultPriceLastWeek = mysqli_query($link, $queryPriceLastWeek);
    $priceDataLastWeek = mysqli_fetch_assoc($resultPriceLastWeek);
    $avgPriceLastWeek = $priceDataLastWeek['avgPrice'];


    // Store the calculations in the response
    $response['calculations']['userPrice'] = $productPrice;
    $response['calculations']['avgPriceYesterday'] = $avgPriceYesterday;
    $response['calculations']['avgPriceLastWeek'] = $avgPriceLastWeek;
    $response['calculations']['80%OfYesterday'] = 0.8 * $avgPriceYesterday;
    $response['calculations']['80%OfLastWeek'] = 0.8 * $avgPriceLastWeek;


        // Append calculations to the response message
    $response['message'] .= "\nUser Price: " . $response['calculations']['userPrice'];
    $response['message'] .= "\nAverage Price Yesterday: " . $response['calculations']['avgPriceYesterday'];
    $response['message'] .= "\nAverage Price Last Week: " . $response['calculations']['avgPriceLastWeek'];
    $response['message'] .= "\n80% Of Average Price Yesterday: " . $response['calculations']['80%OfYesterday'];
    $response['message'] .= "\n80% Of Average Price Last Week: " . $response['calculations']['80%OfLastWeek'];


    if ($productPrice <= (0.8 * $avgPriceYesterday)) {
        // Reward 50 points
        $queryReward = "UPDATE users SET points = points + 50 WHERE id = '$userId'";
        mysqli_query($link, $queryReward);
        $response['message'] .= "User rewarded with 50 points for the daily discount.";
    } elseif ($productPrice <= (0.8 * $avgPriceLastWeek)) {
        // Reward 20 points
        $queryReward = "UPDATE users SET points = points + 20 WHERE id = '$userId'";
        mysqli_query($link, $queryReward);
        $response['message'] .= "User rewarded with 20 points for the weekly discount.";
    } else {
        // No rewards
        $response['message'] .= "No rewards given, but the discount offer is uploaded.";
    }

    // Insert the discount
    $query = "INSERT INTO discounts (user_id, shop_id, product_name, price) VALUES ('$userId', '$shopId', '$productName', '$productPrice')";
    if(mysqli_query($link, $query)) {
        $response['status'] = 'success';
        $response['message'] .= " Discount uploaded successfully!";
    } else {
        $response['message'] .= " Database error: " . mysqli_error($link);
    }
}

echo json_encode($response);

?>
