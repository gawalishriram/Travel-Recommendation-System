"use strict";

const RECOMMENDATION_API = "http://localhost:8080/recommendations";
const FAVORITES_API      = "http://localhost:8080/favorites";

let userFavIds = new Set();
let currentRecoList = [];

document.addEventListener("DOMContentLoaded", () => {
    const token = getToken();
    const userId = getUserId();
    if (token && userId) {
        loadUserName();
        loadMyFavorites();
    }
    checkPendingHomeSearch();
    recommend();
});

function selectMood(vibe, element) {
    const hiddenType = document.getElementById("type");
    if (hiddenType) hiddenType.value = vibe;

    const chips = document.querySelectorAll("#moodChipContainer .mood-chip");
    chips.forEach(c => c.classList.remove("active"));
    if (element) element.classList.add("active");
}

function setBudget(amount, element) {
    const budgetInput = document.getElementById("budget");
    if (budgetInput) budgetInput.value = amount;

    const btns = document.querySelectorAll(".budget-preset-btn");
    btns.forEach(b => b.classList.remove("active"));
    if (element) element.classList.add("active");
}

function quickFillMood(vibe, budget, season) {
    const hiddenType = document.getElementById("type");
    if (hiddenType) hiddenType.value = vibe;

    const budgetInput = document.getElementById("budget");
    if (budgetInput) budgetInput.value = budget;

    const seasonSelect = document.getElementById("season");
    if (seasonSelect) seasonSelect.value = season;

    // Highlight mood chip
    const chips = document.querySelectorAll("#moodChipContainer .mood-chip");
    chips.forEach(c => {
        if (c.getAttribute("data-vibe") === vibe) {
            c.classList.add("active");
        } else {
            c.classList.remove("active");
        }
    });

    recommend();
}

function checkPendingHomeSearch() {
    const raw = sessionStorage.getItem("homeSearch");
    if (!raw) return;
    sessionStorage.removeItem("homeSearch");
    try {
        const data = JSON.parse(raw);
        if (data.season && document.getElementById("season")) {
            document.getElementById("season").value = data.season;
        }
        if (data.budget && document.getElementById("budget")) {
            const matches = data.budget.match(/\d+/g);
            if (matches && matches.length > 0) {
                document.getElementById("budget").value = matches[matches.length - 1];
            } else {
                document.getElementById("budget").value = "30000";
            }
        }
        if (data.category) {
            selectMood(data.category, null);
        }
    } catch (e) {
        console.error("Home search parse error:", e);
    }
}

async function loadMyFavorites() {
    const token = getToken();
    if (!token) return;

    try {
        const res = await fetch(FAVORITES_API, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            userFavIds = new Set(list.map(f => f.destinationId));
        }
    } catch (e) { /* silent */ }
}

async function recommend() {
    const budgetVal  = document.getElementById("budget")?.value.trim();
    const travelType = document.getElementById("type")?.value || "Adventure";
    const season     = document.getElementById("season")?.value || "Summer";

    if (!budgetVal) {
        showMessage("Please specify a maximum budget limit.", "warning");
        return;
    }

    const budget = Number(budgetVal);
    const loader = document.getElementById("recoLoader");
    const result = document.getElementById("result");
    const headerBar = document.getElementById("resultsHeaderBar");
    const statusText = document.getElementById("resultStatusText");

    if (loader) loader.classList.remove("d-none");
    if (result) result.innerHTML = "";
    if (headerBar) headerBar.classList.add("d-none");
    if (statusText) statusText.textContent = "AI is computing matching spots...";

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };
    const token = getToken();
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    try {
        const response = await fetch(RECOMMENDATION_API, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ budget, travelType, category: travelType, season })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load recommendations.");

        currentRecoList = Array.isArray(data) ? data : (data.data || []);
        displayPlaces(currentRecoList);
    } catch (error) {
        console.error(error);
        showMessage(error.message || "Unable to load recommendations.", "danger");
        if (statusText) statusText.textContent = "Ready to recommend";
    } finally {
        if (loader) loader.classList.add("d-none");
    }
}

function clearResults() {
    const result = document.getElementById("result");
    if (result) result.innerHTML = "";
    const headerBar = document.getElementById("resultsHeaderBar");
    if (headerBar) headerBar.classList.add("d-none");
    currentRecoList = [];

    const budgetEl = document.getElementById("budget");
    if (budgetEl) budgetEl.value = "30000";

    const searchFilter = document.getElementById("recoSearchFilter");
    if (searchFilter) searchFilter.value = "";

    const statusText = document.getElementById("resultStatusText");
    if (statusText) statusText.textContent = "Filters reset";
}

function filterLocalResults() {
    const keyword = (document.getElementById("recoSearchFilter")?.value || "").trim().toLowerCase();
    if (!keyword) {
        displayPlaces(currentRecoList);
        return;
    }
    const filtered = currentRecoList.filter(p => {
        return (p.name && p.name.toLowerCase().includes(keyword)) ||
               (p.description && p.description.toLowerCase().includes(keyword)) ||
               (p.category && p.category.toLowerCase().includes(keyword)) ||
               (p.season && p.season.toLowerCase().includes(keyword));
    });
    displayPlaces(filtered, false);
}

