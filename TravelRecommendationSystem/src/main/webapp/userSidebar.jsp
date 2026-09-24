<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="sidebar" id="userSidebar">
    <div class="logo d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-plane-departure"></i>
            <h2>TravelAI</h2>
        </div>
        <button type="button" class="btn btn-link text-white d-lg-none p-1" id="userSidebarCloseBtn" aria-label="Close Sidebar" style="font-size:1.25rem;">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <!-- DASHBOARD / HOME -->
    <a href="${pageContext.request.contextPath}/dashboard.jsp" id="navDashboard">
        <i class="fa-solid fa-chart-pie"></i>
        <span>Dashboard</span>
    </a>

    <!-- RECOMMENDATIONS / AI DISCOVER -->
    <a href="${pageContext.request.contextPath}/recommendation.jsp" id="navRecommendations">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <span>AI Discover</span>
    </a>

    <!-- FAVORITES -->
    <a href="${pageContext.request.contextPath}/favorites.jsp" id="navFavorites">
        <i class="fa-solid fa-heart"></i>
        <span>My Favorites</span>
    </a>

    <!-- MY BOOKINGS -->
    <a href="${pageContext.request.contextPath}/booking.jsp" id="navBookings">
        <i class="fa-solid fa-ticket"></i>
        <span>My Bookings</span>
    </a>

    <!-- PROFILE -->
    <a href="${pageContext.request.contextPath}/profile.jsp" id="navProfile">
        <i class="fa-solid fa-user-circle"></i>
        <span>My Profile</span>
    </a>

    <!-- AUTH ACTION (LOGOUT OR LOGIN) -->
    <a href="${pageContext.request.contextPath}/login.jsp" id="userAuthSidebarLink">
        <i class="fa-solid fa-right-from-bracket" id="userAuthSidebarIcon"></i>
        <span id="userAuthSidebarText">Logout</span>
    </a>
</div>

<div class="sidebar-overlay" id="sidebarOverlay"></div>

<script>
(function() {
    function initUserSidebar() {
        const sidebar = document.getElementById("userSidebar");
        const overlay = document.getElementById("sidebarOverlay");
        const menuBtn = document.getElementById("menuBtn");
        const closeBtn = document.getElementById("userSidebarCloseBtn");

        function openSidebar() {
            if (sidebar) sidebar.classList.add("active");
            if (overlay) overlay.classList.add("active");
        }
        function closeSidebar() {
            if (sidebar) sidebar.classList.remove("active");
            if (overlay) overlay.classList.remove("active");
        }

        if (menuBtn) menuBtn.addEventListener("click", openSidebar);
        if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
        if (overlay) overlay.addEventListener("click", closeSidebar);

        // Check authentication state for sidebar
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const authLink = document.getElementById("userAuthSidebarLink");
        const authIcon = document.getElementById("userAuthSidebarIcon");
        const authText = document.getElementById("userAuthSidebarText");

        if (authLink && authIcon && authText) {
            if (token && userId) {
                authLink.href = "${pageContext.request.contextPath}/login.jsp";
                authIcon.className = "fa-solid fa-right-from-bracket";
                authText.textContent = "Logout";
                authLink.onclick = function(e) {
                    e.preventDefault();
                    if (typeof logoutUser === "function") {
                        logoutUser();
                    } else {
                        localStorage.clear();
                        window.location.replace("login.jsp");
                    }
                };
            } else {
                authLink.href = "${pageContext.request.contextPath}/login.jsp";
                authIcon.className = "fa-solid fa-right-to-bracket";
                authText.textContent = "Sign In / Register";
                authLink.onclick = null;
            }
        }

        // Highlight active link
        const currentPath = window.location.pathname.toLowerCase();
        const links = document.querySelectorAll("#userSidebar a");
        links.forEach(link => {
            const href = link.getAttribute("href");
            if (href && currentPath.endsWith(href.split("/").pop().toLowerCase())) {
                link.classList.add("active");
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUserSidebar);
    } else {
        initUserSidebar();
    }
})();
</script>
