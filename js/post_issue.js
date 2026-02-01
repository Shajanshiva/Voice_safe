// Check if user is logged in immediately on page load
if (!localStorage.getItem("access_token")) {
    alert("Please login to access this page.");
    window.location.href = "login.html";
}

const form = document.getElementById("issueForm");
const descriptionInput = document.getElementById("description");
const charCountDisplay = document.querySelector(".char-count");

if (form) {
    form.addEventListener("submit", submitIssue);
}

// Character Count Logic
if (descriptionInput && charCountDisplay) {
    descriptionInput.addEventListener("input", () => {
        const length = descriptionInput.value.length;
        charCountDisplay.innerText = `${length}/2000 characters`;
    });
}

async function submitIssue(event) {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
        alert("Please log in to submit an issue.");
        window.location.href = "./login.html";
        return;
    }

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const description = descriptionInput.value.trim();

    if (!title || !category || !description) {
        alert("Please fill all required fields");
        return;
    }

    const issue_data = {
        title: title,
        category_name: category,
        description: description
    };

    try {
        const response = await fetch(`${API_URL}/issues/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(issue_data)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to submit issue");
        }

        // Redirect to success page instead of alert
        window.location.href = "report_submit.html";
    } catch (error) {
        alert(error.message);
    }
}
