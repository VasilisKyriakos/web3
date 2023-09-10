<?php
// Connect to the database
include "connector.php";

$response = ['status' => 'error', 'shops' => [], 'message' => ''];

if (isset($_GET['category_id'])) {
    $category_id = mysqli_real_escape_string($link, $_GET['category_id']);
    
    // The above query to fetch shops with a discount for products in the given category
    $query = "
        SELECT 
            products.name, 
            products.category, 
            discounts.*,
            shops.*
        FROM 
            products 
        JOIN 
            discounts 
        ON 
            products.name = discounts.product_name 
        JOIN
            shops
        ON 
            shops.id = discounts.shop_id
        WHERE 
            products.category = '$category_id'
        GROUP BY
            shops.id

    ";
    
    $result = mysqli_query($link, $query);

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $response['shops'][] = $row;
        }
        $response['status'] = 'success';
    } else {
        $response['message'] = "Database query failed: " . mysqli_error($link);
    }
}

echo json_encode($response);
?>
