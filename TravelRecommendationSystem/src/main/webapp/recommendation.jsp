<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Smart Travel Discover | TravelAI</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin.css?v=4">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/adminDashboard.css?v=4">
    <style>
        :root {
            --ai-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
            --ai-glow: rgba(99, 102, 241, 0.25);
        }

        .ai-hero-banner {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%);
            border-radius: 24px;
            padding: 36px 32px;
            color: #ffffff;
            box-shadow: 0 15px 35px rgba(15, 23, 42, 0.15);
            margin-bottom: 28px;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ai-hero-banner::after {
            content: '';
            position: absolute;
            top: -60px;
            right: -60px;
            width: 280px;
            height: 280px;
            background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }

        .ai-badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(10px);
            border-radius: 30px;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #f472b6;
            margin-bottom: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .ai-banner-title {
            font-family: 'Outfit', sans-serif;
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #ffffff 40%, #c084fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Preference Card */
        .pref-card {
            background: #ffffff;
            border-radius: 24px;
            padding: 30px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.05);
            margin-bottom: 30px;
        }

        .pref-section-title {
            font-size: 0.95rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Mood Chips */
        .mood-chip-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 22px;
        }

        .mood-chip {
            padding: 10px 18px;
            border-radius: 14px;
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            color: #475569;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .mood-chip:hover {
            border-color: #818cf8;
            background: #eef2ff;
            color: #4338ca;
            transform: translateY(-2px);
        }

        .mood-chip.active {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-color: transparent;
            color: #ffffff;
            box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
        }

        /* Budget Preset Pills */
        .budget-preset-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .budget-preset-btn {
            padding: 6px 14px;
            border-radius: 20px;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            font-size: 0.78rem;
            font-weight: 600;
            color: #475569;
            cursor: pointer;
            transition: all 0.18s ease;
        }

        .budget-preset-btn:hover {
            background: #e2e8f0;
            color: #0f172a;
        }

        .budget-preset-btn.active {
            background: #0f172a;
            color: #ffffff;
            border-color: #0f172a;
        }

        /* AI Recommendation Cards */
        .reco-luxury-card {
            background: #ffffff;
            border-radius: 22px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .reco-luxury-card:hover {
            transform: translateY(-7px);
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.14);
            border-color: #c7d2fe;
        }

        .reco-img-wrap {
            position: relative;
            height: 220px;
            overflow: hidden;
        }

        .reco-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .reco-luxury-card:hover .reco-img-wrap img {
            transform: scale(1.06);
        }

        .reco-match-badge {
            position: absolute;
            top: 14px;
            left: 14px;
            padding: 6px 12px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(8px);
            color: #38bdf8;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 5px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            z-index: 5;
        }

        .reco-fav-btn {
            position: absolute;
            top: 14px;
            right: 14px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(8px);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 17px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
            color: #94a3b8;
            transition: all 0.2s ease;
            z-index: 5;
        }

        .reco-fav-btn:hover {
            transform: scale(1.15);
            color: #ef4444;
        }

        .reco-fav-btn.active {
            color: #ef4444;
        }

        .reco-card-body {
            padding: 22px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        .reco-title {
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 1.2rem;
            color: #0f172a;
            margin-bottom: 6px;
        }

        .reco-desc {
            color: #64748b;
            font-size: 0.88rem;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 16px;
        }

        .reco-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 18px;
        }

        .reco-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.74rem;
            font-weight: 700;
        }

        .pill-cat-reco { background: #ede9fe; color: #6d28d9; }
        .pill-season-reco { background: #dbeafe; color: #1d4ed8; }
        .pill-rating-reco { background: #fef3c7; color: #b45309; }

        .reco-card-footer {
            margin-top: auto;
            padding-top: 16px;
            border-top: 1px solid #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .reco-price-value {
            font-size: 1.25rem;
            font-weight: 800;
            color: #059669;
            font-family: 'Outfit', sans-serif;
        }

        .btn-ai-book {
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            color: #ffffff;
            border: none;
            border-radius: 20px;
            padding: 8px 20px;
            font-size: 0.88rem;
            font-weight: 700;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .btn-ai-book:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
            color: #ffffff;
        }

        .btn-generate-ai {
            background: var(--ai-gradient);
            color: #ffffff;
            border: none;
            border-radius: 30px;
            padding: 12px 28px;
            font-size: 0.95rem;
            font-weight: 700;
            box-shadow: 0 6px 20px var(--ai-glow);
            transition: all 0.25s ease;
        }

        .btn-generate-ai:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 28px rgba(99, 102, 241, 0.4);
            color: #ffffff;
        }
    </style>
</head>

<body>
    <%@ include file="userSidebar.jsp" %>

    <div class="main">
        <%@ include file="userTopbar.jsp" %>

        <main class="dashboard-page">
            <!-- HERO BANNER -->
            <div class="ai-hero-banner">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-4">
                    <div>
                        <div class="ai-badge-pill">
                            <i class="fa-solid fa-sparkles"></i> AI Smart Discovery Engine
                        </div>
                        <h1 class="ai-banner-title">Find Your Perfect Next Adventure</h1>
                        <p class="text-white-50 mb-0" style="max-width: 620px; font-size: 0.95rem;">
                            Pick your mood, season, or budget range. Our smart recommendation engine curates tailored destinations handpicked for you.
                        </p>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-outline-light rounded-pill px-3 py-2 btn-sm" onclick="quickFillMood('Beach', 20000, 'Summer')">
                            🏖️ Summer Beach
                        </button>
                        <button type="button" class="btn btn-outline-light rounded-pill px-3 py-2 btn-sm" onclick="quickFillMood('Mountain', 25000, 'Winter')">
                            ⛰️ Snow Mountains
                        </button>
                    </div>
                </div>
            </div>

            <div id="message" class="alert d-none" role="alert"></div>

            <!-- PREFERENCE WIZARD CARD -->
            <div class="pref-card">
                <!-- 1. MOOD / TRAVEL VIBE CHIPS -->
                <div class="pref-section-title">
                    <i class="fa-solid fa-compass text-primary"></i> 1. Choose Your Travel Vibe / Category
                </div>
                <div class="mood-chip-group" id="moodChipContainer">
                    <div class="mood-chip active" data-vibe="Adventure" onclick="selectMood('Adventure', this)">
                        <span>🧗</span> Adventure & Trekking
                    </div>
                    <div class="mood-chip" data-vibe="Beach" onclick="selectMood('Beach', this)">
                        <span>🏖️</span> Beach & Coastal
                    </div>
                    <div class="mood-chip" data-vibe="Mountain" onclick="selectMood('Mountain', this)">
                        <span>⛰️</span> Mountains & Hills
                    </div>
                    <div class="mood-chip" data-vibe="Heritage" onclick="selectMood('Heritage', this)">
                        <span>🏛️</span> Heritage & Culture
                    </div>
                    <div class="mood-chip" data-vibe="Nature" onclick="selectMood('Nature', this)">
                        <span>🌲</span> Nature & Wildlife
                    </div>
                    <div class="mood-chip" data-vibe="Family" onclick="selectMood('Family', this)">
                        <span>👨‍👩‍👦</span> Family Vacation
                    </div>
                    <div class="mood-chip" data-vibe="Couple" onclick="selectMood('Couple', this)">
                        <span>💑</span> Romantic Getaway
                    </div>
                    <div class="mood-chip" data-vibe="Solo" onclick="selectMood('Solo', this)">
                        <span>🎒</span> Solo Exploration
                    </div>
                </div>

                <!-- 2. BUDGET & SEASON SELECTOR -->
                <div class="row g-4 mb-4">
                    <!-- BUDGET -->
                    <div class="col-lg-6">
                        <div class="pref-section-title">
                            <i class="fa-solid fa-wallet text-success"></i> 2. Maximum Budget per Person (₹)
                        </div>
                        <div class="input-group">
                            <span class="input-group-text bg-light fw-bold">₹</span>
                            <input type="number" id="budget" class="form-control rounded-end-3" min="1000" step="500" value="30000" placeholder="e.g. 25000">
                        </div>
                        <div class="budget-preset-group">
                            <button type="button" class="budget-preset-btn" onclick="setBudget(15000, this)">Under ₹15K</button>
                            <button type="button" class="budget-preset-btn active" onclick="setBudget(30000, this)">₹30K Standard</button>
                            <button type="button" class="budget-preset-btn" onclick="setBudget(50000, this)">₹50K Premium</button>
                            <button type="button" class="budget-preset-btn" onclick="setBudget(100000, this)">₹100K Luxury</button>
                        </div>
                    </div>

                    <!-- SEASON & DIRECT SEARCH -->
                    <div class="col-lg-6">
                        <div class="pref-section-title">
                            <i class="fa-solid fa-cloud-sun text-warning"></i> 3. Preferred Travel Season
                        </div>
                        <select id="season" class="form-select rounded-3 py-2">
                            <option value="Summer" selected>☀️ Summer Season</option>
                            <option value="Winter">❄️ Winter Season</option>
                            <option value="Monsoon">🌧️ Monsoon Season</option>
                            <option value="Spring">🌸 Spring Season</option>
                            <option value="Autumn">🍂 Autumn Season</option>
                        </select>
                        <small class="text-muted mt-2 d-block">
                            💡 Filter spots optimized for the best weather and sightseeing experience.
                        </small>
                    </div>
                </div>

                <!-- Hidden Travel Type for API -->
                <input type="hidden" id="type" value="Adventure">

                <!-- ACTION BUTTONS -->
                <div class="d-flex gap-3 align-items-center flex-wrap pt-3 border-top">
                    <button type="button" class="btn btn-generate-ai" onclick="recommend()">
                        <i class="fa-solid fa-wand-magic-sparkles me-2"></i>Generate AI Recommendations
                    </button>
                    <button type="button" class="btn btn-light border rounded-pill px-4 py-2" onclick="clearResults()">
                        <i class="fa-solid fa-rotate-left me-1"></i> Reset Filters
                    </button>
                    <span class="text-muted small ms-auto" id="resultStatusText">Click to discover matching destinations</span>
                </div>
            </div>

            <!-- SEARCH / FILTER RESULTS BAR (Shown after load) -->
            <div id="resultsHeaderBar" class="d-none justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h4 class="fw-bold mb-1"><i class="fa-solid fa-gem text-primary me-2"></i>Recommended For You</h4>
                    <p class="text-muted small mb-0" id="resultsCountLabel">Found matching destinations</p>
                </div>
                <div>
                    <input type="text" id="recoSearchFilter" class="form-control rounded-pill px-3" placeholder="🔍 Filter results..." style="max-width: 240px;" oninput="filterLocalResults()">
                </div>
            </div>

            <!-- LOADER -->
            <div id="recoLoader" class="text-center py-5 d-none">
                <div class="spinner-border text-primary" style="width:3.2rem;height:3.2rem;" role="status"></div>
                <h5 class="mt-3 fw-bold text-dark">Analyzing preferences with AI...</h5>
                <p class="text-muted small">Matching your vibe, budget, and best travel seasons</p>
            </div>

            <!-- RESULTS GRID -->
            <div class="row g-4" id="result"></div>
        </main>

        <%@ include file="adminFooter.jsp" %>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/common.js"></script>
    <script src="js/recommendation.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const title = document.getElementById("userPageTitle");
            const sub = document.getElementById("userPageSubtitle");
            if (title) title.textContent = "AI Recommendations";
            if (sub) sub.textContent = "Discover tailored travel spots with our smart recommendation engine";
            const nav = document.getElementById("navRecommendations");
            if (nav) nav.classList.add("active");
        });
    </script>
</body>
</html>
