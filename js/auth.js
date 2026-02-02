document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    const authActions = document.querySelector(".header-actions");
    const nav = document.querySelector(".nav");
    const headerContent = document.querySelector(".header-content");
    const isSubfolder = window.location.pathname.includes("/pages/");

    // Create Hamburger Menu if it doesn't exist
    if (headerContent && !document.querySelector(".menu-toggle")) {
        const toggle = document.createElement("div");
        toggle.className = "menu-toggle";
        toggle.innerHTML = "<span></span><span></span><span></span>";
        headerContent.appendChild(toggle);

        toggle.addEventListener("click", () => {
            toggle.classList.toggle("active");
            nav.classList.toggle("active");
            document.body.style.overflow = nav.classList.contains("active") ? "hidden" : "initial";
        });

        // Close menu when clicking nav links
        nav.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                toggle.classList.remove("active");
                nav.classList.remove("active");
                document.body.style.overflow = "initial";
            });
        });
    }

    // Function to handle "Post Issue" click for both logged in and logged out states
    const handlePostIssueClick = (e) => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            e.preventDefault();
            alert("Please login to post an issue.");
            window.location.href = isSubfolder ? "login.html" : "pages/login.html";
        }
    };

    const updateAuthUI = () => {
        if (!authActions) return;

        let actionsHTML = "";
        if (token) {
            const profilePath = isSubfolder ? "profile.html" : "pages/profile.html";
            const postPath = isSubfolder ? "post_issue.html" : "pages/post_issue.html";

            actionsHTML = `
                <a href="${profilePath}" class="nav-link" id="profileLink" style="margin-right: 15px;">Profile</a>
                <button class="btn-login" id="logoutBtn">Logout</button>
                <a href="${postPath}" class="btn-primary" id="postIssueBtnNav">Post Issue</a>
            `;
        } else {
            const loginPath = isSubfolder ? "login.html" : "pages/login.html";
            const postPath = isSubfolder ? "post_issue.html" : "pages/post_issue.html";

            actionsHTML = `
                <a href="${loginPath}" class="btn-login" id="loginBtn">Login</a>
                <a href="${postPath}" class="btn-primary" id="postIssueBtn">Post Issue</a>
            `;
        }

        authActions.innerHTML = actionsHTML;

        // Sync to mobile menu
        let mobileActions = nav.querySelector(".header-actions-mobile");
        if (!mobileActions) {
            mobileActions = document.createElement("div");
            mobileActions.className = "header-actions-mobile";
            nav.appendChild(mobileActions);
        }
        mobileActions.innerHTML = actionsHTML;

        // Attach listeners
        document.querySelectorAll("#logoutBtn").forEach(btn => {
            btn.addEventListener("click", () => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user_id");
                window.location.href = isSubfolder ? "../index.html" : "index.html";
            });
        });

        document.querySelectorAll("#postIssueBtn, #postIssueBtnNav").forEach(btn => {
            btn.addEventListener("click", handlePostIssueClick);
        });

        document.querySelectorAll("#loginBtn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const loginPath = isSubfolder ? "login.html" : "pages/login.html";
                window.location.href = loginPath;
            });
        });
    };

    updateAuthUI();
});