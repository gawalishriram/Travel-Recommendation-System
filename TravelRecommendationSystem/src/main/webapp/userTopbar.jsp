<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="topbar">
    <div class="d-flex align-items-center gap-3">
        <span class="menu-btn" id="menuBtn">
            <i class="fa-solid fa-bars"></i>
        </span>

        <div>
            <h3 id="userPageTitle">User Dashboard</h3>
            <small class="text-muted" id="userPageSubtitle">Explore and book your next dream vacation</small>
        </div>
    </div>

    <div class="d-flex align-items-center gap-2" id="topbarAuthSection">
        <!-- Logged-in profile badge -->
        <div class="profile" id="userProfileBadge" style="display:none;">
            <i class="fa-solid fa-circle-user me-2 text-primary"></i>
            <span id="welcomeUser">User</span>
        </div>

        <!-- Guest action buttons -->
        <div class="d-flex align-items-center gap-2" id="guestAuthButtons">
            <a href="${pageContext.request.contextPath}/login.jsp" class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold">
                <i class="fa-solid fa-right-to-bracket me-1"></i> Login
            </a>
            <a href="${pageContext.request.contextPath}/register.jsp" class="btn btn-primary btn-sm rounded-pill px-3 fw-bold">
                <i class="fa-solid fa-user-plus me-1"></i> Register
            </a>
        </div>
    </div>
</div>

<script>
(function() {
    function syncTopbarAuth() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const name = localStorage.getItem("userName") || "Traveler";
        const profileBadge = document.getElementById("userProfileBadge");
        const guestBtns = document.getElementById("guestAuthButtons");
        const welcomeUser = document.getElementById("welcomeUser");

        if (token && userId) {
            if (profileBadge) profileBadge.style.display = "flex";
            if (guestBtns) guestBtns.style.display = "none";
            if (welcomeUser) welcomeUser.textContent = name;
        } else {
            if (profileBadge) profileBadge.style.display = "none";
            if (guestBtns) guestBtns.style.display = "flex";
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", syncTopbarAuth);
    } else {
        syncTopbarAuth();
    }
})();
</script>
