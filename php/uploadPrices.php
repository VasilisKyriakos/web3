<?php

include 'connector.php';  // Your DB connection file


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = ['status' => 'error', 'message' => 'Unknown Error'];

// Assuming the JSON content is passed in the 'content' POST variable
if (isset($_POST['content'])) {
    $data = json_decode($_POST['content'], true);

    if ($data) {
        // Start transaction
        mysqli_begin_transaction($link);

        try {
            foreach ($data['data'] as $product) {
                // Insert prices
                foreach ($product['prices'] as $price) {
                    $productId = mysqli_real_escape_string($link, (int)$product['id']);
                    $date = mysqli_real_escape_string($link, $price['date']);
                    $priceValue = mysqli_real_escape_string($link, $price['price']);

                    $query = "INSERT INTO prices (product_id, date , price) VALUES ('$productId', '$date' ,'$priceValue')";
                    $result = mysqli_query($link, $query);

                    if (!$result) {
                        throw new Exception("Error inserting data: " . mysqli_error($link));
                    }
                }
            }

            // Commit the transaction
            mysqli_commit($link);

            $response['status'] = 'success';
            $response['message'] = 'Data uploaded successfully!';
        } catch (Exception $e) {
            // Rollback in case of error
            mysqli_rollback($mysqli);
            $response['message'] = $e->getMessage();
        }
    } else {
        $response['message'] = "Invalid JSON data.";
    }
}

echo json_encode($response);

?>
