console.log("Script is loaded");

window.onload = function() {  

    $(function(){
        $("#navbar-placeholder").load("navbar.html");
     });
     
    // Initialize Leaflet map
    // Patras Location --> [38.24663003171079, 21.735297957672223]
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    processSystemTokens();
    processExpiredBids();
    loadShopsDiscounts();
    loadShops();
    loadCategories();
 
    // Locate the user
    map.locate({setView: true, maxZoom: 16});
    
    var personIcon = L.icon({
        iconUrl: './js/person.png', // update this to your icon's path
        iconSize: [38, 95], // size of the icon, adjust accordingly
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    function onLocationFound(e) {
        var radius = e.accuracy;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, radius).addTo(map);
    }
    map.on('locationfound', onLocationFound);


    function onLocationError(e) {
        alert(e.message);
    }
    map.on('locationerror', onLocationError);


    
    var allShops = []; // Array to hold all markers    
    function loadShops() {
        $.ajax({
            url: './php/fetchShops.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    allShops = response.data;
                } else {
                    console.error("Failed to fetch shops: ", response.message);
                }
            }
        });
    }

    function clearMarkers(){
        allMarkers.forEach(marker => marker.remove());
            allMarkers = [];
    }

    function processSystemTokens(){
        $.ajax({
            url: './php/updates/tokenControll.php', // Change this to the path of your PHP file
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if(response.status === "success") {
                    console.log("Successfull update.");
                    
                } else {
                    console.error("Error", response.message);
                }
            },
            error: function(error) {
                console.error("Ajax error:", error);
            }
        });
    }

    function processExpiredBids() {
        $.ajax({
            url: './php/renewDiscounts.php', // Change this to the path of your PHP file
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if(response.status === "success") {
                    console.log("Successfully processed expired bids.");
                    
                    if(response.updated.length) {
                        console.log("Updated records with IDs:", response.updated.join(', '));
                    }
                    if(response.deleted.length) {
                        console.log("Deleted records with IDs:", response.deleted.join(', '));
                    }
                } else {
                    console.error("Error processing bids:", response.message);
                }
            },
            error: function(error) {
                console.error("Ajax error:", error);
            }
        });
    }
    
        
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

    
    function fetchShopsForCategory(categoryName) {

        var discountIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        $.ajax({
            url: './php/fetchShopForCategory.php',
            type: 'GET',
            data: { category_id: categoryName },
            dataType: 'json',
            success: function(response) {
                if(response.status === "success") {
                    if (response && response.shops && response.shops.length > 0) {
                        response.shops.forEach(shop => {
                            console.log("fetchShopsForCategory: " + shop.name);
                            console.log("fetchshopsLat: " + shop.lat);

                            var popupContentInitial = `
                            <div>
                                <strong>${shop.name || "Shop"}</strong><br>
                                <a href="./addDiscount.html?shopId=${shop.id}" 
                                class="btn btn-sm btn-primary" 
                                style="color: white;">Add Discount</a>
                            </div>
                            `;
                        
                            var marker = L.marker([shop.lat, shop.lon], { 
                                icon: discountIcon 
                            })
                            .addTo(map)
                            .bindPopup(popupContentInitial);
                
                            marker.shopData = shop;
                            allMarkers.push(marker);
                
                            marker.on('click', function() {
                                console.log("Clicked shopId:", shop.id);
                                localStorage.setItem('shopId', shop.id);
                
                                
                                fetchDiscountsForShop(shop.id,categoryName, function(popupContentWithDiscounts) {
                                    marker.setPopupContent(popupContentWithDiscounts).openPopup();
                                });
                                
                            });
                        });
                    }
                    // Handle the data - for example, display the shops on a map
                    //displayShopsOnMap(response.shops); // Assuming you have a function that can display these shops on a map
                } else {
                    console.error("Error fetching shops for category:", response.message);
                }
            },
            error: function(error) {
                console.error("AJAX error:", error);
            }
        });
    }

    //Function that triggers when category from index is selected
    $('#categoryDropdown').on('change', function() {
            clearMarkers();
            const selectedCategory = $(this).val();
    
            // If default option is selected, you might want to skip the AJAX call
            if (selectedCategory === 'defaultCategory') {
                return;
            }
            console.log("Category change:" + selectedCategory);
            fetchShopsForCategory(selectedCategory)
        });
    
    


    var allMarkers = []; // Array to hold all markers    
    var discountShops = []; // Array to hold all markers    

    function loadShopsDiscounts() {
        $.ajax({
            url: './php/fetchShopsDiscounts.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    allMarkers.forEach(marker => marker.remove());
                    allMarkers = [];
                    discountShops = [];
                    console.log(response.data);
                    response.data.forEach(function(shop) {
                        var popupContent = `
                        <div>
                            <strong>${shop.name || "Shop"}</strong><br>
                            <a href="./addDiscount.html?shopId=${shop.id}" 
                               class="btn btn-sm btn-primary" 
                               style="color: white;">Add Discount</a>
                        </div>
                    `;

                    var greenIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                      });
                      
                                       
                    var marker = L.marker([shop.lat, shop.lon], {icon: greenIcon})
                        .addTo(map)
                        .bindPopup(popupContent);

                    marker.shopData = shop;
                    allMarkers.push(marker);
                    discountShops.push(marker);


                    // You would add an event listener to the marker:
                    marker.on('click', function() {
                        console.log("Clicked shopId:", shop.id);
                        localStorage.setItem('shopId', shop.id);
                    });

                    fetchDiscountsForShop(shop.id,null, function(popupContentWithDiscounts) {
                        marker.setPopupContent(popupContentWithDiscounts);
                    });

                    });
                } else {
                    console.error("Failed to fetch shops: ", response.message);
                }
            }
        });
    }

    
    document.getElementById("shopSearch").addEventListener("input", function() {
        var searchTerm = this.value.toLowerCase();
        var matchingShops = allShops.filter(shop => shop.name.toLowerCase().includes(searchTerm));
    
        var uniqueShopNames = [...new Set(matchingShops.map(shop => shop.name))];
    
        var dropdown = document.getElementById("shopDropdown");
        dropdown.innerHTML = ""; // Clear previous results
    
        uniqueShopNames.forEach(name => {
            var item = document.createElement("div");
            item.innerText = name;
            item.addEventListener("click", function() {
                document.getElementById("shopSearch").value = name;
                selectedShopName = name;
                dropdown.style.display = "none";
            });
            dropdown.appendChild(item);
        });
    
        dropdown.style.display = uniqueShopNames.length ? "block" : "none";
    });
    
    

    document.getElementById("btnSearch").addEventListener("click", function() {

        if (selectedShopName) {
    
            // Add markers for shops that match the selected name
            var matchingShops = allShops.filter(shop => shop.name === selectedShopName);

            // Remove all markers
            allMarkers.forEach(marker => marker.remove());
            allMarkers = []; 
    
            // Define icons
            var defaultIcon = new L.Icon.Default();
            var discountIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            matchingShops.forEach(function(shop) {
                var popupContentInitial = `
                        <div>
                            <strong>${shop.name || "Shop"}</strong><br>
                            <a href="./addDiscount.html?shopId=${shop.id}" 
                               class="btn btn-sm btn-primary" 
                               style="color: white;">Add Discount</a>
                        </div>
                    `;
    
                var hasDiscount = discountShops.some(marker => marker.shopData.id === shop.id);
    
                var marker = L.marker([shop.lat, shop.lon], { 
                    icon: hasDiscount ? discountIcon : defaultIcon 
                })
                .addTo(map)
                .bindPopup(popupContentInitial);
    
                marker.shopData = shop;
                allMarkers.push(marker);
    
                marker.on('click', function() {
                    console.log("Clicked shopId:", shop.id);
                    localStorage.setItem('shopId', shop.id);
    
                    if (hasDiscount) {
                        fetchDiscountsForShop(shop.id,null, function(popupContentWithDiscounts) {
                            marker.setPopupContent(popupContentWithDiscounts).openPopup();
                        });
                    }
                });
            });
    
            // Optionally, set the view to the first shop with that name (if exists)
            if (matchingShops[0]) {
                map.setView([matchingShops[0].lat, matchingShops[0].lon], 15);
                //allMarkers[0].openPopup();
            }
        }
    });  

    

