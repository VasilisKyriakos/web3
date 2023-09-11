let discountChart; 
let avgDiscountChart;


$(document).ready(function() {
    initEmptyChart();  // Initialize an empty chart on page load
    initEmptyAvgDiscountChart();
    loadCategories();

    $('#categoryDropdown').on('change', function() {
        const selectedCategoryId = $(this).val();
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
        type: 'line',  // Line chart for displaying trends
        data: {
            labels: [],  // Days of the week
            datasets: [{
                label: 'Average Discount %',
                data: [],  
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 100,  // Assuming maximum percentage is 100%
                    ticks: {
                        // Include a sign for the percentage
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

/*

$("#btnPrevWeek").click(function() {
    weekOffset--;
    fetchDataAndUpdateChart();
});

$("#btnNextWeek").click(function() {
    weekOffset++;
    fetchDataAndUpdateChart();
});
*/

function updateAvgDiscountChart(data) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const avgDiscountPercent = data.avg_difference_over_week;  // Assumes the data returns the average discount per day of the week

    avgDiscountChart.data.labels = daysOfWeek;
    avgDiscountChart.data.datasets[0].data = avgDiscountPercent;
    avgDiscountChart.update();
}


