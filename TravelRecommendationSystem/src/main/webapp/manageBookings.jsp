<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Bookings | TravelAI Admin</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Admin CSS -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/admin.css">

    <style>
        .booking-page {
            padding: 30px;
        }

        .booking-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 30px;
        }

        .booking-title h2 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 5px;
            color: #1e293b;
        }

        .booking-title p {
            color: #64748b;
            margin-bottom: 0;
            font-size: 0.95rem;
        }

        .booking-stat-card {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .booking-stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }

        .booking-stat-label {
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            margin-bottom: 6px;
        }

        .booking-stat-value {
            font-size: 1.85rem;
            font-weight: 700;
            color: #0f172a;
        }

        .booking-stat-icon {
            width: 54px;
            height: 54px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }

        .booking-stat-icon.total {
            background: rgba(13, 110, 253, 0.12);
            color: #0d6efd;
        }

        .booking-stat-icon.confirmed {
            background: rgba(16, 185, 129, 0.12);
            color: #10b981;
        }

        .booking-stat-icon.cancelled {
            background: rgba(239, 68, 68, 0.12);
            color: #ef4444;
        }

        .booking-stat-icon.revenue {
            background: rgba(245, 158, 11, 0.12);
            color: #d97706;
        }

        .booking-filter-card {
            background: #fff;
            border-radius: 16px;
            padding: 20px 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            margin-top: 25px;
            margin-bottom: 25px;
        }

        .booking-table-card {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }

        .booking-table-header {
            padding: 20px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f1f5f9;
        }

        .booking-table th {
            font-size: 0.82rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            color: #64748b;
            background: #f8fafc;
            padding: 14px 16px;
            white-space: nowrap;
        }

        .booking-table td {
            padding: 14px 16px;
            vertical-align: middle;
            font-size: 0.92rem;
        }

        .dest-thumb {
            width: 52px;
            height: 38px;
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid #e2e8f0;
        }

        .dest-thumb-placeholder {
            width: 52px;
            height: 38px;
            border-radius: 8px;
            background: #f1f5f9;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            font-size: 1rem;
        }
    </style>
</head>

<body>

    <!-- SIDEBAR -->
    <%@ include file="adminSidebar.jsp" %>

    <!-- MAIN CONTENT -->
    <div class="main">

        <!-- TOPBAR -->
        <%@ include file="adminTopbar.jsp" %>

        <main class="booking-page">

            <!-- PAGE HEADER -->
            <div class="booking-header">
                <div class="booking-title">
                    <h2><i class="fa-solid fa-ticket me-2 text-primary"></i> Manage Bookings</h2>
                    <p>Track all customer tour reservations, payments, and cancellation requests.</p>
                </div>

                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-outline-primary rounded-pill px-3" onclick="loadBookings()">
                        <i class="fa-solid fa-arrows-rotate me-2"></i> Refresh
                    </button>
                </div>
            </div>

            <!-- ALERT MESSAGE -->
            <div id="bookingMessage" class="alert d-none" role="alert"></div>

            <!-- SUMMARY STATS -->
            <div class="row g-4">
                <div class="col-xl-3 col-md-6">
                    <div class="booking-stat-card">
                        <div>
                            <div class="booking-stat-label">Total Bookings</div>
                            <div class="booking-stat-value" id="statTotalBookings">0</div>
                        </div>
                        <div class="booking-stat-icon total">
                            <i class="fa-solid fa-ticket"></i>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div class="booking-stat-card">
                        <div>
                            <div class="booking-stat-label">Confirmed</div>
                            <div class="booking-stat-value text-success" id="statConfirmedBookings">0</div>
                        </div>
                        <div class="booking-stat-icon confirmed">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div class="booking-stat-card">
                        <div>
                            <div class="booking-stat-label">Cancelled</div>
                            <div class="booking-stat-value text-danger" id="statCancelledBookings">0</div>
                        </div>
                        <div class="booking-stat-icon cancelled">
                            <i class="fa-solid fa-ban"></i>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div class="booking-stat-card">
                        <div>
                            <div class="booking-stat-label">Total Revenue</div>
                            <div class="booking-stat-value text-primary" id="statTotalRevenue">₹0</div>
                        </div>
                        <div class="booking-stat-icon revenue">
                            <i class="fa-solid fa-indian-rupee-sign"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SEARCH & FILTER -->
            <div class="booking-filter-card">
                <div class="row g-3 align-items-center">
                    <div class="col-lg-6">
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0">
                                <i class="fa-solid fa-search text-muted"></i>
                            </span>
                            <input type="search" id="bookingSearch" class="form-control border-start-0" 
                                   placeholder="Search by customer name, user ID, destination, or booking ID...">
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="btn-group w-100" role="group">
                            <button type="button" class="btn btn-outline-primary active filter-status-btn" data-status="ALL">All</button>
                            <button type="button" class="btn btn-outline-success filter-status-btn" data-status="CONFIRMED">Confirmed</button>
                            <button type="button" class="btn btn-outline-danger filter-status-btn" data-status="CANCELLED">Cancelled</button>
                        </div>
                    </div>

                    <div class="col-lg-2">
                        <button type="button" class="btn btn-secondary w-100" onclick="resetBookingFilters()">
                            <i class="fa-solid fa-rotate-left me-1"></i> Reset
                        </button>
                    </div>
                </div>
            </div>

            <!-- BOOKINGS TABLE -->
            <div class="booking-table-card">
                <div class="booking-table-header">
                    <div>
                        <h5 class="mb-0 fw-bold"><i class="fa-solid fa-list-check me-2 text-primary"></i> Customer Bookings</h5>
                        <small class="text-muted" id="bookingSubText">Showing recent customer reservations</small>
                    </div>
                    <span class="badge bg-primary px-3 py-2 rounded-pill" id="bookingCountBadge">0 Bookings</span>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover booking-table mb-0 align-middle">
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Customer</th>
                                <th>Destination</th>
                                <th>Travel Date</th>
                                <th>Travelers</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Booked On</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="bookingTableBody">
                            <tr>
                                <td colspan="9" class="text-center py-5 text-muted">
                                    <i class="fa-solid fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                                    <p class="mb-0">Loading customer bookings...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="card-footer bg-white border-top p-3 d-flex justify-content-center">
                    <ul class="pagination mb-0" id="bookingPagination"></ul>
                </div>
            </div>

        </main>

        <!-- FOOTER -->
        <%@ include file="adminFooter.jsp" %>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Common JS -->
    <script src="${pageContext.request.contextPath}/js/common.js"></script>

    <!-- Manage Bookings JS -->
    <script src="${pageContext.request.contextPath}/js/manageBookings.js"></script>

</body>
</html>