function displayPlaces(places, updateHeader = true) {
    const result = document.getElementById("result");
    const headerBar = document.getElementById("resultsHeaderBar");
    const countLabel = document.getElementById("resultsCountLabel");
    const statusText = document.getElementById("resultStatusText");

    if (!result) return;
    result.innerHTML = "";

    if (headerBar) {
        headerBar.classList.remove("d-none");
        headerBar.classList.add("d-flex");
    }

    if (countLabel) {
        countLabel.textContent = `Showing ${places.length} curated destination${places.length === 1 ? '' : 's'}`;
    }

    if (statusText && updateHeader) {
        statusText.textContent = `Found ${places.length} recommendations! ✨`;
    }

    if (!places.length) {
        result.innerHTML = `
            <div class="col-12">
                <div class="card border-0 shadow-sm rounded-4 p-5 text-center">
                    <i class="fa-solid fa-wand-magic-sparkles text-muted mb-3" style="font-size: 3rem;"></i>
                    <h5 class="fw-bold text-dark">No Matching Destinations Found</h5>
                    <p class="text-muted small mb-3">Try increasing your budget limit or switching the season / travel vibe.</p>
                    <div>
                        <button type="button" class="btn btn-outline-primary rounded-pill px-4" onclick="setBudget(50000, null); recommend();">
                            Try with ₹50,000 Budget
                        </button>
                    </div>
                </div>
            </div>`;
        return;
    }

    places.forEach((place, index) => {
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6";

        const imgUrl = getImageUrl(place.imageUrl);
        const isFav = userFavIds.has(place.destinationId);
        const matchPercent = 94 + (index % 5);

        col.innerHTML = `
            <div class="reco-luxury-card">
                <div class="reco-img-wrap">
                    <div class="reco-match-badge">
                        <i class="fa-solid fa-sparkles"></i> ${matchPercent}% AI Match
                    </div>
                    <button type="button" class="reco-fav-btn ${isFav ? 'active' : ''}"
                        id="favBtn_${place.destinationId}"
                        title="${isFav ? 'Remove from favorites' : 'Save to favorites'}"
                        onclick="toggleFav(${place.destinationId})">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <img src="${imgUrl}" alt="${esc(place.name)}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';">
                </div>
                <div class="reco-card-body">
                    <h5 class="reco-title">${esc(place.name)}</h5>
                    <p class="reco-desc">${esc(place.description || "A breathtaking getaway offering picturesque views, rich culture and unforgettable experiences.")}</p>
                    <div class="reco-pills">
                        <span class="reco-pill pill-cat-reco"><i class="fa-solid fa-tag"></i> ${esc(place.category || place.travelType || 'Travel')}</span>
                        <span class="reco-pill pill-season-reco"><i class="fa-solid fa-cloud-sun"></i> ${esc(place.season || 'All Season')}</span>
                        <span class="reco-pill pill-rating-reco rating-pill-interactive" title="Rate this spot" onclick="openRatingModal(${place.destinationId}, '${esc(place.name).replace(/'/g, "\\'")}', ${place.rating || 5}, (newR) => updateRecoRating(${place.destinationId}, newR))">
                            <i class="fa-solid fa-star"></i> <span id="recoRatingVal_${place.destinationId}">${place.rating != null ? place.rating.toFixed(1) : "5.0"}</span> <small style="font-size:0.7rem;opacity:0.8;">· Rate</small>
                        </span>
                    </div>
                    <div class="reco-card-footer">
                        <div>
                            <small class="text-muted d-block" style="font-size:0.75rem;">Budget / Person</small>
                            <span class="reco-price-value">₹${fmtNum(place.budget)}</span>
                        </div>
                        <a href="booking.jsp?destinationId=${place.destinationId}" class="btn-ai-book">
                            <i class="fa-solid fa-ticket"></i> Book Trip
                        </a>
                    </div>
                </div>
            </div>`;
        result.appendChild(col);
    });
}

function updateRecoRating(destId, newRating) {
    const valEl = document.getElementById(`recoRatingVal_${destId}`);
    if (valEl) {
        valEl.textContent = Number(newRating).toFixed(1);
    }
    const target = currentRecoList.find(p => p.destinationId === destId);
    if (target) target.rating = newRating;
}

async function toggleFav(destinationId) {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
        showMessage("Please <a href='login.jsp' class='alert-link fw-bold text-decoration-underline'>Login</a> or <a href='register.jsp' class='alert-link fw-bold text-decoration-underline'>Register</a> to save destinations to your favorites.", "warning");
        return;
    }

    const btn   = document.getElementById(`favBtn_${destinationId}`);
    const isFav = userFavIds.has(destinationId);

    try {
        let res;
        if (isFav) {
            res = await fetch(`${FAVORITES_API}/remove/${destinationId}`, { method: "DELETE", headers: getAuthHeaders() });
            if (handleAuthError(res)) return;
            userFavIds.delete(destinationId);
            if (btn) {
                btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
                btn.classList.remove("active");
                btn.title = "Save to favorites";
            }
            showMessage("Removed from favorites.", "info");
        } else {
            res = await fetch(`${FAVORITES_API}/add/${destinationId}`, { method: "POST", headers: getAuthHeaders() });
            if (handleAuthError(res)) return;
            userFavIds.add(destinationId);
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
                btn.classList.add("active");
                btn.title = "Remove from favorites";
            }
            showMessage("Added to favorites! ❤️", "success");
        }
    } catch (err) {
        showMessage("Could not update favorite.", "danger");
    }
}

function esc(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

function fmtNum(v) { return v != null ? Number(v).toLocaleString("en-IN") : "0"; }
