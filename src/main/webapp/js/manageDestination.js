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
                             this.src='';"
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

function getImageUrl(
    imageUrl
) {

    if (!imageUrl) {
        return "";
    }

    if (
        imageUrl.startsWith(
            "http://"
        )
        ||
        imageUrl.startsWith(
            "https://"
        )
    ) {

        return imageUrl;
    }

    return BACKEND_URL +
        (
            imageUrl.startsWith("/")
                ? imageUrl
                : "/" + imageUrl
        );
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