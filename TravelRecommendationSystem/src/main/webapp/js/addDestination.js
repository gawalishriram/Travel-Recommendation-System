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

        const form =
            document.getElementById(
                "addDestinationForm"
            );

        const imageInput =
            document.getElementById(
                "destinationImage"
            );

        if (imageInput) {

            imageInput.addEventListener(
                "change",
                previewImage
            );
        }

        if (form) {

            form.addEventListener(
                "submit",
                handleAddDestination
            );
        }
    }
);

function checkAdminAuthentication() {

    const token =
        localStorage.getItem("adminToken");

    if (!token) {

        window.location.href =
            "adminLogin.jsp";

        return false;
    }

    return true;
}

function getAdminHeaders() {

    const token =
        localStorage.getItem("adminToken");

    return {
        "Authorization":
            "Bearer " + token,

        "Accept":
            "application/json"
    };
}

function previewImage(event) {

    const file =
        event.target.files[0];

    const container =
        document.getElementById(
            "imagePreviewContainer"
        );

    if (!container) {
        return;
    }

    if (!file) {

        container.innerHTML = `
            <i class="fa-solid fa-image"></i>
            <span>Image preview</span>
        `;

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

    reader.onload = function (e) {

        container.innerHTML = `
            <img
                src="${e.target.result}"
                alt="Preview">
        `;
    };

    reader.readAsDataURL(file);
}

async function handleAddDestination(event) {

    event.preventDefault();

    const button =
        document.getElementById(
            "saveDestinationBtn"
        );

    try {

        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin me-2"></i>
            Saving...
        `;

        const imageInput =
            document.getElementById(
                "destinationImage"
            );

        const imageFile =
            imageInput.files[0];

        if (!imageFile) {

            throw new Error(
                "Please select a destination image."
            );
        }

        // =================================================
        // STEP 1 - UPLOAD IMAGE
        // =================================================

        const formData =
            new FormData();

        formData.append(
            "file",
            imageFile
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

        if (uploadResponse.status === 401 ||
            uploadResponse.status === 403) {

            logoutAdmin();
            return;
        }

        if (!uploadResponse.ok) {

            const errorText =
                await uploadResponse.text();

            throw new Error(
                errorText ||
                "Image upload failed."
            );
        }

        let imageUrl = "";
        try {
            const uploadData = await uploadResponse.json();
            imageUrl = (typeof uploadData === "object" && uploadData.imageUrl) ? uploadData.imageUrl : uploadData;
        } catch (e) {
            imageUrl = (await uploadResponse.text()).trim();
        }

        // =================================================
        // STEP 2 - SAVE DESTINATION
        // =================================================

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
                imageUrl.trim()
        };

        const response =
            await fetch(
                DESTINATION_API,
                {
                    method: "POST",

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

        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Failed to save destination."
            );
        }

        await response.json();

        showDestinationMessage(
            "Destination added successfully.",
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
            "Add destination error:",
            error
        );

        showDestinationMessage(
            error.message ||
            "Failed to add destination.",
            "danger"
        );

    } finally {

        button.disabled = false;

        button.innerHTML = `
            <i class="fa-solid fa-save me-2"></i>
            Save Destination
        `;
    }
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
        "alert alert-" + type;

    element.textContent =
        message;
}

function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );

    window.location.href =
        "adminLogin.jsp";
}