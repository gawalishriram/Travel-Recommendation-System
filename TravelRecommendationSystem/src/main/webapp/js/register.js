"use strict";

const REGISTER_API = "http://localhost:8080/users/register";

const DISPOSABLE_EMAIL_DOMAINS = [
    "tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com",
    "yopmail.com", "trashmail.com", "fake.com", "test.com", "example.com",
    "dispostable.com", "fakemailgenerator.com", "throwawaymail.com", "sharklasers.com",
    "getairmail.com", "maildrop.cc", "temp-mail.org", "inboxbear.com", "mytemp.email",
    "mytempmail.com", "nada.ltd", "mohmal.com", "crazymailing.com", "abc.com", "xyz.com"
];

function isGenuineEmail(email) {
    if (!email) return { valid: false, reason: "Email is required." };
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return { valid: false, reason: "Please enter a valid email format (e.g. yourname@gmail.com)." };
    }

    const parts = email.split("@");
    if (parts.length !== 2) return { valid: false, reason: "Invalid email structure." };

    const localPart = parts[0];
    const domain = parts[1].toLowerCase();

    if (localPart.length < 2) {
        return { valid: false, reason: "Email prefix is too short. Please provide a genuine email." };
    }

    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
        return { valid: false, reason: "Disposable or temporary email services are not accepted. Please use a genuine email (e.g. Gmail, Outlook, Yahoo)." };
    }

    const domainParts = domain.split(".");
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2 || /^\d+$/.test(tld)) {
        return { valid: false, reason: "Please enter a genuine email domain with a valid domain extension." };
    }

    return { valid: true };
}

function togglePassVisibility(fieldId, btn) {
    const input = document.getElementById(fieldId);
    if (!input) return;
    const icon = btn.querySelector("i");
    if (input.type === "password") {
        input.type = "text";
        if (icon) {
            icon.className = "fa-solid fa-eye-slash";
        }
    } else {
        input.type = "password";
        if (icon) {
            icon.className = "fa-solid fa-eye";
        }
    }
}

async function registerUser() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const gender = document.getElementById("gender").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const address = document.getElementById("address").value.trim();

    if (name.length < 3) return registerMessage("Name must contain at least 3 characters.", "danger");

    const emailCheck = isGenuineEmail(email);
    if (!emailCheck.valid) return registerMessage(emailCheck.reason, "danger");

    if (!/^[6-9]\d{9}$/.test(mobile)) return registerMessage("Enter a valid 10-digit mobile number.", "danger");
    if (!gender) return registerMessage("Please select gender.", "danger");
    if (password.length < 6) return registerMessage("Password must be at least 6 characters.", "danger");
    if (password !== confirmPassword) return registerMessage("Passwords do not match.", "danger");
    if (!address) return registerMessage("Please enter your address.", "danger");

    const request = { name, email, mobile, gender, password, address };

    const regBtn = document.querySelector(".btn-register");
    if (regBtn) {
        regBtn.disabled = true;
        regBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Creating Account...';
    }

    try {
        const response = await fetch(REGISTER_API, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(request)
        });

        const text = await response.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }

        if (!response.ok) {
            throw new Error(data.message || "Registration failed. Please check your details.");
        }

        registerMessage(data.message || "User Registered Successfully! Redirecting to login...", "success");
        setTimeout(() => window.location.replace("login.jsp"), 1200);

    } catch (error) {
        console.error(error);
        registerMessage(error.message || "Unable to connect to server.", "danger");
    } finally {
        if (regBtn) {
            regBtn.disabled = false;
            regBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Create Account';
        }
    }
}

function registerMessage(message, type) {
    const box = document.getElementById("message");
    if (!box) return;
    box.className = "alert alert-" + type;
    box.textContent = message;
    box.style.display = "block";
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
