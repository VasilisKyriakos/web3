<?php
include "connector.php";

$response = ['status' => 'error', 'message' => 'Unknown Error'];

if (isset($_POST['discount_id']) && isset($_POST['in_stock'])) {
    $discount_id = mysqli_real_escape_string($link, $_POST['discount_id']);
    $in_stock = mysqli_real_escape_string($link, $_POST['in_stock']) === '1' ? '1' : '0';
    
    $query = "UPDATE discounts SET in_stock = '$in_stock' WHERE id = $discount_id";
    $result = mysqli_query($link, $query);

    if ($result) {
        $response['status'] = 'success';
        $response['message'] = 'Updated Successfully';
    } else {
        $response['message'] = "Database update failed: " . mysqli_error($link);
    }
}

echo json_encode($response);
?>
