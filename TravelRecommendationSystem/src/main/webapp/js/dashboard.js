"use strict";

const DEST_API = "http://localhost:8080/destinations";
const FAV_API = "http://localhost:8080/favorites";
const ITEMS_PER_PAGE = 10;

let allDestinations = [];
let filteredList = [];
let userFavoriteIds = new Set();
let currentPage = 1;

document.addEventListener("DOMContentLoaded", function () {
    if (!checkLogin()) return;
    loadUserName();
    loadDashboardDestinations();
});

const BOOKINGS_API = "http://localhost:8080/bookings";

async function loadDashboardDestinations() {
    const loader = document.getElementById("destLoader");
    const grid = document.getElementById("destinationsGrid");
    const empty = document.getElementById("destEmpty");

    try {
        const [destResponse, favResponse, bookResponse] = await Promise.all([
            fetch(DEST_API, { method: "GET", headers: getAuthHeaders() }),
            fetch(FAV_API, { method: "GET", headers: getAuthHeaders() }).catch(() => null),
            fetch(BOOKINGS_API, { method: "GET", headers: getAuthHeaders() }).catch(() => null)
        ]);

        if (destResponse.ok) {
            const data = await destResponse.json();
            allDestinations = Array.isArray(data) ? data : [];
            filteredList = [...allDestinations];
            const destStat = document.getElementById("statDestCount");
            if (destStat) destStat.textContent = allDestinations.length;
        }

        if (favResponse && favResponse.ok) {
            const favData = await favResponse.json();
            const favArray = Array.isArray(favData) ? favData : [];
            userFavoriteIds = new Set(favArray.map(f => f.destinationId));
            const favStat = document.getElementById("statFavCount");
            if (favStat) favStat.textContent = favArray.length;
        }

        if (bookResponse && bookResponse.ok) {
            const bookData = await bookResponse.json();
            const bookArray = Array.isArray(bookData) ? bookData : [];
            const bookStat = document.getElementById("statBookingCount");
            if (bookStat) bookStat.textContent = bookArray.length;
        }

        if (loader) loader.style.display = "none";
        currentPage = 1;
        renderDestinationsPage();

    } catch (error) {
        console.error("Dashboard error:", error);
        if (loader) loader.style.display = "none";
        if (empty) {
            empty.textContent = "Failed to load destinations from server.";
            empty.classList.remove("d-none");
        }
    }
}

let selectedCategory = "all";
let selectedSort = "featured";

function onUserDestSearch() {
    applyDestFilters();
}

function filterByCategory(category, btnElement) {
    selectedCategory = category;
    
    // Update chip active classes
    const chips = document.querySelectorAll("#categoryChips .cat-chip");
    chips.forEach(c => {
        c.classList.remove("btn-primary", "active");
        c.classList.add("btn-outline-secondary");
    });
    
    if (btnElement) {
        btnElement.classList.remove("btn-outline-secondary");
        btnElement.classList.add("btn-primary", "active");
    }

    applyDestFilters();
}

function onUserDestSort() {
    const sortSelect = document.getElementById("destSortSelect");
    if (sortSelect) {
        selectedSort = sortSelect.value;
    }
    applyDestFilters();
}

