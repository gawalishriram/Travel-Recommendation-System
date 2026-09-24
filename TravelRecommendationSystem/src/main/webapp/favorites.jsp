<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Favorites | TravelAI</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin.css?v=3">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/adminDashboard.css?v=3">
    <style>
        .fav-card {
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #f1f5f9;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
            transition: all 0.25s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .fav-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
        }
        .fav-card img {
            height: 200px;
            width: 100%;
            object-fit: cover;
        }
        .fav-body {
            padding: 20px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        .dest-name {
            font-weight: 700;
            font-size: 1.1rem;
            color: #1e293b;
            margin-bottom: 6px;
        }
        .dest-desc {
            color: #64748b;
            font-size: 0.86rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            flex-grow: 1;
            margin-bottom: 14px;
        }
        .info-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            border-radius: 20px;
            padding: 4px 10px;
            font-size: 0.76rem;
            font-weight: 600;
        }
        .pill-budget { background: #d1fae5; color: #065f46; }
        .pill-season { background: #dbeafe; color: #1e40af; }
        .pill-rating { background: #fef3c7; color: #92400e; }
        .pill-cat { background: #ede9fe; color: #5b21b6; }
        
        .btn-remove {
            background: #fff5f5;
            color: #ef4444;
            border: 1px solid #fee2e2;
            border-radius: 20px;
            padding: 8px 14px;
            font-size: 0.85rem;
            font-weight: 600;
            flex: 1;
            transition: all 0.2s;
            cursor: pointer;
        }
        .btn-remove:hover { background: #fee2e2; }
        .btn-book-fav {
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 0.85rem;
            font-weight: 600;
            flex: 1;
            text-decoration: none;
            text-align: center;
            transition: opacity 0.2s;
        }
        .btn-book-fav:hover { opacity: 0.9; color: #fff; }
    </style>
</head>

<body>
    <%@ include file="userSidebar.jsp" %>

    <div class="main">
        <%@ include file="userTopbar.jsp" %>

        <main class="dashboard-page">
            <div class="dashboard-header mb-4">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 w-100">
                    <div>
                        <h2><i class="fa-solid fa-heart text-danger me-2"></i>My Saved Favorites</h2>
                        <p>All your bookmarked travel destinations stored in one place.</p>
                    </div>
                    <a href="recommendation.jsp" class="btn btn-primary rounded-pill px-4">
                        <i class="fa-solid fa-compass me-1"></i> Explore More
                    </a>
                </div>
            </div>

            <div id="message" class="alert d-none" role="alert"></div>

            <div class="card border-0 shadow-sm rounded-4 p-4">
                <div class="row g-4" id="favoriteContainer">
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-danger" style="width:3rem;height:3rem;" role="status"></div>
                        <p class="mt-3 text-muted fw-semibold">Loading your favorites...</p>
                    </div>
                </div>
            </div>
        </main>

        <%@ include file="adminFooter.jsp" %>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/common.js"></script>
    <script src="js/favorites.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const title = document.getElementById("userPageTitle");
            const sub = document.getElementById("userPageSubtitle");
            if (title) title.textContent = "My Favorites";
            if (sub) sub.textContent = "Your saved and bookmarked dream vacation spots";
            const nav = document.getElementById("navFavorites");
            if (nav) nav.classList.add("active");
        });
    </script>
</body>
</html>
