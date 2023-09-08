<?php
include "connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = [
    "status" => "error",
    "message" => "",
    "categories" => []
];

try {
    // Fetch categories
    $result = mysqli_query($link, "SELECT * FROM categories");
    if (!$result) {
        throw new Exception("Error fetching categories: " . mysqli_error($link));
    }

    while ($row = mysqli_fetch_assoc($result)) {
        $response["categories"][] = $row;
    }

    $response["status"] = "success";
    $response["message"] = "Categories fetched successfully!";
    
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

mysqli_close($link);
echo json_encode($response);
?>
