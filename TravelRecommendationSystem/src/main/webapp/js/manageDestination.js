"use strict";

const BACKEND_URL =
    "http://localhost:8080";

const DESTINATION_API =
    BACKEND_URL + "/destinations";

const ITEMS_PER_PAGE = 10;

let allDestinations = [];

let filteredDestinations = [];

let currentPage = 1;

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (!checkAdminAuthentication()) {
            return;
        }

        const searchInput =
            document.getElementById(
                "destinationSearch"
            );

        const refreshButton =
            document.getElementById(
                "refreshDestinationsBtn"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                handleSearch
            );
        }

        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                loadDestinations
            );
        }

        loadDestinations();
    }
);

// =====================================================
// AUTHENTICATION
// =====================================================

function checkAdminAuthentication() {

    const token =
        localStorage.getItem(
            "adminToken"
        );

    if (!token) {

        window.location.href =
            "adminLogin.jsp";

        return false;
    }

    return true;
}

function getAdminHeaders() {

    const token =
        localStorage.getItem(
            "adminToken"
        );

    return {
        "Authorization":
            "Bearer " + token,

        "Accept":
            "application/json"
    };
}

// =====================================================
// LOAD DESTINATIONS
// =====================================================

async function loadDestinations() {

    const tableBody =
        document.getElementById(
            "destinationTableBody"
        );

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = `
        <tr>
            <td colspan="9"
                class="text-center text-muted py-5">

                <i class="fa-solid fa-spinner fa-spin me-2"></i>

                Loading destinations...

            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(
                DESTINATION_API,
                {
                    method: "GET",
                    headers: getAdminHeaders()
                }
            );

        if (response.status === 401 ||
            response.status === 403) {

            logoutAdmin();
            return;
        }

        if (!response.ok) {

            throw new Error(
                "Unable to load destinations."
            );
        }

        const destinations =
            await response.json();

        allDestinations =
            Array.isArray(destinations)
                ? destinations
                : [];

        filteredDestinations =
            [...allDestinations];

        currentPage = 1;

        populateHubSelect();

        renderDestinations();

    } catch (error) {

        console.error(
            "Load destinations error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="9"
                    class="text-center text-danger py-5">

                    <i class="fa-solid fa-circle-exclamation me-2"></i>

                    Failed to load destinations.

                </td>
            </tr>
        `;
    }
}

// =====================================================
// SEARCH
// =====================================================

