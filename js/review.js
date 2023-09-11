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
                    //let likeBtn = discount.in_stock === '1' 
                    //? `<button class="btn btn-sm btn-light" onclick="updateLikes(${discount.discount_id}, 'like')"><i class="fas fa-thumbs-up"></i> ${discount.likes}</button>` 
                    //: `<button class="btn btn-sm btn-light" disabled><i class="fas fa-thumbs-up"></i> ${discount.likes}</button>`;
                    //let dislikeBtn = discount.in_stock === '1' ? `<button class="btn btn-sm btn-light" onclick="updateLikes(${discount.discount_id}, 'dislike')"><i class="fas fa-thumbs-down"></i> ${discount.dislikes}</button>` : `<button class="btn btn-sm btn-light" disabled><i class="fas fa-thumbs-down"></i> ${discount.dislikes}</button>`;
                    

                    let likeBtn = `
                    <button id="like-btn-${discount.discount_id}" class="btn btn-sm btn-light" onclick="updateLikes(${discount.discount_id}, 'like')" ${discount.in_stock === '0' ? 'disabled' : ''}>
                        <i class="fas fa-thumbs-up"></i> ${discount.likes}
                    </button>`;
                    
                    let dislikeBtn = `
                    <button id="dislike-btn-${discount.discount_id}" class="btn btn-sm btn-light" onclick="updateLikes(${discount.discount_id}, 'dislike')" ${discount.in_stock === '0' ? 'disabled' : ''}>
                        <i class="fas fa-thumbs-down"></i> ${discount.dislikes}
                    </button>`;
                    

                    let stockBtn = `<button id="stock-btn-${discount.discount_id}" class="btn btn-sm ${discount.in_stock === '1' ? 'btn-success' : 'btn-danger'}" onclick="toggleStock(${discount.discount_id})">${discount.in_stock === '1' ? 'In Stock' : 'Out of Stock'}</button>`;
                    
                    rowsHtml += `
                        <tr>
                            <td>${discount.discount_id}</td>
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


function updateLikes(discountId, typeL) {
    console.log("discountId",discountId);
    console.log("type",typeL);
    
    $.ajax({
        url:"./php/updateLikes.php", 
        type: 'POST',
        data: {
            discount_id: discountId,
            type: typeL
        },

        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                console.log("Succes:" + response.message);
                fetchDiscountsForShop(fetchShopId()); // Refetch to update numbers
            } else {
                console.error(response.message);
                alert('Error updating likes/dislikes.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error("Request failed: " + textStatus, errorThrown);
        }
    });
}0    




function toggleStock(discountId) {
    console.log("Toggling stock for:", discountId);

    const currentStock = $(`#stock-btn-${discountId}`).hasClass('btn-success'); // returns true or false
    
    const newStock = currentStock ? '0' : '1'; // adjusted this line

    $.ajax({
        url: "./php/updateStock.php",
        type: 'POST',
        data: {
            discount_id: discountId,
            in_stock: newStock
        },
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                // Update the buttons directly
                if (newStock === '1') {
                    $(`#stock-btn-${discountId}`).removeClass('btn-danger').addClass('btn-success').text('In Stock');
                    
                    // Enable like and dislike buttons
                    $(`#like-btn-${discountId}`).prop('disabled', false);
                    $(`#dislike-btn-${discountId}`).prop('disabled', false);
                } else {
                    $(`#stock-btn-${discountId}`).removeClass('btn-success').addClass('btn-danger').text('Out of Stock');
                    
                    // Disable like and dislike buttons
                    $(`#like-btn-${discountId}`).prop('disabled', true);
                    $(`#dislike-btn-${discountId}`).prop('disabled', true);
                }
            } else {
                console.error(response.message);
                alert('Error updating stock status.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Request failed: " + textStatus, errorThrown);
        }
    });
}

