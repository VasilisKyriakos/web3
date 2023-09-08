
$(function(){
    $("#navbar-placeholder").load("navbar.html");
 });
 

function sendData() {
  const fileInput = document.getElementById('dataFile');
  const file = fileInput.files[0];

  if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
          const fileContent = e.target.result;

          $.ajax({
              url: './php/uploadData.php',
              type: 'POST',
              data: { content: fileContent },
              success: function(response) { 
                  console.log("Response from server:", response);
                  showAlert(response, "success");

              },
              error: function(err) {
                  console.error("AJAX Error:", err);
              }
          });
      }

      reader.onerror = function(error) {
          console.error("File Reading Error:", error);  
      };

      reader.readAsText(file);
  } else {
      console.error("No file selected!");
  }
}




function sendDataShops() {
  const fileInput = document.getElementById('shopsFile');
  const file = fileInput.files[0];

  if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
          const fileContent = e.target.result;

          $.ajax({
              url: './php/uploadShops.php',
              type: 'POST',
              data: { content: fileContent },
              success: function(response) { 
                  console.log("Response from server:", response);
                  showAlert(response, "success");
              },
              error: function(err) {
                  console.error("AJAX Error:", err);
              }
          });
      }

      reader.onerror = function(error) {
          console.error("File Reading Error:", error);  
      };

      reader.readAsText(file);
  } else {
      console.error("No file selected!");
  }
}


$(document).ready(function() {
    $('#deleteShops').click(function() {
        if (confirm('Are you sure you want to delete everything? This action cannot be undone.')) {
            $.ajax({
                url: './php/deleteShops.php',
                type: 'POST',
                dataType: 'json',
                success: function(response) {
                    showAlert(response.message, "warning");
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        }
    });
});


$(document).ready(function() {
    $('#deleteData').click(function() {
        if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
            $.ajax({
                url: './php/deleteData.php',
                type: 'POST',
                dataType: 'json',
                success: function(response) {
                    showAlert(response.message, "warning");
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        }
    });
});



function showAlert(message, type) {

    //const alertTypes = ['success', 'danger', 'info', 'warning'];
    const alertHtml = `<div class="alert alert-${type}">${message}</div>`;
    $('#alert-placeholder').html(alertHtml);
    setTimeout(() => {
        $('#alert-placeholder .alert').alert('close');
    }, 4000);
}