// Function to fetch discounts for a shop and return the constructed popup content

function fetchDiscountsForShop(shopId, categoryId, callback) {

    $.ajax({
        url: './php/fetchDiscountForShops.php',
        type: 'GET',
        data: { shop_id: shopId, category_id: categoryId},
        dataType: 'json',
        success: function(response) {
            if(response.status === "success" && response.data.length > 0) {
                var discountDetails = `<div class="discount-container">`;
                response.data.forEach(discount => {
                    let criteriaIcon = discount.satisfying_criteria == 1 
                        ? '<i class="fas fa-check-circle text-success"></i>' 
                        : '<i class="fas fa-times-circle text-danger"></i>';
                    discountDetails += `
                    <ul class="list-group mt-2">
                        <li class="list-group-item"><strong>Product:</strong> ${discount.product_name}</li>
                        <li class="list-group-item"><strong>Price:</strong> ${discount.price}</li>
                        <li class="list-group-item"><strong>Date:</strong> ${discount.date_of_entry}</li>
                        <li class="list-group-item"><strong>Likes:</strong> ${discount.likes} / <strong>Dislikes:</strong> ${discount.dislikes}</li>
                        <li class="list-group-item"><strong>Stock:</strong> ${discount.in_stock === '1' ? 'Yes' : 'No'}</li>
                        <li class="list-group-item"><strong>Criteria Satisfaction:</strong> ${criteriaIcon}</li>
                    </ul>
                `;
                });

                var popupContent = `
                <div class="card border-0">
                    <div class="card-body">
                        <h5 class="card-title">${response.data[0].name || "Shop"}</h5>
                        ${discountDetails}
                        <div class="mt-3">
                            <a href="./addDiscount.html?shopId=${shopId}" class="btn btn-success text-white btn-sm">Add Discount</a>
                            <a href="./reviewDiscounts.html?shopId=${shopId}" class="btn btn-success text-white btn-sm ml-2">Review</a>
                        </div>
                    </div>
                </div>
            `;

                callback(popupContent);
            } else {
                console.error("No discounts found or error:", response.message);
            }
        },
        error: function(error) {
            console.error("AJAX error:", error);
        }
    });
}


}

   

    






