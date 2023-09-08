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

    $query = "SELECT * FROM subcategories WHERE category_id = '$categoryId'";
    $result = mysqli_query($link, $query);

    if (!$result) {
        throw new Exception("Error fetching subcategories: " . mysqli_error($link));
    }

    while ($row = mysqli_fetch_assoc($result)) {
        $response["subcategories"][] = $row;
    }

    $response["status"] = "success";
    $response["message"] = "Subcategories fetched successfully!";
    
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

mysqli_close($link);
echo json_encode($response);
?>
