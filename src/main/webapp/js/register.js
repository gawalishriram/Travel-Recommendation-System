"use strict";

const REGISTER_API = "http://localhost:8080/users/register";

async function registerUser() {
    const request = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        gender: document.getElementById("gender").value,
        password: document.getElementById("password").value,
        address: document.getElementById("address").value.trim()
    };
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (request.name.length < 3) return registerMessage("Name must contain at least 3 characters.", "danger");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) return registerMessage("Enter a valid email.", "danger");
    if (!/^[6-9]\d{9}$/.test(request.mobile)) return registerMessage("Enter a valid 10-digit mobile number.", "danger");
    if (!request.gender) return registerMessage("Select gender.", "danger");
    if (request.password.length < 6) return registerMessage("Password must be at least 6 characters.", "danger");
    if (request.password !== confirmPassword) return registerMessage("Passwords do not match.", "danger");
    if (!request.address) return registerMessage("Enter address.", "danger");

    try {
        const response = await fetch(REGISTER_API, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(request)
        });
        const text = await response.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }

        if (!response.ok) throw new Error(data.message || "Registration failed.");
        registerMessage(data.message || "User Registered Successfully", "success");
        setTimeout(() => window.location.replace("login.jsp"), 1000);
    } catch (error) {
        console.error(error);
        registerMessage(error.message || "Unable to connect to server.", "danger");
    }
}

function registerMessage(message, type) {
    const box = document.getElementById("message");
    if (!box) return;
    box.className = "alert alert-" + type;
    box.textContent = message;
    box.style.display = "block";
}
