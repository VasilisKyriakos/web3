document.addEventListener("DOMContentLoaded", function() {
    const shopId = fetchShopId();
    if (!shopId) {
        alert('Shop ID not retrieved.');
        return;
    }

    fetchDiscountsForShop(shopId);
});

function fetchShopId() {
    let retrievedShopId = localStorage.getItem('shopId');
    console.log("Retrieved Shop ID:", retrievedShopId);
    return retrievedShopId;
}

function fetchDiscountsForShop(shopId) {
    $.ajax({
        url: './php/fetchDiscountForShops.php',
        type: 'GET',
        data: { shop_id: shopId },
        dataType: 'json',
        success: function(response) {
            if (response.status === "success" && response.data.length > 0) {
                const tableBody = document.getElementById('discount-table').querySelector('tbody');
                document.getElementById('shop-name').textContent = response.data[0].name || "Shop";

                let rowsHtml = '';
                
                response.data.forEach(discount => {
                    let likeBtn = discount.in_stock === '1' 
                    ? `<button class="btn btn-sm btn-light" onclick="updateLikes(${discount.id}, 'like')"><i class="fas fa-thumbs-up"></i> ${discount.likes}</button>` 
                    : `<button class="btn btn-sm btn-light" disabled><i class="fas fa-thumbs-up"></i> ${discount.likes}</button>`;
                                    let dislikeBtn = discount.in_stock === '1' ? `<button class="btn btn-sm btn-light" onclick="updateLikes(${discount.id}, 'dislike')"><i class="fas fa-thumbs-down"></i> ${discount.dislikes}</button>` : `<button class="btn btn-sm btn-light" disabled><i class="fas fa-thumbs-down"></i> ${discount.dislikes}</button>`;
                    let stockBtn = `<button class="btn btn-sm ${discount.in_stock === '1' ? 'btn-success' : 'btn-danger'}" onclick="toggleStock(${discount.id})">${discount.in_stock === '1' ? 'In Stock' : 'Out of Stock'}</button>`;
                    
                    rowsHtml += `
                        <tr>
                            <td>${discount.id}</td>
                            <td>${discount.name}</td>
                            <td>${discount.product_name}</td>
                            <td>${discount.price}</td>
                            <td>${discount.date_of_entry}</td>
                            <td>${likeBtn} ${dislikeBtn}</td>
                            <td>${stockBtn}</td>
                        </tr>
                    `;
                });
                

                tableBody.innerHTML = rowsHtml;
            } else {
                alert("No discounts found or error:", response.message);
            }
        },
        error: function(error) {
            console.error("AJAX error:", error);
            alert('An error occurred while fetching data.');
        }
    });
}


function updateLikes(discountId, type) {
    console.log("discountId",discountId);
    console.log("type",type);
    
    $.post("./php/updateLikes.php", {
        discount_id: discountId,
        type: type
    }, function(response) {
        if (response.status === "success") {
            fetchDiscountsForShop(fetchShopId()); // Refetch to update numbers
        } else {
            console.error(response.message);
            alert('Error updating likes/dislikes.');
        }
    }, "json");
}

function toggleStock(discountId) {
    const currentStock = $(`#stock-btn-${discountId}`).hasClass('btn-success') ? '1' : '0';
    const newStock = currentStock === '1' ? '0' : '1';
    
    $.post("./php/updateStock.php", {
        discount_id: discountId,
        in_stock: newStock
    }, function(response) {
        if (response.status === "success") {
            fetchDiscountsForShop(fetchShopId()); // Refetch to update stock status
        } else {
            console.error(response.message);
            alert('Error updating stock status.');
        }
    }, "json");
}
