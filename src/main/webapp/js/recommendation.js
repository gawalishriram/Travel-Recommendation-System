"use strict";

const RECOMMENDATION_API = "http://localhost:8080/api/recommend";

document.addEventListener("DOMContentLoaded", () => {
    if (!checkLogin()) return;
    loadUserName();
});

async function recommend() {
    if (!checkLogin()) return;
    const budget = document.getElementById("budget")?.value.trim();
    const travelType = document.getElementById("type")?.value;
    const season = document.getElementById("season")?.value;

    if (!budget || !travelType || !season) {
        showMessage("Please fill all recommendation fields.", "warning");
        return;
    }

    try {
        const response = await fetch(RECOMMENDATION_API, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ budget, travelType, season })
        });
        if (handleAuthError(response)) return;
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load recommendations.");
        displayPlaces(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
        console.error(error);
        showMessage(error.message || "Unable to load recommendations.", "danger");
    }
}

function displayPlaces(places) {
    const result = document.getElementById("result");
    if (!result) return;
    result.innerHTML = "";
    if (!places.length) {
        result.innerHTML = '<div class="col-12"><div class="alert alert-warning">No recommendations found.</div></div>';
        return;
    }
    places.forEach(place => {
        const col = document.createElement("div");
        col.className = "col-md-4 result-card";
        col.innerHTML = `
            <div class="card h-100">
                <img src="${place.image || ""}" class="card-img-top" alt="Destination">
                <div class="card-body">
                    <h5>${place.name || place.destinationName || "Destination"}</h5>
                    <p>${place.description || ""}</p>
                </div>
            </div>`;
        result.appendChild(col);
    });
}
