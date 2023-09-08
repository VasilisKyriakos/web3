


$(document).ready(function() {

    loadCategories();

    // Listen for category change to load subcategories
    $("#categoryDropdown").change(function() {
        let categoryId = $(this).val();
        loadSubcategories(categoryId);
    });

    $("#subcategoryDropdown").change(function() {
        let subcategoryId = $(this).val();
        loadProducts(subcategoryId);
    });

});


function loadCategories() {
    $.ajax({
        url: './php/fetchCategories.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                let categoriesDropdown = $("#categoryDropdown");
                response.categories.forEach(category => {
                    categoriesDropdown.append(`<option value="${category.id}">${category.name}</option>`);
                });
            } else {
                console.error("Error fetching categories_ajax:", response.message);
            }
        },
        error: function(error) {
            console.error("AJAX error:", error);
        }
    });
}

function loadSubcategories(categoryId) {
    $.ajax({
        url: './php/fetchSubcategories.php',
        type: 'POST',
        data: { category_id: categoryId },
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                let subcategoriesDropdown = $("#subcategoryDropdown");
                // Clear previous subcategories
                subcategoriesDropdown.empty();
                response.subcategories.forEach(subcategory => {
                    subcategoriesDropdown.append(`<option value="${subcategory.uuid}">${subcategory.name}</option>`);
                
                });
                
            } else {
                console.error("Error fetching subcategories_ajax:", response.message);
            }
        },
        error: function(error) {
            console.error("AJAX error:", error);
        }
    });
}


function loadProducts(subcategoryId) {
    $.ajax({
        url: './php/fetchProducts.php',
        type: 'POST',
        data: { subcategory_id: subcategoryId },
        dataType: 'json',
        success: function(response) {
            if(response.status === "success") {
                let productsDropdown = $("#productDropdown");
                // Clear previous entries
                productsDropdown.empty();
                response.products.forEach(product => {
                    productsDropdown.append(`<option value="${product.id}">${product.name}</option>`);
                });
            }else {
                console.error("Error fetching products_ajax", response.message);
            }
        },
        error: function(error) {
            console.error("Failed to fetch products:", error);
        }
    });
}