function applyDestFilters() {
    const input = document.getElementById("destSearchInput");
    const keyword = (input ? input.value : "").trim().toLowerCase();

    filteredList = allDestinations.filter(d => {
        const matchesCategory = (selectedCategory === "all") ||
            (d.category && d.category.toLowerCase().includes(selectedCategory.toLowerCase()));

        const matchesKeyword = !keyword ||
            (d.name && d.name.toLowerCase().includes(keyword)) ||
            (d.description && d.description.toLowerCase().includes(keyword)) ||
            (d.category && d.category.toLowerCase().includes(keyword)) ||
            (d.season && d.season.toLowerCase().includes(keyword));

        return matchesCategory && matchesKeyword;
    });

    // Apply sorting
    if (selectedSort === "rating-desc") {
        filteredList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (selectedSort === "budget-asc") {
        filteredList.sort((a, b) => (a.budget || 0) - (b.budget || 0));
    } else if (selectedSort === "budget-desc") {
        filteredList.sort((a, b) => (b.budget || 0) - (a.budget || 0));
    } else if (selectedSort === "name-asc") {
        filteredList.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    currentPage = 1;
    renderDestinationsPage();
}

function renderDestinationsPage() {
    const grid = document.getElementById("destinationsGrid");
    const empty = document.getElementById("destEmpty");
    const pagWrapper = document.getElementById("destPaginationWrapper");
    const pageLabel = document.getElementById("pageCountLabel");

    if (!grid) return;

    if (!filteredList.length) {
        grid.style.display = "none";
        if (empty) empty.classList.remove("d-none");
        if (pagWrapper) pagWrapper.style.setProperty("display", "none", "important");
        return;
    }

    if (empty) empty.classList.add("d-none");
    grid.style.display = "flex";
    if (pagWrapper) pagWrapper.style.setProperty("display", "flex", "important");

    const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, filteredList.length);
    const pageItems = filteredList.slice(startIdx, endIdx);

    if (pageLabel) {
        pageLabel.textContent = `Showing ${startIdx + 1}–${endIdx} of ${filteredList.length} destinations (Page ${currentPage} of ${totalPages})`;
    }

    grid.innerHTML = pageItems.map(d => {
        const isFav = userFavoriteIds.has(d.destinationId);
        const imgUrl = getImageUrl(d.imageUrl);

        return `
            <div class="col-lg-4 col-md-6">
                <div class="dest-card" style="background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);transition:all .25s;position:relative;height:100%;border:1px solid #f1f5f9;">
                    <button type="button" title="${isFav ? 'Remove Favorite' : 'Save Favorite'}"
                        style="position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.95);border:none;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.15);color:${isFav?'#ef4444':'#94a3b8'};transition:all .2s;z-index:10;"
                        onclick="toggleUserFavorite(event, ${d.destinationId})">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <img src="${imgUrl}" alt="${escapeHtml(d.name)}" style="height:200px;width:100%;object-fit:cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';">
                    <div style="padding:18px;display:flex;flex-direction:column;">
                        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
                            <span style="background:#ede9fe;color:#7c3aed;border-radius:20px;font-size:.75rem;font-weight:600;padding:3px 10px;">${escapeHtml(d.category || 'Travel')}</span>
                            <span style="background:#dcfce7;color:#16a34a;border-radius:20px;font-size:.75rem;font-weight:600;padding:3px 10px;">${escapeHtml(d.season || 'Any Season')}</span>
                            <span id="ratingPill_${d.destinationId}" class="rating-pill-interactive" title="Click to rate this destination" onclick="openRatingModal(${d.destinationId}, '${escapeHtml(d.name).replace(/'/g, "\\'")}', ${d.rating || 5}, (newRating) => updateCardRating(${d.destinationId}, newRating))" style="background:#fef9c3;color:#a16207;border-radius:20px;font-size:.75rem;font-weight:600;padding:3px 10px;cursor:pointer;border:1px dashed #fde047;">
                                <i class="fa-solid fa-star text-warning"></i> <span id="ratingVal_${d.destinationId}">${d.rating != null ? d.rating.toFixed(1) : '5.0'}</span> <small style="font-size:0.7rem;opacity:0.8;">· Rate</small>
                            </span>
                        </div>
                        <div style="font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:6px;">${escapeHtml(d.name)}</div>
                        <p style="color:#64748b;font-size:.85rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;flex-grow:1;margin-bottom:12px;">${escapeHtml(d.description || '')}</p>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:12px;border-top:1px solid #f1f5f9;">
                            <strong style="font-size:1.1rem;color:#059669;">₹${formatNum(d.budget)}</strong>
                            <a href="booking.jsp?destinationId=${d.destinationId}" style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:20px;padding:7px 18px;font-size:.85rem;font-weight:600;text-decoration:none;">
                                <i class="fa-solid fa-ticket me-1"></i> Book
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join("");

    renderPaginationControls(totalPages);
}

function updateCardRating(destId, newRating) {
    const valEl = document.getElementById(`ratingVal_${destId}`);
    if (valEl) {
        valEl.textContent = Number(newRating).toFixed(1);
    }
    // Also update in memory arrays
    const target = allDestinations.find(d => d.destinationId === destId);
    if (target) target.rating = newRating;
    const targetF = filteredList.find(d => d.destinationId === destId);
    if (targetF) targetF.rating = newRating;
}

function renderPaginationControls(totalPages) {
    const nav = document.getElementById("destPaginationNav");
    if (!nav) return;

    if (totalPages <= 1) {
        nav.innerHTML = "";
        return;
    }

    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="goToDestPage(${currentPage - 1})">
                <i class="fa-solid fa-angle-left"></i> Prev
            </button>
        </li>`;

    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
            html += `
                <li class="page-item ${p === currentPage ? 'active' : ''}">
                    <button class="page-link" onclick="goToDestPage(${p})">${p}</button>
                </li>`;
        } else if (p === currentPage - 2 || p === currentPage + 2) {
            html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
        }
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" onclick="goToDestPage(${currentPage + 1})">
                Next <i class="fa-solid fa-angle-right"></i>
            </button>
        </li>`;

    nav.innerHTML = html;
}

function goToDestPage(page) {
    const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderDestinationsPage();
    window.scrollTo({ top: 400, behavior: "smooth" });
}

async function toggleUserFavorite(event, destinationId) {
    event.stopPropagation();
    const btn = event.currentTarget;
    const isFav = userFavoriteIds.has(destinationId);

    try {
        if (isFav) {
            const res = await fetch(`${FAV_API}/remove/${destinationId}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            if (handleAuthError(res)) return;
            userFavoriteIds.delete(destinationId);
            btn.classList.remove("active");
            btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            btn.title = "Save Favorite";
            showMessage("Removed from favorites.", "info");
        } else {
            const res = await fetch(`${FAV_API}/add/${destinationId}`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            if (handleAuthError(res)) return;
            userFavoriteIds.add(destinationId);
            btn.classList.add("active");
            btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            btn.title = "Remove Favorite";
            showMessage("Destination added to favorites! ❤️", "success");
        }
    } catch (err) {
        console.error("Favorite toggle error:", err);
        showMessage("Could not update favorite status.", "danger");
    }
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
}

function formatNum(v) {
    return v != null ? Number(v).toLocaleString("en-IN") : "0";
}