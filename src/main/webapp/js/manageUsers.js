"use strict";

/*
 * ============================================================
 * MANAGE USERS - ADMIN
 * ============================================================
 */

const USER_API = "http://localhost:8080/users";

let allUsers = [];
let selectedGender = "";


/*
 * ============================================================
 * PAGE LOAD
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", function () {

    setupUserSearch();

    setupUserFilters();

    loadUsers();

});


/*
 * ============================================================
 * LOAD USERS
 * ============================================================
 */

function loadUsers() {

    const tableBody =
        document.getElementById("userTableBody");

    if (!tableBody) {
        return;
    }

    showUserLoading();

    fetch(USER_API, {

        method: "GET",

        headers: {
            "Accept": "application/json"
        }

    })

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Failed to load users. HTTP Status: " +
                response.status
            );

        }

        return response.json();

    })

    .then(function (data) {

        console.log("Users received:", data);

        if (Array.isArray(data)) {

            allUsers = data;

        }

        else if (
            data &&
            Array.isArray(data.data)
        ) {

            allUsers = data.data;

        }

        else if (
            data &&
            Array.isArray(data.users)
        ) {

            allUsers = data.users;

        }

        else {

            allUsers = [];

        }

        updateUserStatistics();

        filterUsers();

    })

    .catch(function (error) {

        console.error(
            "User loading error:",
            error
        );

        allUsers = [];

        updateUserStatistics();

        showUserError(
            error.message ||
            "Unable to load users."
        );

    });

}


/*
 * ============================================================
 * LOADING
 * ============================================================
 */

