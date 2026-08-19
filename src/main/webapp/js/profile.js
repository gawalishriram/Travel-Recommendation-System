"use strict";

const PROFILE_API = "http://localhost:8080/users";

document.addEventListener("DOMContentLoaded", () => {
    if (!checkLogin()) return;
    loadUserName();
    loadProfile();
});

async function loadProfile() {
    const id = getUserId();
    if (!id) return redirectToLogin();

    try {
        const response = await fetch(`${PROFILE_API}/userProfile/${encodeURIComponent(id)}`, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": `Bearer ${getToken()}` }
        });
        const data = await readJson(response);
        if (handleAuthError(response)) return;
        if (!response.ok) throw new Error(data.message || "Unable to load profile.");

        setValue("userId", data.userId);
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("mobile", data.mobile);
        setValue("gender", data.gender);
        setValue("address", data.address);

        localStorage.setItem("userName", data.name || "User");
        localStorage.setItem("userEmail", data.email || "");
        loadUserName();
    } catch (error) {
        console.error(error);
        showMessage(error.message || "Unable to load profile.", "danger");
    }
}

async function updateProfile() {
    if (!checkLogin()) return;

    const id = getUserId();
    const password = value("password").trim();
    const confirmPassword = value("confirmPassword").trim();
    const request = {
        name: value("name").trim(),
        email: value("email").trim(),
        mobile: value("mobile").trim(),
        gender: value("gender"),
        address: value("address").trim()
    };

    if (!request.name || !request.email || !request.mobile || !request.gender || !request.address) {
        showMessage("All profile fields are required.", "danger");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) return showMessage("Invalid email.", "danger");
    if (!/^[6-9]\d{9}$/.test(request.mobile)) return showMessage("Invalid mobile number.", "danger");
    if (password && password.length < 6) return showMessage("Password must be at least 6 characters.", "danger");
    if (password !== confirmPassword) return showMessage("Password does not match.", "danger");
    if (password) request.password = password;

    try {
        const response = await fetch(`${PROFILE_API}/updateUser/${encodeURIComponent(id)}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(request)
        });
        const data = await readJson(response);
        if (handleAuthError(response)) return;
        if (!response.ok) throw new Error(data.message || "Profile update failed.");

        localStorage.setItem("userName", data.name || request.name);
        localStorage.setItem("userEmail", data.email || request.email);
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";
        loadUserName();
        showMessage("Profile updated successfully.", "success");
    } catch (error) {
        console.error(error);
        showMessage(error.message || "Unable to update profile.", "danger");
    }
}

async function readJson(response) {
    const text = await response.text();
    if (!text) return {};
    try { return JSON.parse(text); } catch { return {}; }
}
function value(id) { const el = document.getElementById(id); return el ? el.value : ""; }
function setValue(id, value) { const el = document.getElementById(id); if (el) el.value = value ?? ""; }
