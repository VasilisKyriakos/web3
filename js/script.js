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

    loadShopsDiscounts();
    loadShops();

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
                        fetchDiscountsForShop(shop.id, function(popupContentWithDiscounts) {
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
    function fetchDiscountsForShop(shopId, callback) {
        $.ajax({
            url: './php/fetchDiscountForShops.php',
            type: 'GET',
            data: { shop_id: shopId },
            dataType: 'json',
            success: function(response) {
                if(response.status === "success" && response.data.length > 0) {
                    var discountDetails = '';
                    response.data.forEach(discount => {
                        discountDetails += `
                            <div>
                                Product: ${discount.product_name}<br>
                                Price: ${discount.price}<br>
                                Date: ${discount.date_of_entry}<br>
                                Likes: ${discount.likes} / Dislikes: ${discount.dislikes}<br>
                                Stock: ${discount.in_stock === '1' ? 'Yes' : 'No'}
                            </div>
                        `;
                    });

                    var popupContent = `
                        <div>
                            <strong>${response.data[0].shop_name || "Shop"}</strong><br>
                            ${discountDetails}
                            <a href="./addDiscount.html?shopId=${shopId}" class="btn btn-sm btn-primary" style="color: white;">Add Discount</a>
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

   

    






