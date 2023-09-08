<?php
include "connector.php";

$response = ["message" => ""];

try {
    $sql = "TRUNCATE TABLE shops"; 
    if (!$link->query($sql)) {
        throw new Exception("Error deleting data: " . $link->error);
    }

    $response["message"] = "Data deleted successfully!";
} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

mysqli_close($link);
echo json_encode($response);
?>
