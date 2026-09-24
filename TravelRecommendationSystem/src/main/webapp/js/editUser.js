"use strict";

const USER_API = "http://localhost:8080/users";

document.addEventListener("DOMContentLoaded", function () {
    loadUser();
    setupUserForm();
    setupResetButton();
});

function getUserId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function loadUser() {
    const userId = getUserId();

    if (!userId) {
        showUserMessage("User ID is missing.", "danger");
        return;
    }

    const updateButton =
        document.getElementById("updateUserBtn");

    if (updateButton) {
        updateButton.disabled = true;
    }

    fetch(`${USER_API}/${encodeURIComponent(userId)}`, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(
                    "User not found. HTTP Status: " +
                    response.status
                );
            }

            return response.json();
        })
        .then(function (user) {
            console.log("User loaded:", user);

            fillUserForm(user);

            if (updateButton) {
                updateButton.disabled = false;
            }
        })
        .catch(function (error) {
            console.error("Load user error:", error);

            showUserMessage(
                error.message ||
                "Unable to load user.",
                "danger"
            );

            if (updateButton) {
                updateButton.disabled = true;
            }
        });
}

function fillUserForm(user) {
    const userId =
        document.getElementById("userId");

    const name =
        document.getElementById("name");

    const email =
        document.getElementById("email");

    const mobile =
        document.getElementById("mobile");

    const gender =
        document.getElementById("gender");

    const address =
        document.getElementById("address");

    if (userId) {
        userId.value =
            user.userId ??
            user.user_id ??
            "";
    }

    if (name) {
        name.value =
            user.name ??
            "";
    }

    if (email) {
        email.value =
            user.email ??
            "";
    }

    if (mobile) {
        mobile.value =
            user.mobile ??
            "";
    }

    if (gender) {
        gender.value =
            user.gender ??
            "";
    }

    if (address) {
        address.value =
            user.address ??
            "";
    }
}

function setupUserForm() {
    const form =
        document.getElementById(
            "editUserForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        updateUser
    );
}

function updateUser(event) {
    event.preventDefault();

    const form =
        document.getElementById(
            "editUserForm"
        );

    if (!form) {
        return;
    }

    if (!form.checkValidity()) {
        form.classList.add(
            "was-validated"
        );

        form.reportValidity();

        return;
    }

    const userId =
        getUserId();

    if (!userId) {
        showUserMessage(
            "User ID is missing.",
            "danger"
        );

        return;
    }

    const nameElement =
        document.getElementById(
            "name"
        );

    const emailElement =
        document.getElementById(
            "email"
        );

    const mobileElement =
        document.getElementById(
            "mobile"
        );

    const genderElement =
        document.getElementById(
            "gender"
        );

    const addressElement =
        document.getElementById(
            "address"
        );

    if (
        !nameElement ||
        !emailElement ||
        !mobileElement ||
        !genderElement ||
        !addressElement
    ) {
        showUserMessage(
            "Required form fields are missing.",
            "danger"
        );

        return;
    }

    const name =
        nameElement.value.trim();

    const email =
        emailElement.value.trim();

    const mobile =
        mobileElement.value.trim();

    const gender =
        genderElement.value;

    const address =
        addressElement.value.trim();

    const passwordElement =
        document.getElementById(
            "password"
        );

    const password =
        passwordElement
            ? passwordElement.value.trim()
            : "";

    if (name.length < 3) {
        showUserMessage(
            "Name must contain at least 3 characters.",
            "danger"
        );

        return;
    }

    if (!email) {
        showUserMessage(
            "Email is required.",
            "danger"
        );

        return;
    }

    if (!mobile) {
        showUserMessage(
            "Mobile number is required.",
            "danger"
        );

        return;
    }

    if (!gender) {
        showUserMessage(
            "Please select gender.",
            "danger"
        );

        return;
    }

    if (!address) {
        showUserMessage(
            "Address is required.",
            "danger"
        );

        return;
    }

    const user = {
        userId: Number(userId),
        name: name,
        email: email,
        mobile: mobile,
        gender: gender,
        address: address
    };

    if (password) {
        user.password = password;
    }

    console.log(
        "Updating user:",
        user
    );

    const button =
        document.getElementById(
            "updateUserBtn"
        );

    if (button) {
        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin me-1"></i>
            Updating...
        `;
    }

    fetch(
        `${USER_API}/${encodeURIComponent(userId)}`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json"
            },

            body:
                JSON.stringify(user)
        }
    )
        .then(function (response) {
            return response.text()
                .then(function (text) {
                    let data = {};

                    if (text) {
                        try {
                            data =
                                JSON.parse(text);
                        } catch (error) {
                            data = {
                                message: text
                            };
                        }
                    }

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            "Failed to update user. HTTP Status: " +
                            response.status
                        );
                    }

                    return data;
                });
        })
        .then(function (data) {
            console.log(
                "Update user response:",
                data
            );

            showUserMessage(
                data.message ||
                "User updated successfully.",
                "success"
            );

            setTimeout(
                function () {
                    window.location.href =
                        "manageUser.jsp";
                },
                1200
            );
        })
        .catch(function (error) {
            console.error(
                "Update user error:",
                error
            );

            showUserMessage(
                error.message ||
                "Failed to update user.",
                "danger"
            );
        })
        .finally(function () {
            if (button) {
                button.disabled = false;

                button.innerHTML = `
                    <i class="fa-solid fa-floppy-disk me-1"></i>
                    Update User
                `;
            }
        });
}

function setupResetButton() {
    const resetButton =
        document.getElementById(
            "resetEditUserBtn"
        );

    if (!resetButton) {
        return;
    }

    resetButton.addEventListener(
        "click",
        function () {
            setTimeout(
                function () {
                    loadUser();
                },
                0
            );
        }
    );
}

function showUserMessage(
    text,
    type
) {
    const message =
        document.getElementById(
            "userMessage"
        );

    if (!message) {
        return;
    }

    message.className =
        "alert alert-" +
        type;

    message.textContent =
        text;

    message.classList.remove(
        "d-none"
    );

    setTimeout(
        function () {
            message.classList.add(
                "d-none"
            );
        },
        4000
    );
}