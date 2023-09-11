<?php
include "connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = ['status' => 'error', 'message' => 'Unknown Error'];
if(!isset($_POST['discount_id'])){
    $response['message'] = 'no discount';
}
if(!isset($_POST['type'])){
    $response['message'] = 'no type';
}

if (isset($_POST['discount_id']) && isset($_POST['type'])) {
    $response['status'] = 'success'; // Corrected the status typo
    $response['message'] = 'Update complete';
  
    
    // Sanitize input data to prevent SQL injection
    $discount_id = mysqli_real_escape_string($link, $_POST['discount_id']);
    $type = mysqli_real_escape_string($link, $_POST['type']);
    $column = $type === 'like' ? 'likes' : 'dislikes';

    $query = "UPDATE discounts SET $column = $column + 1 WHERE discount_id = $discount_id";
    if (!mysqli_query($link, $query)) {
        $response['message'] = mysqli_error($link);
        echo json_encode($response);
        return;
    }

    // Get the user_id of the recommending user from the discount
    $getUserQuery = "SELECT user_id FROM discounts WHERE discount_id = $discount_id";
    $result = mysqli_query($link, $getUserQuery);

    if (!$result) {
        $response['message'] = mysqli_error($link);
        echo json_encode($response);
        return;
    }

    $data = mysqli_fetch_assoc($result);
    $recommendingUserId = $data['user_id'];

    // Calculate points based on the action
    $pointsChange = $type === 'like' ? 5 : -1;

    // Update total and monthly points
    $pointsQuery = "UPDATE users SET total_points = total_points + $pointsChange, monthly_points = GREATEST(0, monthly_points + $pointsChange) WHERE id = $recommendingUserId";

    if (!mysqli_query($link, $pointsQuery)) {
        $response['message'] = mysqli_error($link);
        echo json_encode($response);
        return;

    }
    
    $user_id = $_SESSION['id'];
    $isLike = $type === 'like' ? 'like' : 'dislike';
    $likesQuery = "INSERT INTO likes (user_id, discount_id, likeType) VALUES ('$user_id', '$discount_id', '$column')";
    if(!mysqli_query($link, $likesQuery)) {
        $response['message'] = 'like query';
        echo json_encode($response);
        return;
    }
    
    // Commit the transaction
    mysqli_commit($link);
}

echo json_encode($response);
?>
