<?php

// Initialization code
header('Content-Type: application/json');

include "connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$updated = array();
$deleted = array();

$today = date('Y-m-d');

// Fetch expired bids
$query = "SELECT * FROM discounts WHERE expired_date = '$today'";
$result = mysqli_query($link, $query);

while ($row = mysqli_fetch_assoc($result)) {
    // Fetch average price from the 'prices' table for yesterday
    $yesterday = date("Y-m-d", strtotime("-1 day"));
    $avgPriceQuery = "SELECT price as average FROM prices WHERE date = '$yesterday'";
    $avgResult = mysqli_query($link, $avgPriceQuery);
    $avgPriceRow = mysqli_fetch_assoc($avgResult);
    $avgPriceYesterday = $avgPriceRow['average'];

    // Fetch average price from the previous week
    $startOfWeek = date("Y-m-d", strtotime("-7 days", strtotime($today)));
    $endOfWeek = date("Y-m-d", strtotime("-1 day", strtotime($today)));
    $avgPriceWeekQuery = "SELECT AVG(price) as average FROM prices WHERE date BETWEEN '$startOfWeek' AND '$endOfWeek'";
    $avgWeekResult = mysqli_query($link, $avgPriceWeekQuery);
    $avgWeekRow = mysqli_fetch_assoc($avgWeekResult);
    $avgPriceWeek = $avgWeekRow['average'];

    // Renew the bid if it meets one of the criteria
    if ($row['price'] <= 0.8 * $avgPriceYesterday || $row['price'] <= 0.8 * $avgPriceWeek) {
        $renewDate = date('Y-m-d', strtotime('+7 days', strtotime($today)));
        $renewQuery = "UPDATE discounts SET expired_date = '$renewDate' WHERE discount_id = {$row['discount_id']}";
        mysqli_query($link, $renewQuery);
        $updated[] = $row['discount_id'];
    } else {
        // Delete the bid if it doesn't meet any criteria
        $deleteQuery = "DELETE FROM discounts WHERE discount_id = {$row['discount_id']}";
        mysqli_query($link, $deleteQuery);
        $deleted[] = $row['discount_id'];
    }
}

$response = array(
    'status' => 'success',
    'message' => 'Successfully processed expired bids',
    'updated' => $updated,
    'deleted' => $deleted
);

echo json_encode($response);

?>


