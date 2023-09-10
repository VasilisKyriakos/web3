<?php

header('Content-Type: application/json');

include "connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$response = array(
    'status' => 'error',
    'message' => ''
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
    $queryPriceYesterday = "SELECT price FROM prices WHERE product_id = '$productId' AND date = '$yesterday'";
    $resultPriceYesterday = mysqli_query($link, $queryPriceYesterday);
    $priceDataYesterday = mysqli_fetch_assoc($resultPriceYesterday);
    $avgPriceYesterday = $priceDataYesterday['price'];

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


    if ($productPrice <= (0.8 * $avgPriceYesterday)) {
        // Reward 50 points
        $queryReward = "UPDATE users SET total_points = total_points + 50 , monthly_points =  monthly_points + 50 WHERE id = '$userId'";
        mysqli_query($link, $queryReward);
        $response['message'] .= "User rewarded with 50 points for the daily discount.";
    } elseif ($productPrice <= (0.8 * $avgPriceLastWeek)) {
        // Reward 20 points
        $queryReward = "UPDATE users SET total_points = total_points + 50, monthly_points =  monthly_points + 50 WHERE id = '$userId'";
        mysqli_query($link, $queryReward);
        $response['message'] .= "User rewarded with 20 points for the weekly discount.";
    } else {
        // No rewards
        $response['message'] .= "No rewards given, but the discount offer is uploaded.";
    }

    $dateOfEntry = date('Y-m-d'); // Assuming this is today's date
    $expiryDate = date('Y-m-d', strtotime('+7 days', strtotime($dateOfEntry)));
    
    $query = "INSERT INTO discounts (user_id, shop_id, product_name, price , expired_date) VALUES ('$userId', '$shopId', '$productName', '$productPrice','$expiryDate')";
    if(mysqli_query($link, $query)) {
        $response['status'] = 'success';
        $response['message'] .= " Discount uploaded successfully!";
    } else {
        $response['message'] .= " Database error: " . mysqli_error($link);
    }
}

echo json_encode($response);

?>
