<?php
include "connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = [
    "status" => "error",
    "message" => "",
    "products" => []
];

try {
    $subcategoryId = isset($_POST['subcategory_id']) ? $_POST['subcategory_id'] : null;

    // Check if subcategory ID is provided
    if (!$subcategoryId) {
        throw new Exception("Subcategory ID not provided!");
    }

    // Fetch products based on subcategory
    $query = "SELECT * FROM products WHERE subcategory = '$subcategoryId'";
    $result = mysqli_query($link, $query);

    if (!$result) {
        throw new Exception("Error fetching products: " . mysqli_error($link));
    }

    while ($row = mysqli_fetch_assoc($result)) {
        $response["products"][] = $row;
    }

    $response["status"] = "success";
    $response["message"] = "Products fetched successfully!";
    
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

mysqli_close($link);
echo json_encode($response);
?>
