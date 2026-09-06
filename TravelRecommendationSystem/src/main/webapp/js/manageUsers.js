"use strict";

/*
 * ============================================================
 * API
 * ============================================================
 */

const USER_API =
    "http://localhost:8080/users/admin/all";

const DELETE_USER_API =
    "http://localhost:8080/users/admin";


/*
 * ============================================================
 * PAGINATION
 * ============================================================
 */

const PAGE_SIZE = 10;

let currentPage = 0;
let totalPages = 0;
let totalElements = 0;


/*
 * ============================================================
 * USERS
 * ============================================================
 */

let allUsers = [];

let selectedGender = "";


/*
 * ============================================================
 * PAGE LOAD
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupUserSearch();

        setupUserFilters();

        loadUsers(0);

    }
);


/*
 * ============================================================
 * LOAD USERS
 * ============================================================
 */

function loadUsers(page) {

    const tableBody =
        document.getElementById(
            "userTableBody"
        );

    if (!tableBody) {
        return;
    }

    if (
        page === null ||
        page === undefined
    ) {

        page = currentPage;
    }

    currentPage = page;

    showUserLoading();

    const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token");

    if (!token) {

        showUserError(
            "Admin session expired. Please login again."
        );

        return;
    }

    const url =
        USER_API +
        "?page=" +
        encodeURIComponent(page) +
        "&size=" +
        encodeURIComponent(PAGE_SIZE);


    fetch(
        url,
        {
            method: "GET",

            headers: {
                "Accept": "application/json",
                "Authorization":
                    "Bearer " + token
            }
        }
    )

    .then(
        function (response) {

            if (response.status === 401) {

                throw new Error(
                    "Unauthorized. Please login again."
                );
            }

            if (response.status === 403) {

                throw new Error(
                    "Access denied. Admin permission required."
                );
            }

            if (!response.ok) {

                throw new Error(
                    "Failed to load users. HTTP Status: " +
                    response.status
                );
            }

            return response.json();
        }
    )

    .then(
        function (data) {

            console.log(
                "Users API response:",
                data
            );


            /*
             * ==================================================
             * USERS
             * ==================================================
             */

            if (
                data &&
                Array.isArray(data.users)
            ) {

                allUsers =
                    data.users;

            } else {

                allUsers = [];
            }


            /*
             * ==================================================
             * PAGINATION
             * ==================================================
             */

            currentPage =
                Number(
                    data.currentPage ?? page
                );

            totalPages =
                Number(
                    data.totalPages ?? 0
                );

            totalElements =
                Number(
                    data.totalElements ??
                    allUsers.length
                );


            /*
             * ==================================================
             * UPDATE STATISTICS
             * ==================================================
             */

            updateUserStatistics();


            /*
             * ==================================================
             * DISPLAY
             * ==================================================
             */

            filterUsers();


            /*
             * ==================================================
             * PAGINATION
             * ==================================================
             */

            renderPagination();

        }
    )

    .catch(
        function (error) {

            console.error(
                "Load users error:",
                error
            );

            allUsers = [];

            totalPages = 0;

            totalElements = 0;

            updateUserStatistics();

            updateVisibleUserCount(0);

            showUserError(
                error.message ||
                "Unable to load users."
            );
        }
    );
}


/*
 * ============================================================
 * LOADING
 * ============================================================
 */

function showUserLoading() {

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

                <div class="user-loading">

                    <i
                        class="fa-solid fa-spinner fa-spin">
                    </i>

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
        document.getElementById(
            "userTableBody"
        );

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

                            <i
                                class="fa-solid fa-users">
                            </i>

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


    users.forEach(
        function (user) {

            const userId =
                user.userId ?? "-";

            const name =
                user.name ?? "-";

            const email =
                user.email ?? "-";

            const mobile =
                user.mobile ?? "-";

            const gender =
                user.gender ?? "-";

            const address =
                user.address ?? "-";

            const createdAt =
                user.createdAt ?? "-";


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
                            truncateText(
                                address,
                                35
                            )
                        )}

                    </span>

                </td>


                <td>

                    <span class="user-date">

                        ${escapeHtml(
                            formattedDate
                        )}

                    </span>

                </td>


                <td class="text-center">

                    <div class="user-actions">

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger user-action"
                            onclick="deleteUser('${escapeJs(userId)}')"
                            title="Delete User">

                            <i
                                class="fa-solid fa-trash">
                            </i>

                        </button>

                    </div>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );
}


/*
 * ============================================================
 * SEARCH
 * ============================================================
 */

function setupUserSearch() {

    const searchInput =
        document.getElementById(
            "userSearch"
        );

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
        document.querySelectorAll(
            ".filter-btn"
        );

    if (!filterButtons.length) {
        return;
    }


    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    selectedGender =
                        this.dataset.gender || "";


                    filterUsers();

                }
            );

        }
    );
}


/*
 * ============================================================
 * FILTER USERS
 * ============================================================
 */

