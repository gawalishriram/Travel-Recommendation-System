"use strict";

const ADMIN_API = "http://localhost:8080/admin";

document.addEventListener("DOMContentLoaded", function () {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
        window.location.replace("login.jsp?role=admin");
        return;
    }
    loadDashboardData();
});

function loadDashboardData() {
    const adminToken = localStorage.getItem("adminToken");

    fetch(`${ADMIN_API}/dashboard/summary`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + adminToken
        }
    })
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Dashboard request failed: " + response.status);
        }
        return response.json();
    })
    .then(function (data) {
        console.log("Dashboard data:", data);

        const totalUsers = document.getElementById("totalUsers");
        const totalDestinations = document.getElementById("totalDestinations");
        const totalBookings = document.getElementById("totalBookings");
        const maleCount = document.getElementById("maleCount");
        const femaleCount = document.getElementById("femaleCount");
        const otherGenderCount = document.getElementById("otherGenderCount");

        if (totalUsers) totalUsers.textContent = data.totalUsers ?? 0;
        if (totalDestinations) totalDestinations.textContent = data.totalDestinations ?? 0;
        if (totalBookings) totalBookings.textContent = data.totalBookings ?? 0;
        if (maleCount) maleCount.textContent = data.maleCount ?? 0;
        if (femaleCount) femaleCount.textContent = data.femaleCount ?? 0;
        if (otherGenderCount) otherGenderCount.textContent = data.otherGenderCount ?? 0;

        // Render Logged In Users
        const loader = document.getElementById("usersLoader");
        const wrapper = document.getElementById("loggedInTableWrapper");
        const noLogins = document.getElementById("noLoginsMsg");
        const tbody = document.getElementById("loggedInUsersTableBody");

        if (loader) loader.style.display = "none";

        const loggedInList = Array.isArray(data.loggedInUsers) ? data.loggedInUsers : [];
        if (!loggedInList.length) {
            if (noLogins) noLogins.classList.remove("d-none");
            if (wrapper) wrapper.style.display = "none";
        } else {
            if (noLogins) noLogins.classList.add("d-none");
            if (wrapper) wrapper.style.display = "block";
            if (tbody) {
                tbody.innerHTML = loggedInList.map(u => {
                    const gender = u.gender || "—";
                    const genderLower = gender.toLowerCase();
                    let badgeColor = "secondary";
                    if (genderLower === "male") badgeColor = "primary";
                    else if (genderLower === "female") badgeColor = "danger";

                    const dateStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "—";

                    return `
                        <tr>
                            <td><span class="badge bg-light text-dark border">#${u.userId}</span></td>
                            <td><strong class="text-dark">${u.name}</strong></td>
                            <td class="text-muted">${u.email}</td>
                            <td><span class="badge bg-${badgeColor}">${gender}</span></td>
                            <td>${u.mobile || "—"}</td>
                            <td><small class="text-muted">${u.address || "—"}</small></td>
                            <td><small class="text-secondary">${dateStr}</small></td>
                        </tr>`;
                }).join("");
            }
        }
    })
    .catch(function (error) {
        console.error("Failed to load dashboard data:", error);
        const loader = document.getElementById("usersLoader");
        if (loader) {
            loader.innerHTML = '<p class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> Failed to connect to server backend.</p>';
        }
    });
}