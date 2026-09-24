"use strict";

const BACKEND_API = "http://localhost:8080";
const BOOKINGS_API = `${BACKEND_API}/bookings/admin/all`;
const CANCEL_BOOKING_API = `${BACKEND_API}/bookings/cancel`;

const PAGE_SIZE = 10;
let allBookings = [];
let filteredBookings = [];
let currentPage = 1;
let selectedStatus = "ALL";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    if (!checkAdminAuth()) return;

    setupBookingSearch();
    setupStatusFilters();
    loadBookings();
});

function getAdminToken() {
    return localStorage.getItem("adminToken") || localStorage.getItem("token");
}

function checkAdminAuth() {
    const token = getAdminToken();
    if (!token) {
        window.location.replace("login.jsp?role=admin");
        return false;
    }
    return true;
}

function setupBookingSearch() {
    const searchInput = document.getElementById("bookingSearch");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        currentPage = 1;
        applyFilters();
    });
}

function setupStatusFilters() {
    const buttons = document.querySelectorAll(".filter-status-btn");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            buttons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            selectedStatus = btn.dataset.status || "ALL";
            currentPage = 1;
            applyFilters();
        });
    });
}

function resetBookingFilters() {
    const searchInput = document.getElementById("bookingSearch");
    if (searchInput) searchInput.value = "";
    searchQuery = "";

    const buttons = document.querySelectorAll(".filter-status-btn");
    buttons.forEach((b) => b.classList.remove("active"));
    const allBtn = document.querySelector('.filter-status-btn[data-status="ALL"]');
    if (allBtn) allBtn.classList.add("active");

    selectedStatus = "ALL";
    currentPage = 1;
    applyFilters();
}