function showUserLoading() {

    const tableBody =
        document.getElementById("userTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="text-center py-5">

                <div class="user-loading">

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    <span>
                        Loading users...
                    </span>

                </div>

            </td>

        </tr>

    `;

}


/*
 * ============================================================
 * DISPLAY USERS
 * ============================================================
 */

function displayUsers(users) {

    const tableBody =
        document.getElementById("userTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";


    if (
        !Array.isArray(users) ||
        users.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center py-5">

                    <div class="user-empty">

                        <div class="user-empty-icon">

                            <i class="fa-solid fa-users"></i>

                        </div>

                        <h6>
                            No Users Found
                        </h6>

                        <p>
                            No users match your search or filter.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;
    }


    users.forEach(function (user) {

        const userId =
            user.userId ??
            user.user_id ??
            "-";


        const name =
            user.name ??
            user.fullName ??
            user.full_name ??
            "-";


        const email =
            user.email ??
            "-";


        const mobile =
            user.mobile ??
            "-";


        const gender =
            user.gender ??
            "-";


        const address =
            user.address ??
            "-";


        const createdAt =
            user.createdAt ??
            user.created_at ??
            "-";


        const formattedDate =
            formatDate(createdAt);


        const genderBadge =
            getGenderBadge(gender);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="user-id">

                    U${escapeHtml(userId)}

                </span>

            </td>


            <td>

                <div class="user-name-wrapper">

                    <div class="user-avatar">

                        ${getInitials(name)}

                    </div>

                    <div>

                        <div class="user-name">

                            ${escapeHtml(name)}

                        </div>

                    </div>

                </div>

            </td>


            <td>

                ${
                    email !== "-"
                    ?

                    `
                    <a
                        href="mailto:${escapeHtml(email)}"
                        class="user-email">

                        ${escapeHtml(email)}

                    </a>
                    `

                    :

                    `<span>-</span>`
                }

            </td>


            <td>

                ${
                    mobile !== "-"
                    ?

                    `
                    <a
                        href="tel:${escapeHtml(mobile)}"
                        class="user-mobile">

                        ${escapeHtml(mobile)}

                    </a>
                    `

                    :

                    `<span>-</span>`
                }

            </td>


            <td>

                ${genderBadge}

            </td>


            <td>

                <span
                    class="user-address"
                    title="${escapeHtml(address)}">

                    ${escapeHtml(
                        truncateText(address, 35)
                    )}

                </span>

            </td>


            <td>

                <span class="user-date">

                    ${escapeHtml(formattedDate)}

                </span>

            </td>


            <td class="text-center">

                <div class="user-actions">

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-primary user-action"
                        onclick="editUser('${escapeJs(userId)}')"
                        title="Edit User">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="btn btn-sm btn-outline-danger user-action"
                        onclick="deleteUser('${escapeJs(userId)}')"
                        title="Delete User">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


/*
 * ============================================================
 * SEARCH
 * ============================================================
 */

function setupUserSearch() {

    const searchInput =
        document.getElementById("userSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        function () {

            filterUsers();

        }
    );

}


/*
 * ============================================================
 * FILTER BUTTONS
 * ============================================================
 */

function setupUserFilters() {

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    if (!filterButtons.length) {
        return;
    }

    filterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove("active");

                    }
                );


                this.classList.add("active");


                selectedGender =
                    this.dataset.gender || "";


                filterUsers();

            }
        );

    });

}


/*
 * ============================================================
 * FILTER USERS
 * ============================================================
 */

function filterUsers() {

    const searchInput =
        document.getElementById("userSearch");


    const search =
        searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";


    const filteredUsers =
        allUsers.filter(function (user) {

            const userId =
                String(
                    user.userId ??
                    user.user_id ??
                    ""
                ).toLowerCase();


            const name =
                String(
                    user.name ??
                    user.fullName ??
                    user.full_name ??
                    ""
                ).toLowerCase();


            const email =
                String(
                    user.email ??
                    ""
                ).toLowerCase();


            const mobile =
                String(
                    user.mobile ??
                    ""
                ).toLowerCase();


            const gender =
                String(
                    user.gender ??
                    ""
                )
                .trim()
                .toLowerCase();


            const matchesSearch =
                !search ||
                userId.includes(search) ||
                name.includes(search) ||
                email.includes(search) ||
                mobile.includes(search);


            const matchesGender =
                !selectedGender ||
                gender ===
                selectedGender
                    .trim()
                    .toLowerCase();


            return (
                matchesSearch &&
                matchesGender
            );

        });


    displayUsers(filteredUsers);

    updateVisibleUserCount(
        filteredUsers.length
    );

}


/*
 * ============================================================
 * USER STATISTICS
 * ============================================================
 */

function updateUserStatistics() {

    /*
     * IMPORTANT:
     * These IDs exactly match manageUsers.jsp
     */

    const totalUsers =
        document.getElementById("totalUsersCount");


    const maleUsers =
        document.getElementById("maleUsersCount");


    const femaleUsers =
        document.getElementById("femaleUsersCount");


    const otherUsers =
        document.getElementById("otherUsersCount");


    /*
     * TOTAL
     */

    if (totalUsers) {

        totalUsers.textContent =
            allUsers.length;

    }


    let male = 0;
    let female = 0;
    let other = 0;


    allUsers.forEach(function (user) {

        const gender =
            String(
                user.gender ?? ""
            )
            .trim()
            .toLowerCase();


        if (gender === "male") {

            male++;

        }

        else if (gender === "female") {

            female++;

        }

        else {

            other++;

        }

    });


    /*
     * MALE
     */

    if (maleUsers) {

        maleUsers.textContent =
            male;

    }


    /*
     * FEMALE
     */

    if (femaleUsers) {

        femaleUsers.textContent =
            female;

    }


    /*
     * OTHER
     */

    if (otherUsers) {

        otherUsers.textContent =
            other;

    }


    /*
     * TABLE BADGE
     */

    const userCountBadge =
        document.getElementById(
            "userCountBadge"
        );


    if (userCountBadge) {

        userCountBadge.textContent =
            allUsers.length +
            (
                allUsers.length === 1
                ? " User"
                : " Users"
            );

    }

}


/*
 * ============================================================
 * VISIBLE COUNT
 * ============================================================
 */

function updateVisibleUserCount(count) {

    const visibleCount =
        document.getElementById(
            "visibleUserCount"
        );

    if (!visibleCount) {
        return;
    }

    visibleCount.textContent =
        count;

}


/*
 * ============================================================
 * EDIT USER
 * ============================================================
 */

function editUser(id) {

    if (
        id === null ||
        id === undefined ||
        id === "" ||
        id === "-"
    ) {

        return;

    }


    window.location.href =
        "editUser.jsp?id=" +
        encodeURIComponent(id);

}


/*
 * ============================================================
 * DELETE USER
 * ============================================================
 */

function deleteUser(id) {

    if (
        id === null ||
        id === undefined ||
        id === "" ||
        id === "-"
    ) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this user?"
        );


    if (!confirmed) {
        return;
    }


    fetch(
        USER_API +
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

        return response.text()
            .then(function (text) {

                let data = {};


                if (text) {

                    try {

                        data =
                            JSON.parse(text);

                    }

                    catch (error) {

                        data = {
                            message: text
                        };

                    }

                }


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to delete user. HTTP Status: " +
                        response.status
                    );

                }


                return data;

            });

    })

    .then(function (data) {

        console.log(
            "Delete response:",
            data
        );


        showUserMessage(
            data.message ||
            "User deleted successfully.",
            "success"
        );


        loadUsers();

    })

    .catch(function (error) {

        console.error(
            "Delete user error:",
            error
        );


        showUserMessage(
            error.message ||
            "Failed to delete user.",
            "danger"
        );

    });

}


/*
 * ============================================================
 * REFRESH
 * ============================================================
 */

function refreshUsers() {

    loadUsers();

}


/*
 * ============================================================
 * EXPORT USERS
 * ============================================================
 */

function exportUsers() {

    if (
        !Array.isArray(allUsers) ||
        allUsers.length === 0
    ) {

        showUserMessage(
            "No users available to export.",
            "warning"
        );

        return;

    }


    let csv =
        "User ID,Name,Email,Mobile,Gender,Address,Created At\n";


    allUsers.forEach(function (user) {

        const userId =
            user.userId ??
            user.user_id ??
            "";


        const name =
            user.name ??
            user.fullName ??
            user.full_name ??
            "";


        const email =
            user.email ??
            "";


        const mobile =
            user.mobile ??
            "";


        const gender =
            user.gender ??
            "";


        const address =
            user.address ??
            "";


        const createdAt =
            user.createdAt ??
            user.created_at ??
            "";


        csv +=
            [
                userId,
                name,
                email,
                mobile,
                gender,
                address,
                createdAt
            ]
            .map(csvEscape)
            .join(",") +
            "\n";

    });


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "travelai-users.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


/*
 * ============================================================
 * CSV ESCAPE
 * ============================================================
 */

function csvEscape(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return '""';

    }


    return (
        '"' +
        String(value)
            .replace(/"/g, '""') +
        '"'
    );

}


/*
 * ============================================================
 * MESSAGE
 * ============================================================
 */

function showUserMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "userMessage"
        );


    if (!box) {
        return;
    }


    box.className =
        "alert alert-" +
        type;


    box.textContent =
        message;


    box.classList.remove("d-none");


    setTimeout(
        function () {

            box.classList.add("d-none");

        },
        4000
    );

}


/*
 * ============================================================
 * ERROR
 * ============================================================
 */

function showUserError(message) {

    const tableBody =
        document.getElementById(
            "userTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="text-center py-5">

                <div class="user-error">

                    <i
                        class="fa-solid fa-triangle-exclamation">
                    </i>

                    <h6>
                        Unable to Load Users
                    </h6>

                    <p>
                        ${escapeHtml(message)}
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary btn-sm rounded-pill"
                        onclick="loadUsers()">

                        <i
                            class="fa-solid fa-arrows-rotate me-1">
                        </i>

                        Try Again

                    </button>

                </div>

            </td>

        </tr>

    `;

}


/*
 * ============================================================
 * FORMAT DATE
 * ============================================================
 */

function formatDate(value) {

    if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "-"
    ) {

        return "-";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/*
 * ============================================================
 * GENDER BADGE
 * ============================================================
 */

function getGenderBadge(gender) {

    if (
        !gender ||
        gender === "-"
    ) {

        return `

            <span class="user-gender other">

                -

            </span>

        `;

    }


    const normalized =
        String(gender)
            .trim()
            .toLowerCase();


    let className =
        "other";


    if (normalized === "male") {

        className = "male";

    }

    else if (normalized === "female") {

        className = "female";

    }


    return `

        <span class="user-gender ${className}">

            ${escapeHtml(gender)}

        </span>

    `;

}


/*
 * ============================================================
 * INITIALS
 * ============================================================
 */

function getInitials(name) {

    if (
        !name ||
        name === "-"
    ) {

        return "U";

    }


    const words =
        String(name)
            .trim()
            .split(/\s+/);


    if (words.length === 1) {

        return escapeHtml(
            words[0]
                .charAt(0)
                .toUpperCase()
        );

    }


    return escapeHtml(
        (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase()
    );

}


/*
 * ============================================================
 * TRUNCATE
 * ============================================================
 */

function truncateText(
    text,
    maxLength
) {

    if (
        text === null ||
        text === undefined ||
        text === ""
    ) {

        return "-";

    }


    const value =
        String(text);


    if (
        value.length <= maxLength
    ) {

        return value;

    }


    return (
        value.substring(0, maxLength) +
        "..."
    );

}


/*
 * ============================================================
 * ESCAPE HTML
 * ============================================================
 */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/*
 * ============================================================
 * ESCAPE JAVASCRIPT
 * ============================================================
 */

function escapeJs(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n");

}