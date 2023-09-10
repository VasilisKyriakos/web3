console.log("Script is loaded");

window.onload = function() {  

    $(function(){
        $("#navbar-placeholder").load("navbar.html");
     });

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
    
}

   

    






