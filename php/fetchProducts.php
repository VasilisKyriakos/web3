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
    $stmt = $link->prepare("SELECT * FROM products WHERE subcategory = ?");
    $stmt->bind_param("s", $subcategoryId);
    
    if (!$stmt->execute()) {
        throw new Exception("Error fetching products: " . $stmt->error);
    }

    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $response["products"][] = $row;
    }

    $response["status"] = "success";
    $response["message"] = "Products fetched successfully!";
    
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$stmt->close();
mysqli_close($link);
echo json_encode($response);
?>