function handleSearch(event) {

    const keyword =
        event.target.value
            .trim()
            .toLowerCase();

    filteredDestinations =
        allDestinations.filter(
            destination => {

                return (
                    String(
                        destination.name || ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(
                        destination.category || ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(
                        destination.season || ""
                    )
                    .toLowerCase()
                    .includes(keyword)
                );
            }
        );

    currentPage = 1;

    renderDestinations();
}

// =====================================================
// RENDER
// =====================================================

function renderDestinations() {

    const tableBody =
        document.getElementById(
            "destinationTableBody"
        );

    if (!tableBody) {
        return;
    }

    const countElement =
        document.getElementById(
            "destinationCount"
        );

    if (
        !filteredDestinations ||
        filteredDestinations.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9"
                    class="text-center text-muted py-5">

                    <i class="fa-solid fa-location-dot me-2"></i>

                    No destinations found.

                </td>
            </tr>
        `;

        if (countElement) {

            countElement.textContent =
                "Showing 0 destinations";
        }

        renderPagination();

        return;
    }

    const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

    const endIndex =
        startIndex +
        ITEMS_PER_PAGE;

    const pageDestinations =
        filteredDestinations.slice(
            startIndex,
            endIndex
        );

    tableBody.innerHTML =
        pageDestinations
            .map(
                destination =>
                    createDestinationRow(
                        destination
                    )
            )
            .join("");

    if (countElement) {

        countElement.textContent =
            `Showing ${
                startIndex + 1
            }-${
                Math.min(
                    endIndex,
                    filteredDestinations.length
                )
            } of ${
                filteredDestinations.length
            } destinations`;
    }

    renderPagination();
}

// =====================================================
// CREATE ROW
// =====================================================

function createDestinationRow(
    destination
) {

    const imageUrl =
        getImageUrl(
            destination.imageUrl
        );

    const imageHtml =
        imageUrl
            ? `
                <img
                    src="${escapeHtml(imageUrl)}"
                    alt="${escapeHtml(
                        destination.name ||
                        "Destination"
                    )}"
                    class="destination-table-image"
                    onerror="this.onerror=null;
                             this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';"
                >
              `
            : `
                <div class="no-destination-image">
                    <i class="fa-solid fa-image"></i>
                </div>
              `;

    return `
        <tr>

            <td>
                ${escapeHtml(
                    destination.destinationId
                )}
            </td>

            <td>
                ${imageHtml}
            </td>

            <td>
                <strong>
                    ${escapeHtml(
                        destination.name || ""
                    )}
                </strong>
            </td>

            <td>
                <div class="description-cell">
                    ${escapeHtml(
                        destination.description || ""
                    )}
                </div>
            </td>

            <td>
                ₹${formatNumber(
                    destination.budget
                )}
            </td>

            <td>
                ${escapeHtml(
                    destination.season || ""
                )}
            </td>

            <td>
                <span class="badge bg-primary-subtle text-primary">
                    ${escapeHtml(
                        destination.category || ""
                    )}
                </span>
            </td>

            <td>
                <span class="rating-badge">
                    <i class="fa-solid fa-star"></i>

                    ${formatNumber(
                        destination.rating
                    )}
                </span>
            </td>

            <td>

                <div class="destination-actions">

                    <button
                        type="button"
                        class="btn btn-sm"
                        style="background: #ede9fe; color: #7c3aed; border: 1px solid #ddd6fe;"
                        title="Recommend Similar Destinations Based on this Spot"
                        onclick="showDestinationRecommendations(${destination.destinationId})">

                        <i class="fa-solid fa-wand-magic-sparkles"></i>

                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-info text-white"
                        title="View"
                        onclick="viewDestination(
                            ${destination.destinationId}
                        )">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-warning"
                        title="Edit"
                        onclick="editDestination(
                            ${destination.destinationId}
                        )">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        title="Delete"
                        onclick="deleteDestination(
                            ${destination.destinationId}
                        )">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>
    `;
}

// =====================================================
// IMAGE URL
// =====================================================

function getImageUrl(imageUrl) {
    const fallbackImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
    if (!imageUrl) {
        return fallbackImage;
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
        return fallbackImage;
    }

    imageUrl = imageUrl.trim();

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
        return imageUrl;
    }

    return BACKEND_URL + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
}

// =====================================================
// VIEW
// =====================================================

function viewDestination(id) {

    window.location.href =
        "viewDestination.jsp?id=" +
        encodeURIComponent(id);
}

// =====================================================
// EDIT
// =====================================================

function editDestination(id) {

    window.location.href =
        "editDestination.jsp?id=" +
        encodeURIComponent(id);
}

// =====================================================
// DELETE
// =====================================================

async function deleteDestination(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this destination?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                DESTINATION_API +
                "/" +
                id,
                {
                    method: "DELETE",
                    headers: getAdminHeaders()
                }
            );

        if (response.status === 401 ||
            response.status === 403) {

            logoutAdmin();
            return;
        }

        if (response.status === 404) {

            throw new Error(
                "Destination not found."
            );
        }

        if (!response.ok) {

            throw new Error(
                "Failed to delete destination."
            );
        }

        showDestinationMessage(
            "Destination deleted successfully.",
            "success"
        );

        await loadDestinations();

    } catch (error) {

        console.error(
            "Delete destination error:",
            error
        );

        showDestinationMessage(
            error.message ||
            "Failed to delete destination.",
            "danger"
        );
    }
}

// =====================================================
// PAGINATION
// =====================================================

function renderPagination() {

    const pagination =
        document.getElementById(
            "destinationPagination"
        );

    if (!pagination) {
        return;
    }

    const totalPages =
        Math.ceil(
            filteredDestinations.length /
            ITEMS_PER_PAGE
        );

    if (totalPages <= 1) {

        pagination.innerHTML = "";

        return;
    }

    let html = "";

    html += `
        <li class="page-item ${
            currentPage === 1
                ? "disabled"
                : ""
        }">

            <button
                class="page-link"
                onclick="changePage(
                    ${currentPage - 1}
                )">

                Previous

            </button>

        </li>
    `;

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        html += `
            <li class="page-item ${
                page === currentPage
                    ? "active"
                    : ""
            }">

                <button
                    class="page-link"
                    onclick="changePage(
                        ${page}
                    )">

                    ${page}

                </button>

            </li>
        `;
    }

    html += `
        <li class="page-item ${
            currentPage === totalPages
                ? "disabled"
                : ""
        }">

            <button
                class="page-link"
                onclick="changePage(
                    ${currentPage + 1}
                )">

                Next

            </button>

        </li>
    `;

    pagination.innerHTML =
        html;
}

function changePage(page) {

    const totalPages =
        Math.ceil(
            filteredDestinations.length /
            ITEMS_PER_PAGE
        );

    if (
        page < 1 ||
        page > totalPages
    ) {
        return;
    }

    currentPage = page;

    renderDestinations();
}

// =====================================================
// MESSAGE
// =====================================================

function showDestinationMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "destinationMessage"
        );

    if (!element) {
        return;
    }

    element.className =
        "alert alert-" + type;

    element.textContent =
        message;

    element.classList.remove(
        "d-none"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    setTimeout(
        function () {

            element.classList.add(
                "d-none"
            );

        },
        4000
    );
}

// =====================================================
// HELPERS
// =====================================================

function formatNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "0";
    }

    const number =
        Number(value);

    if (Number.isNaN(number)) {
        return "0";
    }

    return number.toFixed(2);
}

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}

function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );

    window.location.href =
        "adminLogin.jsp";
}

// =====================================================
// DESTINATION-BASED RECOMMENDATIONS
// =====================================================

function populateHubSelect() {
    const select = document.getElementById("hubDestinationSelect");
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = `<option value="">-- Choose a Destination to Match --</option>`;

    allDestinations.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.destinationId;
        opt.textContent = `${d.name || 'Destination'} (Category: ${d.category || 'General'}, Season: ${d.season || 'Any'}, ₹${formatNumber(d.budget)})`;
        select.appendChild(opt);
    });

    if (currentVal) {
        select.value = currentVal;
    }
}

function onHubDestSelect(val) {
    if (val) {
        showDestinationRecommendations(Number(val));
    }
}

function triggerHubRecommendation() {
    const select = document.getElementById("hubDestinationSelect");
    if (!select || !select.value) {
        showDestinationMessage("Please select a destination to generate recommendations.", "warning");
        return;
    }
    showDestinationRecommendations(Number(select.value));
}

function showDestinationRecommendations(destinationId) {
    const source = allDestinations.find(d => Number(d.destinationId) === Number(destinationId));
    if (!source) {
        showDestinationMessage("Selected destination not found.", "warning");
        return;
    }

    const modalTitle = document.getElementById("recoModalTitle");
    const modalSubtitle = document.getElementById("recoModalSubtitle");
    const sourceCard = document.getElementById("recoSourceCard");
    const listContainer = document.getElementById("recoModalList");

    if (modalTitle) modalTitle.textContent = `Recommendations Based on: ${source.name || 'Destination'}`;
    if (modalSubtitle) modalSubtitle.textContent = `Matched using category (${source.category || 'Any'}), season (${source.season || 'Any'}) and budget (₹${formatNumber(source.budget)})`;

    // Render Source Destination Card
    if (sourceCard) {
        const sourceImg = getImageUrl(source.imageUrl);
        sourceCard.innerHTML = `
            <div class="d-flex align-items-center gap-3 flex-wrap">
                <img src="${sourceImg}" alt="${escapeHtml(source.name)}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 12px;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';">
                <div>
                    <h6 class="fw-bold mb-1 text-dark">
                        <i class="fa-solid fa-location-dot text-primary me-1"></i> ${escapeHtml(source.name)}
                    </h6>
                    <div class="small text-muted">
                        <span class="badge bg-primary bg-opacity-10 text-primary me-1">${escapeHtml(source.category || 'Travel')}</span>
                        <span class="badge bg-success bg-opacity-10 text-success me-1">Season: ${escapeHtml(source.season || 'Any')}</span>
                        <span class="badge bg-warning bg-opacity-10 text-dark me-1">⭐ ${formatNumber(source.rating)}</span>
                        <strong>Budget: ₹${formatNumber(source.budget)}</strong>
                    </div>
                </div>
            </div>
        `;
    }

    // Compute Recommendations based on similarity score
    const otherDestinations = allDestinations.filter(d => Number(d.destinationId) !== Number(destinationId));
    const sourceBudget = Number(source.budget || 0);

    const scoredList = otherDestinations.map(d => {
        let score = 50; // base score
        const reasons = [];

        // Category match
        if (source.category && d.category && source.category.toLowerCase() === d.category.toLowerCase()) {
            score += 30;
            reasons.push("Same Category");
        }

        // Season match
        if (source.season && d.season && source.season.toLowerCase() === d.season.toLowerCase()) {
            score += 20;
            reasons.push("Same Season");
        }

        // Budget similarity
        const dBudget = Number(d.budget || 0);
        if (sourceBudget > 0 && dBudget > 0) {
            const diffRatio = Math.abs(sourceBudget - dBudget) / sourceBudget;
            if (diffRatio <= 0.3) {
                score += 15;
                reasons.push("Budget Fit");
            } else if (diffRatio <= 0.6) {
                score += 8;
                reasons.push("Similar Budget");
            }
        }

        // Rating boost
        const rating = Number(d.rating || 0);
        score += Math.round(rating * 2);

        const matchPercent = Math.min(99, Math.max(70, score));

        return {
            destination: d,
            score: score,
            matchPercent: matchPercent,
            reasons: reasons.length ? reasons : ["Similar Travel Profile"]
        };
    });

    // Sort by highest similarity score
    scoredList.sort((a, b) => b.score - a.score);
    const topRecommendations = scoredList.slice(0, 6);

    if (listContainer) {
        if (!topRecommendations.length) {
            listContainer.innerHTML = `
                <div class="col-12 text-center py-4">
                    <i class="fa-solid fa-circle-info text-muted fs-3 mb-2"></i>
                    <p class="text-muted mb-0">No other destinations available in database to recommend.</p>
                </div>
            `;
        } else {
            listContainer.innerHTML = topRecommendations.map(item => {
                const d = item.destination;
                const dImg = getImageUrl(d.imageUrl);

                return `
                    <div class="col-lg-4 col-md-6">
                        <div class="reco-modal-dest-card">
                            <div style="position:relative; height: 160px; overflow:hidden;">
                                <img src="${dImg}" alt="${escapeHtml(d.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';">
                                <span class="similarity-badge" style="position:absolute; top:10px; left:10px; box-shadow:0 2px 8px rgba(0,0,0,0.2);">
                                    <i class="fa-solid fa-sparkles"></i> ${item.matchPercent}% Match
                                </span>
                            </div>
                            <div class="p-3 d-flex flex-column flex-grow-1">
                                <h6 class="fw-bold mb-1 text-dark">${escapeHtml(d.name)}</h6>
                                <p class="small text-muted mb-2 text-truncate" style="max-height: 38px;">${escapeHtml(d.description || '')}</p>
                                
                                <div class="d-flex flex-wrap gap-1 mb-3">
                                    <span class="badge bg-primary-subtle text-primary" style="font-size:0.72rem;">${escapeHtml(d.category || 'Travel')}</span>
                                    <span class="badge bg-success-subtle text-success" style="font-size:0.72rem;">${escapeHtml(d.season || 'Any')}</span>
                                    <span class="badge bg-warning-subtle text-dark" style="font-size:0.72rem;">⭐ ${formatNumber(d.rating)}</span>
                                </div>

                                <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                                    <strong class="text-success" style="font-size:0.95rem;">₹${formatNumber(d.budget)}</strong>
                                    <div class="d-flex gap-1">
                                        <button type="button" class="btn btn-sm btn-outline-info" title="View Details" onclick="viewDestination(${d.destinationId})">
                                            <i class="fa-solid fa-eye"></i>
                                        </button>
                                        <button type="button" class="btn btn-sm btn-outline-warning" title="Edit" onclick="editDestination(${d.destinationId})">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }

    // Show modal
    const modalEl = document.getElementById("destinationRecoModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}