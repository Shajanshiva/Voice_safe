document.querySelector(".login-btn").addEventListener("click", verify_user);

async function verify_user(event) {
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

    try {
        
        const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });
    
        const data = await response.json();
    
                if (!response.ok) {
                    throw new Error(data.detail || "Invalid email or password");
                } 
                alert("Login successful!");
    
                localStorage.setItem("access_token", data.access_token);
                window.location.href = "../index.html";
              
    }
        catch(error)  {
            alert(error.message);
        };
}
