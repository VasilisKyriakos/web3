<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
include "connector.php"; 

$response = ['status' => '', 'data' => [], 'message' => ''];

if (isset($_GET['year']) && isset($_GET['month'])) {
    $selectedYear = mysqli_real_escape_string($link, $_GET['year']);
    $selectedMonth = mysqli_real_escape_string($link, $_GET['month']);
    
    $query = "SELECT date_of_entry, COUNT(discount_id) as number_of_discounts 
              FROM discounts 
              WHERE YEAR(date_of_entry) = '$selectedYear' AND MONTH(date_of_entry) = '$selectedMonth'
              GROUP BY date_of_entry";
              
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
} else {
    $response['status'] = 'error';
    $response['message'] = "Year or month not provided!";
}

echo json_encode($response);

mysqli_close($link);
?>
