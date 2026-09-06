<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Destinations | TravelAI Admin</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin.css?v=4">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/manageDestination.css?v=4">
    <style>
        .reco-hub-banner {
            background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
            border-radius: 20px;
            padding: 22px 26px;
            color: #ffffff;
            margin-bottom: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .reco-modal-dest-card {
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 18px;
            overflow: hidden;
            transition: all 0.22s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .reco-modal-dest-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
            border-color: #c7d2fe;
        }

        .similarity-badge {
            background: #ede9fe;
            color: #6d28d9;
            font-size: 0.74rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
    </style>
</head>

<body>
    <%@ include file="adminSidebar.jsp" %>

    <div class="main">
        <%@ include file="adminTopbar.jsp" %>

        <div class="container-fluid px-3 px-md-4 py-4">
            <!-- PAGE HEADER -->
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 class="fw-bold mb-1" style="font-family: 'Outfit', sans-serif;">
                        <i class="fa-solid fa-location-dot me-2 text-primary"></i>Manage Destinations
                    </h2>
                    <p class="text-muted mb-0">Search, update, view, and find AI recommendations based on any destination.</p>
                </div>
                <div class="d-flex gap-2">
                    <a href="addDestination.jsp" class="btn btn-primary rounded-pill px-4">
                        <i class="fa-solid fa-plus me-2"></i>Add Destination
                    </a>
                </div>
            </div>

            <!-- RECOMMENDATION QUICK HUB BANNER -->
            <div class="reco-hub-banner">
                <div class="row align-items-center g-3">
                    <div class="col-lg-7">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge bg-primary bg-opacity-25 text-info px-2 py-1 rounded-pill" style="font-size:0.75rem;">
                                <i class="fa-solid fa-wand-magic-sparkles me-1"></i> AI Recommendation Engine
                            </span>
                        </div>
                        <h5 class="fw-bold mb-1">Find Recommended Destinations on the Basis of a Destination</h5>
                        <p class="text-white-50 small mb-0">Select any destination to discover similar spots matching category, season, and budget profile.</p>
                    </div>
                    <div class="col-lg-5">
                        <div class="input-group">
                            <select id="hubDestinationSelect" class="form-select rounded-start-pill py-2" onchange="onHubDestSelect(this.value)">
                                <option value="">-- Choose a Destination to Match --</option>
                            </select>
                            <button type="button" class="btn btn-info text-white rounded-end-pill px-3" onclick="triggerHubRecommendation()">
                                <i class="fa-solid fa-sparkles me-1"></i> Match
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="destinationMessage" class="alert d-none" role="alert"></div>

            <!-- TABLE CARD -->
            <div class="table-card bg-white rounded-4 shadow-sm">
                <div class="p-4 border-bottom">
                    <div class="row g-3 align-items-center">
                        <div class="col-lg-6">
                            <h4 class="mb-1 fw-bold text-dark">
                                <i class="fa-solid fa-list me-2 text-primary"></i>All Destinations
                            </h4>
                            <p id="destinationCount" class="text-muted mb-0 small">Loading destinations...</p>
                        </div>
                        <div class="col-lg-6">
                            <div class="d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
                                <div class="input-group destination-search">
                                    <span class="input-group-text"><i class="fa-solid fa-search"></i></span>
                                    <input type="search" id="destinationSearch" class="form-control" placeholder="Search by name, category, season...">
                                </div>
                                <button type="button" id="refreshDestinationsBtn" class="btn btn-outline-primary">
                                    <i class="fa-solid fa-arrows-rotate"></i>
                                    <span class="d-none d-sm-inline">Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0 destination-table">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Budget</th>
                                <th>Season</th>
                                <th>Category</th>
                                <th>Rating</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="destinationTableBody">
                            <tr>
                                <td colspan="9" class="text-center text-muted py-5">
                                    <i class="fa-solid fa-spinner fa-spin me-2"></i>Loading destinations...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="card-footer bg-white border-top p-3 d-flex justify-content-center">
                    <ul class="pagination mb-0" id="destinationPagination"></ul>
                </div>
            </div>
        </div>

        <!-- DESTINATION-BASED RECOMMENDATION MODAL -->
        <div class="modal fade" id="destinationRecoModal" tabindex="-1" aria-labelledby="recoModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content rounded-4 border-0 shadow">
                    <div class="modal-header bg-dark text-white rounded-top-4 py-3">
                        <div class="d-flex align-items-center gap-2">
                            <div class="bg-primary bg-opacity-25 p-2 rounded-circle text-info">
                                <i class="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <div>
                                <h5 class="modal-title fw-bold mb-0" id="recoModalTitle">Recommended on the Basis of Destination</h5>
                                <small class="text-white-50" id="recoModalSubtitle">Similar places matching attributes</small>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body p-4">
                        <!-- SOURCE DESTINATION BANNER -->
                        <div class="card border-0 bg-light rounded-3 p-3 mb-4" id="recoSourceCard">
                            <!-- Populated by JS -->
                        </div>

                        <h5 class="fw-bold mb-3 text-dark">
                            <i class="fa-solid fa-gem text-primary me-2"></i>Top Recommended Destinations Based on this Spot:
                        </h5>

                        <div class="row g-3" id="recoModalList">
                            <!-- Populated by JS -->
                        </div>
                    </div>

                    <div class="modal-footer bg-light rounded-bottom-4 py-2">
                        <button type="button" class="btn btn-secondary rounded-pill px-4 btn-sm" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <%@ include file="adminFooter.jsp" %>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/js/manageDestination.js"></script>
</body>
</html>