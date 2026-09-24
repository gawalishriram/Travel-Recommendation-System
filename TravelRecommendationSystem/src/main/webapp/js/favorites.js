"use strict";

const FAVORITES_API = "http://localhost:8080/favorites";

document.addEventListener("DOMContentLoaded", () => {
    if (!checkLogin()) return;
    loadUserName();
    loadFavorites();
});

async function loadFavorites() {
    try {
        const response = await fetch(FAVORITES_API, { method: "GET", headers: getAuthHeaders() });
        if (handleAuthError(response)) return;
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load favorites.");
        displayFavorites(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
        console.error(error);
        const container = document.getElementById("favoriteContainer");
        if (container) container.innerHTML = `<div class="col-12"><div class="alert alert-danger">${error.message || "Server error."}</div></div>`;
    }
}

function displayFavorites(favorites) {
    const container = document.getElementById("favoriteContainer");
    if (!container) return;
    container.innerHTML = "";

    if (!favorites.length) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fa-regular fa-heart" style="color:#f1f5f9;"></i>
                    <h5 class="text-muted">No favorites yet!</h5>
                    <p class="text-muted">Start exploring destinations and tap the heart icon to save them here.</p>
                    <a href="recommendation.jsp" class="btn btn-primary rounded-pill px-5 mt-2">
                        <i class="fa-solid fa-compass me-1"></i> Explore Destinations
                    </a>
                </div>
            </div>`;
        return;
    }

    favorites.forEach(place => {
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6";

        const imgUrl = getImageUrl(place.imageUrl);

        const name   = place.destinationName || place.name || "Destination";
        const budget = place.budget ?? place.price ?? 0;

        col.innerHTML = `
            <div class="fav-card h-100">
                <img src="${imgUrl}" alt="${esc(name)}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';">
                <div class="fav-body">
                    <div class="dest-name">${esc(name)}</div>
                    <p class="dest-desc">${esc(place.description || "")}</p>
                    <div class="d-flex flex-wrap gap-2 mb-3">
                        <span class="info-pill pill-budget"><i class="fa-solid fa-wallet"></i> ₹${fmtNum(budget)}</span>
                        ${place.season ? `<span class="info-pill pill-season"><i class="fa-solid fa-cloud-sun"></i> ${esc(place.season)}</span>` : ""}
                        <span class="info-pill pill-rating rating-pill-interactive" title="Rate this spot" onclick="openRatingModal(${place.destinationId}, '${esc(name).replace(/'/g, "\\'")}', ${place.rating || 5}, (newR) => updateFavRating(${place.destinationId}, newR))">
                            <i class="fa-solid fa-star"></i> <span id="favRatingVal_${place.destinationId}">${place.rating != null ? Number(place.rating).toFixed(1) : "5.0"}</span> <small style="font-size:0.7rem;opacity:0.8;">· Rate</small>
                        </span>
                        ${place.category ? `<span class="info-pill pill-cat"><i class="fa-solid fa-tag"></i> ${esc(place.category)}</span>` : ""}
                    </div>
                    <div class="d-flex gap-2 mt-auto">
                        <button type="button" class="btn-remove" onclick="removeFavorite(${place.destinationId}, this)">
                            <i class="fa-solid fa-heart-crack me-1"></i> Remove
                        </button>
                        <a href="booking.jsp?destinationId=${place.destinationId}" class="btn-book-fav">
                            <i class="fa-solid fa-ticket me-1"></i> Book Now
                        </a>
                    </div>
                </div>
            </div>`;
        container.appendChild(col);
    });
}

function updateFavRating(destId, newRating) {
    const valEl = document.getElementById(`favRatingVal_${destId}`);
    if (valEl) {
        valEl.textContent = Number(newRating).toFixed(1);
    }
}

async function removeFavorite(destinationId, btn) {
    try {
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; }
        const response = await fetch(`${FAVORITES_API}/remove/${encodeURIComponent(destinationId)}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (handleAuthError(response)) return;
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Unable to remove favorite.");
        showMessage("Removed from favorites.", "info");
        loadFavorites();
    } catch (error) {
        console.error(error);
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-heart-crack me-1"></i> Remove'; }
        showMessage(error.message || "Server error.", "danger");
    }
}

function esc(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}
function fmtNum(v) { return v != null ? Number(v).toLocaleString("en-IN") : "0"; }
