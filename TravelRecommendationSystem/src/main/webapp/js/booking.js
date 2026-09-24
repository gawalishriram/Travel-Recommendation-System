"use strict";

const BOOKING_API     = "http://localhost:8080/bookings";
const DESTINATION_API = "http://localhost:8080/destinations";

let destCache = {};
let allDestinationsList = [];
let allBookingsList = [];
let currentFilter = "ALL";
let selectedDestBudget = 0;

document.addEventListener("DOMContentLoaded", () => {
    if (!checkLogin()) return;
    loadUserName();

    // Set minimum travel date to today
    const dateInput = document.getElementById("travelDate");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    loadAllDestinationsForDropdown();
    loadBookings();
});

async function loadAllDestinationsForDropdown() {
    const select = document.getElementById("destinationSelect");
    if (!select) return;

    try {
        const res = await fetch(DESTINATION_API, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            allDestinationsList = Array.isArray(data) ? data : [];
            allDestinationsList.forEach(d => {
                destCache[d.destinationId] = d;
                const opt = document.createElement("option");
                opt.value = d.destinationId;
                opt.textContent = `${d.name || 'Destination'} (₹${Number(d.budget || 0).toLocaleString("en-IN")}/person)`;
                select.appendChild(opt);
            });

            // Check URL param after options are loaded
            const params = new URLSearchParams(window.location.search);
            const destinationId = params.get("destinationId");
            if (destinationId) {
                select.value = destinationId;
                const field = document.getElementById("destinationId");
                if (field) field.value = destinationId;
                loadDestinationPreview(destinationId);
            }
        }
    } catch (e) {
        console.error("Failed to load destinations for dropdown", e);
    }
}

function onDestSelectChange(val) {
    const field = document.getElementById("destinationId");
    if (field) field.value = val;
    if (val) {
        loadDestinationPreview(val);
    } else {
        hideDestPreview();
    }
}

let previewTimeout = null;
function onDestIdInput(val) {
    clearTimeout(previewTimeout);
    const select = document.getElementById("destinationSelect");
    if (select) select.value = val || "";

    if (!val) { hideDestPreview(); return; }
    previewTimeout = setTimeout(() => loadDestinationPreview(val), 400);
}

async function loadDestinationPreview(id) {
    if (!id) return;
    if (destCache[id]) { renderDestPreview(destCache[id]); return; }
    try {
        const res = await fetch(`${DESTINATION_API}/${id}`, { headers: { "Accept": "application/json" } });
        if (!res.ok) { hideDestPreview(); return; }
        const d = await res.json();
        destCache[id] = d;
        renderDestPreview(d);
    } catch (e) { hideDestPreview(); }
}

function renderDestPreview(d) {
    const box   = document.getElementById("destInfoBox");
    const title = document.getElementById("destTitle");
    const meta  = document.getElementById("destMeta");
    const thumb = document.getElementById("destThumb");
    if (!box || !title) return;

    selectedDestBudget = Number(d.budget || 0);

    title.textContent = d.name || "Selected Destination";
    if (meta) {
        meta.innerHTML = `<span class="badge bg-primary bg-opacity-10 text-primary me-1">${d.category || 'Travel'}</span> ₹${selectedDestBudget.toLocaleString("en-IN")} / person &bull; ${d.season || 'All season'}`;
    }
    if (thumb) {
        thumb.src = getImageUrl(d.imageUrl);
        thumb.style.display = "block";
    }
    box.style.display = "block";
    updateLivePrice();
}

function hideDestPreview() {
    const box = document.getElementById("destInfoBox");
    if (box) box.style.display = "none";
    selectedDestBudget = 0;
    updateLivePrice();
}

function adjustTravelers(delta) {
    const input = document.getElementById("numberOfTravelers");
    if (!input) return;
    let count = Number(input.value) || 1;
    count += delta;
    if (count < 1) count = 1;
    if (count > 50) count = 50;
    input.value = count;
    updateLivePrice();
}

function updateLivePrice() {
    const travelers = Number(document.getElementById("numberOfTravelers")?.value) || 1;
    const priceDisplay = document.getElementById("liveTotalPrice");
    if (!priceDisplay) return;

    if (selectedDestBudget > 0) {
        const total = selectedDestBudget * travelers;
        priceDisplay.textContent = `₹${total.toLocaleString("en-IN")}`;
    } else {
        priceDisplay.textContent = "—";
    }
}

async function createBooking(event) {
    if (event) event.preventDefault();
    if (!checkLogin()) return;

    const destinationId     = document.getElementById("destinationId")?.value;
    const travelDate        = document.getElementById("travelDate")?.value;
    const numberOfTravelers = document.getElementById("numberOfTravelers")?.value;
    const confirmBtn        = document.getElementById("confirmBtn");

    if (!destinationId || !travelDate || !numberOfTravelers) {
        showMessage("Please fill all booking details.", "warning");
        return;
    }

    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Reserving...';
    }

    try {
        const response = await fetch(BOOKING_API, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                destinationId: Number(destinationId),
                travelDate: travelDate,
                numberOfTravelers: Number(numberOfTravelers)
            })
        });
        if (handleAuthError(response)) return;
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Booking failed.");

        showMessage("🎉 Trip Reserved Successfully! Have an incredible journey!", "success");
        document.getElementById("bookingForm")?.reset();
        hideDestPreview();
        loadBookings();
    } catch (err) {
        console.error(err);
        showMessage(err.message || "Booking error.", "danger");
    } finally {
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Confirm & Reserve Trip';
        }
    }
}

