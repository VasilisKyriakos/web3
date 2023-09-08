<?php
include "connector.php";

$response = ["message" => ""];

try {
    $link->begin_transaction();  // Start a transaction

    // Order is important due to foreign key constraints
    $sqlDeleteProducts = "DELETE FROM products";
    $sqlDeleteSubcategories = "DELETE FROM subcategories";
    $sqlDeleteCategories = "DELETE FROM categories";

    if (!$link->query($sqlDeleteProducts)) {
        throw new Exception("Error deleting products: " . $link->error);
    }

    if (!$link->query($sqlDeleteSubcategories)) {
        throw new Exception("Error deleting subcategories: " . $link->error);
    }

    if (!$link->query($sqlDeleteCategories)) {
        throw new Exception("Error deleting categories: " . $link->error);
    }

    $link->commit();  // Commit the transaction if all deletions were successful

    $response["message"] = "All data deleted successfully!";
} catch (Exception $e) {
    $link->rollback();  // If there's an error, rollback any changes made in this transaction
    $response["message"] = "Error: " . $e->getMessage();
}

mysqli_close($link);
echo json_encode($response);
?>
