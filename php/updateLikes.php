<?php
include "connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = ['status' => 'error', 'message' => 'Unknown Error'];

if (isset($_POST['discount_id']) && isset($_POST['type'])) {
    
    $discount_id = mysqli_real_escape_string($link, $_POST['discount_id']);
    $type = $_POST['type'];
    $column = $type === 'like' ? 'likes' : 'dislikes';

    $query = "UPDATE discounts SET $column = $column + 1 WHERE discount_id = $discount_id";
    if(!mysqli_query($link, $query)) {
        throw new Exception("Failed to update like/dislike count: " . mysqli_error($link));
    }

    // Get the user_id of the recommending user from the discount
    $getUserQuery = "SELECT user_id FROM discounts WHERE discount_id = $discount_id";
    $result = mysqli_query($link, $getUserQuery);

    $data = mysqli_fetch_assoc($result);
    $recommendingUserId = $data['user_id'];

    // Calculate points based on the action
    $pointsChange = $type === 'like' ? 5 : -1;

    // Update total and monthly points
    $pointsQuery = "UPDATE users SET total_points = total_points + $pointsChange, monthly_points = GREATEST(0, monthly_points + $pointsChange) WHERE id = $recommendingUserId";
    
    if(!mysqli_query($link, $pointsQuery)) {
        throw new Exception("Failed to update user points: " . mysqli_error($link));
    }
    $user_id = $_SESSION['id'];
    $likesQuery = "INSERT INTO likes (user_id, discount_id, likeType) VALUES ('$user_id', '$discount_id', '$column')";
    if(!mysqli_query($link, $likesQuery)) {
        throw new Exception("Failed to update like/dislike table: " . mysqli_error($link));
    }

    // Commit the transaction
    mysqli_commit($link);
    $response['status'] = 'success';
    $response['message'] = 'Updated Successfully';

}
echo json_encode($response);
?>
