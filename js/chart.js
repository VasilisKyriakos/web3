let discountChart; 
let avgDiscountChart;


$(document).ready(function() {
    initEmptyChart();  // Initialize an empty chart on page load
    initEmptyAvgDiscountChart();
    loadCategories();
    checkButtonsState();

    let selectedCategoryId = null;

    $('#categoryDropdown').on('change', function() {
     selectedCategoryId = $(this).val();

        console.log(selectedCategoryId);
        // Check if the default option is selected; if yes, you can either clear the chart or do nothing.
        if (selectedCategoryId === "defaultCategory") {
            // Clear the chart or do nothing
            return;
        }
        // Reset weekOffset when changing category
        weekOffset = 0;
        // Fetch data and update the chart
        fetchDataAndUpdateAvgDiscountChart(selectedCategoryId);
    });


        // Event listener for the "Previous Week" button
    document.getElementById('prevWeek').addEventListener('click', function() {
        console.log(selectedCategoryId)
        weekOffset++;  // Decrement the week offset
        fetchDataAndUpdateAvgDiscountChart(selectedCategoryId);  // Fetch and update the chart for the new week
        updateWeekLabel();  // Update the week label
        checkButtonsState();  // Check if buttons should be enabled or disabled
    });

    // Event listener for the "Next Week" button
    document.getElementById('nextWeek').addEventListener('click', function() {
      
        weekOffset--;  
        fetchDataAndUpdateAvgDiscountChart(selectedCategoryId);  
        updateWeekLabel(); 
        checkButtonsState(); 
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

function getNumberOfDays(year, month) {
    return new Date(year, month, 0).getDate();  // Using '0' as day will give us the last day in the previous month, which is the total number of days in our target month
}

function initEmptyChart() {
    const ctx = document.getElementById('discountChart').getContext('2d');
    discountChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],  
            datasets: [{
                label: 'Number of Discounts',
                data: [],  
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });
}


function fetchDataAndUpdateDiscountChart() {
    const year = $('#year').val();
    const month = $('#month').val();

    $.ajax({
        url: './php/fetchDiscountsForChart.php',
        type: 'GET',
        data: { year: year, month: month },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                updateDiscountChart(year, month, response.data);
            } else {
                console.error("Error fetching data:", response.message);
            }
        },
        error: function(error) {
            console.error("AJAX error:", error);
        }
    });
}



function updateDiscountChart(year, month, data) {
    const numberOfDays = getNumberOfDays(year, month);
    const days = Array.from({ length: numberOfDays }, (_, i) => (i + 1).toString());
    
    const discountCounts = new Array(numberOfDays).fill(0);  // Initialize with zeros

    data.forEach(item => {
        const day = parseInt(item.date_of_entry.split('-')[2]);
        discountCounts[day - 1] = item.number_of_discounts;  // Update the count for the days with data
    });

    discountChart.data.labels = days;
    discountChart.data.datasets[0].data = discountCounts;
    discountChart.update();
}



function initEmptyAvgDiscountChart() {
    const ctx = document.getElementById('avgDiscountChart').getContext('2d');
    avgDiscountChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],  // Days of the week
            datasets: [{
                label: 'Average Discount %',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Fill color
                borderColor: 'rgba(255, 99, 132, 1)',  // Line color
                borderWidth: 1,
                fill: true,  // Fill the area under the line
                tension: 0.4  // Add a curve to the line
            }]
        },
        options: {
            scales: {
                y: {
                    min: -100,
                    max: 200,
                    ticks: {
                        callback: function(value, index, values) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}




let weekOffset = 0;  // Current week is the default

function fetchDataAndUpdateAvgDiscountChart(categoryId) {
    $.ajax({
        url: './php/fetchDiscountsPercentage.php',
        type: 'GET',
        data: { category_id: categoryId, week_offset: weekOffset },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                console.log(response.data);
                updateAvgDiscountChart(response.data);
            } else {
                console.error("Error fetching data:", response.message);
            }
        },
        error: function(error) {
            console.error("AJAX error:", error);
        }
    });
}

function updateAvgDiscountChart(data) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const avgDiscountPercent = data.avg_discount_percent;  // Assumes the data returns the average discount per day of the week

    avgDiscountChart.data.labels = daysOfWeek;
    avgDiscountChart.data.datasets[0].data = avgDiscountPercent;
    avgDiscountChart.update();
}




// Function to update the week label based on the weekOffset
function updateWeekLabel() {
    const label = document.getElementById('weekLabel');
    if (weekOffset === 0) {
        label.textContent = "Current Week";
    } else if (weekOffset === -1) {
        label.textContent = "Last Week";
    } else if (weekOffset < 0) {
        label.textContent = `${Math.abs(weekOffset)} Weeks Ago`;
    } else {
        label.textContent = `${weekOffset} Weeks Ahead`;
    }
}

// Function to check if the "Previous Week" or "Next Week" buttons should be enabled or disabled
function checkButtonsState() {
    const prevWeekButton = document.getElementById('prevWeek');
    const nextWeekButton = document.getElementById('nextWeek');
    
    // Example logic: Disable the "Next Week" button if we're looking at the current week
    if (weekOffset === 0) {
        nextWeekButton.disabled = true;
    } else {
        nextWeekButton.disabled = false;
    }
    
    // Add any other conditions as needed
}







