<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
include "connector.php"; 

$response = ['status' => '', 'data' => [], 'message' => ''];

$category_id = $_GET['category_id'];
$weekOffset = isset($_GET['week_offset']) ? intval($_GET['week_offset']) : 0;

$avgDifferencePercentages = [];

$startDay = 7 * $weekOffset;
$endDay = $startDay + 6;

for ($i = $startDay; $i <= $endDay; $i++) {
    $query_date = date('Y-m-d', strtotime('-' . $i . ' days'));
    $query_date_prev_week = date('Y-m-d', strtotime('-' . ($i + 7) . ' days'));

    $query = "SELECT AVG(sub.avg_difference_percentage) as final_avg_difference_percentage
             FROM (
                 SELECT ((today.price - last_week.price)/last_week.price)*100 AS avg_difference_percentage 
                 FROM (
                     SELECT pp.product_id, pp.price 
                     FROM prices pp
                     JOIN products p ON pp.product_id = p.id
                     JOIN categories c ON p.category = c.id
                     WHERE pp.date = '$query_date' AND c.id =  '$category_id'
                 ) AS today
                 
                 JOIN (
                     SELECT pp.product_id, pp.price
                     FROM prices pp
                     JOIN products p ON pp.product_id = p.id
                     JOIN categories c ON p.category = c.id
                     WHERE pp.date = '$query_date_prev_week' AND c.id =  '$category_id'
                 ) AS last_week ON today.product_id = last_week.product_id
             ) as sub;";

    $result = mysqli_query($link, $query);

    if (!$result) {
        $response['status'] = 'error';
        $response['message'] = "Database query failed for date $query_date: " . mysqli_error($link);
        echo json_encode($response);
        exit;
    } else {
        $row = mysqli_fetch_assoc($result);
        $avgDifferencePercentages[] = $row['final_avg_difference_percentage'];
    }
}

$response['status'] = 'success';
$response['data'] = ['avg_discount_percent' => $avgDifferencePercentages];

echo json_encode($response);

mysqli_close($link);

?>
