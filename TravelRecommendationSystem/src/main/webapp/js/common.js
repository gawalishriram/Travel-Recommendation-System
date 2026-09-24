"use strict";

const API_BASE_URL = "http://localhost:8080";

function getToken() {
    return localStorage.getItem("token");
}

function getUserId() {
    return localStorage.getItem("userId");
}

function getUserName() {
    return localStorage.getItem("userName") || "User";
}

function getUserEmail() {
    return localStorage.getItem("userEmail") || "";
}

function checkLogin() {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
        clearLoginData();
        redirectToLogin();
        return false;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
        clearLoginData();
        redirectToLogin();
        return false;
    }

    return true;
}

function getAuthHeaders() {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + token
    };
}

function handleAuthError(response) {
    if (response && (response.status === 401 || response.status === 403)) {
        clearLoginData();
        redirectToLogin();
        return true;
    }
    return false;
}

function loadUserName() {
    const name = getUserName();

    document.querySelectorAll(".user-name").forEach(function (element) {
        element.textContent = name;
    });

    const welcomeUser = document.getElementById("welcomeUser");
    if (welcomeUser) {
        welcomeUser.textContent = "Welcome " + name;
    }

    const dashboardUser = document.getElementById("dashboardUser");
    if (dashboardUser) {
        dashboardUser.textContent = name;
    }
}

function clearLoginData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
}

function redirectToLogin() {
    window.location.replace("login.jsp");
}

function logoutUser() {
    clearLoginData();
    window.location.replace("login.jsp");
}

function showMessage(text, type) {
    const message = document.getElementById("message");
    if (!message) return;
    message.className = "alert alert-" + type;
    message.textContent = text;
    message.classList.remove("d-none");
    message.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("userSidebar") || document.getElementById("adminSidebar") || document.querySelector(".sidebar");
    const overlay = document.getElementById("sidebarOverlay") || document.querySelector(".sidebar-overlay");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", function () {
            sidebar.classList.toggle("active");
            if (overlay) overlay.classList.toggle("active");
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener("click", function () {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });
    }
});

const DEFAULT_TRAVEL_FALLBACK = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

function getImageUrl(imageUrl) {
    if (!imageUrl) {
        return DEFAULT_TRAVEL_FALLBACK;
    }

    if (typeof imageUrl === "string" && imageUrl.trim().startsWith("{")) {
        try {
            const parsed = JSON.parse(imageUrl);
            imageUrl = parsed.imageUrl || "";
        } catch (e) {
            const match = imageUrl.match(/"imageUrl"\s*:\s*"([^"]+)"/);
            if (match) {
                imageUrl = match[1];
            }
        }
    }

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
        return DEFAULT_TRAVEL_FALLBACK;
    }

    imageUrl = imageUrl.trim();

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
        return imageUrl;
    }

    const base = (typeof API_BASE_URL !== "undefined") ? API_BASE_URL : ((typeof BACKEND_URL !== "undefined") ? BACKEND_URL : "http://localhost:8080");
    return base + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
}

function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================================================
   Interactive Destination Rating Dialog
   ========================================================================== */
let activeRatingDestinationId = null;
let activeRatingCallback = null;
let activeSelectedRating = 5;

const RATING_DESCRIPTIONS = {
    1: "★☆☆☆☆ · Needs Improvement (1.0)",
    2: "★★☆☆☆ · Fair / Average (2.0)",
    3: "★★★☆☆ · Good Experience (3.0)",
    4: "★★★★☆ · Very Good / Recommended (4.0)",
    5: "★★★★★ · Incredible / Must Visit! (5.0)"
};