function filterUsers() {

    const searchInput =
        document.getElementById(
            "userSearch"
        );


    const search =
        searchInput
        ? searchInput.value
                .trim()
                .toLowerCase()
        : "";


    const filteredUsers =
        allUsers.filter(
            function (user) {

                const userId =
                    String(
                        user.userId ?? ""
                    )
                    .toLowerCase();


                const name =
                    String(
                        user.name ?? ""
                    )
                    .toLowerCase();


                const email =
                    String(
                        user.email ?? ""
                    )
                    .toLowerCase();


                const mobile =
                    String(
                        user.mobile ?? ""
                    )
                    .toLowerCase();


                const gender =
                    String(
                        user.gender ?? ""
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

            }
        );


    displayUsers(
        filteredUsers
    );


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

    const totalUsers =
        document.getElementById(
            "totalUsersCount"
        );


    const maleUsers =
        document.getElementById(
            "maleUsersCount"
        );


    const femaleUsers =
        document.getElementById(
            "femaleUsersCount"
        );


    const otherUsers =
        document.getElementById(
            "otherUsersCount"
        );


    /*
     * Total comes from backend.
     */

    if (totalUsers) {

        totalUsers.textContent =
            totalElements;

    }


    /*
     * Gender counts for
     * currently loaded page.
     */

    let male = 0;

    let female = 0;

    let other = 0;


    allUsers.forEach(
        function (user) {

            const gender =
                String(
                    user.gender ?? ""
                )
                .trim()
                .toLowerCase();


            if (gender === "male") {

                male++;

            }
            else if (
                gender === "female"
            ) {

                female++;

            }
            else {

                other++;

            }

        }
    );


    if (maleUsers) {
        maleUsers.textContent = male;
    }


    if (femaleUsers) {
        femaleUsers.textContent = female;
    }


    if (otherUsers) {
        otherUsers.textContent = other;
    }


    /*
     * Badge
     */

    const userCountBadge =
        document.getElementById(
            "userCountBadge"
        );


    if (userCountBadge) {

        userCountBadge.textContent =
            totalElements +
            (
                totalElements === 1
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

function updateVisibleUserCount(
    count
) {

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
 * PAGINATION
 * ============================================================
 */

function renderPagination() {

    const pagination =
        document.getElementById(
            "userPagination"
        );


    if (!pagination) {
        return;
    }


    pagination.innerHTML = "";


    if (totalPages <= 1) {

        return;

    }


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "d-flex justify-content-between align-items-center flex-wrap gap-2";


    /*
     * ========================================================
     * INFO
     * ========================================================
     */

    const info =
        document.createElement("small");


    info.className =
        "text-muted";


    const start =
        currentPage * PAGE_SIZE + 1;


    const end =
        Math.min(
            start + allUsers.length - 1,
            totalElements
        );


    info.textContent =
        "Showing " +
        start +
        " - " +
        end +
        " of " +
        totalElements +
        " users";


    wrapper.appendChild(info);


    /*
     * ========================================================
     * NAVIGATION
     * ========================================================
     */

    const nav =
        document.createElement("div");


    nav.className =
        "d-flex align-items-center gap-1";


    /*
     * PREVIOUS
     */

    const previous =
        document.createElement(
            "button"
        );


    previous.type = "button";

    previous.className =
        "btn btn-sm btn-outline-primary";


    previous.innerHTML =
        '<i class="fa-solid fa-chevron-left"></i>';


    previous.disabled =
        currentPage === 0;


    previous.addEventListener(
        "click",
        function () {

            if (currentPage > 0) {

                loadUsers(
                    currentPage - 1
                );

            }

        }
    );


    nav.appendChild(previous);


    /*
     * PAGE NUMBERS
     */

    for (
        let i = 0;
        i < totalPages;
        i++
    ) {

        /*
         * Hide unnecessary pages
         */

        if (
            totalPages > 7 &&
            i !== 0 &&
            i !== totalPages - 1 &&
            Math.abs(
                i - currentPage
            ) > 2
        ) {

            if (
                i === 1 ||
                i === totalPages - 2
            ) {

                const dots =
                    document.createElement(
                        "span"
                    );

                dots.className =
                    "px-2 text-muted";

                dots.textContent =
                    "...";

                nav.appendChild(dots);

            }

            continue;
        }


        const pageButton =
            document.createElement(
                "button"
            );


        pageButton.type =
            "button";


        pageButton.className =
            "btn btn-sm " +
            (
                i === currentPage
                ? "btn-primary"
                : "btn-outline-primary"
            );


        pageButton.textContent =
            i + 1;


        pageButton.addEventListener(
            "click",
            function () {

                loadUsers(i);

            }
        );


        nav.appendChild(
            pageButton
        );

    }


    /*
     * NEXT
     */

    const next =
        document.createElement(
            "button"
        );


    next.type =
        "button";


    next.className =
        "btn btn-sm btn-outline-primary";


    next.innerHTML =
        '<i class="fa-solid fa-chevron-right"></i>';


    next.disabled =
        currentPage >=
        totalPages - 1;


    next.addEventListener(
        "click",
        function () {

            if (
                currentPage <
                totalPages - 1
            ) {

                loadUsers(
                    currentPage + 1
                );

            }

        }
    );


    nav.appendChild(next);


    wrapper.appendChild(nav);


    pagination.appendChild(
        wrapper
    );
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


    const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token");


    if (!token) {

        showUserMessage(
            "Admin session expired. Please login again.",
            "danger"
        );

        return;
    }


    const deleteUrl =
        DELETE_USER_API +
        "/" +
        encodeURIComponent(id);


    fetch(
        deleteUrl,
        {
            method: "DELETE",

            headers: {
                "Accept":
                    "application/json",

                "Authorization":
                    "Bearer " + token
            }
        }
    )

    .then(
        function (response) {

            return response.text()
                .then(
                    function (text) {

                        let data = {};


                        if (text) {

                            try {

                                data =
                                    JSON.parse(
                                        text
                                    );

                            }
                            catch (error) {

                                data = {
                                    message: text
                                };

                            }

                        }


                        if (!response.ok) {

                            if (
                                response.status === 401
                            ) {

                                throw new Error(
                                    "Unauthorized. Please login again."
                                );

                            }


                            if (
                                response.status === 403
                            ) {

                                throw new Error(
                                    "Access denied. Admin permission required."
                                );

                            }


                            throw new Error(
                                data.message ||
                                "Failed to delete user. HTTP Status: " +
                                response.status
                            );

                        }


                        return data;

                    }
                );

        }
    )

    .then(
        function (data) {

            console.log(
                "Delete response:",
                data
            );


            showUserMessage(
                data.message ||
                "User deleted successfully.",
                "success"
            );


            /*
             * If last user on page was deleted,
             * go to previous page.
             */

            if (
                allUsers.length === 1 &&
                currentPage > 0
            ) {

                currentPage--;

            }


            loadUsers(
                currentPage
            );

        }
    )

    .catch(
        function (error) {

            console.error(
                "Delete user error:",
                error
            );


            showUserMessage(
                error.message ||
                "Failed to delete user.",
                "danger"
            );

        }
    );
}


/*
 * ============================================================
 * REFRESH
 * ============================================================
 */

function refreshUsers() {

    loadUsers(
        currentPage
    );
}


/*
 * ============================================================
 * RESET FILTERS
 * ============================================================
 */

function resetUserFilters() {

    const searchInput =
        document.getElementById(
            "userSearch"
        );


    if (searchInput) {

        searchInput.value = "";

    }


    selectedGender = "";


    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );


            if (
                !button.dataset.gender
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );


    filterUsers();
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


    allUsers.forEach(
        function (user) {

            const userId =
                user.userId ?? "";


            const name =
                user.name ?? "";


            const email =
                user.email ?? "";


            const mobile =
                user.mobile ?? "";


            const gender =
                user.gender ?? "";


            const address =
                user.address ?? "";


            const createdAt =
                user.createdAt ?? "";


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

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "travelai-users.csv";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );
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


    box.classList.remove(
        "d-none"
    );


    setTimeout(
        function () {

            box.classList.add(
                "d-none"
            );

        },
        4000
    );
}


/*
 * ============================================================
 * ERROR
 * ============================================================
 */

function showUserError(
    message
) {

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

                    <div class="d-flex gap-2 justify-content-center mt-2">
                        <button
                            type="button"
                            class="btn btn-primary btn-sm rounded-pill px-3"
                            onclick="loadUsers(currentPage)">
                            <i class="fa-solid fa-arrows-rotate me-1"></i>
                            Try Again
                        </button>
                        <a
                            href="login.jsp?role=admin"
                            class="btn btn-outline-secondary btn-sm rounded-pill px-3">
                            <i class="fa-solid fa-right-to-bracket me-1"></i>
                            Login as Admin
                        </a>
                    </div>

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

function getGenderBadge(
    gender
) {

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


    if (
        normalized === "male"
    ) {

        className =
            "male";

    }
    else if (
        normalized === "female"
    ) {

        className =
            "female";

    }


    return `
        <span
            class="user-gender ${className}">

            ${escapeHtml(gender)}

        </span>
    `;
}


/*
 * ============================================================
 * INITIALS
 * ============================================================
 */

function getInitials(
    name
) {

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


    if (
        words.length === 1
    ) {

        return escapeHtml(
            words[0]
                .charAt(0)
                .toUpperCase()
        );
    }


    return escapeHtml(
        (
            words[0].charAt(0) +
            words[
                words.length - 1
            ].charAt(0)
        )
        .toUpperCase()
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
        value.substring(
            0,
            maxLength
        ) +
        "..."
    );
}


/*
 * ============================================================
 * ESCAPE HTML
 * ============================================================
 */

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/*
 * ============================================================
 * ESCAPE JAVASCRIPT
 * ============================================================
 */

function escapeJs(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        )

        .replace(
            /"/g,
            '\\"'
        )

        .replace(
            /\r/g,
            "\\r"
        )

        .replace(
            /\n/g,
            "\\n"
        );
}