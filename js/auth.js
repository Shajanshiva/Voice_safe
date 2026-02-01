document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    const authActions = document.querySelector(".header-actions");
    const isSubfolder = window.location.pathname.includes("/pages/");

    // Function to handle "Post Issue" click for both logged in and logged out states
    const handlePostIssueClick = (e) => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            e.preventDefault();
            alert("Please login to post an issue.");
            window.location.href = isSubfolder ? "login.html" : "pages/login.html";
        }
    };

    if (token && authActions) {
        const profilePath = isSubfolder ? "profile.html" : "pages/profile.html";
        const postPath = isSubfolder ? "post_issue.html" : "pages/post_issue.html";

        authActions.innerHTML = `
            <a href="${profilePath}" class="nav-link" id="profileLink" style="margin-right: 15px;">Profile</a>
            <button class="btn-login" id="logoutBtn">Logout</button>
            <a href="${postPath}" class="btn-primary" id="postIssueBtnNav">Post Issue</a>
        `;

        // Logout logic
        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_id");
            window.location.href = isSubfolder ? "../index.html" : "index.html";
        });

    } else if (authActions) {
        const loginPath = isSubfolder ? "login.html" : "pages/login.html";
        const postPath = isSubfolder ? "post_issue.html" : "pages/post_issue.html";

        authActions.innerHTML = `
            <a href="${loginPath}" class="btn-login" id="loginBtn">Login</a>
            <a href="${postPath}" class="btn-primary" id="postIssueBtn">Post Issue</a>
        `;
    }

    // Attach listeners to whatever buttons exist now
    document.getElementById("postIssueBtn")?.addEventListener("click", handlePostIssueClick);
    document.getElementById("postIssueBtnNav")?.addEventListener("click", handlePostIssueClick);

    // Login button logic (just in case index.js or others are overwritten)
    document.getElementById("loginBtn")?.addEventListener("click", (e) => {
        // No special check needed, just let the link work or force it
        const loginPath = isSubfolder ? "login.html" : "pages/login.html";
        window.location.href = loginPath;
    });
});