"use strict";

const FAVORITES_API = "http://localhost:8080/api/favorites";

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
        showMessage(error.message || "Unable to load favorites.", "danger");
    }
}

function displayFavorites(favorites) {
    const container = document.getElementById("favoriteContainer");
    if (!container) return;
    container.innerHTML = "";
    if (!favorites.length) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-warning">No favorite destinations found.</div></div>';
        return;
    }
    favorites.forEach(place => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
            <div class="card h-100">
                <img src="${place.image || ""}" class="card-img-top" alt="Destination">
                <div class="card-body text-center">
                    <h5>${place.destinationName || place.name || "Destination"}</h5>
                    <p>${place.description || ""}</p>
                    <p><b>₹${place.price ?? 0}</b></p>
                    <button class="btn btn-danger" type="button">Remove</button>
                </div>
            </div>`;
        col.querySelector("button").addEventListener("click", () => removeFavorite(place.id));
        container.appendChild(col);
    });
}

async function removeFavorite(id) {
    try {
        const response = await fetch(`${FAVORITES_API}/remove/${encodeURIComponent(id)}`, {
            method: "DELETE", headers: getAuthHeaders()
        });
        if (handleAuthError(response)) return;
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Unable to remove favorite.");
        showMessage("Removed successfully.", "success");
        loadFavorites();
    } catch (error) {
        console.error(error);
        showMessage(error.message || "Server error.", "danger");
    }
}
