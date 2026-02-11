document.querySelector(".login-btn").addEventListener("click", createUser);

function createUser(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("Please fill all required fields");
    return;
  } 

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  const user_data = {
    full_name: username,
    email: email,
    password: password,
  };

  fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user_data),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("User " + username + " created successfully!");
      window.location.href = "./login.html";
    })
    .catch((error) => {
      alert("Error creating user.");
    });
}