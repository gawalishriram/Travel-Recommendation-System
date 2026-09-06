<div class="sidebar" id="adminSidebar">

    <div class="logo d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-plane-departure"></i>
            <h2>TravelAI</h2>
        </div>
        <button type="button" class="btn btn-link text-white d-lg-none p-1" id="sidebarCloseBtn" aria-label="Close Sidebar" style="font-size:1.25rem;">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <!-- DASHBOARD -->
    <a href="${pageContext.request.contextPath}/adminDashboard.jsp">
        <i class="fa-solid fa-chart-line"></i>
        <span>Dashboard</span>
    </a>

    <!-- DESTINATIONS -->
    <div class="sidebar-section">
        <div class="sidebar-section-title">
            <i class="fa-solid fa-location-dot"></i>
            <span>Destinations</span>
        </div>

        <a href="${pageContext.request.contextPath}/addDestination.jsp" class="sidebar-submenu">
            <i class="fa-solid fa-plus"></i>
            <span>Add Destination</span>
        </a>

        <a href="${pageContext.request.contextPath}/manageDestination.jsp" class="sidebar-submenu">
            <i class="fa-solid fa-list"></i>
            <span>View Destinations</span>
        </a>
    </div>

    <!-- USERS -->
    <a href="${pageContext.request.contextPath}/manageUsers.jsp">
        <i class="fa-solid fa-users"></i>
        <span>Users</span>
    </a>

    <!-- BOOKINGS -->
    <a href="${pageContext.request.contextPath}/manageBookings.jsp">
        <i class="fa-solid fa-ticket"></i>
        <span>Bookings</span>
    </a>

    <!-- LOGOUT -->
    <a href="${pageContext.request.contextPath}/login.jsp" id="adminLogoutLink" onclick="localStorage.clear();">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
    </a>

</div>

<div class="sidebar-overlay" id="sidebarOverlay"></div>

<script>
(function() {
    const path = window.location.pathname.toLowerCase();
    const links = document.querySelectorAll("#adminSidebar a");
    links.forEach(function(a) {
        const href = (a.getAttribute("href") || "").toLowerCase();
        if (href) {
            const fileName = href.split("/").pop();
            if (fileName && path.endsWith(fileName)) {
                a.classList.add("active");
            }
        }
    });

    const closeBtn = document.getElementById("sidebarCloseBtn");
    if (closeBtn) {
        closeBtn.addEventListener("click", function() {
            const sidebar = document.getElementById("adminSidebar");
            const overlay = document.getElementById("sidebarOverlay");
            if (sidebar) sidebar.classList.remove("active");
            if (overlay) overlay.classList.remove("active");
        });
    }
})();
</script>