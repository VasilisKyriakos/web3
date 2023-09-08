$(document).ready(function() {
    

    $.ajax({
        url: './php/fetchCategories.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                let categoriesDropdown = $("#categoryDropdown");
                response.categories.forEach(category => {
                    categoriesDropdown.append(`<option value="${category.id}">${category.name}</option>`);
                });
            } else {
                console.error("Error fetching categories: ", response.message);
            }
        },
        error: function(error) {
            console.error("Failed to fetch categories:", error);
        }
    });
    
    

    // When a category is selected, fetch and display its subcategories
    $("#categoryDropdown").on('change', function() {
        let category_id = $(this).val();
        $.ajax({
            url: './php/fetchSubcategories.php',
            type: 'GET',
            data: { category_id: category_id },
            dataType: 'json',
            success: function(data) {
                let subcategoriesDropdown = $("#subcategoryDropdown");
                // Clear previous entries
                subcategoriesDropdown.empty();
                data.forEach(subcategory => {
                    subcategoriesDropdown.append(`<option value="${subcategory.uuid}">${subcategory.name}</option>`);
                });
            },
            error: function(error) {
                console.error("Failed to fetch subcategories:", error);
            }
        });
    });

    // When a subcategory is selected, fetch and display its products
    $("#subcategoryDropdown").on('change', function() {
        let subcategory_name = $(this).val();
        $.ajax({
            url: './php/fetchProducts.php',
            type: 'GET',
            data: { subcategory_name: subcategory_name },
            dataType: 'json',
            success: function(data) {
                let productsDropdown = $("#productDropdown");
                // Clear previous entries
                productsDropdown.empty();
                data.forEach(product => {
                    productsDropdown.append(`<option value="${product.id}">${product.name}</option>`);
                });
            },
            error: function(error) {
                console.error("Failed to fetch products:", error);
            }
        });
    });

    // For quick product search (if implemented)
    window.searchProduct = function(query) {
        // Here, you'd add logic to search for a product given a query string. 
        // You may choose to implement an AJAX search similar to the above functions.
    };
});
