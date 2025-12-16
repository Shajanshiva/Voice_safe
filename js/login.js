document.querySelector(".login-btn").addEventListener("click", verify_user);

function verify_user(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill all required fields");
        return;
    }

    const login_data = {
        email: email,
        password: password
    };

    fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login_data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Invalid email or password");
        }
        return response.json();
    })
    .then(data => {
        alert("Login successful !");

        localStorage.setItem("user_id", data.user_id);

        window.location.href = "../index.html";
    })
    .catch(error => {
        alert(error.message); 
    });
}
