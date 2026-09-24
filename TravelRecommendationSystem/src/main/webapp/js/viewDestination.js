"use strict";

const BACKEND_URL =
    "http://localhost:8080";

const DESTINATION_API =
    BACKEND_URL + "/destinations";

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (!checkAdminAuthentication()) {
            return;
        }

        const params =
            new URLSearchParams(
                window.location.search
            );

        const id =
            params.get("id");

        if (!id) {

            showError(
                "Destination ID is missing."
            );

            return;
        }

        const editButton =
            document.getElementById(
                "editButton"
            );

        if (editButton) {

            editButton.href =
                "editDestination.jsp?id=" +
                encodeURIComponent(id);
        }

        loadDestination(id);
    }
);

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

    return {
        "Authorization":
            "Bearer " +
            localStorage.getItem(
                "adminToken"
            ),

        "Accept":
            "application/json"
    };
}

async function loadDestination(id) {

    try {

        const response =
            await fetch(
                DESTINATION_API +
                "/" +
                id,
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

        if (response.status === 404) {

            throw new Error(
                "Destination not found."
            );
        }

        if (!response.ok) {

            throw new Error(
                "Failed to load destination."
            );
        }

        const destination =
            await response.json();

        displayDestination(
            destination
        );

    } catch (error) {

        console.error(
            "View destination error:",
            error
        );

        showError(
            error.message
        );
    }
}

function displayDestination(
    destination
) {

    document.getElementById(
        "destinationId"
    ).textContent =
        destination.destinationId;

    document.getElementById(
        "destinationName"
    ).textContent =
        destination.name || "";

    document.getElementById(
        "destinationDescription"
    ).textContent =
        destination.description || "";

    document.getElementById(
        "destinationBudget"
    ).textContent =
        "₹" +
        formatNumber(
            destination.budget
        );

    document.getElementById(
        "destinationCategory"
    ).textContent =
        destination.category || "";

    document.getElementById(
        "destinationSeason"
    ).textContent =
        destination.season || "";

    document.getElementById(
        "destinationRating"
    ).innerHTML = `
        <i class="fa-solid fa-star"></i>
        ${formatNumber(
            destination.rating
        )}
    `;

    const imageContainer =
        document.getElementById(
            "destinationImage"
        );

    const imageUrl =
        getImageUrl(
            destination.imageUrl
        );

    if (imageUrl) {

        imageContainer.innerHTML = `
            <img
                src="${escapeHtml(imageUrl)}"
                alt="${escapeHtml(
                    destination.name ||
                    "Destination"
                )}"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';"
            >
        `;

    } else {

        imageContainer.innerHTML = `
            <div class="no-detail-image">

                <i class="fa-solid fa-image fa-3x"></i>

                <p class="mt-2 mb-0">
                    No image available
                </p>

            </div>
        `;
    }

    document
        .getElementById(
            "loadingMessage"
        )
        .classList.add(
            "d-none"
        );

    document
        .getElementById(
            "destinationDetails"
        )
        .classList.remove(
            "d-none"
        );
}

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
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function showError(message) {

    const loading =
        document.getElementById(
            "loadingMessage"
        );

    loading.innerHTML = `
        <i class="fa-solid
                   fa-circle-exclamation
                   fa-2x
                   text-danger">
        </i>

        <p class="mt-3 text-danger">
            ${escapeHtml(message)}
        </p>

        <a
            href="manageDestination.jsp"
            class="btn btn-primary">

            Back to Destinations

        </a>
    `;
}

function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );

    window.location.href =
        "adminLogin.jsp";
}