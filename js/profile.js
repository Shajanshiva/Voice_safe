document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    if (!token) {
        window.location.href = "login.html";
        return;
    }


    fetch(`${API_URL}/users/me/profile`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(user => {
            if (user) {
                document.getElementById("welcomeGreeting").innerText = `Welcome, ${user.full_name}!`;
                document.getElementById("fullName").value = user.full_name || "";
                document.getElementById("email").value = user.email || "";
            }
        })
        .catch(err => console.error(err));

  
    fetch(`${API_URL}/issues/user/my-issues`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(issues => {
            const container = document.getElementById("myPostsContainer");
            const postsCountElement = document.getElementById("totalPostsCount");
            container.innerHTML = "";

            if (!issues || issues.length === 0) {
                container.innerHTML = "<p>You haven't posted any issues yet.</p>";
                postsCountElement.innerText = "0";
                return;
            }

            postsCountElement.innerText = issues.length;

            issues.reverse().forEach(issue => {
                const div = document.createElement("div");
                div.className = "post-item-card";

               
                const catClass = `cat-${issue.category_name.toLowerCase().replace(/\s+/g, '-')}`;

                div.innerHTML = `
                <h3>${issue.title}</h3>
                <p>${issue.description.substring(0, 150)}${issue.description.length > 150 ? '...' : ''}</p>
                <span class="category-badge ${catClass}">${issue.category_name}</span>
            `;
                container.appendChild(div);
            });
        })
        .catch(err => console.error(err));

   
    document.getElementById("editProfileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const updateData = {
            full_name: fullName,
            email: email,
            password: password || null
        };

        fetch(`${API_URL}/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || "Profile updated successfully!");
               
                document.getElementById("welcomeGreeting").innerText = `Welcome, ${fullName}!`;
            })
            .catch(err => alert("Update failed"));
    });
});
