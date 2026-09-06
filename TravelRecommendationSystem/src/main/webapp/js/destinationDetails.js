"use strict";

const DEST_API = "http://localhost:8080/destinations";
const FAV_API = "http://localhost:8080/favorites";

let currentDestination = null;
let userFavs = new Set();

document.addEventListener("DOMContentLoaded", async () => {
    if (!checkLogin()) return;
    loadUserName();
    
    const urlParams = new URLSearchParams(window.location.search);
    const destId = urlParams.get("id") || urlParams.get("destinationId");

    await loadUserFavorites();

    if (destId) {
        loadDestinationDetails(destId);
    } else {
        loadDefaultOrFirstDestination();
    }
});

async function loadUserFavorites() {
    try {
        const res = await fetch(FAVORITES_API, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            userFavs = new Set(list.map(f => f.destinationId));
        }
    } catch (e) { /* ignore */ }
}

async function loadDestinationDetails(id) {
    const loadingEl = document.getElementById("detailsLoading");
    const contentEl = document.getElementById("detailsContent");
    const notFoundEl = document.getElementById("detailsNotFound");

    if (loadingEl) loadingEl.style.display = "block";
    if (contentEl) contentEl.style.display = "none";
    if (notFoundEl) notFoundEl.style.display = "none";

    try {
        const res = await fetch(`${DEST_API}/${id}`, { headers: getAuthHeaders() });
        if (handleAuthError(res)) return;
        if (!res.ok) throw new Error("Destination not found");

        currentDestination = await res.json();
        renderDestinationDetails(currentDestination);
        loadRelatedDestinations(currentDestination);

        if (loadingEl) loadingEl.style.display = "none";
        if (contentEl) contentEl.style.display = "block";
    } catch (e) {
        console.error("Error loading destination details:", e);
        if (loadingEl) loadingEl.style.display = "none";
        if (notFoundEl) notFoundEl.style.display = "block";
    }
}

async function loadDefaultOrFirstDestination() {
    try {
        const res = await fetch(DEST_API, { headers: getAuthHeaders() });
        if (res.ok) {
            const list = await res.json();
            if (Array.isArray(list) && list.length > 0) {
                loadDestinationDetails(list[0].destinationId);
            } else {
                document.getElementById("detailsLoading").style.display = "none";
                document.getElementById("detailsNotFound").style.display = "block";
            }
        }
    } catch (e) {
        document.getElementById("detailsLoading").style.display = "none";
        document.getElementById("detailsNotFound").style.display = "block";
    }
}

function renderDestinationDetails(d) {
    document.title = `${d.name || "Destination"} | TravelAI`;
    
    const title = document.getElementById("userPageTitle");
    if (title) title.textContent = d.name || "Destination Details";

    const imgEl = document.getElementById("destHeroImage");
    if (imgEl) {
        imgEl.src = getImageUrl(d.imageUrl);
        imgEl.alt = d.name || "Destination";
    }

    const nameEl = document.getElementById("destTitleName");
    if (nameEl) nameEl.textContent = d.name || "Destination";

    const descEl = document.getElementById("destFullDescription");
    if (descEl) descEl.textContent = d.description || "A breathtaking getaway offering picturesque views, rich culture and unforgettable experiences.";

    const catEl = document.getElementById("destCategoryPill");
    if (catEl) catEl.textContent = d.category || "Travel";

    const seasonEl = document.getElementById("destSeasonPill");
    if (seasonEl) seasonEl.textContent = d.season || "All Season";

    const ratingValEl = document.getElementById("destRatingValue");
    if (ratingValEl) ratingValEl.textContent = d.rating != null ? Number(d.rating).toFixed(1) : "5.0";

    const budgetEl = document.getElementById("destBudgetValue");
    if (budgetEl) budgetEl.textContent = "₹" + (d.budget != null ? Number(d.budget).toLocaleString("en-IN") : "0");

    const bookBtn = document.getElementById("destBookBtn");
    if (bookBtn) bookBtn.href = `booking.jsp?destinationId=${d.destinationId}`;

    const favBtn = document.getElementById("destFavBtn");
    if (favBtn) {
        const isFav = userFavs.has(d.destinationId);
        favBtn.innerHTML = `<i class="${isFav ? 'fa-solid text-danger' : 'fa-regular'} fa-heart me-1"></i> ${isFav ? 'Favorited' : 'Save Favorite'}`;
    }
}

function rateCurrentDestination() {
    if (!currentDestination) return;
    openRatingModal(
        currentDestination.destinationId,
        currentDestination.name,
        currentDestination.rating,
        (newRating) => {
            currentDestination.rating = newRating;
            const ratingValEl = document.getElementById("destRatingValue");
            if (ratingValEl) ratingValEl.textContent = Number(newRating).toFixed(1);
        }
    );
}

async function toggleCurrentFavorite() {
    if (!currentDestination) return;
    const destId = currentDestination.destinationId;
    const isFav = userFavs.has(destId);

    try {
        if (isFav) {
            await fetch(`${FAV_API}/remove/${destId}`, { method: "DELETE", headers: getAuthHeaders() });
            userFavs.delete(destId);
            showMessage("Removed from favorites.", "info");
        } else {
            await fetch(`${FAV_API}/add/${destId}`, { method: "POST", headers: getAuthHeaders() });
            userFavs.add(destId);
            showMessage("Added to favorites! ❤️", "success");
        }
        renderDestinationDetails(currentDestination);
    } catch (e) {
        showMessage("Failed to update favorite.", "danger");
    }
}

async function loadRelatedDestinations(current) {
    const relatedContainer = document.getElementById("relatedDestinationsGrid");
    if (!relatedContainer) return;

    try {
        const res = await fetch(DEST_API, { headers: getAuthHeaders() });
        if (!res.ok) return;
        const list = await res.json();
        
        const related = (Array.isArray(list) ? list : [])
            .filter(d => d.destinationId !== current.destinationId && (d.category === current.category || d.season === current.season))
            .slice(0, 3);

        if (!related.length) {
            relatedContainer.innerHTML = '<div class="col-12 text-muted small">No other similar destinations found.</div>';
            return;
        }

        relatedContainer.innerHTML = related.map(d => `
            <div class="col-md-4 mb-3">
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style="cursor: pointer; transition: transform 0.2s;" onclick="window.location.href='destinationDetails.jsp?id=${d.destinationId}'">
                    <img src="${getImageUrl(d.imageUrl)}" alt="${escapeHtml(d.name)}" style="height: 140px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'">
                    <div class="p-3">
                        <h6 class="fw-bold mb-1 text-dark">${escapeHtml(d.name)}</h6>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <span class="text-warning small"><i class="fa-solid fa-star"></i> ${d.rating != null ? Number(d.rating).toFixed(1) : '5.0'}</span>
                            <span class="fw-bold text-success small">₹${Number(d.budget || 0).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
    } catch (e) { /* ignore */ }
}
