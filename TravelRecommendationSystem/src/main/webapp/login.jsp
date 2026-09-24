<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign In | TravelAI — Modern Travel Platform</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #0062ff;
            --primary-glow: rgba(0, 98, 255, 0.35);
            --primary-gradient: linear-gradient(135deg, #0062ff 0%, #00c6ff 100%);
            --admin-gradient: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            --dark-bg: #070d1e;
            --card-bg: rgba(255, 255, 255, 0.96);
            --card-border: rgba(255, 255, 255, 0.4);
            --text-dark: #0f172a;
            --text-muted: #64748b;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }

        body {
            min-height: 100vh;
            background: var(--dark-bg);
            background-image: 
                radial-gradient(at 0% 0%, rgba(0, 98, 255, 0.25) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.22) 0px, transparent 50%),
                radial-gradient(at 50% 50%, rgba(0, 198, 255, 0.12) 0px, transparent 55%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            color: #fff;
            position: relative;
            overflow-x: hidden;
        }

        /* Ambient floating lights */
        .ambient-sphere {
            position: fixed;
            border-radius: 50%;
            filter: blur(100px);
            pointer-events: none;
            z-index: 0;
            opacity: 0.6;
            animation: floatGlow 14s ease-in-out infinite alternate;
        }
        .ambient-1 {
            width: 450px;
            height: 450px;
            background: rgba(0, 98, 255, 0.28);
            top: -120px;
            left: -120px;
        }
        .ambient-2 {
            width: 380px;
            height: 380px;
            background: rgba(236, 72, 153, 0.22);
            bottom: -100px;
            right: -100px;
            animation-delay: -5s;
        }

        @keyframes floatGlow {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(40px, 30px) scale(1.1); }
        }

        /* Container & Split Frame */
        .login-super-wrapper {
            width: 100%;
            max-width: 1120px;
            position: relative;
            z-index: 10;
        }

        .auth-container {
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 32px;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 98, 255, 0.15);
            overflow: hidden;
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            min-height: 640px;
        }

        /* ====================================================
           LEFT HERO SHOWCASE
           ==================================================== */
        .auth-hero-pane {
            position: relative;
            padding: 48px 44px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            background: 
                linear-gradient(180deg, rgba(7, 13, 30, 0.75) 0%, rgba(7, 13, 30, 0.92) 100%),
                url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
        }

        .hero-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
        }

        .hero-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: #fff;
        }

        .brand-pill-icon {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            background: var(--primary-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 8px 20px var(--primary-glow);
        }

        .brand-text {
            font-family: 'Outfit', sans-serif;
            font-size: 1.55rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #ffffff 30%, #00c6ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-live-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            border-radius: 30px;
            background: rgba(0, 210, 190, 0.15);
            border: 1px solid rgba(0, 210, 190, 0.35);
            color: #00d2be;
            font-size: 0.8rem;
            font-weight: 600;
            backdrop-filter: blur(10px);
        }

        .live-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #00d2be;
            box-shadow: 0 0 10px #00d2be;
            animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
        }

        .hero-main-content {
            margin: 40px 0;
        }

        .hero-heading {
            font-family: 'Outfit', sans-serif;
            font-size: 2.35rem;
            font-weight: 800;
            line-height: 1.25;
            color: #ffffff;
            margin-bottom: 16px;
        }

        .hero-heading span {
            background: linear-gradient(135deg, #00c6ff 0%, #0062ff 50%, #c084fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-tagline {
            color: #94a3b8;
            font-size: 1.02rem;
            line-height: 1.6;
            max-width: 440px;
            margin-bottom: 30px;
        }

        /* Glass Feature Chips */
        .feature-chips {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .feature-chip {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            padding: 12px 18px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: all 0.3s ease;
        }
        .feature-chip:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(0, 198, 255, 0.4);
            transform: translateX(6px);
        }

        .feature-chip-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #fff;
            flex-shrink: 0;
        }
        .chip-icon-blue { background: rgba(0, 98, 255, 0.25); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.3); }
        .chip-icon-purple { background: rgba(139, 92, 246, 0.25); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.3); }
        .chip-icon-teal { background: rgba(0, 210, 190, 0.25); color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.3); }

        .feature-chip-title {
            font-size: 0.88rem;
            font-weight: 700;
            color: #f8fafc;
            margin-bottom: 2px;
        }
        .feature-chip-desc {
            font-size: 0.78rem;
            color: #94a3b8;
        }

        .hero-footer {
            display: flex;
            align-items: center;
            gap: 14px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .rating-stars {
            color: #f59e0b;
            font-size: 0.95rem;
            letter-spacing: 2px;
        }

        .rating-caption {
            font-size: 0.82rem;
            color: #cbd5e1;
            font-weight: 500;
        }

        /* ====================================================
           RIGHT AUTH CARD
           ==================================================== */
        .auth-form-pane {
            background: var(--card-bg);
            padding: 46px 42px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: var(--text-dark);
            position: relative;
        }

        .form-header {
            text-align: center;
            margin-bottom: 26px;
        }

        .brand-icon-circle {
            width: 70px;
            height: 70px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 22px;
            background: var(--primary-gradient);
            color: #ffffff;
            font-size: 28px;
            box-shadow: 0 10px 25px var(--primary-glow);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .brand-icon-circle.admin-mode {
            background: var(--admin-gradient);
            box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
            transform: rotate(10deg);
        }

        .login-main-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.75rem;
            font-weight: 800;
            color: var(--text-dark);
            margin-bottom: 4px;
            letter-spacing: -0.4px;
        }

        .login-sub-title {
            font-size: 0.9rem;
            color: var(--text-muted);
            margin-bottom: 0;
        }

        /* ROLE TOGGLE TABS */
        .role-switcher-box {
            display: flex;
            background: #f1f5f9;
            border-radius: 16px;
            padding: 5px;
            margin-bottom: 24px;
            border: 1px solid #e2e8f0;
            gap: 6px;
        }

        .role-switch-tab {
            flex: 1;
            border: none;
            background: transparent;
            padding: 11px 18px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.88rem;
            color: #64748b;
            cursor: pointer;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .role-switch-tab.active {
            background: #ffffff;
            color: var(--primary);
            box-shadow: 0 4px 16px rgba(0, 98, 255, 0.15);
        }

        .role-switch-tab.admin-active {
            background: #ffffff;
            color: #8b5cf6;
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
        }

        /* Modern Input Styling */
        .input-block {
            margin-bottom: 18px;
        }

        .input-label-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 7px;
        }

        .field-label {
            font-size: 0.86rem;
            font-weight: 700;
            color: #334155;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .field-label i {
            color: var(--primary);
            font-size: 0.88rem;
        }

        .field-container {
            position: relative;
            display: flex;
            align-items: center;
        }

        .custom-input {
            width: 100%;
            height: 52px;
            border: 2px solid #e2e8f0;
            border-radius: 14px;
            padding: 0 16px;
            font-size: 0.95rem;
            color: #0f172a;
            background: #f8fafc;
            transition: all 0.25s ease;
            outline: none;
        }

        .custom-input:focus {
            border-color: var(--primary);
            background: #ffffff;
            box-shadow: 0 0 0 4px rgba(0, 98, 255, 0.12);
        }

        .password-field .custom-input {
            padding-right: 48px;
        }

        .eye-toggle-btn {
            position: absolute;
            right: 8px;
            width: 36px;
            height: 36px;
            border: none;
            background: transparent;
            color: #64748b;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.05rem;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 5;
        }
        .eye-toggle-btn:hover {
            color: var(--primary);
            background: #f1f5f9;
        }

        /* Checkbox & Forgot */
        .auth-extra-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            font-size: 0.85rem;
        }

        .remember-checkbox-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            user-select: none;
            color: #64748b;
            font-weight: 500;
        }
        .remember-checkbox-wrap input {
            accent-color: var(--primary);
            width: 16px;
            height: 16px;
            cursor: pointer;
        }

        .link-forgot {
            color: var(--primary);
            font-weight: 600;
            text-decoration: none;
            transition: color 0.2s;
        }
        .link-forgot:hover {
            color: #0044b3;
            text-decoration: underline;
        }

        /* Submit Button */
        .btn-auth-submit {
            width: 100%;
            height: 52px;
            border: none;
            border-radius: 14px;
            background: var(--primary-gradient);
            color: #ffffff;
            font-weight: 700;
            font-size: 1rem;
            letter-spacing: 0.2px;
            cursor: pointer;
            box-shadow: 0 10px 25px var(--primary-glow);
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .btn-auth-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 30px rgba(0, 98, 255, 0.45);
            color: #ffffff;
        }

        .btn-auth-submit.admin-submit {
            background: var(--admin-gradient);
            box-shadow: 0 10px 25px rgba(139, 92, 246, 0.35);
        }
        .btn-auth-submit.admin-submit:hover {
            box-shadow: 0 14px 30px rgba(139, 92, 246, 0.45);
        }

        /* Bottom Links */
        .auth-bottom-nav {
            margin-top: 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .signup-prompt {
            font-size: 0.88rem;
            color: #64748b;
        }
        .signup-prompt a {
            color: var(--primary);
            font-weight: 700;
            text-decoration: none;
        }
        .signup-prompt a:hover {
            text-decoration: underline;
        }

        .back-home-link {
            font-size: 0.82rem;
            color: #94a3b8;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: color 0.2s;
        }
        .back-home-link:hover {
            color: var(--primary);
        }

        /* Alert Box */
        .alert-custom {
            border-radius: 12px;
            font-size: 0.86rem;
            font-weight: 600;
            padding: 12px 16px;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* ====================================================
           RESPONSIVENESS (Laptop, Tablet, Mobile)
           ==================================================== */
        @media (max-width: 991px) {
            .auth-container {
                grid-template-columns: 1fr;
                border-radius: 28px;
            }

            .auth-hero-pane {
                padding: 36px 30px;
                min-height: auto;
            }

            .hero-heading {
                font-size: 1.85rem;
            }

            .feature-chips {
                display: none; /* Keep hero clean on tablet & mobile */
            }

            .hero-tagline {
                margin-bottom: 0;
            }

            .hero-footer {
                display: none;
            }

            .auth-form-pane {
                padding: 38px 28px;
            }
        }

        @media (max-width: 576px) {
            body {
                padding: 12px;
            }

            .auth-container {
                border-radius: 22px;
            }

            .auth-hero-pane {
                padding: 24px 20px;
            }

            .hero-heading {
                font-size: 1.55rem;
                margin-bottom: 8px;
            }

            .hero-tagline {
                font-size: 0.88rem;
            }

            .auth-form-pane {
                padding: 28px 18px;
            }

            .login-main-title {
                font-size: 1.45rem;
            }

            .brand-icon-circle {
                width: 58px;
                height: 58px;
                font-size: 24px;
                border-radius: 16px;
                margin-bottom: 12px;
            }

            .custom-input {
                height: 48px;
                font-size: 0.92rem;
            }

            .btn-auth-submit {
                height: 48px;
                font-size: 0.95rem;
            }
        }
    </style>
</head>
<body>

    <!-- Ambient glow spheres -->
    <div class="ambient-sphere ambient-1"></div>
    <div class="ambient-sphere ambient-2"></div>

    <div class="login-super-wrapper">
        <div class="auth-container">

            <!-- LEFT HERO PANE (Showcase on Laptop & Desktop) -->
            <div class="auth-hero-pane">
                <div class="hero-top">
                    <a href="index.jsp" class="hero-brand">
                        <div class="brand-pill-icon">
                            <i class="fa-solid fa-plane-departure"></i>
                        </div>
                        <span class="brand-text">TravelAI</span>
                    </a>
                    <div class="hero-live-badge">
                        <span class="live-dot"></span>
                        <span>AI Engine Active</span>
                    </div>
                </div>

                <div class="hero-main-content">
                    <h1 class="hero-heading">
                        Discover the World with <span>Intelligent Travel</span>
                    </h1>
                    <p class="hero-tagline">
                        Personalized AI recommendations, verified destinations, and effortless bookings tailored to your style and budget.
                    </p>

                    <div class="feature-chips">
                        <div class="feature-chip">
                            <div class="feature-chip-icon chip-icon-blue">
                                <i class="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <div>
                                <div class="feature-chip-title">Smart AI Recommendations</div>
                                <div class="feature-chip-desc">Personalized itineraries matching your budget & season</div>
                            </div>
                        </div>

                        <div class="feature-chip">
                            <div class="feature-chip-icon chip-icon-purple">
                                <i class="fa-solid fa-map-location-dot"></i>
                            </div>
                            <div>
                                <div class="feature-chip-title">500+ Handpicked Destinations</div>
                                <div class="feature-chip-desc">Curated mountain, beach, wildlife, and heritage getaways</div>
                            </div>
                        </div>

                        <div class="feature-chip">
                            <div class="feature-chip-icon chip-icon-teal">
                                <i class="fa-solid fa-shield-halved"></i>
                            </div>
                            <div>
                                <div class="feature-chip-title">Verified & Instant Booking</div>
                                <div class="feature-chip-desc">Enterprise-grade security for your account & transactions</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hero-footer">
                    <div class="rating-stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div class="rating-caption">
                        Trusted by <strong>25,000+</strong> happy travelers worldwide
                    </div>
                </div>
            </div>

            <!-- RIGHT FORM PANE -->
            <div class="auth-form-pane">
                <div class="form-header">
                    <div class="brand-icon-circle" id="brandIcon">
                        <i class="fa-solid fa-earth-americas"></i>
                    </div>
                    <h2 class="login-main-title" id="loginTitle">Welcome Back</h2>
                    <p class="login-sub-title" id="loginSubtitle">Login to explore your dream destinations</p>
                </div>

                <!-- ROLE TOGGLE TABS -->
                <div class="role-switcher-box">
                    <button type="button" class="role-switch-tab active" id="userRoleBtn">
                        <i class="fa-solid fa-user"></i>
                        <span>Traveler</span>
                    </button>
                    <button type="button" class="role-switch-tab" id="adminRoleBtn">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>Administrator</span>
                    </button>
                </div>

                <!-- ALERT MESSAGE -->
                <div id="message" class="alert alert-custom d-none" role="alert"></div>

                <!-- FORM -->
                <form id="loginForm" novalidate>
                    <div class="input-block">
                        <div class="input-label-row">
                            <label class="field-label" for="email" id="emailLabel">
                                <i class="fa-solid fa-envelope"></i> Email
                            </label>
                        </div>
                        <div class="field-container">
                            <input 
                                type="text" 
                                id="email" 
                                class="custom-input" 
                                placeholder="Enter your email address" 
                                autocomplete="email" 
                                required>
                        </div>
                    </div>

                    <div class="input-block">
                        <div class="input-label-row">
                            <label class="field-label" for="password">
                                <i class="fa-solid fa-lock"></i> Password
                            </label>
                        </div>
                        <div class="field-container password-field">
                            <input 
                                type="password" 
                                id="password" 
                                class="custom-input" 
                                placeholder="Enter your password" 
                                autocomplete="current-password" 
                                required>
                            <button 
                                type="button" 
                                class="eye-toggle-btn" 
                                id="passwordToggleBtn" 
                                aria-label="Toggle Password Visibility"
                                tabindex="-1">
                                <i class="fa-solid fa-eye" id="eyeIcon"></i>
                            </button>
                        </div>
                    </div>

                    <div class="auth-extra-row">
                        <label class="remember-checkbox-wrap">
                            <input type="checkbox" id="rememberMe">
                            <span>Remember me</span>
                        </label>
                        <a href="forgotPassword.jsp" class="link-forgot">Forgot Password?</a>
                    </div>

                    <button type="submit" class="btn-auth-submit" id="loginBtn">
                        <i class="fa-solid fa-right-to-bracket"></i>
                        <span>Login as User</span>
                    </button>
                </form>

                <div class="auth-bottom-nav">
                    <div class="signup-prompt" id="registerOption">
                        Don't have an account? <a href="register.jsp">Create an Account</a>
                    </div>
                    <div>
                        <a href="index.jsp" class="back-home-link">
                            <i class="fa-solid fa-arrow-left"></i> Back to Homepage
                        </a>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <!-- SCRIPTS -->
    <script src="js/common.js"></script>
    <script src="js/login.js"></script>

</body>
</html>