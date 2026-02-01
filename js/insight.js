// This function runs as soon as the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadCategoryInsightData();
});

// This function fetches data from our server and shows it in the chart
function loadCategoryInsightData() {
  const token = localStorage.getItem("access_token");
  const headers = {};

  // If user is logged in, we add their token to the request
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  // Fetch the category counts from the backend API
  fetch(API_URL + "/issues/category-count", { headers: headers })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // 1. Calculate the TOTAL number of issues
      let totalIssues = 0;
      const categories = Object.keys(data);

      categories.forEach(function (cat) {
        totalIssues = totalIssues + data[cat];
      });

      // 2. Prepare the labels and colors for our chart
      const chartLabels = [];
      const chartValues = [];
      const chartColors = [];

      // A list of colors for each category
      const colorMap = {
        "harassment": "#ff4757",
        "bullying": "#ffa502",
        "discrimination": "#3498db",
        "favoritism": "#1abc9c",
        "others": "#9b59b6",
        "other": "#9b59b6"
      };

      categories.forEach(function (name) {
        // Add the Name (with capital letter) to labels
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        chartLabels.push(capitalizedName);

        // Add the Count to values
        chartValues.push(data[name]);

        // Add the Color to colors
        const color = colorMap[name.toLowerCase()] || "#8ba0e8";
        chartColors.push(color);

        // 3. Update the percentage text inside the cards on the page
        const elementId = "percent-" + name.toLowerCase();
        const textElement = document.getElementById(elementId);

        if (textElement) {
          if (totalIssues > 0) {
            const percent = Math.round((data[name] / totalIssues) * 100);
            textElement.textContent = percent + "%";
          } else {
            textElement.textContent = "0%";
          }
        }
      });

      // 4. Create the Doughnut Chart
      const canvasElement = document.getElementById("categoryPieChart");
      if (!canvasElement) return;

      const ctx = canvasElement.getContext("2d");

      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: chartLabels,
          datasets: [{
            data: chartValues,
            backgroundColor: chartColors,
            borderWidth: 0,
            hoverOffset: 15
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          layout: {
            padding: 30
          },
          plugins: {
            legend: {
              position: "bottom"
            }
          }
        }
      });
    })
    .catch(function (error) {
      console.error("Oops! Something went wrong loading the data:", error);
    });
}