"use strict";

const USER_LOGIN_API = "http://localhost:8080/users/login";

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("loginForm not found.");
        return;
    }

    loginForm.addEventListener("submit", loginUser);

});


async function loginUser(event) {

    event.preventDefault();

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const button =
        document.getElementById("loginBtn");

    const message =
        document.getElementById("message");


    if (!emailElement || !passwordElement) {

        console.error("Email or password field not found.");

        return;
    }


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    if (!email || !password) {

        showMessage(
            "Email and password are required.",
            "danger"
        );

        return;
    }


    try {

        if (button) {

            button.disabled = true;

            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
        }


        console.log("Sending login request...");


        const response =
            await fetch(
                USER_LOGIN_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            email: email,
                            password: password
                        })
                }
            );


        console.log(
            "Login HTTP status:",
            response.status
        );


        const text =
            await response.text();


        console.log(
            "Raw server response:",
            text
        );


        let data = {};

        if (text) {

            try {

                data =
                    JSON.parse(text);

            } catch (error) {

                console.error(
                    "Invalid JSON response:",
                    text
                );

                throw new Error(
                    "Invalid response received from server."
                );
            }
        }


        console.log(
            "Login response:",
            data
        );


        // =====================================================
        // HTTP ERROR
        // =====================================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Invalid email or password."
            );
        }


        // =====================================================
        // CHECK TOKEN
        // =====================================================

        if (!data.token) {

            console.error(
                "Token missing from login response:",
                data
            );

            throw new Error(
                "Login successful but JWT token was not received."
            );
        }


        // =====================================================
        // CHECK USER ID
        // =====================================================

        if (
            data.userId === null ||
            data.userId === undefined
        ) {

            console.error(
                "User ID missing:",
                data
            );

            throw new Error(
                "Login successful but user ID was not received."
            );
        }


        // =====================================================
        // CLEAR OLD LOGIN DATA
        // =====================================================

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("userEmail");


        // =====================================================
        // SAVE NEW LOGIN DATA
        // =====================================================

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "userId",
            String(data.userId)
        );

        localStorage.setItem(
            "userName",
            data.name || "User"
        );

        localStorage.setItem(
            "userEmail",
            data.email || email
        );


        // =====================================================
        // VERIFY DATA
        // =====================================================

        console.log(
            "Saved token:",
            localStorage.getItem("token")
        );

        console.log(
            "Saved userId:",
            localStorage.getItem("userId")
        );

        console.log(
            "Saved userName:",
            localStorage.getItem("userName")
        );


        showMessage(
            data.message ||
            "Login successful.",
            "success"
        );


        // =====================================================
        // REDIRECT
        // =====================================================

        console.log(
            "Redirecting to dashboard.jsp..."
        );


        setTimeout(function () {

            window.location.replace(
                "dashboard.jsp"
            );

        }, 300);


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        showMessage(
            error.message ||
            "Login failed. Please try again.",
            "danger"
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.innerHTML =
                '<i class="fa-solid fa-right-to-bracket"></i> Login';
        }
    }
}


function showMessage(text, type) {

    const message =
        document.getElementById("message");

    if (!message) {
        return;
    }


    message.className =
        "alert alert-" + type;

    message.textContent =
        text;

    message.classList.remove(
        "d-none"
    );

    message.style.display =
        "block";
}