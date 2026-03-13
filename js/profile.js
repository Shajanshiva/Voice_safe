document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");
  let userId = localStorage.getItem("user_id"); // Initial ID from storage
  let userEmail = ""; // To store the email for update

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Load User Profile
  try {
    const profileResponse = await fetch(`${API_URL}/users/me/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = await profileResponse.json();

    if (user) {
      userId = user.user_id; // Get the definitive ID from the server
      document.getElementById("welcomeGreeting").innerText =
        `Welcome, ${user.full_name}!`;
      document.getElementById("fullName").value = user.full_name || "";
      userEmail = user.email || ""; // Store the email

      // Check if email field exists before setting value
      const emailField = document.getElementById("email");
      if (emailField) {
        emailField.value = userEmail;
      }
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
  }

  // Load User Issues
  try {
    const issuesResponse = await fetch(`${API_URL}/issues/user/my-issues`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const issues = await issuesResponse.json();

    const container = document.getElementById("myPostsContainer");
    const postsCountElement = document.getElementById("totalPostsCount");
    container.innerHTML = "";

    if (!issues || issues.length === 0) {
      container.innerHTML = "<p>You haven't posted any issues yet.</p>";
      postsCountElement.innerText = "0";
    } else {
      postsCountElement.innerText = issues.length;
      issues.reverse().forEach((issue) => {
        const div = document.createElement("div");
        div.className = "post-item-card";
        const catClass = `cat-${issue.category_name.toLowerCase().replace(/\s+/g, "-")}`;

        div.innerHTML = `
                <h3>${issue.title}</h3>
                <p>${issue.description.substring(0, 150)}${issue.description.length > 150 ? "..." : ""}</p>
                <span class="category-badge ${catClass}">${issue.category_name}</span>
            `;
        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error("Error fetching issues:", err);
  }

  // Update Profile Form Submission
  document.getElementById("editProfileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value;
    const password = document.getElementById("password").value;

    const updateData = {
      full_name: fullName,
      email: userEmail, // Use the stored email
      password: password || null,
    };

    try {
      if (!userId) {
        alert("User ID missing. Please log in again.");
        return;
      }

      const updateResponse = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await updateResponse.json();

      if (updateResponse.ok) {
        alert(data.message || "Profile updated successfully!");
        document.getElementById("welcomeGreeting").innerText = `Welcome, ${fullName}!`;
      } else {
        alert(data.detail || data.message || "Update failed");
      }
    } catch (err) {
      alert("Update failed");
      console.error("Update profile error:", err);
    }
  });
});
