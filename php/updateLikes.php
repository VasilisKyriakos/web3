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

        $query = "UPDATE discounts SET $column = $column + 1 WHERE discount_id = $discount_id";
        if(!mysqli_query($link, $query)) {
            throw new Exception("Failed to update like/dislike count: " . mysqli_error($link));
        }

        // Get the user_id of the recommending user from the discount
        $getUserQuery = "SELECT user_id FROM discounts WHERE discount_id = $discount_id";
        $result = mysqli_query($link, $getUserQuery);

    
        $data = mysqli_fetch_assoc($result);
        $recommendingUserId = $data['user_id'];

        // Update points based on the action
        if ($type === 'like') {
            $pointsQuery = "UPDATE users SET points = points + 5 WHERE id = $recommendingUserId";
        } else {
            $pointsQuery = "UPDATE users SET points = points - 1 WHERE id = $recommendingUserId";
        }

        if(!mysqli_query($link, $pointsQuery)) {
            throw new Exception("Failed to update user points: " . mysqli_error($link));
        }

        // Commit the transaction
        mysqli_commit($link);
        $response['status'] = 'success';
        $response['message'] = 'Updated Successfully';

}
echo json_encode($response);
?>
