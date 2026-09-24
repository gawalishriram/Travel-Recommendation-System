"use strict";

const DESTINATION_API = "http://localhost:8080/api/destinations";

const ITEMS_PER_PAGE = 10;

let allDestinations = [];

let filteredDestinations = [];

let currentPage = 1;

document.addEventListener("DOMContentLoaded", function () {

    const destinationForm =
        document.getElementById("destinationForm");

    const destinationSearch =
        document.getElementById("destinationSearch");

    const refreshButton =
        document.getElementById("refreshDestinationsBtn");

    if (destinationForm) {

        destinationForm.addEventListener(
            "submit",
            addDestination
        );

    }

    if (destinationSearch) {

        destinationSearch.addEventListener(
            "input",
            handleDestinationSearch
        );

    }

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadDestinations
        );

    }

    if (
        document.getElementById("destinationTableBody")
    ) {

        loadDestinations();

    }

});

function addDestination(event) {

    event.preventDefault();

    const form =
        document.getElementById("destinationForm");

    if (!form) {
        return;
    }

    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }

    const button =
        document.getElementById("addDestinationBtn");

    const destination = {

        name:
            document.getElementById("name").value.trim(),

        description:
            document.getElementById("description").value.trim(),

        budget:
            Number(document.getElementById("budget").value),

        season:
            document.getElementById("season").value,

        category:
            document.getElementById("category").value,

        rating:
            Number(document.getElementById("rating").value),

        imageUrl:
            document.getElementById("imageUrl").value.trim()

    };

    if (button) {

        button.disabled = true;

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin me-2"></i>' +
            "Adding...";

    }

    fetch(DESTINATION_API, {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            "Accept": "application/json"

        },

        body: JSON.stringify(destination)

    })

    .then(function (response) {

        return response.text().then(function (text) {

            let data = {};

            if (text) {

                try {

                    data = JSON.parse(text);

                } catch (error) {

                    data = {};

                }

            }

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to add destination."
                );

            }

            return data;

        });

    })

    .then(function () {

        showDestinationMessage(
            "Destination added successfully.",
            "success"
        );

        form.reset();

        const rating =
            document.getElementById("rating");

        if (rating) {
            rating.value = "0";
        }

    })

    .catch(function (error) {

        console.error(
            "Add destination error:",
            error
        );

        showDestinationMessage(
            error.message ||
            "Failed to add destination.",
            "danger"
        );

    })

    .finally(function () {

        if (button) {

            button.disabled = false;

            button.innerHTML =
                '<i class="fa-solid fa-plus me-2"></i>' +
                "Add Destination";

        }

    });

}

function loadDestinations() {

    const tableBody =
        document.getElementById("destinationTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = `

        <tr>

            <td
                colspan="9"
                class="text-center text-muted py-5">

                <i
                    class="fa-solid fa-spinner fa-spin me-2">
                </i>

                Loading destinations...

            </td>

        </tr>

    `;

    fetch(DESTINATION_API, {

        method: "GET",

        headers: {

            "Accept": "application/json"

        }

    })

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Unable to load destinations."
            );

        }

        return response.json();

    })

    .then(function (data) {

        if (Array.isArray(data)) {

            allDestinations = data;

        } else if (
            data &&
            Array.isArray(data.content)
        ) {

            allDestinations = data.content;

        } else if (
            data &&
            Array.isArray(data.data)
        ) {

            allDestinations = data.data;

        } else {

            allDestinations = [];

        }

        filteredDestinations =
            [...allDestinations];

        currentPage = 1;

        renderDestinations();

    })

    .catch(function (error) {

        console.error(
            "Load destinations error:",
            error
        );

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="text-center text-danger py-5">

                    <i
                        class="fa-solid fa-circle-exclamation
                               me-2">
                    </i>

                    ${escapeHtml(error.message)}

                </td>

            </tr>

        `;

        updatePaginationInfo();

    });

}

