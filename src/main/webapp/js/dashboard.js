"use strict";

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Dashboard loaded."
        );

        console.log(
            "Token:",
            getToken()
        );

        console.log(
            "User ID:",
            getUserId()
        );

        console.log(
            "User Name:",
            getUserName()
        );


        if (!checkLogin()) {
            return;
        }


        loadUserName();

    }
);