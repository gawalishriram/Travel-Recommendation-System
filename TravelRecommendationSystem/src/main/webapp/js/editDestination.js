"use strict";

const BACKEND_URL =
    "http://localhost:8080";

const DESTINATION_API =
    BACKEND_URL + "/destinations";

let destinationId = null;

let existingImageUrl = "";

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

        destinationId =
            params.get("id");

        if (!destinationId) {

            showDestinationMessage(
                "Destination ID is missing.",
                "danger"
            );

            return;
        }

        const imageInput =
            document.getElementById(
                "destinationImage"
            );

        if (imageInput) {

            imageInput.addEventListener(
                "change",
                previewNewImage
            );
        }

        const form =
            document.getElementById(
                "editDestinationForm"
            );

        if (form) {

            form.addEventListener(
                "submit",
                handleUpdateDestination
            );
        }

        loadDestination();
    }
);

// =====================================================
// AUTH
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

// =====================================================
// LOAD
// =====================================================

async function loadDestination() {

    try {

        const response =
            await fetch(
                DESTINATION_API +
                "/" +
                destinationId,
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

        populateForm(
            destination
        );

        document
            .getElementById(
                "loadingMessage"
            )
            .classList.add(
                "d-none"
            );

        document
            .getElementById(
                "editFormContainer"
            )
            .classList.remove(
                "d-none"
            );

    } catch (error) {

        console.error(
            "Load destination error:",
            error
        );

        document
            .getElementById(
                "loadingMessage"
            )
            .innerHTML = `
                <i class="fa-solid
                           fa-circle-exclamation
                           fa-2x
                           text-danger"></i>

                <p class="mt-3 text-danger">
                    ${escapeHtml(
                        error.message
                    )}
                </p>

                <a
                    href="manageDestination.jsp"
                    class="btn btn-primary">

                    Back to Destinations

                </a>
            `;
    }
}

// =====================================================
// POPULATE FORM
// =====================================================

function populateForm(
    destination
) {

    document.getElementById(
        "name"
    ).value =
        destination.name || "";

    document.getElementById(
        "description"
    ).value =
        destination.description || "";

    document.getElementById(
        "budget"
    ).value =
        destination.budget ?? "";

    document.getElementById(
        "season"
    ).value =
        destination.season || "";

    document.getElementById(
        "category"
    ).value =
        destination.category || "";

    document.getElementById(
        "rating"
    ).value =
        destination.rating ?? "";

    existingImageUrl =
        destination.imageUrl || "";

    const preview =
        document.getElementById(
            "imagePreviewContainer"
        );

    const imageUrl =
        getImageUrl(
            existingImageUrl
        );

    if (imageUrl) {

        preview.innerHTML = `
            <img
                src="${escapeHtml(imageUrl)}"
                alt="Destination image">
        `;

    } else {

        preview.innerHTML = `
            <i class="fa-solid fa-image"></i>
            <span>No image available</span>
        `;
    }
}

// =====================================================
// PREVIEW NEW IMAGE
// =====================================================

function previewNewImage(event) {

    const file =
        event.target.files[0];

    const preview =
        document.getElementById(
            "imagePreviewContainer"
        );

    if (!file) {

        const imageUrl =
            getImageUrl(
                existingImageUrl
            );

        if (imageUrl) {

            preview.innerHTML = `
                <img
                    src="${escapeHtml(imageUrl)}"
                    alt="Destination image">
            `;

        } else {

            preview.innerHTML = `
                <i class="fa-solid fa-image"></i>
                <span>No image available</span>
            `;
        }

        return;
    }

    if (!file.type.startsWith("image/")) {

        showDestinationMessage(
            "Please select a valid image file.",
            "danger"
        );

        event.target.value = "";

        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        function (e) {

            preview.innerHTML = `
                <img
                    src="${e.target.result}"
                    alt="New destination image">
            `;
        };

    reader.readAsDataURL(file);
}

// =====================================================
// UPDATE
// =====================================================

async function handleUpdateDestination(
    event
) {

    event.preventDefault();

    const button =
        document.getElementById(
            "updateDestinationBtn"
        );

    try {

        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin me-2"></i>
            Updating...
        `;

        let imageUrl =
            existingImageUrl;

        const imageInput =
            document.getElementById(
                "destinationImage"
            );

        const newImage =
            imageInput.files[0];

        // =============================================
        // UPLOAD NEW IMAGE ONLY IF SELECTED
        // =============================================

        if (newImage) {

            const formData =
                new FormData();

            formData.append(
                "file",
                newImage
            );

            const uploadResponse =
                await fetch(
                    DESTINATION_API +
                    "/upload-image",
                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                "Bearer " +
                                localStorage.getItem(
                                    "adminToken"
                                ),

                            "Accept":
                                "application/json"
                        },

                        body: formData
                    }
                );

            if (
                uploadResponse.status === 401 ||
                uploadResponse.status === 403
            ) {

                logoutAdmin();
                return;
            }

            if (!uploadResponse.ok) {

                const errorText =
                    await uploadResponse.text();

                throw new Error(
                    errorText ||
                    "New image upload failed."
                );
            }

            try {
                const uploadData = await uploadResponse.json();
                imageUrl = (typeof uploadData === "object" && uploadData.imageUrl) ? uploadData.imageUrl : uploadData;
            } catch (e) {
                imageUrl = (await uploadResponse.text()).trim();
            }
        }

        // =============================================
        // UPDATE DESTINATION
        // =============================================

        const destination = {

            name:
                document.getElementById(
                    "name"
                ).value.trim(),

            description:
                document.getElementById(
                    "description"
                ).value.trim(),

            budget:
                Number(
                    document.getElementById(
                        "budget"
                    ).value
                ),

            season:
                document.getElementById(
                    "season"
                ).value,

            category:
                document.getElementById(
                    "category"
                ).value,

            rating:
                Number(
                    document.getElementById(
                        "rating"
                    ).value
                ),

            imageUrl:
                imageUrl
        };

        const response =
            await fetch(
                DESTINATION_API +
                "/" +
                destinationId,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            localStorage.getItem(
                                "adminToken"
                            ),

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            destination
                        )
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

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Failed to update destination."
            );
        }

        await response.json();

        showDestinationMessage(
            "Destination updated successfully.",
            "success"
        );

        setTimeout(
            function () {

                window.location.href =
                    "manageDestination.jsp";

            },
            1000
        );

    } catch (error) {

        console.error(
            "Update destination error:",
            error
        );

        showDestinationMessage(
            error.message ||
            "Failed to update destination.",
            "danger"
        );

    } finally {

        button.disabled = false;

        button.innerHTML = `
            <i class="fa-solid fa-save me-2"></i>
            Update Destination
        `;
    }
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
}

// =====================================================
// HELPERS
// =====================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );

    window.location.href =
        "adminLogin.jsp";
}