async function loadBookings() {
    const listEl = document.getElementById("bookingHistoryList");
    if (!listEl) return;
    listEl.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-3 text-muted fw-semibold">Loading your reservations...</p></div>`;

    try {
        const response = await fetch(BOOKING_API, { method: "GET", headers: getAuthHeaders() });
        if (handleAuthError(response)) return;
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load bookings");

        allBookingsList = Array.isArray(data) ? data : [];
        updateBookingKPIs(allBookingsList);
        renderFilteredBookings();
    } catch (err) {
        console.error(err);
        listEl.innerHTML = `<div class="alert alert-danger">${err.message || "Server error."}</div>`;
    }
}

function updateBookingKPIs(bookings) {
    const totalEl = document.getElementById("kpiTotalBookings");
    const activeEl = document.getElementById("kpiActiveTrips");
    const spentEl = document.getElementById("kpiTotalSpent");

    const totalCount = bookings.length;
    const activeCount = bookings.filter(b => b.status === "CONFIRMED").length;
    const totalSpent = bookings
        .filter(b => b.status === "CONFIRMED")
        .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

    if (totalEl) totalEl.textContent = totalCount;
    if (activeEl) activeEl.textContent = activeCount;
    if (spentEl) spentEl.textContent = `₹${totalSpent.toLocaleString("en-IN")}`;
}

function filterBookings(filter, btnElement) {
    currentFilter = filter;
    const btns = document.querySelectorAll(".filter-tab-btn");
    btns.forEach(b => b.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");
    renderFilteredBookings();
}

function renderFilteredBookings() {
    const listEl = document.getElementById("bookingHistoryList");
    const countSubtext = document.getElementById("bookingCountSubtext");
    if (!listEl) return;
    listEl.innerHTML = "";

    let displayed = allBookingsList;
    if (currentFilter === "CONFIRMED") {
        displayed = allBookingsList.filter(b => b.status === "CONFIRMED");
    } else if (currentFilter === "CANCELLED") {
        displayed = allBookingsList.filter(b => b.status === "CANCELLED");
    }

    if (countSubtext) {
        countSubtext.textContent = `Showing ${displayed.length} of ${allBookingsList.length} trips`;
    }

    if (!displayed.length) {
        listEl.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="fa-solid fa-plane-slash" style="font-size:3.2rem;color:#cbd5e1;"></i>
                <h6 class="mt-3 fw-bold text-dark">No ${currentFilter === "ALL" ? "" : currentFilter.toLowerCase()} bookings found</h6>
                <p class="small text-muted">Select a destination on the left to make your next reservation.</p>
            </div>`;
        return;
    }

    displayed.forEach(b => {
        const isConfirmed = b.status === "CONFIRMED";
        const card = document.createElement("div");
        card.className = `ticket-card ${isConfirmed ? "confirmed" : "cancelled"}`;

        card.innerHTML = `
            <div class="ticket-left-strip">
                <i class="fa-solid fa-plane-departure text-primary fs-3 mb-2"></i>
                <small class="fw-bold text-muted" style="font-size:0.7rem;">BOOKING</small>
                <span class="fw-bold text-dark" style="font-size:0.85rem;">#${b.bookingId}</span>
            </div>
            <div class="ticket-main">
                <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                        <div class="ticket-dest-name">
                            <i class="fa-solid fa-location-dot text-primary me-2"></i>${escapeHtml(b.destinationName || "Destination")}
                        </div>
                        <div class="ticket-meta-row">
                            <div class="ticket-meta-item">
                                <i class="fa-solid fa-calendar-day text-secondary"></i>
                                <span><strong>${b.travelDate}</strong></span>
                            </div>
                            <div class="ticket-meta-item">
                                <i class="fa-solid fa-users text-secondary"></i>
                                <span>${b.numberOfTravelers} Traveler${b.numberOfTravelers > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-end">
                        <span class="${isConfirmed ? 'status-pill-confirmed' : 'status-pill-cancelled'}">
                            <i class="fa-solid fa-circle" style="font-size:6px;"></i> ${b.status}
                        </span>
                    </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div>
                        <small class="text-muted d-block" style="font-size:0.75rem;">Total Amount</small>
                        <span class="ticket-price">₹${Number(b.totalAmount || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                        ${isConfirmed ? `
                            <button type="button" class="btn-cancel-ticket" onclick="cancelBooking(${b.bookingId}, this)">
                                <i class="fa-solid fa-xmark me-1"></i> Cancel Reservation
                            </button>
                        ` : `
                            <span class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill" style="font-size:0.75rem;">Cancelled</span>
                        `}
                    </div>
                </div>
            </div>`;
        listEl.appendChild(card);
    });
}

async function cancelBooking(bookingId, btn) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i>Cancelling...';
    }
    try {
        const response = await fetch(`${BOOKING_API}/cancel/${bookingId}`, { method: "PUT", headers: getAuthHeaders() });
        if (handleAuthError(response)) return;
        if (!response.ok) throw new Error("Could not cancel booking.");
        showMessage("Booking cancelled successfully.", "info");
        loadBookings();
    } catch (err) {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-xmark me-1"></i> Cancel Reservation';
        }
        showMessage(err.message || "Error cancelling booking.", "danger");
    }
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}
