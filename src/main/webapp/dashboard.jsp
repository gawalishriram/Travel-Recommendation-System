<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard | Travel AI</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
<link href="css/common.css" rel="stylesheet">
<link href="css/dashboard.css" rel="stylesheet">
</head>
<body>
<%@ include file="navbar.jsp" %>
<div class="container mt-4">
    <div id="message" class="alert" style="display:none"></div>
    <h2 class="page-title">Dashboard</h2>
    <div class="card dashboard-welcome">
        <div class="card-body">
            <h3>Welcome, <span id="dashboardUser">User</span>!</h3>
            <p class="mb-0">Discover destinations that match your travel preferences.</p>
        </div>
    </div>
    <div class="row g-4 mt-1">
        <div class="col-md-4"><a class="action-card" href="recommendation.jsp"><i class="fa-solid fa-wand-magic-sparkles"></i><span>Recommendation</span></a></div>
        <div class="col-md-4"><a class="action-card" href="profile.jsp"><i class="fa-solid fa-user"></i><span>My Profile</span></a></div>
        <div class="col-md-4"><a class="action-card" href="favorites.jsp"><i class="fa-solid fa-heart"></i><span>Favorites</span></a></div>
    </div>
</div>
<%@ include file="footer.jsp" %>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/common.js"></script>
<script src="js/logoutUser.js"></script>
<script src="js/dashboard.js"></script>
</body>
</html>
