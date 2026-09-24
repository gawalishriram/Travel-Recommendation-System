"use strict";

let currentRole = "USER";
const BACKEND_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", function () {
    const userBtn = document.getElementById("userRoleBtn");
    const adminBtn = document.getElementById("adminRoleBtn");
    const eyeBtn = document.getElementById("passwordToggleBtn");
    const loginForm = document.getElementById("loginForm");

    if (userBtn) {
        userBtn.addEventListener("click", function (e) {
            e.preventDefault();
            switchLoginRole("USER");
        });
    }

    if (adminBtn) {
        adminBtn.addEventListener("click", function (e) {
            e.preventDefault();
            switchLoginRole("ADMIN");
        });
    }

    if (eyeBtn) {
        eyeBtn.addEventListener("click", togglePasswordEye);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", executeLogin);
    }

    // Auto-detect role from URL (e.g. login.jsp?role=admin)
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get("role");
    if (roleParam && roleParam.toUpperCase() === "ADMIN") {
        switchLoginRole("ADMIN");
    }
});

function togglePasswordEye(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const passInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");
    if (!passInput || !eyeIcon) return;

    if (passInput.type === "password") {
        passInput.type = "text";
        eyeIcon.className = "fa-solid fa-eye-slash";
    } else {
        passInput.type = "password";
        eyeIcon.className = "fa-solid fa-eye";
    }
}

function switchLoginRole(role) {
    currentRole = role;
    const userBtn = document.getElementById("userRoleBtn");
    const adminBtn = document.getElementById("adminRoleBtn");
    const loginBtn = document.getElementById("loginBtn");
    const title = document.getElementById("loginTitle");
    const subtitle = document.getElementById("loginSubtitle");
    const emailInput = document.getElementById("email");
    const emailLabel = document.getElementById("emailLabel");
    const registerOpt = document.getElementById("registerOption");
    const brandIcon = document.getElementById("brandIcon");
    const message = document.getElementById("message");

    if (message) message.classList.add("d-none");

    if (role === "ADMIN") {
        if (userBtn) userBtn.classList.remove("active");
        if (adminBtn) adminBtn.classList.add("active", "admin-active");
        if (loginBtn) {
            loginBtn.classList.add("admin-submit");
            loginBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Login as Admin';
        }
        if (title) title.textContent = "Admin Portal";
        if (subtitle) subtitle.textContent = "Sign in with administrator credentials";
        if (emailInput) emailInput.placeholder = "Enter Admin Email or Username";
        if (emailLabel) emailLabel.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Admin Email or Username';
        if (registerOpt) registerOpt.style.display = "none";
        if (brandIcon) {
            brandIcon.classList.add("admin-mode");
            brandIcon.innerHTML = '<i class="fa-solid fa-shield-halved"></i>';
        }
    } else {
        if (adminBtn) adminBtn.classList.remove("active", "admin-active");
        if (userBtn) userBtn.classList.add("active");
        if (loginBtn) {
            loginBtn.classList.remove("admin-submit");
            loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login as User';
        }
        if (title) title.textContent = "Welcome Back";
        if (subtitle) subtitle.textContent = "Login to explore your dream destinations";
        if (emailInput) emailInput.placeholder = "Enter your email address";
        if (emailLabel) emailLabel.innerHTML = '<i class="fa-solid fa-envelope"></i> Email';
        if (registerOpt) registerOpt.style.display = "block";
        if (brandIcon) {
            brandIcon.classList.remove("admin-mode");
            brandIcon.innerHTML = '<i class="fa-solid fa-earth-americas"></i>';
        }
    }
}

async function executeLogin(event) {
    if (event) event.preventDefault();

    const emailEl = document.getElementById("email");
    const passEl = document.getElementById("password");
    const btn = document.getElementById("loginBtn");

    if (!emailEl || !passEl) return;

    const email = emailEl.value.trim();
    const password = passEl.value.trim();

    if (!email || !password) {
        displayAlert("Email and password are required.", "danger");
        return;
    }

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Authenticating...';
        }

        let targetApi = currentRole === "ADMIN" 
            ? BACKEND_URL + "/admin/login" 
            : BACKEND_URL + "/users/login";

        let response = await fetch(targetApi, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        });

// No fallback endpoint; rely on role‑specific login API

        const text = await response.text();
        let data = {};
        if (text) {
            try { data = JSON.parse(text); } catch (e) { data = {}; }
        }

        if (!response.ok) {
            throw new Error(data.message || (currentRole === "ADMIN" ? "Invalid admin email or password." : "Invalid email or password."));
        }

        if (!data.token) {
            throw new Error("Authentication succeeded but token was missing.");
        }

        const role = (data.role || currentRole).toUpperCase();

        if (role === "ADMIN") {
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminId", String(data.adminId || ""));
            localStorage.setItem("adminEmail", data.email || email);
            localStorage.setItem("adminRole", "ADMIN");
            localStorage.setItem("adminLoggedIn", "true");

            displayAlert(data.message || "Admin Login Successful! Redirecting...", "success");
            setTimeout(() => window.location.replace("adminDashboard.jsp"), 500);
        } else {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", String(data.userId || ""));
            localStorage.setItem("userName", data.name || "User");
            localStorage.setItem("userEmail", data.email || email);

            displayAlert(data.message || "Login Successful! Welcome back.", "success");
            setTimeout(() => window.location.replace("dashboard.jsp"), 500);
        }

    } catch (err) {
        console.error("Login error:", err);
        displayAlert(err.message || "Login failed. Please verify your credentials.", "danger");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = currentRole === "ADMIN" 
                ? '<i class="fa-solid fa-shield-halved"></i> Login as Admin' 
                : '<i class="fa-solid fa-right-to-bracket"></i> Login as User';
        }
    }
}

function displayAlert(text, type) {
    const message = document.getElementById("message");
    if (!message) return;
    message.className = "alert alert-" + type;
    message.innerHTML = (type === "success" 
        ? '<i class="fa-solid fa-circle-check me-2"></i>' 
        : '<i class="fa-solid fa-triangle-exclamation me-2"></i>') + text;
    message.classList.remove("d-none");
    message.style.display = "block";
}