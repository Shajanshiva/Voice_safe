document.addEventListener("DOMContentLoaded", loadIssues);

function loadIssues() {
  fetch("http://127.0.0.1:8000/issues/")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("storiesContainer");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No issues reported yet.</p>";
        return;
      }

      data.forEach(issue => {
        const storyDiv = document.createElement("div");
        storyDiv.className = "story";

        storyDiv.innerHTML = `
          <div class="story-header">
            <span class="tag">${issue.category_name}</span>
            <span class="time">Anonymous</span>
          </div>

          <h3>${issue.title}</h3>

          <p>${issue.description.substring(0, 200)}...</p>

          <div class="story-footer">
            <div class="actions">
              <span>👍 Support</span>
            </div>
            <button class="btn-read">Read More</button>
          </div>
        `;

        container.appendChild(storyDiv);
      });
    })
    .catch(error => {
      console.error("Error loading issues:", error);
    });
}
