"use strict";

const ADMIN_API = "http://localhost:8080/admin";

document.addEventListener("DOMContentLoaded", function () {

    loadDashboardData();

});


function loadDashboardData() {

    fetch(`${ADMIN_API}/dashboard/summary`, {

        method: "GET",

        headers: {
            "Accept": "application/json"
        }

    })

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Dashboard request failed: "
                + response.status
            );

        }

        return response.json();

    })

    .then(function (data) {

        console.log("Dashboard data:", data);

        const totalUsers =
            document.getElementById("totalUsers");

        const totalDestinations =
            document.getElementById("totalDestinations");


        if (totalUsers) {

            totalUsers.textContent =
                data.totalUsers ?? 0;

        }


        if (totalDestinations) {

            totalDestinations.textContent =
                data.totalDestinations ?? 0;

        }

    })

    .catch(function (error) {

        console.error(
            "Failed to load dashboard data:",
            error
        );

    });

}