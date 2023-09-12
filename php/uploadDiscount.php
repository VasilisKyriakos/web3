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
    $productPrice = (float)$_POST['product_price'];

    // Check if an identical active offer exists
    $today = date('Y-m-d');
    $checkActiveOffer = "SELECT price FROM discounts WHERE product_name = '$productName' AND shop_id = '$shopId' AND expired_date > '$today'";
    $activeOfferResult = mysqli_query($link, $checkActiveOffer);

    if($existingOffer = mysqli_fetch_assoc($activeOfferResult)) {
        // Offer found, check if the new price is at least 20% lower
        if($productPrice >= $existingOffer['price'] * 0.8) {
            $response['status'] = 'error';
            $response['message'] = 'Identical active offer found. The new price is not 20% lower than the existing one.';
            echo json_encode($response);
            exit;  // Stop the script
        }
    }

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

    $satisfyingCriteria = 0;  // Default value

    if ($productPrice <= (0.8 * $avgPriceYesterday)) {
        // Reward 50 points
        $queryReward = "UPDATE users SET total_points = total_points + 50 , monthly_points =  monthly_points + 50 WHERE id = '$userId'";
        mysqli_query($link, $queryReward);
        $response['message'] .= "User rewarded with 50 points for the daily discount.  ";
        $satisfyingCriteria = 1;  // Set to 1 as the criteria is satisfied
    } elseif ($productPrice <= (0.8 * $avgPriceLastWeek)) {
        // Reward 20 points
        $queryReward = "UPDATE users SET total_points = total_points + 50, monthly_points =  monthly_points + 50 WHERE id = '$userId'";
        mysqli_query($link, $queryReward);
        $response['message'] .= "User rewarded with 20 points for the weekly discount.  ";
        $satisfyingCriteria = 1;  // Set to 1 as the criteria is satisfied
    } else {
        // No rewards
        $response['message'] .= "No rewards given, but the discount offer is uploaded.  ";
    }

    $dateOfEntry = date('Y-m-d'); 
    $expiryDate = date('Y-m-d', strtotime('+7 days', strtotime($dateOfEntry)));

    // Include the satisfying_criteria column in your INSERT query
    $query = "INSERT INTO discounts (user_id, shop_id, product_name, price, expired_date, satisfying_criteria) VALUES ('$userId', '$shopId', '$productName', '$productPrice', '$expiryDate', '$satisfyingCriteria')";
    

    
    if(mysqli_query($link, $query)) {
        // Create the SQL query to get the average price
        $query = "SELECT AVG(price) AS avg_price FROM `discounts` WHERE product_name = '$productName'";

        // Execute the query
        $result = mysqli_query($link, $query);
        // Fetch the result as an associative array
        $row = mysqli_fetch_assoc($result);

        // Get the average price
        $avgPrice = $row['avg_price'];
        $response['message'] .= $avgPrice;

        $query = "SELECT COUNT(*) FROM prices WHERE product_id = '$productId' AND date = '$dateOfEntry'";
        $result = mysqli_query($link, $query);
        $row = mysqli_fetch_array($result);
        if ($row[0]==0){
            $query = "INSERT INTO prices (product_id, date, price) VALUES ('$productId', '$dateOfEntry', '$avgPrice')";
            mysqli_query($link, $query);
        }else{
            $updateQuery = "UPDATE `prices` SET `price` = '$avgPrice' WHERE product_id = '$productId' AND date = '$dateOfEntry'";
            // Execute the query to update the prices table
            $updateResult = mysqli_query($link, $updateQuery);
        }    
        $response['status'] = 'success';
        $response['message'] .= " Discount uploaded successfully !";
        

    } else {
        $response['message'] .= " Database error: " . mysqli_error($link);
    }
}

echo json_encode($response);

?>


