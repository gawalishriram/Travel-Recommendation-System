"use strict";

const AUTH_API = "http://localhost:8080/users";

let activeEmail = "";
let resendTimer = null;
let resendSeconds = 0;

function showMessage(msg, type) {
    const alert = document.getElementById("message");
    if (!alert) return;
    alert.className = `alert alert-${type} mb-3`;
    alert.innerHTML = msg;
    alert.classList.remove("d-none");
    alert.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideMessage() {
    const alert = document.getElementById("message");
    if (!alert) return;
    alert.classList.add("d-none");
    alert.innerHTML = "";
}

function togglePasswordVisibility(fieldId, iconId) {
    const input = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    if (input.type === "password") {
        input.type = "text";
        icon.className = "fa-solid fa-eye-slash";
    } else {
        input.type = "password";
        icon.className = "fa-solid fa-eye";
    }
}

async function requestResetToken(event) {
    if (event) event.preventDefault();
    hideMessage();

    const btn = document.getElementById("requestBtn");
    const emailInput = document.getElementById("forgotEmail");
    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";

    if (!email) {
        showMessage("Please enter your registered email address.", "danger");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address.", "danger");
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Sending Verification Code...';
    }

    try {
        const response = await fetch(`${AUTH_API}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ email: email })
        });

        let data = {};
        try { data = await response.json(); } catch (e) { data = { message: "Server communication error." }; }

        if (!response.ok) {
            throw new Error(data.message || "No account found with this email address.");
        }

        activeEmail = email;
        showMessage(`A 6-digit verification code has been dispatched to <strong>${escapeHtml(email)}</strong>.<br><small class="text-muted">Please check your inbox (and Spam/Junk folder).</small>`, "success");

        const noticeEl = document.getElementById("tokenNotice");
        if (noticeEl) {
            noticeEl.className = "alert alert-success py-2 px-3 mb-3 small";
            noticeEl.innerHTML = `<i class="fa-solid fa-envelope-circle-check text-success me-1"></i> Verification code sent to <strong>${escapeHtml(email)}</strong>. Please check your inbox.`;
        }

        document.getElementById("step1").classList.add("d-none");
        document.getElementById("step2").classList.remove("d-none");

        const codeInput = document.getElementById("resetToken");
        if (codeInput) {
            codeInput.value = "";
            codeInput.focus();
        }

        startResendCountdown(60);

    } catch (err) {
        showMessage(err.message, "danger");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i> Send Verification Code';
        }
    }
}

function startResendCountdown(seconds) {
    const resendBtn = document.getElementById("resendBtn");
    if (!resendBtn) return;

    clearInterval(resendTimer);
    resendSeconds = seconds;
    resendBtn.disabled = true;

    resendTimer = setInterval(() => {
        resendSeconds--;
        if (resendSeconds <= 0) {
            clearInterval(resendTimer);
            resendBtn.disabled = false;
            resendBtn.innerHTML = '<i class="fa-solid fa-rotate-right me-1"></i> Resend Code';
        } else {
            resendBtn.innerHTML = `<i class="fa-solid fa-clock me-1"></i> Resend in ${resendSeconds}s`;
        }
    }, 1000);
}

async function resendCode() {
    if (!activeEmail) return backToStep1();
    hideMessage();

    const resendBtn = document.getElementById("resendBtn");
    if (resendBtn) {
        resendBtn.disabled = true;
        resendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Resending...';
    }

    try {
        const response = await fetch(`${AUTH_API}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ email: activeEmail })
        });

        let data = {};
        try { data = await response.json(); } catch (e) { data = {}; }

        if (!response.ok) {
            throw new Error(data.message || "Failed to resend verification code.");
        }

        showMessage("A new verification code has been dispatched to your email.", "success");

        const noticeEl = document.getElementById("tokenNotice");
        if (noticeEl) {
            noticeEl.className = "alert alert-success py-2 px-3 mb-3 small";
            noticeEl.innerHTML = `<i class="fa-solid fa-envelope-circle-check text-success me-1"></i> A fresh verification code has been sent to <strong>${escapeHtml(activeEmail)}</strong>.`;
        }

        startResendCountdown(60);

    } catch (error) {
        showMessage(error.message, "danger");
        if (resendBtn) {
            resendBtn.disabled = false;
            resendBtn.innerHTML = '<i class="fa-solid fa-rotate-right me-1"></i> Resend Code';
        }
    }
}

async function submitNewPassword(event) {
    if (event) event.preventDefault();
    hideMessage();

    const btn = document.getElementById("resetBtn");
    const token = document.getElementById("resetToken").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmNewPassword").value;

    if (!token) {
        showMessage("Please enter the 6-digit verification code received on your email.", "danger");
        return;
    }

    if (token.length < 4) {
        showMessage("Verification code is incomplete.", "danger");
        return;
    }

    if (!newPassword || newPassword.length < 6) {
        showMessage("Password must be at least 6 characters.", "danger");
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage("Passwords do not match. Please re-enter your password.", "danger");
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Updating Password...';
    }

    try {
        const response = await fetch(`${AUTH_API}/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ email: activeEmail, token: token, newPassword: newPassword })
        });

        let data = {};
        try { data = await response.json(); } catch (e) { data = { message: "Server error" }; }

        if (!response.ok) {
            throw new Error(data.message || "Invalid or expired verification code.");
        }

        clearInterval(resendTimer);

        document.getElementById("step2").innerHTML = `
            <div class="text-center py-4">
                <i class="fa-solid fa-circle-check text-success fa-3x mb-3"></i>
                <h4 class="fw-bold text-success mb-2">Password Reset Successful!</h4>
                <p class="text-muted mb-4">${escapeHtml(data.message || 'Your password has been changed. You can now log in with your new password.')}</p>
                <a href="login.jsp" class="btn btn-login w-100">
                    <i class="fa-solid fa-right-to-bracket me-2"></i> Proceed to Login
                </a>
            </div>
        `;

    } catch (err) {
        showMessage(err.message, "danger");
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check me-2"></i> Update Password';
        }
    }
}

function backToStep1() {
    clearInterval(resendTimer);
    hideMessage();
    document.getElementById("step2").classList.add("d-none");
    document.getElementById("step1").classList.remove("d-none");
    const tokenInput = document.getElementById("resetToken");
    if (tokenInput) tokenInput.value = "";
    const passInput = document.getElementById("newPassword");
    if (passInput) passInput.value = "";
    const confirmInput = document.getElementById("confirmNewPassword");
    if (confirmInput) confirmInput.value = "";
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
