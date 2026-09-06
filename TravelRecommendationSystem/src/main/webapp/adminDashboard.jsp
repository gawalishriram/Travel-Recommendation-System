<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | TravelAI Management Console</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin.css?v=4">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/adminDashboard.css?v=4">

    <style>
        :root {
            --primary-accent: #0062ff;
            --emerald-accent: #10b981;
            --purple-accent: #8b5cf6;
            --amber-accent: #f59e0b;
        }

        .dashboard-page {
            padding: 28px;
            background: #f8fafc;
        }

        /* Modern Stat Cards */
        .stat-card-modern {
            position: relative;
            background: #ffffff;
            border-radius: 22px;
            padding: 26px 24px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .stat-card-modern:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
        }
        .stat-card-modern::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
        }
        .stat-card-users::before { background: linear-gradient(180deg, #2563eb, #60a5fa); }
        .stat-card-destinations::before { background: linear-gradient(180deg, #059669, #34d399); }
        .stat-card-bookings::before { background: linear-gradient(180deg, #7c3aed, #a78bfa); }
        .stat-card-health::before { background: linear-gradient(180deg, #d97706, #fbbf24); }

        .stat-icon-wrapper {
            width: 64px;
            height: 64px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            flex-shrink: 0;
        }
        .icon-wrap-blue { background: rgba(37, 99, 235, 0.1); color: #2563eb; }
        .icon-wrap-green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .icon-wrap-purple { background: rgba(124, 58, 237, 0.1); color: #7c3aed; }
        .icon-wrap-amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

        .stat-data-value {
            font-family: 'Outfit', sans-serif;
            font-size: 2.2rem;
            font-weight: 800;
            line-height: 1.1;
            color: #0f172a;
            margin-bottom: 4px;
        }
        .stat-data-label {
            font-size: 0.88rem;
            font-weight: 600;
            color: #64748b;
        }
        .stat-badge-trend {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.74rem;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 20px;
            margin-top: 6px;
        }
        .trend-up { background: #dcfce7; color: #16a34a; }
        .trend-live { background: #ede9fe; color: #7c3aed; }

        /* Demographics Visualizer */
        .demographics-panel {
            background: #ffffff;
            border-radius: 24px;
            padding: 28px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
            margin-bottom: 28px;
        }
        .demo-chip {
            padding: 20px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            gap: 16px;
            transition: transform 0.2s;
        }
        .demo-chip:hover {
            transform: translateY(-2px);
        }
        .demo-chip-male {
            background: rgba(37, 99, 235, 0.06);
            border: 1px solid rgba(37, 99, 235, 0.18);
        }
        .demo-chip-female {
            background: rgba(236, 72, 153, 0.06);
            border: 1px solid rgba(236, 72, 153, 0.18);
        }
        .demo-chip-other {
            background: rgba(139, 92, 246, 0.06);
            border: 1px solid rgba(139, 92, 246, 0.18);
        }
        .demo-avatar {
            width: 50px;
            height: 50px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        .avatar-male { background: rgba(37, 99, 235, 0.15); color: #2563eb; }
        .avatar-female { background: rgba(236, 72, 153, 0.15); color: #ec4899; }
        .avatar-other { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }

        /* Quick Launchers */
        .launcher-card {
            background: #ffffff;
            border-radius: 22px;
            padding: 24px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-decoration: none;
            color: inherit;
            transition: all 0.25s ease;
        }
        .launcher-card:hover {
            transform: translateY(-4px);
            border-color: #0062ff;
            box-shadow: 0 10px 25px rgba(0, 98, 255, 0.12);
            color: #0062ff;
        }
        .launcher-icon {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            color: #334155;
            transition: all 0.25s;
        }
        .launcher-card:hover .launcher-icon {
            background: #0062ff;
            color: #fff;
        }

        /* Modern Table Card */
        .table-card-modern {
            background: #ffffff;
            border-radius: 24px;
            padding: 28px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
            margin-bottom: 28px;
        }
        .table-card-modern table th {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            font-weight: 700;
            color: #64748b;
            padding: 14px 16px;
            border-bottom: 2px solid #f1f5f9;
        }
        .table-card-modern table td {
            padding: 14px 16px;
            font-size: 0.9rem;
            color: #334155;
            vertical-align: middle;
            border-bottom: 1px solid #f1f5f9;
        }
        .user-avatar-initials {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            background: linear-gradient(135deg, #0062ff, #00c6ff);
            color: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.88rem;
            margin-right: 10px;
        }

        @media (max-width: 768px) {
            .dashboard-page {
                padding: 16px;
            }
            .stat-data-value {
                font-size: 1.8rem;
            }
            .stat-icon-wrapper {
                width: 52px;
                height: 52px;
                font-size: 20px;
            }
            .demographics-panel, .table-card-modern {
                padding: 20px 16px;
            }
        }
    </style>
</head>

<body>
    <%@ include file="adminSidebar.jsp" %>

    <div class="main">
        <%@ include file="adminTopbar.jsp" %>

        <main class="dashboard-page">

            <!-- PAGE HEADER -->
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 class="fw-bold mb-1" style="color:#0f172a; font-family:'Outfit', sans-serif;">
                        <i class="fa-solid fa-chart-pie text-primary me-2"></i>Executive Overview
                    </h2>
                    <p class="text-muted mb-0" style="font-size:0.92rem;">
                        Real-time analytics across platform travelers, destinations, and system metrics
                    </p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-outline-primary rounded-pill px-3 py-2 btn-sm" onclick="loadDashboardData()" title="Reload real-time metrics">
                        <i class="fa-solid fa-arrows-rotate me-1"></i> Refresh Data
                    </button>
                    <a href="addDestination.jsp" class="btn btn-primary rounded-pill px-4 py-2 btn-sm fw-semibold shadow-sm">
                        <i class="fa-solid fa-plus me-1"></i> Add Destination
                    </a>
                </div>
            </div>

            <!-- PRIMARY 4 METRIC STAT CARDS -->
            <div class="row g-4 mb-4">
                <div class="col-xl-3 col-md-6">
                    <div class="stat-card-modern stat-card-users">
                        <div>
                            <div class="stat-data-value" id="totalUsers">0</div>
                            <div class="stat-data-label">Registered Users</div>
                            <span class="stat-badge-trend trend-up">
                                <i class="fa-solid fa-arrow-trend-up"></i> Verified Accounts
                            </span>
                        </div>
                        <div class="stat-icon-wrapper icon-wrap-blue">
                            <i class="fa-solid fa-users"></i>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div class="stat-card-modern stat-card-destinations">
                        <div>
                            <div class="stat-data-value" id="totalDestinations">0</div>
                            <div class="stat-data-label">Total Destinations</div>
                            <span class="stat-badge-trend trend-up">
                                <i class="fa-solid fa-compass"></i> Active Catalog
                            </span>
                        </div>
                        <div class="stat-icon-wrapper icon-wrap-green">
                            <i class="fa-solid fa-location-dot"></i>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div class="stat-card-modern stat-card-bookings">
                        <div>
                            <div class="stat-data-value" id="totalBookings">0</div>
                            <div class="stat-data-label">Total Bookings</div>
                            <span class="stat-badge-trend trend-live">
                                <i class="fa-solid fa-bolt"></i> Real-time Orders
                            </span>
                        </div>
                        <div class="stat-icon-wrapper icon-wrap-purple">
                            <i class="fa-solid fa-ticket"></i>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div class="stat-card-modern stat-card-health">
                        <div>
                            <div class="stat-data-value" style="color:#f59e0b;">99.9%</div>
                            <div class="stat-data-label">Platform Health</div>
                            <span class="stat-badge-trend trend-up">
                                <i class="fa-solid fa-circle-check"></i> System Operational
                            </span>
                        </div>
                        <div class="stat-icon-wrapper icon-wrap-amber">
                            <i class="fa-solid fa-shield-heart"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GENDER DEMOGRAPHICS ROW -->
            <div class="demographics-panel">
                <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h5 class="fw-bold mb-1" style="color:#0f172a;">
                            <i class="fa-solid fa-venus-mars text-primary me-2"></i> Traveler Gender Demographics
                        </h5>
                        <small class="text-muted">Registered user demographic breakdown</small>
                    </div>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">
                        <i class="fa-solid fa-chart-simple me-1"></i> Live Breakdown
                    </span>
                </div>

                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="demo-chip demo-chip-male">
                            <div class="demo-avatar avatar-male">
                                <i class="fa-solid fa-person"></i>
                            </div>
                            <div>
                                <div class="fw-bold fs-3 text-primary mb-0" id="maleCount">0</div>
                                <div class="fw-semibold text-secondary" style="font-size:0.86rem;">Male Travelers</div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="demo-chip demo-chip-female">
                            <div class="demo-avatar avatar-female">
                                <i class="fa-solid fa-person-dress"></i>
                            </div>
                            <div>
                                <div class="fw-bold fs-3 text-danger mb-0" style="color:#ec4899 !important;" id="femaleCount">0</div>
                                <div class="fw-semibold text-secondary" style="font-size:0.86rem;">Female Travelers</div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="demo-chip demo-chip-other">
                            <div class="demo-avatar avatar-other">
                                <i class="fa-solid fa-genderless"></i>
                            </div>
                            <div>
                                <div class="fw-bold fs-3 text-purple mb-0" style="color:#8b5cf6 !important;" id="otherGenderCount">0</div>
                                <div class="fw-semibold text-secondary" style="font-size:0.86rem;">Other / Diverse</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- QUICK SHORTCUT LAUNCHERS -->
            <div class="row g-3 mb-4">
                <div class="col-lg-3 col-sm-6">
                    <a href="manageDestination.jsp" class="launcher-card">
                        <div>
                            <div class="fw-bold mb-1">Destinations</div>
                            <small class="text-muted">View &amp; Edit Catalog</small>
                        </div>
                        <div class="launcher-icon">
                            <i class="fa-solid fa-map-location-dot"></i>
                        </div>
                    </a>
                </div>

                <div class="col-lg-3 col-sm-6">
                    <a href="addDestination.jsp" class="launcher-card">
                        <div>
                            <div class="fw-bold mb-1">Add Destination</div>
                            <small class="text-muted">Upload New Place</small>
                        </div>
                        <div class="launcher-icon">
                            <i class="fa-solid fa-circle-plus"></i>
                        </div>
                    </a>
                </div>

                <div class="col-lg-3 col-sm-6">
                    <a href="manageUsers.jsp" class="launcher-card">
                        <div>
                            <div class="fw-bold mb-1">User Manager</div>
                            <small class="text-muted">Profiles &amp; Roles</small>
                        </div>
                        <div class="launcher-icon">
                            <i class="fa-solid fa-users-gear"></i>
                        </div>
                    </a>
                </div>

                <div class="col-lg-3 col-sm-6">
                    <a href="manageBookings.jsp" class="launcher-card">
                        <div>
                            <div class="fw-bold mb-1">Manage Bookings</div>
                            <small class="text-muted">Confirm &amp; Track</small>
                        </div>
                        <div class="launcher-icon">
                            <i class="fa-solid fa-receipt"></i>
                        </div>
                    </a>
                </div>
            </div>

            <!-- LOGGED-IN USERS TABLE -->
            <div class="table-card-modern">
                <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h5 class="fw-bold mb-1" style="color:#0f172a;">
                            <i class="fa-solid fa-user-check text-success me-2"></i> Real-time Logged In Accounts
                        </h5>
                        <small class="text-muted">Travelers currently authenticated or recently active</small>
                    </div>
                    <a href="manageUsers.jsp" class="btn btn-outline-primary btn-sm rounded-pill px-3">
                        View Complete User Directory <i class="fa-solid fa-arrow-right ms-1"></i>
                    </a>
                </div>

                <div id="usersLoader" class="text-center py-5">
                    <i class="fa-solid fa-spinner fa-spin fa-2x text-primary"></i>
                    <p class="mt-2 text-muted fw-semibold">Loading real-time user accounts...</p>
                </div>

                <div class="table-responsive" id="loggedInTableWrapper" style="display:none">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>#ID</th>
                                <th>Traveler Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Mobile</th>
                                <th>Address</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody id="loggedInUsersTableBody"></tbody>
                    </table>
                </div>

                <div id="noLoginsMsg" class="alert alert-info text-center d-none my-3" role="alert">
                    <i class="fa-solid fa-circle-info me-2"></i> No active traveler logins recorded yet.
                </div>
            </div>

        </main>

        <%@ include file="adminFooter.jsp" %>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/js/adminDashboard.js?v=4"></script>
</body>
</html>