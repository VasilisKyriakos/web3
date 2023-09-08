<?php
include "connector.php";
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = ["message" => ""];

try {
    if (isset($_POST['content'])) {
        $data = json_decode($_POST['content'], true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON format");
        }

        $insertStmt = $link->prepare("INSERT INTO shops (id, lat, lon, name) VALUES (?, ?, ?, ?)");
        $insertStmt->bind_param("idds", $id, $lat, $lon, $name);

        foreach ($data['elements'] as $element) {
            if (isset($element['type']) && $element['type'] === 'node' && isset($element['tags']['name'])) {
                $id = $element['id'];
                $lat = $element['lat'];
                $lon = $element['lon'];
                $name = $element['tags']['name'];

                if (!$insertStmt->execute()) {
                    throw new Exception("Error inserting shop: " . $insertStmt->error);
                }
            }
        }

        $insertStmt->close();

        $response["message"] = "Data added successfully!";
    } else {
        throw new Exception("No content received!");
    }

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

mysqli_close($link);
echo json_encode($response["message"]);
?>
