console.log("Script is loaded");

window.onload = function() {  

    $(function(){
        $("#navbar-placeholder").load("navbar.html");
    });

    fetchUsers();
   
     // Function to fetch and display user data
    function fetchUsers() {
        $.ajax({
            url: './php/fetch/fetchSortedUsers.php',
            type: 'GET', // Use GET or POST based on your PHP script
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    // Assuming you have a <tbody> element with the id "userTableBody"
                    let tbody = $('#userTableBody');
                    tbody.empty(); // Clear existing table rows

                    // Iterate through the user data and append rows to the table
                    response.data.forEach(function (user) {
                        let row = `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.email}</td>
                                <td>${user.username}</td>
                                <td>${user.total_points}</td>
                                <td>${user.monthly_points}</td>
                                <td>${user.tokens}</td>
                                <td>${user.total_tokens}</td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                } else {
                    console.error(response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Fetching users failed:", textStatus, errorThrown);
            }
        });
    }
}   

    






