<div class="sidebar" id="adminSidebar">

    <div class="logo">

        <i class="fa-solid fa-plane-departure"></i>

        <h2>TravelAI</h2>

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


        <a
            href="${pageContext.request.contextPath}/addDestination.jsp"
            class="sidebar-submenu">

            <i class="fa-solid fa-plus"></i>

            <span>Add Destination</span>

        </a>


        <a
            href="${pageContext.request.contextPath}/manageDestination.jsp"
            class="sidebar-submenu">

            <i class="fa-solid fa-list"></i>

            <span>View Destinations</span>

        </a>

    </div>


    <!-- USERS -->

    <a
        href="${pageContext.request.contextPath}/manageUsers.jsp">

        <i class="fa-solid fa-users"></i>

        <span>Users</span>

    </a>


    <!-- LOGOUT -->

    <a
        href="${pageContext.request.contextPath}/adminLogin.jsp"
        id="adminLogoutLink">

        <i class="fa-solid fa-right-from-bracket"></i>

        <span>Logout</span>

    </a>

</div>


<div
    class="sidebar-overlay"
    id="sidebarOverlay">
</div>