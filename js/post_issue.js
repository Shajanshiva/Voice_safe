document.querySelector(".report-form").addEventListener("submit", submitIssue);

function submitIssue(event) {
    event.preventDefault();

    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        alert("Please log in to submit an issue.");
        window.location.href = "./login.html";
        return;
    }

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();

    if (!title || !category || !description) {
        alert("Please fill all required fields");
        return;
    }

    const issue_data = {
        user_id: parseInt(user_id),
        title: title,
        category_name: category,
        description: description
    };

    fetch("http://127.0.0.1:8000/issues/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(issue_data)
    })
    .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to submit issue");
        }

        return data;
    })
    .then((data) => {
        alert(data.message); 
        document.getElementById("issueForm").reset();
    })
    .catch((error) => {
        alert(error.message);
    });
}   
