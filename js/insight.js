document.addEventListener("DOMContentLoaded", function () {
  loadCategoryInsightData();
});

function loadCategoryInsightData() {
  const token = localStorage.getItem("access_token");
  const headers = {};

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  fetch(API_URL + "/issues/category-count", { headers: headers })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let totalIssues = 0;
      const categories = Object.keys(data);

      categories.forEach(function (cat) {
        totalIssues = totalIssues + data[cat];
      });

      const chartLabels = [];
      const chartValues = [];
      const chartColors = [];

      const colorMap = {
        "harassment": "#ff4757",
        "bullying": "#ffa502",
        "discrimination": "#3498db",
        "favoritism": "#1abc9c",
        "others": "#9b59b6",
        "other": "#9b59b6"
      };

      categories.forEach(function (name) {
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        chartLabels.push(capitalizedName);

        chartValues.push(data[name]);

        const color = colorMap[name.toLowerCase()] || "#8ba0e8";
        chartColors.push(color);

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