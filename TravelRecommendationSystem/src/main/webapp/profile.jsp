<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile | TravelAI</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin.css?v=3">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/adminDashboard.css?v=3">
    <style>
        .profile-avatar-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #60a5fa);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.2rem;
            color: #fff;
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
        }
        .profile-section-title {
            font-weight: 700;
            font-size: 1.05rem;
            color: #1e293b;
            padding-bottom: 12px;
            border-bottom: 2px solid #f1f5f9;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <%@ include file="userSidebar.jsp" %>

    <div class="main">
        <%@ include file="userTopbar.jsp" %>

        <main class="dashboard-page">
            <!-- Header with avatar -->
            <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <div class="d-flex align-items-center gap-4">
                    <div class="profile-avatar-circle"><i class="fa-solid fa-user"></i></div>
                    <div>
                        <h3 class="fw-bold mb-1" id="profileHeadingName">My Profile</h3>
                        <p class="text-muted mb-0">View and update your personal information and password</p>
                    </div>
                </div>
            </div>

            <div id="message" class="alert d-none" role="alert"></div>

            <input type="hidden" id="userId">

            <!-- Personal Information Form -->
            <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <div class="profile-section-title"><i class="fa-solid fa-address-card text-primary me-2"></i>Personal Details</div>
                <div class="row g-4">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold"><i class="fa-solid fa-user text-primary me-1"></i> Full Name</label>
                        <input id="name" class="form-control rounded-3" type="text" placeholder="Your full name">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold"><i class="fa-solid fa-envelope text-primary me-1"></i> Email Address</label>
                        <input id="email" class="form-control rounded-3" type="email" placeholder="Your email address">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold"><i class="fa-solid fa-phone text-primary me-1"></i> Mobile Number</label>
                        <input id="mobile" class="form-control rounded-3" type="text" maxlength="10" placeholder="10-digit mobile number">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold"><i class="fa-solid fa-venus-mars text-primary me-1"></i> Gender</label>
                        <select id="gender" class="form-select rounded-3">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <label class="form-label fw-semibold"><i class="fa-solid fa-location-dot text-primary me-1"></i> Address</label>
                        <textarea id="address" class="form-control rounded-3" rows="3" placeholder="Enter your full address"></textarea>
                    </div>
                </div>
            </div>

            <!-- Password Update Form -->
            <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <div class="profile-section-title"><i class="fa-solid fa-lock text-primary me-2"></i>Change Password <small class="text-muted fw-normal fs-6">(Optional)</small></div>
                <div class="row g-4">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold"><i class="fa-solid fa-key text-primary me-1"></i> New Password</label>
                        <input id="password" class="form-control rounded-3" type="password" placeholder="Leave blank to keep current">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold"><i class="fa-solid fa-key text-primary me-1"></i> Confirm Password</label>
                        <input id="confirmPassword" class="form-control rounded-3" type="password" placeholder="Confirm new password">
                    </div>
                </div>
            </div>

            <div class="d-flex gap-3 flex-wrap">
                <button class="btn btn-primary rounded-pill px-4 py-2 fw-semibold" type="button" onclick="updateProfile()">
                    <i class="fa-solid fa-floppy-disk me-2"></i>Save Changes
                </button>
                <a class="btn btn-light border rounded-pill px-4 py-2" href="dashboard.jsp">
                    <i class="fa-solid fa-arrow-left me-1"></i> Back to Dashboard
                </a>
            </div>
        </main>

        <%@ include file="adminFooter.jsp" %>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/common.js"></script>
    <script src="js/profile.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const title = document.getElementById("userPageTitle");
            const sub = document.getElementById("userPageSubtitle");
            if (title) title.textContent = "My Profile";
            if (sub) sub.textContent = "View and manage your account details and password";
            const nav = document.getElementById("navProfile");
            if (nav) nav.classList.add("active");
        });
    </script>
</body>
</html>