async function loadBookings() {
    const tableBody = document.getElementById("bookingTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr>
            <td colspan="9" class="text-center py-5 text-muted">
                <i class="fa-solid fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                <p class="mb-0">Loading customer bookings...</p>
            </td>
        </tr>
    `;

    const token = getAdminToken();
    if (!token) {
        showBookingError("Admin session expired. Please login again.");
        return;
    }

    try {
        const response = await fetch(BOOKINGS_API, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            showBookingError("Session expired or unauthorized. Please login as admin.");
            return;
        }

        if (!response.ok) {
            throw new Error(`Failed to load bookings (Status: ${response.status})`);
        }

        const data = await response.json();
        allBookings = Array.isArray(data) ? data : [];
        updateBookingStatistics();
        applyFilters();

    } catch (error) {
        console.error("Error loading bookings:", error);
        showBookingError(error.message || "Failed to connect to backend server.");
    }
}

function updateBookingStatistics() {
    const total = allBookings.length;
    let confirmed = 0;
    let cancelled = 0;
    let revenue = 0;

    allBookings.forEach((b) => {
        const status = (b.status || "").toUpperCase();
        if (status === "CONFIRMED") {
            confirmed++;
            revenue += Number(b.totalAmount || 0);
        } else if (status === "CANCELLED") {
            cancelled++;
        }
    });

    const statTotal = document.getElementById("statTotalBookings");
    const statConfirmed = document.getElementById("statConfirmedBookings");
    const statCancelled = document.getElementById("statCancelledBookings");
    const statRevenue = document.getElementById("statTotalRevenue");

    if (statTotal) statTotal.textContent = total;
    if (statConfirmed) statConfirmed.textContent = confirmed;
    if (statCancelled) statCancelled.textContent = cancelled;
    if (statRevenue) statRevenue.textContent = "₹" + revenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function applyFilters() {
    filteredBookings = allBookings.filter((b) => {
        const status = (b.status || "").toUpperCase();
        if (selectedStatus !== "ALL" && status !== selectedStatus) {
            return false;
        }

        if (searchQuery) {
            const userName = (b.userName || "").toLowerCase();
            const destName = (b.destinationName || "").toLowerCase();
            const bookingId = String(b.bookingId || "");
            const userId = String(b.userId || "");
            if (
                !userName.includes(searchQuery) &&
                !destName.includes(searchQuery) &&
                !bookingId.includes(searchQuery) &&
                !userId.includes(searchQuery)
            ) {
                return false;
            }
        }

        return true;
    });

    renderBookings();
}

function renderBookings() {
    const tableBody = document.getElementById("bookingTableBody");
    const countBadge = document.getElementById("bookingCountBadge");
    const subText = document.getElementById("bookingSubText");

    if (!tableBody) return;

    if (countBadge) countBadge.textContent = `${filteredBookings.length} Bookings`;

    if (filteredBookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-5 text-muted">
                    <i class="fa-solid fa-ticket-simple fa-2x text-muted mb-2 d-block"></i>
                    <p class="mb-0 fw-semibold">No bookings found</p>
                    <small class="text-secondary">Try adjusting your search or filters.</small>
                </td>
            </tr>
        `;
        if (subText) subText.textContent = "Showing 0 bookings";
        renderBookingPagination();
        return;
    }

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageBookings = filteredBookings.slice(startIndex, endIndex);

    if (subText) {
        subText.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, filteredBookings.length)} of ${filteredBookings.length} bookings`;
    }

    tableBody.innerHTML = pageBookings.map((b) => {
        const status = (b.status || "CONFIRMED").toUpperCase();
        let badgeClass = "bg-success";
        if (status === "CANCELLED") badgeClass = "bg-danger";
        else if (status === "PENDING") badgeClass = "bg-warning text-dark";

        const travelDateStr = b.travelDate ? new Date(b.travelDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "—";
        const bookedOnStr = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "—";

        let imgHtml = '';
        if (b.destinationImage) {
            const imgUrl = b.destinationImage.startsWith("http") ? b.destinationImage : `${BACKEND_API}${b.destinationImage.startsWith("/") ? "" : "/"}${b.destinationImage}`;
            imgHtml = `<img src="${escapeHtml(imgUrl)}" alt="Destination" class="dest-thumb me-2" onerror="this.onerror=null;this.parentElement.innerHTML='<span class=\\'dest-thumb-placeholder me-2\\'><i class=\\'fa-solid fa-image\\'></i></span>';">`;
        } else {
            imgHtml = `<span class="dest-thumb-placeholder me-2"><i class="fa-solid fa-image"></i></span>`;
        }

        const travelers = b.numberOfTravelers || b.numberOfPeople || 1;
        const total = Number(b.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const canCancel = status !== "CANCELLED";

        return `
            <tr>
                <td><span class="badge bg-light text-dark border">#${b.bookingId}</span></td>
                <td>
                    <div class="fw-semibold text-dark">${escapeHtml(b.userName || "Customer")}</div>
                    <small class="text-muted">User ID: #${b.userId}</small>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        ${imgHtml}
                        <span class="fw-semibold text-truncate" style="max-width: 180px;">${escapeHtml(b.destinationName || "Destination")}</span>
                    </div>
                </td>
                <td><i class="fa-regular fa-calendar me-1 text-primary"></i> ${travelDateStr}</td>
                <td><i class="fa-solid fa-user-group me-1 text-secondary"></i> ${travelers}</td>
                <td><span class="fw-bold text-primary">₹${total}</span></td>
                <td><span class="badge ${badgeClass} px-3 py-2 rounded-pill">${status}</span></td>
                <td><small class="text-muted">${bookedOnStr}</small></td>
                <td class="text-center">
                    ${canCancel ? `
                        <button type="button" class="btn btn-outline-danger btn-sm rounded-pill px-3" 
                                onclick="cancelBooking(${b.bookingId}, '${escapeHtml(b.userName || "Customer")}')" title="Cancel Booking">
                            <i class="fa-solid fa-ban me-1"></i> Cancel
                        </button>
                    ` : `
                        <span class="text-muted small"><i class="fa-solid fa-check text-muted me-1"></i> None</span>
                    `}
                </td>
            </tr>
        `;
    }).join("");

    renderBookingPagination();
}

function renderBookingPagination() {
    const pagination = document.getElementById("bookingPagination");
    if (!pagination) return;

    const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = "";

    html += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <button class="page-link" onclick="changeBookingPage(${currentPage - 1})">Previous</button>
        </li>
    `;

    for (let p = 1; p <= totalPages; p++) {
        html += `
            <li class="page-item ${p === currentPage ? "active" : ""}">
                <button class="page-link" onclick="changeBookingPage(${p})">${p}</button>
            </li>
        `;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <button class="page-link" onclick="changeBookingPage(${currentPage + 1})">Next</button>
        </li>
    `;

    pagination.innerHTML = html;
}

function changeBookingPage(page) {
    const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderBookings();
}

async function cancelBooking(bookingId, customerName) {
    if (!confirm(`Are you sure you want to cancel booking #${bookingId} for customer ${customerName}?`)) {
        return;
    }

    const token = getAdminToken();
    try {
        const response = await fetch(`${CANCEL_BOOKING_API}/${bookingId}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to cancel booking.");
        }

        showBookingMessage(`Booking #${bookingId} has been successfully cancelled.`, "success");
        loadBookings();

    } catch (error) {
        console.error("Cancel error:", error);
        showBookingMessage(error.message || "Unable to cancel booking.", "danger");
    }
}

function showBookingMessage(msg, type) {
    const alertBox = document.getElementById("bookingMessage");
    if (!alertBox) return;

    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = msg;
    alertBox.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
        alertBox.classList.add("d-none");
    }, 4000);
}

function showBookingError(message) {
    const tableBody = document.getElementById("bookingTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr>
            <td colspan="9" class="text-center py-5 text-danger">
                <i class="fa-solid fa-triangle-exclamation fa-2x text-danger mb-2 d-block"></i>
                <p class="fw-semibold mb-1">Unable to Load Bookings</p>
                <small class="text-muted d-block mb-3">${escapeHtml(message)}</small>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-primary btn-sm rounded-pill px-3" onclick="loadBookings()">
                        <i class="fa-solid fa-arrows-rotate me-1"></i> Try Again
                    </button>
                    <a href="login.jsp?role=admin" class="btn btn-outline-secondary btn-sm rounded-pill px-3">
                        <i class="fa-solid fa-right-to-bracket me-1"></i> Login as Admin
                    </a>
                </div>
            </td>
        </tr>
    `;
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
