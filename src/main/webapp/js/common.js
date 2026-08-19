"use strict";

const API_BASE_URL =
    "http://localhost:8080";


// ============================================================
// GET TOKEN
// ============================================================

function getToken() {

    return localStorage.getItem("token");
}


// ============================================================
// GET USER ID
// ============================================================

function getUserId() {

    return localStorage.getItem("userId");
}


// ============================================================
// GET USER NAME
// ============================================================

function getUserName() {

    return (
        localStorage.getItem("userName") ||
        "User"
    );
}


// ============================================================
// GET USER EMAIL
// ============================================================

function getUserEmail() {

    return (
        localStorage.getItem("userEmail") ||
        ""
    );
}


// ============================================================
// CHECK LOGIN
// ============================================================

function checkLogin() {

    const token =
        getToken();

    const userId =
        getUserId();


    console.log(
        "CHECK LOGIN TOKEN:",
        token
    );

    console.log(
        "CHECK LOGIN USER ID:",
        userId
    );


    if (!token || !userId) {

        console.warn(
            "User is not logged in."
        );

        redirectToLogin();

        return false;
    }


    // Basic JWT validation

    const parts =
        token.split(".");


    if (parts.length !== 3) {

        console.warn(
            "Invalid JWT format."
        );

        clearLoginData();

        redirectToLogin();

        return false;
    }


    return true;
}


// ============================================================
// AUTH HEADERS
// ============================================================

function getAuthHeaders() {

    const token =
        getToken();


    return {

        "Content-Type":
            "application/json",

        "Accept":
            "application/json",

        "Authorization":
            "Bearer " + token
    };
}


// ============================================================
// LOAD USER NAME
// ============================================================

function loadUserName() {

    const name =
        getUserName();


    document
        .querySelectorAll(".user-name")
        .forEach(function (element) {

            element.textContent =
                name;
        });


    const welcomeUser =
        document.getElementById(
            "welcomeUser"
        );


    if (welcomeUser) {

        welcomeUser.textContent =
            "Welcome " + name;
    }


    const dashboardUser =
        document.getElementById(
            "dashboardUser"
        );


    if (dashboardUser) {

        dashboardUser.textContent =
            name;
    }
}


// ============================================================
// CLEAR LOGIN DATA
// ============================================================

function clearLoginData() {

    localStorage.removeItem("token");

    localStorage.removeItem("userId");

    localStorage.removeItem("userName");

    localStorage.removeItem("userEmail");


    sessionStorage.removeItem("token");

    sessionStorage.removeItem("userId");

    sessionStorage.removeItem("userName");

    sessionStorage.removeItem("userEmail");
}


// ============================================================
// REDIRECT TO LOGIN
// ============================================================

function redirectToLogin() {

    window.location.replace(
        "login.jsp"
    );
}


// ============================================================
// LOGOUT
// ============================================================

function logoutUser() {

    clearLoginData();

    window.location.replace(
        "login.jsp"
    );
}