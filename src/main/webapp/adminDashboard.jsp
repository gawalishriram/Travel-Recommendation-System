<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Admin Dashboard | TravelAI</title>


    <!-- =====================================================
         BOOTSTRAP
         ===================================================== -->

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">


    <!-- =====================================================
         FONT AWESOME
         ===================================================== -->

    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


    <!-- =====================================================
         GOOGLE FONT
         ===================================================== -->

    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">


    <!-- =====================================================
         ADMIN CSS
         ===================================================== -->

    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/css/admin.css?v=2">


    <!-- =====================================================
         DASHBOARD CSS
         ===================================================== -->

    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/css/adminDashboard.css?v=2">

</head>


<body>


    <!-- =====================================================
         SIDEBAR
         ===================================================== -->

    <%@ include file="adminSidebar.jsp" %>


    <!-- =====================================================
         MAIN
         ===================================================== -->

    <div class="main">


        <!-- =================================================
             TOPBAR
             ================================================= -->

        <%@ include file="adminTopbar.jsp" %>


        <!-- =================================================
             DASHBOARD PAGE
             ================================================= -->

        <main class="dashboard-page">


            <!-- =================================================
                 HEADER
                 ================================================= -->

            <div class="dashboard-header">

                <div>

                    <h2>
                        Admin Dashboard
                    </h2>

                    <p>
                        Manage your TravelAI system
                    </p>

                </div>

            </div>


            <!-- =================================================
                 STAT CARDS
                 ================================================= -->

            <div class="row g-4 mb-4">


                <!-- =============================================
                     TOTAL USERS
                     ============================================= -->

                <div class="col-lg-6 col-md-6">

                    <div class="dashboard-stat-card users-card">

                        <div class="dashboard-stat-icon">

                            <i class="fa-solid fa-users"></i>

                        </div>


                        <div class="dashboard-stat-content">

                            <div
                                class="dashboard-stat-value"
                                id="totalUsers">

                                0

                            </div>


                            <div class="dashboard-stat-label">

                                Total Users

                            </div>

                        </div>

                    </div>

                </div>


                <!-- =============================================
                     TOTAL DESTINATIONS
                     ============================================= -->

                <div class="col-lg-6 col-md-6">

                    <div class="dashboard-stat-card destinations-card">

                        <div class="dashboard-stat-icon">

                            <i class="fa-solid fa-location-dot"></i>

                        </div>


                        <div class="dashboard-stat-content">

                            <div
                                class="dashboard-stat-value"
                                id="totalDestinations">

                                0

                            </div>


                            <div class="dashboard-stat-label">

                                Total Destinations

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <!-- =================================================
                 MANAGEMENT CARDS
                 ================================================= -->

            <div class="row g-4">


                <!-- =============================================
                     MANAGE DESTINATIONS
                     ============================================= -->

                <div class="col-lg-6 col-md-6">

                    <div class="dashboard-management-card">

                        <div class="management-icon">

                            <i class="fa-solid fa-map-location-dot"></i>

                        </div>


                        <h3>
                            Manage Destinations
                        </h3>


                        <p>
                            Create, view, update and delete
                            travel destinations.
                        </p>


                        <a
                            href="manageDestination.jsp"
                            class="dashboard-open-btn destination-btn">

                            Open

                        </a>

                    </div>

                </div>


                <!-- =============================================
                     MANAGE USERS
                     ============================================= -->

                <div class="col-lg-6 col-md-6">

                    <div class="dashboard-management-card">

                        <div class="management-icon">

                            <i class="fa-solid fa-users"></i>

                        </div>


                        <h3>
                            Manage Users
                        </h3>


                        <p>
                            View and manage registered users.
                        </p>


                        <a
                            href="manageUsers.jsp"
                            class="dashboard-open-btn users-btn">

                            Open

                        </a>

                    </div>

                </div>

            </div>


        </main>


        <!-- =================================================
             FOOTER
             ================================================= -->

        <%@ include file="adminFooter.jsp" %>


    </div>


    <!-- =====================================================
         BOOTSTRAP JS
         ===================================================== -->

    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
    </script>


    <!-- =====================================================
         ADMIN JS
         ===================================================== -->

    <script
        src="${pageContext.request.contextPath}/js/admin.js?v=2">
    </script>


    <!-- =====================================================
         DASHBOARD JS
         ===================================================== -->

    <script
        src="${pageContext.request.contextPath}/js/adminDashboard.js?v=2">
    </script>


</body>

</html>