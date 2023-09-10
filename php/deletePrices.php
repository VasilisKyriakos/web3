<?php

include 'connector.php';  // Your DB connection file

$response = ['status' => 'error', 'message' => 'Failed to delete the prices.'];

$query = "TRUNCATE TABLE prices";
$result = mysqli_query($link, $query);

if ($result) {
    $response['status'] = 'success';
    $response['message'] = 'All prices have been deleted successfully.';
} else {
    $response['message'] = mysqli_error($link);  // Get the error message from MySQL in case of failure
}

echo json_encode($response);

?>
