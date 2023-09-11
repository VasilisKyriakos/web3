<?php

// Initialization code
header('Content-Type: application/json');

include "../connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$today = date('Y-m-d');


$response = array(
    'status' => 'error',
    'message' => 'error'
    
);

// Check if it's the first day of the month
$today = date('d'); // Get the current day of the month
$lastDayOfMonth = date('t'); // Get the last day of the current month
if($today === '01'){
    $total_users_query = "SELECT COUNT(*) AS total_entries FROM users";
    // Execute the query
    $result = mysqli_query($link, $total_users_query );
    if ($result) {
        // Fetch the result into an associative array
        $row = mysqli_fetch_assoc($result);
    
        // Get the total entries from the result
        $totalEntries = $row['total_entries'];
        
          // Calculate the current tokens
        $currentTokens = $totalEntries * 100;

        // SQL query to insert currentTokens into the "tokens" table
        $insertTokensSql = "INSERT INTO tokens (current_tokens) VALUES ($currentTokens)";

        // Execute the insert query
        if (mysqli_query($link, $insertTokensSql)) {
            $response['status'] = 'success';
            $response['message'] = 'Updated system tokens';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Cant get the tokens table';
        }


    } else {
        $response['status'] = 'error';
        $response['message'] = 'Cant get total users';
    }


}else if($today === $lastDayOfMonth){

    $sqlTotalTokens = "SELECT current_tokens FROM tokens";
    $resultTotalTokens = mysqli_query($link, $sqlTotalTokens);

    if ($resultTotalTokens) {
        $rowTotalTokens = mysqli_fetch_assoc($resultTotalTokens);
        $totalTokens = $rowTotalTokens['current_tokens'];

        // Step 2: Calculate the amount to distribute (80% of total tokens)
        $amountToDistribute = 0.8 * $totalTokens;

        // Step 3: Retrieve all users and their "monthly_points" from the "users" table
        $sqlUsers = "SELECT user_id, monthly_points FROM users";
        $resultUsers = mysqli_query($link, $sqlUsers);

        if ($resultUsers) {
            $totalMonthlyPoints = 0;
            while ($rowUser = mysqli_fetch_assoc($resultUsers)) {
                $totalMonthlyPoints += $rowUser['monthly_points'];
            }
            // Step 4 and Step 5: Calculate the share of tokens and update "tokens" and "total_tokens" for each user
            while ($rowUser = mysqli_fetch_assoc($resultUsers)) {
                $userId = $rowUser['user_id'];
                $monthlyPoints = $rowUser['monthly_points'];
                $tokensToDistribute = round(($monthlyPoints / $totalMonthlyPoints) * $amountToDistribute);

                // Update the "tokens" and "total_tokens" columns for each user
                $sqlUpdateUserTokens = "UPDATE users SET tokens = $tokensToDistribute, total_tokens = total_tokens + $tokensToDistribute WHERE user_id = $userId";
                mysqli_query($link, $sqlUpdateUserTokens);
            }
            // Update the "current_tokens" in the "tokens" table
            $newCurrentTokens = $totalTokens - $amountToDistribute;
            $sqlUpdateTokens = "UPDATE tokens SET current_tokens = $newCurrentTokens";
            mysqli_query($link, $sqlUpdateTokens);
            $response['message'] = "Tokens distributed successfully to users.";
          
        } else {
            // Handle the query error for retrieving users
            $response['message'] = "Error retrieving users: " . mysqli_error($link);
        }
    } else {
        // Handle the query error for retrieving total tokens
        $response['message'] = "Error retrieving total tokens: " . mysqli_error($link);
    }

}else{
    $response['status'] = 'success';
    $response['message'] = 'Not a date for token updates';
}


echo json_encode($response);

?>


