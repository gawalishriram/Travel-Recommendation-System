<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard | TravelAI</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin.css?v=3">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/adminDashboard.css?v=3">
    <style>
        .user-stat-card {
            min-height: 140px;
            border-radius: 20px;
            padding: 24px;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 20px;
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            text-decoration: none;
        }
        .user-stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 35px rgba(15, 23, 42, 0.15);
            color: #fff;
        }
        .card-destinations { background: linear-gradient(135deg, #2563eb, #60a5fa); }
        .card-favorites { background: linear-gradient(135deg, #ec4899, #f472b6); }
        .card-bookings { background: linear-gradient(135deg, #10b981, #34d399); }
        .card-recommend { background: linear-gradient(135deg, #8b5cf6, #c084fc); }

        .dest-card-box {
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #f1f5f9;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
            transition: all 0.25s ease;
            height: 100%;
            position: relative;
        }
        .dest-card-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
        }
        .dest-card-img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .fav-heart-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(4px);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
            color: #94a3b8;
            transition: all 0.2s ease;
            z-index: 10;
        }
        .fav-heart-btn:hover {
            transform: scale(1.15);
            color: #ef4444;
        }
        .fav-heart-btn.active {
            color: #ef4444;
        }
    </style>
</head>

<body>
    <%@ include file="userSidebar.jsp" %>

    <div class="main">
        <%@ include file="userTopbar.jsp" %>

        <main class="dashboard-page">
            <!-- HEADER -->
            <div class="dashboard-header mb-4">
                <div>
                    <h2>Welcome, <span id="dashboardUser" class="text-primary">Traveler</span>! ✈️</h2>
                    <p>Discover handpicked destinations, manage your travel bookings and recommendations.</p>
                </div>
            </div>

            <!-- STAT CARDS ROW -->
            <div class="row g-4 mb-4">
                <div class="col-lg-3 col-md-6">
                    <a href="#destinationsSection" class="user-stat-card card-destinations">
                        <div class="dashboard-stat-icon">
                            <i class="fa-solid fa-earth-americas"></i>
                        </div>
                        <div class="dashboard-stat-content">
                            <div class="dashboard-stat-value" id="statDestCount">0</div>
                            <div class="dashboard-stat-label">Destinations</div>
                        </div>
                    </a>
                </div>

                <div class="col-lg-3 col-md-6">
                    <a href="favorites.jsp" class="user-stat-card card-favorites">
                        <div class="dashboard-stat-icon">
                            <i class="fa-solid fa-heart"></i>
                        </div>
                        <div class="dashboard-stat-content">
                            <div class="dashboard-stat-value" id="statFavCount">0</div>
                            <div class="dashboard-stat-label">Saved Favorites</div>
                        </div>
                    </a>
                </div>

                <div class="col-lg-3 col-md-6">
                    <a href="booking.jsp" class="user-stat-card card-bookings">
                        <div class="dashboard-stat-icon">
                            <i class="fa-solid fa-ticket"></i>
                        </div>
                        <div class="dashboard-stat-content">
                            <div class="dashboard-stat-value" id="statBookingCount">0</div>
                            <div class="dashboard-stat-label">My Bookings</div>
                        </div>
                    </a>
                </div>

                <div class="col-lg-3 col-md-6">
                    <a href="recommendation.jsp" class="user-stat-card card-recommend">
                        <div class="dashboard-stat-icon">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <div class="dashboard-stat-content">
                            <div class="dashboard-stat-value">AI</div>
                            <div class="dashboard-stat-label">Recommendations</div>
                        </div>
                    </a>
                </div>
            </div>

            <div id="message" class="alert d-none" role="alert"></div>

            <!-- EXPLORE DESTINATIONS SECTION -->
            <div class="card border-0 shadow-sm rounded-4 p-4 mb-4" id="destinationsSection">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                    <div>
                        <h4 class="fw-bold mb-1"><i class="fa-solid fa-map-location-dot text-primary me-2"></i>Explore Destinations</h4>
                        <p class="text-muted mb-0 small" id="destPaginationInfo">Browse all available destinations with pagination (10 per page)</p>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <input type="text" id="destSearchInput" class="form-control rounded-pill px-3" placeholder="🔍 Search destinations..." style="max-width: 240px;" oninput="onUserDestSearch()">
                        <select id="destSortSelect" class="form-select rounded-pill px-3" style="width: auto; font-size: 0.88rem;" onchange="onUserDestSort()">
                            <option value="featured">✨ Featured</option>
                            <option value="rating-desc">⭐ Top Rated</option>
                            <option value="budget-asc">💰 Budget: Low to High</option>
                            <option value="budget-desc">💎 Budget: High to Low</option>
                            <option value="name-asc">🔤 Name: A to Z</option>
                        </select>
                    </div>
                </div>

                <!-- CATEGORY PILLS -->
                <div class="d-flex align-items-center gap-2 flex-wrap mb-4" id="categoryChips">
                    <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 cat-chip active" data-cat="all" onclick="filterByCategory('all', this)">🌍 All</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 cat-chip" data-cat="Beach" onclick="filterByCategory('Beach', this)">🏖️ Beach</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 cat-chip" data-cat="Mountain" onclick="filterByCategory('Mountain', this)">⛰️ Mountains</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 cat-chip" data-cat="Heritage" onclick="filterByCategory('Heritage', this)">🏛️ Heritage</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 cat-chip" data-cat="Adventure" onclick="filterByCategory('Adventure', this)">🧗 Adventure</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 cat-chip" data-cat="Nature" onclick="filterByCategory('Nature', this)">🌲 Nature</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 cat-chip" data-cat="City" onclick="filterByCategory('City', this)">🌆 City</button>
                </div>

                <div id="destLoader" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
                    <p class="mt-3 text-muted fw-semibold">Loading destinations...</p>
                </div>

                <div class="row g-4" id="destinationsGrid" style="display:none"></div>

                <div id="destEmpty" class="alert alert-info text-center d-none my-4">
                    <i class="fa-solid fa-circle-info me-2"></i> No destinations found matching your search query.
                </div>

                <!-- PAGINATION CONTROLS (10 per page) -->
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4 pt-3 border-top" id="destPaginationWrapper" style="display:none !important">
                    <small class="text-muted fw-semibold" id="pageCountLabel"></small>
                    <nav>
                        <ul class="pagination pagination-sm mb-0" id="destPaginationNav"></ul>
                    </nav>
                </div>
            </div>
        </main>

        <%@ include file="adminFooter.jsp" %>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/common.js"></script>
    <script src="js/dashboard.js"></script>
</body>
</html>
