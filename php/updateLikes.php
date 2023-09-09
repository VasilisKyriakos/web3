<?php
include "connector.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = ['status' => 'error', 'message' => 'Unknown Error'];

if (isset($_POST['discount_id']) && isset($_POST['type'])) {
    $discount_id = mysqli_real_escape_string($link, $_POST['discount_id']);
    $type = $_POST['type'];
    $column = $type === 'like' ? 'likes' : 'dislikes';
    
    $query = "UPDATE discounts SET $column = $column + 1 WHERE id = $discount_id";
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
