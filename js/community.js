document.addEventListener("DOMContentLoaded", loadIssues);

function loadIssues() {
  fetch(`${API_URL}/issues/`)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("storiesContainer");
      if (!container) return;

      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No issues reported yet. Be the first to share your story!</p>";
        return;
      }

      // Reverse data to show latest posts first
      data.reverse().forEach(issue => {
        const storyDiv = document.createElement("div");

        // Map category name to CSS class for gradient headers
        const category = issue.category_name ? issue.category_name.toLowerCase().replace(/\s+/g, '-') : 'default';
        const catClass = `cat-${category}`;
        storyDiv.className = `story ${catClass}`;

        storyDiv.innerHTML = `
                <div class="story-header">
                    <span class="category-label">${issue.category_name || 'Issue'}</span>
                    <h3>${issue.title}</h3>
                </div>
                <div class="story-body">
                    <p>${issue.description}</p>
                </div>
            `;

        container.appendChild(storyDiv);
      });
    })
    .catch(error => {
      console.error("Error loading issues:", error);
      const container = document.getElementById("storiesContainer");
      if (container) {
        container.innerHTML = "<p>Failed to load stories. Please try again later.</p>";
      }
    });
}