<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Bookings & Reservations | TravelAI</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin.css?v=4">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/adminDashboard.css?v=4">
    <style>
        .booking-hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 24px;
            padding: 28px 30px;
            color: #ffffff;
            margin-bottom: 25px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
        }

        /* Stat Chips */
        .booking-kpi-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 20px 24px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
            display: flex;
            align-items: center;
            gap: 16px;
            transition: transform 0.2s ease;
        }
        .booking-kpi-card:hover { transform: translateY(-3px); }

        .kpi-icon-box {
            width: 50px;
            height: 50px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
        }
        .kpi-blue { background: rgba(37, 99, 235, 0.1); color: #2563eb; }
        .kpi-green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .kpi-purple { background: rgba(124, 58, 237, 0.1); color: #7c3aed; }

        /* Booking Card Left Form */
        .booking-form-card {
            background: #ffffff;
            border-radius: 24px;
            padding: 30px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.05);
        }

        /* Destination Preview Box */
        .dest-preview-box {
            background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
            border: 1.5px solid #c7d2fe;
            border-radius: 18px;
            padding: 16px;
            margin-bottom: 20px;
            display: none;
            transition: all 0.3s ease;
        }

        .dest-preview-thumb {
            width: 70px;
            height: 70px;
            border-radius: 14px;
            object-fit: cover;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        /* Price Calculation Badge */
        .price-calc-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 14px;
            padding: 14px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        /* Boarding Pass Ticket Style */
        .ticket-card {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
            margin-bottom: 18px;
            overflow: hidden;
            display: flex;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }

        .ticket-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 14px 30px rgba(15, 23, 42, 0.1);
            border-color: #cbd5e1;
        }

        .ticket-card.confirmed { border-left: 6px solid #10b981; }
        .ticket-card.cancelled { border-left: 6px solid #ef4444; opacity: 0.85; background: #fafafa; }

        .ticket-left-strip {
            width: 110px;
            min-width: 110px;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 14px;
            border-right: 2px dashed #e2e8f0;
            text-align: center;
        }

        .ticket-main {
            padding: 20px 24px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .ticket-dest-name {
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 1.2rem;
            color: #0f172a;
            margin-bottom: 4px;
        }

        .ticket-meta-row {
            display: flex;
            align-items: center;
            gap: 18px;
            flex-wrap: wrap;
            margin: 8px 0;
            font-size: 0.86rem;
            color: #64748b;
        }

        .ticket-meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ticket-price {
            font-family: 'Outfit', sans-serif;
            font-size: 1.3rem;
            font-weight: 800;
            color: #059669;
        }

        .status-pill-confirmed {
            background: #dcfce7;
            color: #15803d;
            border-radius: 20px;
            padding: 4px 12px;
            font-size: 0.78rem;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .status-pill-cancelled {
            background: #fee2e2;
            color: #b91c1c;
            border-radius: 20px;
            padding: 4px 12px;
            font-size: 0.78rem;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .btn-cancel-ticket {
            background: #fff;
            color: #ef4444;
            border: 1.5px solid #fca5a5;
            border-radius: 20px;
            padding: 5px 14px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-cancel-ticket:hover {
            background: #fee2e2;
            color: #dc2626;
        }

        /* Filter Tab Buttons */
        .filter-tab-btn {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.82rem;
            font-weight: 600;
            border: 1px solid #cbd5e1;
            background: #fff;
            color: #475569;
            cursor: pointer;
            transition: all 0.2s;
        }
        .filter-tab-btn.active {
            background: #0f172a;
            color: #fff;
            border-color: #0f172a;
        }
    </style>
</head>

<body>
    <%@ include file="userSidebar.jsp" %>

    <div class="main">
        <%@ include file="userTopbar.jsp" %>

        <main class="dashboard-page">
            <!-- HERO -->
            <div class="booking-hero">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 class="fw-bold mb-1" style="font-family: 'Outfit', sans-serif;">
                            <i class="fa-solid fa-ticket text-primary me-2"></i>Travel Bookings & Tickets
                        </h2>
                        <p class="text-white-50 mb-0 small">Manage your trip reservations, view digital boarding passes, and plan new trips.</p>
                    </div>
                    <button type="button" class="btn btn-outline-light rounded-pill px-4 btn-sm" onclick="loadBookings()">
                        <i class="fa-solid fa-rotate-right me-1"></i> Refresh History
                    </button>
                </div>
            </div>

            <!-- KPI SUMMARY CARDS -->
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="booking-kpi-card">
                        <div class="kpi-icon-box kpi-blue"><i class="fa-solid fa-ticket"></i></div>
                        <div>
                            <div class="fw-bold fs-4 text-dark" id="kpiTotalBookings">0</div>
                            <small class="text-muted">Total Bookings</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="booking-kpi-card">
                        <div class="kpi-icon-box kpi-green"><i class="fa-solid fa-circle-check"></i></div>
                        <div>
                            <div class="fw-bold fs-4 text-dark" id="kpiActiveTrips">0</div>
                            <small class="text-muted">Active Confirmed Trips</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="booking-kpi-card">
                        <div class="kpi-icon-box kpi-purple"><i class="fa-solid fa-wallet"></i></div>
                        <div>
                            <div class="fw-bold fs-4 text-dark" id="kpiTotalSpent">₹0</div>
                            <small class="text-muted">Total Trip Investment</small>
                        </div>
                    </div>
                </div>
            </div>

            <div id="message" class="alert d-none" role="alert"></div>

            <div class="row g-4">
                <!-- NEW BOOKING FORM -->
                <div class="col-lg-5">
                    <div class="booking-form-card">
                        <h5 class="fw-bold mb-3 text-dark">
                            <i class="fa-solid fa-calendar-plus text-primary me-2"></i>Book a Destination
                        </h5>

                        <!-- DESTINATION PREVIEW BOX -->
                        <div id="destInfoBox" class="dest-preview-box">
                            <div class="d-flex align-items-center gap-3">
                                <img id="destThumb" src="" alt="Destination" class="dest-preview-thumb">
                                <div>
                                    <h6 class="fw-bold mb-1 text-dark" id="destTitle">Selected Destination</h6>
                                    <div id="destMeta" class="small text-muted"></div>
                                </div>
                            </div>
                        </div>

                        <form id="bookingForm" onsubmit="createBooking(event)">
                            <!-- 1. SEARCHABLE DESTINATION SELECTOR -->
                            <div class="mb-3">
                                <label class="form-label fw-semibold">
                                    <i class="fa-solid fa-map-location-dot text-primary me-1"></i> Select Destination
                                </label>
                                <select id="destinationSelect" class="form-select rounded-3 py-2" onchange="onDestSelectChange(this.value)">
                                    <option value="">-- Choose a Destination --</option>
                                </select>
                                <small class="text-muted mt-1 d-block" style="font-size:0.78rem;">
                                    💡 Or enter ID directly below if known.
                                </small>
                            </div>

                            <!-- DIRECT ID FIELD (Auto-synced) -->
                            <div class="mb-3">
                                <label class="form-label fw-semibold" style="font-size:0.85rem;">
                                    <i class="fa-solid fa-hashtag text-secondary me-1"></i> Destination ID
                                </label>
                                <input type="number" id="destinationId" class="form-control rounded-3" placeholder="Destination ID" required oninput="onDestIdInput(this.value)">
                            </div>

                            <!-- TRAVEL DATE -->
                            <div class="mb-3">
                                <label class="form-label fw-semibold">
                                    <i class="fa-solid fa-calendar-day text-primary me-1"></i> Travel Departure Date
                                </label>
                                <input type="date" id="travelDate" class="form-control rounded-3 py-2" required>
                            </div>

                            <!-- PASSENGERS -->
                            <div class="mb-3">
                                <label class="form-label fw-semibold">
                                    <i class="fa-solid fa-users text-primary me-1"></i> Number of Travelers
                                </label>
                                <div class="input-group">
                                    <button type="button" class="btn btn-outline-secondary" onclick="adjustTravelers(-1)">
                                        <i class="fa-solid fa-minus"></i>
                                    </button>
                                    <input type="number" id="numberOfTravelers" class="form-control text-center fw-bold" value="1" min="1" max="50" required oninput="updateLivePrice()">
                                    <button type="button" class="btn btn-outline-secondary" onclick="adjustTravelers(1)">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- ESTIMATED TOTAL -->
                            <div class="price-calc-box" id="priceCalcBox">
                                <div>
                                    <small class="text-muted d-block" style="font-size:0.75rem;">Estimated Total Price</small>
                                    <strong class="text-success fs-5" id="liveTotalPrice">₹0</strong>
                                </div>
                                <span class="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1">Instant Confirm</span>
                            </div>

                            <button type="submit" class="btn btn-primary w-100 rounded-pill py-2 fw-bold" id="confirmBtn">
                                <i class="fa-solid fa-check me-2"></i>Confirm & Reserve Trip
                            </button>
                        </form>
                    </div>
                </div>

                <!-- BOOKING HISTORY LIST -->
                <div class="col-lg-7">
                    <div class="card border-0 shadow-sm rounded-4 p-4">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                            <div>
                                <h5 class="fw-bold mb-0 text-dark">
                                    <i class="fa-solid fa-receipt text-primary me-2"></i>My Bookings History
                                </h5>
                                <small class="text-muted" id="bookingCountSubtext">All your reservations</small>
                            </div>
                            <!-- Filter tabs -->
                            <div class="d-flex gap-2">
                                <button type="button" class="filter-tab-btn active" onclick="filterBookings('ALL', this)">All</button>
                                <button type="button" class="filter-tab-btn" onclick="filterBookings('CONFIRMED', this)">Confirmed</button>
                                <button type="button" class="filter-tab-btn" onclick="filterBookings('CANCELLED', this)">Cancelled</button>
                            </div>
                        </div>

                        <div id="bookingHistoryList">
                            <div class="text-center py-5">
                                <div class="spinner-border text-primary" style="width:3rem;height:3rem;" role="status"></div>
                                <p class="mt-3 text-muted fw-semibold">Loading reservations...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <%@ include file="adminFooter.jsp" %>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/common.js"></script>
    <script src="js/booking.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const title = document.getElementById("userPageTitle");
            const sub = document.getElementById("userPageSubtitle");
            if (title) title.textContent = "My Bookings";
            if (sub) sub.textContent = "View reservation status and manage your travel bookings";
            const nav = document.getElementById("navBookings");
            if (nav) nav.classList.add("active");
        });
    </script>
</body>
</html>
