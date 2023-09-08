<?php
include "connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = [
    "status" => "error",
    "message" => "",
    "subcategories" => []
];

try {
    $categoryId = isset($_POST['category_id']) ? $_POST['category_id'] : null;
    
    // Check if category ID is provided
    if (!$categoryId) {
        throw new Exception("Category ID not provided!");
    }

    // Fetch subcategories based on category ID
    $stmt = $link->prepare("SELECT * FROM subcategories WHERE category_id = ?");
    $stmt->bind_param("s", $categoryId);
    
    if (!$stmt->execute()) {
        throw new Exception("Error fetching subcategories: " . $stmt->error);
    }

    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $response["subcategories"][] = $row;
    }

    $response["status"] = "success";
    $response["message"] = "Subcategories fetched successfully!";
    
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$stmt->close();
mysqli_close($link);
echo json_encode($response);
?>
