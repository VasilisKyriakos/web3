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

    loadShops();

    // Locate the user
    map.locate({setView: true, maxZoom: 16});
    
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


    var allMarkers = []; // Array to hold all markers    
    function loadShops() {
        $.ajax({
            url: './php/fetchShops.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    allMarkers.forEach(marker => marker.remove());
                    allMarkers = [];
                    console.log(response.data);
                    response.data.forEach(function(shop) {
                        var marker = L.marker([shop.lat, shop.lon])
                            .addTo(map)
                            .bindPopup(shop.name || "Shop");
    
                        marker.shopData = shop;
                        allMarkers.push(marker);
                    });
                } else {
                    console.error("Failed to fetch shops: ", response.message);
                }
            }
        });
    }

    
    // Filter function for dropdown
    document.getElementById("shopSearch").addEventListener("input", function() {
        var searchTerm = this.value.toLowerCase();
        var matchingShops = allMarkers.filter(marker => 
            marker.shopData.name.toLowerCase().includes(searchTerm)
        );

        var uniqueShopNames = [...new Set(matchingShops.map(marker => marker.shopData.name))];

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
    

    // Search button function to focus on selected shops by name
    document.getElementById("btnSearch").addEventListener("click", function() {
        if (selectedShopName) {
            // Remove all markers
            allMarkers.forEach(marker => marker.remove());

            // Add markers for shops that match the selected name
            var matchingMarkers = allMarkers.filter(marker => marker.shopData.name === selectedShopName);
            matchingMarkers.forEach(marker => marker.addTo(map));

            map.on('locationfound', onLocationFound);

            // Optionally, set the view to the first shop with that name (if exists)
            if (matchingMarkers[0]) {
                map.setView(matchingMarkers[0].getLatLng(), 15);
                matchingMarkers[0].openPopup();
            }
        }
    });
}

   

    