function ensureRatingModalExists() {
    let modalEl = document.getElementById("globalRatingModal");
    if (modalEl) return modalEl;

    const modalHtml = `
    <div class="modal fade" id="globalRatingModal" tabindex="-1" aria-labelledby="globalRatingModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 440px;">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 24px; overflow: hidden; background: #ffffff;">
                <div class="modal-header border-0 pb-0" style="background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);">
                    <div class="d-flex align-items-center gap-2">
                        <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(245,158,11,0.3);">
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <div>
                            <h5 class="modal-title fw-bold mb-0 text-dark" id="globalRatingModalLabel">Rate Destination</h5>
                            <small class="text-muted" id="ratingModalDestName">Destination Name</small>
                        </div>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center py-4 px-4">
                    <p class="text-muted small mb-2">How was your travel experience? Your feedback helps fellow travelers discover the best spots!</p>
                    
                    <div class="star-rating-container" id="starRatingSelector">
                        <i class="fa-solid fa-star star-item" data-val="1"></i>
                        <i class="fa-solid fa-star star-item" data-val="2"></i>
                        <i class="fa-solid fa-star star-item" data-val="3"></i>
                        <i class="fa-solid fa-star star-item" data-val="4"></i>
                        <i class="fa-solid fa-star star-item" data-val="5"></i>
                    </div>

                    <div id="starRatingFeedback" class="fw-semibold text-warning mb-3" style="font-size: 0.95rem; min-height: 24px;">
                        ★★★★★ · Incredible / Must Visit! (5.0)
                    </div>

                    <div id="ratingModalAlert" class="alert alert-danger d-none py-2 px-3 small rounded-3 mb-0"></div>
                </div>
                <div class="modal-footer border-0 pt-0 px-4 pb-4 d-flex justify-content-between">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-warning text-dark fw-bold rounded-pill px-4 shadow-sm" id="btnSubmitRating" onclick="submitDestinationRating()">
                        <i class="fa-solid fa-check me-1"></i> Submit Rating
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    modalEl = document.getElementById("globalRatingModal");

    const stars = modalEl.querySelectorAll(".star-item");
    stars.forEach(star => {
        star.addEventListener("mouseenter", function () {
            const val = parseInt(this.getAttribute("data-val"), 10);
            highlightStars(val);
            updateStarFeedback(val);
        });

        star.addEventListener("click", function () {
            activeSelectedRating = parseInt(this.getAttribute("data-val"), 10);
            selectStars(activeSelectedRating);
            updateStarFeedback(activeSelectedRating);
        });
    });

    const starContainer = document.getElementById("starRatingSelector");
    if (starContainer) {
        starContainer.addEventListener("mouseleave", function () {
            selectStars(activeSelectedRating);
            updateStarFeedback(activeSelectedRating);
        });
    }

    return modalEl;
}

function highlightStars(val) {
    const stars = document.querySelectorAll("#starRatingSelector .star-item");
    stars.forEach(s => {
        const starVal = parseInt(s.getAttribute("data-val"), 10);
        if (starVal <= val) {
            s.classList.add("hovered");
        } else {
            s.classList.remove("hovered");
        }
    });
}

function selectStars(val) {
    const stars = document.querySelectorAll("#starRatingSelector .star-item");
    stars.forEach(s => {
        const starVal = parseInt(s.getAttribute("data-val"), 10);
        s.classList.remove("hovered");
        if (starVal <= val) {
            s.classList.add("selected");
        } else {
            s.classList.remove("selected");
        }
    });
}

function updateStarFeedback(val) {
    const fb = document.getElementById("starRatingFeedback");
    if (fb) {
        fb.textContent = RATING_DESCRIPTIONS[val] || `${val} Stars`;
    }
}

function openRatingModal(destinationId, destName, currentRating, callback) {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
        if (typeof showMessage === "function") {
            showMessage("Please <a href='login.jsp' class='alert-link fw-bold text-decoration-underline'>Login</a> or <a href='register.jsp' class='alert-link fw-bold text-decoration-underline'>Register</a> to submit a star rating.", "warning");
        } else {
            window.location.href = "login.jsp";
        }
        return;
    }

    activeRatingDestinationId = destinationId;
    activeRatingCallback = callback;
    activeSelectedRating = Math.max(1, Math.min(5, Math.round(Number(currentRating) || 5)));

    ensureRatingModalExists();

    const nameEl = document.getElementById("ratingModalDestName");
    if (nameEl) nameEl.textContent = destName || "Destination #" + destinationId;

    const alertEl = document.getElementById("ratingModalAlert");
    if (alertEl) {
        alertEl.classList.add("d-none");
        alertEl.textContent = "";
    }

    selectStars(activeSelectedRating);
    updateStarFeedback(activeSelectedRating);

    const modalEl = document.getElementById("globalRatingModal");
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
}

async function submitDestinationRating() {
    if (!activeRatingDestinationId) return;

    const btn = document.getElementById("btnSubmitRating");
    const alertEl = document.getElementById("ratingModalAlert");

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Submitting...';
        }
        if (alertEl) alertEl.classList.add("d-none");

        const response = await fetch(`${API_BASE_URL}/destinations/${activeRatingDestinationId}/rate`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ rating: activeSelectedRating })
        });

        if (handleAuthError(response)) return;

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to submit rating.");
        }

        const modalEl = document.getElementById("globalRatingModal");
        if (modalEl) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
        }

        const updatedRating = data.rating || (data.destination && data.destination.rating) || activeSelectedRating;
        showMessage(`⭐ Rating submitted successfully! Current average: ${Number(updatedRating).toFixed(1)} / 5.0`, "success");

        if (typeof activeRatingCallback === "function") {
            activeRatingCallback(updatedRating, activeRatingDestinationId);
        }

    } catch (err) {
        console.error("Rating error:", err);
        if (alertEl) {
            alertEl.textContent = err.message || "Could not submit rating. Please try again.";
            alertEl.classList.remove("d-none");
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check me-1"></i> Submit Rating';
        }
    }
}

