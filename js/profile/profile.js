console.log("Script is loaded");

window.onload = function() {  

    $(function(){
        $("#navbar-placeholder").load("navbar.html");
     });
    fetchDiscounds();
    document.getElementById('updateProfileBtn').addEventListener('click', updateProfile);

    function updateProfile(){
        let username = $('#edit-username').val();
        let password = $('#edit-password').val();

        // Here, we could add client-side validation for the password, but remember server-side validation is essential!
        
        $.ajax({
            url: './php/userAuthentication/updateUser.php',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(response) {
                if (response.includes('Registration successful!')) {
                    alert('Updated successfully.');
                    $("#navbar-placeholder").load("navbar.html");
                } else {
                    alert(response);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Update failed:", textStatus, errorThrown);
            }
        });
    }

    function fetchDiscounds(){
        $.ajax({
            url: './php/fetch/fetchDiscountsForUser.php', // Replace with the correct path to your PHP script
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                console.log("Response received:", response); // Log the response

                if (response.status === 'success') {
                    // Assuming you have a <table> element with the id "discounts-table"
                    let tbody = $('#offers-table-body');
                    // Clear existing table rows
                    tbody.empty();

                    // Iterate through the discounts and append rows to the table
                    response.data.forEach(function(discount) {
                        let row = `
                            <tr>
                                <td>${discount.discount_id}</td>
                                <td>${discount.shop_id}</td>
                                <td>${discount.product_name}</td>
                                <td>${discount.price}</td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                } else {
                    console.error(response.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Fetching discounts failed:", textStatus, errorThrown);
            }
        });
    }
    
}

   

    






