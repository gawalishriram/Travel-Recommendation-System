"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // 1. Scroll effect & back to top
    const navbar = document.querySelector(".navbar");
    const topBtn = document.getElementById("topBtn");

    window.addEventListener("scroll", function () {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }

        if (topBtn) {
            if (document.documentElement.scrollTop > 300) {
                topBtn.style.display = "block";
            } else {
                topBtn.style.display = "none";
            }
        }
    });

    if (topBtn) {
        topBtn.onclick = function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };
    }

    // 2. Setup Navbar Auth Status
    setupNavbarAuth();

    // 3. Setup Auth Gate Interceptors for Buttons & Search
    setupAuthGates();
});

function isUserLoggedIn() {
    const userToken = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    return !!(userToken && userId);
}

function isAdminLoggedIn() {
    return !!localStorage.getItem("adminToken");
}

function isAuthenticated() {
    return isUserLoggedIn() || isAdminLoggedIn();
}

function setupNavbarAuth() {
    const authContainer = document.getElementById("navAuthContainer");
    if (!authContainer) return;

    if (isUserLoggedIn()) {
        const userName = localStorage.getItem("userName") || "User";
        authContainer.innerHTML = `
            <span class="nav-link text-primary fw-semibold me-2 d-none d-lg-inline">
                <i class="fa-regular fa-circle-user me-1"></i> Hi, ${escapeHtml(userName)}
            </span>
            <a href="dashboard.jsp" class="btn btn-primary px-3 rounded-pill">
                <i class="fa-solid fa-gauge me-1"></i> Dashboard
            </a>
            <button type="button" class="btn btn-outline-danger px-3 rounded-pill" onclick="logoutFromHome()">
                <i class="fa-solid fa-right-from-bracket me-1"></i> Logout
            </button>
        `;
    } else if (isAdminLoggedIn()) {
        authContainer.innerHTML = `
            <a href="adminDashboard.jsp" class="btn btn-primary px-3 rounded-pill">
                <i class="fa-solid fa-shield-halved me-1"></i> Admin Dashboard
            </a>
            <button type="button" class="btn btn-outline-danger px-3 rounded-pill" onclick="logoutFromHome()">
                <i class="fa-solid fa-right-from-bracket me-1"></i> Logout
            </button>
        `;
    }
}

function logoutFromHome() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminLoggedIn");

    sessionStorage.clear();
    window.location.replace("index.jsp");
}

function setupAuthGates() {
    // Intercept clicks on any .auth-gate-btn
    const gateButtons = document.querySelectorAll(".auth-gate-btn");
    gateButtons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            if (!isAuthenticated()) {
                e.preventDefault();
                e.stopPropagation();

                const target = btn.getAttribute("data-target") || btn.getAttribute("href") || "recommendation.jsp";
                promptAuthModal(target);
            }
        });
    });

    // Intercept Hero Search Form
    const searchForm = document.getElementById("homeSearchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!isAuthenticated()) {
                promptAuthModal("recommendation.jsp");
                return;
            }

            // Save search params and redirect to recommendations
            const destInput = searchForm.querySelector('[name="destination"]');
            const budgetInput = searchForm.querySelector('[name="budget"]');
            const seasonInput = searchForm.querySelector('[name="season"]');

            const searchParams = {
                destination: destInput ? destInput.value.trim() : "",
                budget: budgetInput ? budgetInput.value : "",
                season: seasonInput ? seasonInput.value : ""
            };

            sessionStorage.setItem("homeSearch", JSON.stringify(searchParams));
            window.location.href = "recommendation.jsp";
        });
    }
}

function promptAuthModal(targetUrl) {
    const loginLink = document.getElementById("authModalLoginLink");
    if (loginLink) {
        loginLink.href = "login.jsp?msg=auth_required&redirect=" + encodeURIComponent(targetUrl);
    }

    const modalEl = document.getElementById("authRequiredModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    } else {
        window.location.href = "login.jsp?msg=auth_required&redirect=" + encodeURIComponent(targetUrl);
    }
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
