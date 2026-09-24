<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Destination Details | TravelAI</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin.css?v=3">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/common.css?v=3">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/adminDashboard.css?v=3">
</head>
<body>
    <%@ include file="userSidebar.jsp" %>
    <div class="main">
        <%@ include file="userTopbar.jsp" %>

        <main class="dashboard-page">
            <div id="message" class="alert alert-info d-none mb-3"></div>

            <div id="detailsLoading" class="text-center py-5">
                <i class="fa-solid fa-spinner fa-spin fa-3x text-primary mb-3"></i>
                <h5 class="text-muted">Loading destination details...</h5>
            </div>

            <div id="detailsNotFound" class="card border-0 shadow-sm rounded-4 p-5 text-center my-4" style="display: none;">
                <i class="fa-solid fa-map-location-dot fa-3x text-muted mb-3"></i>
                <h4 class="fw-bold">Destination Not Found</h4>
                <p class="text-muted mb-4">The requested destination could not be loaded or may have been removed.</p>
                <div>
                    <a href="dashboard.jsp" class="btn btn-primary rounded-pill px-4 me-2">Back to Dashboard</a>
                    <a href="recommendation.jsp" class="btn btn-outline-primary rounded-pill px-4">AI Recommendations</a>
                </div>
            </div>

            <div id="detailsContent" style="display: none;">
                <!-- Hero Destination Card -->
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                    <div class="row g-0">
                        <div class="col-lg-6">
                            <div style="position: relative; height: 100%; min-height: 380px;">
                                <img id="destHeroImage" src="" alt="Destination" style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px 0 0 16px;" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'">
                            </div>
                        </div>
                        <div class="col-lg-6 p-4 p-lg-5 d-flex flex-direction-column justify-content-between">
                            <div>
                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <span id="destCategoryPill" class="badge rounded-pill bg-primary-subtle text-primary fw-semibold px-3 py-2">Category</span>
                                    <span id="destSeasonPill" class="badge rounded-pill bg-success-subtle text-success fw-semibold px-3 py-2">Season</span>
                                    <span class="badge rounded-pill bg-warning-subtle text-warning fw-semibold px-3 py-2 rating-pill-interactive" title="Rate this place" onclick="rateCurrentDestination()">
                                        <i class="fa-solid fa-star"></i> <span id="destRatingValue">5.0</span> · <small>Rate</small>
                                    </span>
                                </div>
                                <h2 id="destTitleName" class="fw-bold text-dark mb-3">Destination Name</h2>
                                <p id="destFullDescription" class="text-muted leading-relaxed mb-4">Destination description goes here.</p>
                            </div>

                            <div class="pt-4 border-top">
                                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                    <div>
                                        <small class="text-muted d-block">Estimated Budget / Person</small>
                                        <h3 id="destBudgetValue" class="fw-bold text-success mb-0">₹0</h3>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <button type="button" id="destFavBtn" class="btn btn-outline-danger rounded-pill px-3 py-2" onclick="toggleCurrentFavorite()">
                                            <i class="fa-regular fa-heart me-1"></i> Save Favorite
                                        </button>
                                        <button type="button" class="btn btn-outline-warning text-dark rounded-pill px-3 py-2" onclick="rateCurrentDestination()">
                                            <i class="fa-solid fa-star text-warning me-1"></i> Rate
                                        </button>
                                        <a id="destBookBtn" href="booking.jsp" class="btn btn-primary rounded-pill px-4 py-2 shadow-sm">
                                            <i class="fa-solid fa-ticket me-1"></i> Book Trip Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Similar Recommendations Section -->
                <div class="mb-4">
                    <h4 class="fw-bold mb-3 text-dark"><i class="fa-solid fa-sparkles text-primary me-2"></i>You Might Also Like</h4>
                    <div class="row" id="relatedDestinationsGrid"></div>
                </div>
            </div>
        </main>

        <%@ include file="adminFooter.jsp" %>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/common.js"></script>
    <script src="js/destinationDetails.js"></script>
</body>
</html>
