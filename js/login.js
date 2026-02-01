document.querySelector(".login-btn").addEventListener("click", verify_user);

function verify_user(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill all required fields");
        return;
    }


    const loginData = {
        email: email,
        password: password
    };

    fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Invalid email or password");
            }

            return data;
        })
        .then(data => {
            alert("Login successful!");

            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user_id", data.user_id);

            window.location.href = "../index.html";
        })
        .catch(error => {
            alert(error.message);
        });
}