function handleDestinationSearch(event) {

    const searchText =
        event.target.value.trim().toLowerCase();

    if (!searchText) {

        filteredDestinations =
            [...allDestinations];

    } else {

        filteredDestinations =
            allDestinations.filter(
                function (destination) {

                    const name =
                        String(
                            destination.name || ""
                        ).toLowerCase();

                    const description =
                        String(
                            destination.description || ""
                        ).toLowerCase();

                    const season =
                        String(
                            destination.season || ""
                        ).toLowerCase();

                    const category =
                        String(
                            destination.category || ""
                        ).toLowerCase();

                    return (
                        name.includes(searchText) ||
                        description.includes(searchText) ||
                        season.includes(searchText) ||
                        category.includes(searchText)
                    );

                }
            );

    }

    currentPage = 1;

    renderDestinations();

}

function renderDestinations() {

    const tableBody =
        document.getElementById("destinationTableBody");

    if (!tableBody) {
        return;
    }

    const totalItems =
        filteredDestinations.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalItems / ITEMS_PER_PAGE
            )
        );

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

    const endIndex =
        startIndex +
        ITEMS_PER_PAGE;

    const pageItems =
        filteredDestinations.slice(
            startIndex,
            endIndex
        );

    if (pageItems.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="text-center text-muted py-5">

                    <i
                        class="fa-solid fa-folder-open
                               fa-2x mb-3">
                    </i>

                    <div>
                        No destinations found.
                    </div>

                </td>

            </tr>

        `;

    } else {

        tableBody.innerHTML =
            pageItems
                .map(createDestinationRow)
                .join("");

    }

    renderDestinationPagination(
        totalPages
    );

    updatePaginationInfo();

}

function createDestinationRow(destination) {

    const id =
        destination.destinationId ??
        destination.id ??
        "";

    const name =
        destination.name ??
        "N/A";

    const description =
        destination.description ??
        "N/A";

    const budget =
        destination.budget ??
        0;

    const season =
        destination.season ??
        "N/A";

    const category =
        destination.category ??
        "N/A";

    const rating =
        destination.rating ??
        0;

    const imageUrl =
        destination.imageUrl ??
        destination.image ??
        "";

    const imageHtml = imageUrl
        ? `
            <img
                src="${escapeAttribute(imageUrl)}"
                alt="${escapeAttribute(name)}"
                class="destination-table-image"
                onerror="this.src=''; this.classList.add('image-error');">
          `
        : `
            <div class="destination-no-image">
                <i class="fa-solid fa-image"></i>
            </div>
          `;

    return `

        <tr>

            <td>
                ${escapeHtml(id)}
            </td>

            <td>
                ${imageHtml}
            </td>

            <td>

                <strong>
                    ${escapeHtml(name)}
                </strong>

            </td>

            <td>

                <div
                    class="destination-description"
                    title="${escapeAttribute(description)}">

                    ${escapeHtml(description)}

                </div>

            </td>

            <td>

                <strong>
                    ₹${formatNumber(budget)}
                </strong>

            </td>

            <td>

                <span class="badge bg-info-subtle
                             text-info-emphasis">

                    ${escapeHtml(season)}

                </span>

            </td>

            <td>

                <span class="badge bg-primary-subtle
                             text-primary-emphasis">

                    ${escapeHtml(category)}

                </span>

            </td>

            <td>

                <span class="text-warning">

                    <i class="fa-solid fa-star"></i>

                </span>

                ${escapeHtml(rating)}

            </td>

            <td>

                <div
                    class="d-flex
                           justify-content-center
                           gap-2">

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-primary"
                        onclick="editDestination(${Number(id)})"
                        title="Edit">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        onclick="deleteDestination(${Number(id)})"
                        title="Delete">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

    `;

}

function renderDestinationPagination(totalPages) {

    const pagination =
        document.getElementById(
            "destinationPagination"
        );

    if (!pagination) {
        return;
    }

    pagination.innerHTML = "";

    if (
        filteredDestinations.length <=
        ITEMS_PER_PAGE
    ) {

        return;

    }

    const previousLi =
        document.createElement("li");

    previousLi.className =
        "page-item" +
        (
            currentPage === 1
                ? " disabled"
                : ""
        );

    previousLi.innerHTML = `

        <button
            class="page-link"
            type="button">

            <i class="fa-solid fa-chevron-left"></i>

        </button>

    `;

    previousLi
        .querySelector("button")
        .addEventListener(
            "click",
            function () {

                if (currentPage > 1) {

                    currentPage--;

                    renderDestinations();

                }

            }
        );

    pagination.appendChild(previousLi);

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageLi =
            document.createElement("li");

        pageLi.className =
            "page-item" +
            (
                page === currentPage
                    ? " active"
                    : ""
            );

        pageLi.innerHTML = `

            <button
                class="page-link"
                type="button">

                ${page}

            </button>

        `;

        pageLi
            .querySelector("button")
            .addEventListener(
                "click",
                function () {

                    currentPage = page;

                    renderDestinations();

                }
            );

        pagination.appendChild(pageLi);

    }

    const nextLi =
        document.createElement("li");

    nextLi.className =
        "page-item" +
        (
            currentPage === totalPages
                ? " disabled"
                : ""
        );

    nextLi.innerHTML = `

        <button
            class="page-link"
            type="button">

            <i class="fa-solid fa-chevron-right"></i>

        </button>

    `;

    nextLi
        .querySelector("button")
        .addEventListener(
            "click",
            function () {

                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderDestinations();

                }

            }
        );

    pagination.appendChild(nextLi);

}

function updatePaginationInfo() {

    const info =
        document.getElementById(
            "destinationPaginationInfo"
        );

    if (!info) {
        return;
    }

    const total =
        filteredDestinations.length;

    if (total === 0) {

        info.textContent =
            "Showing 0 of 0 destinations";

        return;

    }

    const start =
        (
            (currentPage - 1) *
            ITEMS_PER_PAGE
        ) + 1;

    const end =
        Math.min(
            currentPage *
            ITEMS_PER_PAGE,
            total
        );

    info.textContent =
        `Showing ${start}-${end} of ${total} destinations`;

}

function editDestination(id) {

    if (!id) {
        return;
    }

    window.location.href =
        "editDestination.jsp?id=" +
        encodeURIComponent(id);

}

function deleteDestination(id) {

    if (!id) {
        return;
    }

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this destination?"
        );

    if (!confirmed) {
        return;
    }

    fetch(
        DESTINATION_API +
        "/" +
        encodeURIComponent(id),
        {

            method: "DELETE",

            headers: {

                "Accept": "application/json"

            }

        }
    )

    .then(function (response) {

        return response.text().then(
            function (text) {

                let data = {};

                if (text) {

                    try {

                        data =
                            JSON.parse(text);

                    } catch (error) {

                        data = {};

                    }

                }

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to delete destination."
                    );

                }

                return data;

            }
        );

    })

    .then(function () {

        showDestinationMessage(
            "Destination deleted successfully.",
            "success"
        );

        loadDestinations();

    })

    .catch(function (error) {

        console.error(
            "Delete destination error:",
            error
        );

        showDestinationMessage(
            error.message ||
            "Failed to delete destination.",
            "danger"
        );

    });

}

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
        "alert alert-" +
        type;

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

function scrollToDestinationForm() {

    const formSection =
        document.getElementById(
            "destinationFormSection"
        );

    if (!formSection) {
        return;
    }

    formSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

function formatNumber(value) {

    const number =
        Number(value);

    if (Number.isNaN(number)) {
        return "0";
    }

    return number.toLocaleString(
        "en-IN"
    );

}

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

function escapeAttribute(value) {

    return escapeHtml(value);

}