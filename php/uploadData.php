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

        // Insert Categories
        $insertCategoryStmt = $link->prepare("INSERT INTO categories (id, name) VALUES (?, ?)");
        $insertCategoryStmt->bind_param("ss", $categoryId, $categoryName);

        foreach ($data['categories'] as $category) {
            $categoryId = $category['id'];
            $categoryName = $category['name'];
            
            if (!$insertCategoryStmt->execute()) {
                throw new Exception("Error inserting category: " . $insertCategoryStmt->error);
            }

            // Insert Subcategories for each category
            $insertSubcategoryStmt = $link->prepare("INSERT INTO subcategories (uuid, name, category_id) VALUES (?, ?, ?)");
            $insertSubcategoryStmt->bind_param("sss", $subUuid, $subName, $categoryId);

            foreach ($category['subcategories'] as $subcategory) {
                $subUuid = $subcategory['uuid'];
                $subName = $subcategory['name'];
                
                if (!$insertSubcategoryStmt->execute()) {
                    throw new Exception("Error inserting subcategory: " . $insertSubcategoryStmt->error);
                }
            }

            $insertSubcategoryStmt->close();
        }

        $insertCategoryStmt->close();

        // Insert Products
        $insertProductStmt = $link->prepare("INSERT INTO products (id, name, category, subcategory) VALUES (?, ?, ?, ?)");
        $insertProductStmt->bind_param("ssss", $productId, $productName, $productCategory, $productSubcategory);

        foreach ($data['products'] as $product) {
            $productId = (int)$product['id'];
            $productName = $product['name'];
            $productCategory = $product['category'];
            $productSubcategory = $product['subcategory'];
            
            if (!$insertProductStmt->execute()) {
                throw new Exception("Error inserting product: " . $insertProductStmt->error);
            }
        }

        $insertProductStmt->close();

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
