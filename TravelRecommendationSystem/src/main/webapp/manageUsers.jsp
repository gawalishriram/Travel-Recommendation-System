<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Manage Users | TravelAI Admin</title>


    <!-- ===================================================== -->
    <!-- BOOTSTRAP -->
    <!-- ===================================================== -->

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">


    <!-- ===================================================== -->
    <!-- FONT AWESOME -->
    <!-- ===================================================== -->

    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


    <!-- ===================================================== -->
    <!-- GOOGLE FONT -->
    <!-- ===================================================== -->

    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">


    <!-- ===================================================== -->
    <!-- ADMIN CSS -->
    <!-- ===================================================== -->

    <link
        rel="stylesheet"
        type="text/css"
        href="${pageContext.request.contextPath}/css/admin.css">


    <!-- ===================================================== -->
    <!-- MANAGE USERS CSS -->
    <!-- ===================================================== -->

    <link
        rel="stylesheet"
        type="text/css"
        href="${pageContext.request.contextPath}/css/manageUsers.css">

</head>


<body>


    <!-- ===================================================== -->
    <!-- SIDEBAR -->
    <!-- ===================================================== -->

    <%@ include file="adminSidebar.jsp" %>


    <!-- ===================================================== -->
    <!-- MAIN CONTENT -->
    <!-- ===================================================== -->

    <div class="main">


        <!-- ================================================= -->
        <!-- TOPBAR -->
        <!-- ================================================= -->

        <%@ include file="adminTopbar.jsp" %>


        <!-- ================================================= -->
        <!-- USER PAGE -->
        <!-- ================================================= -->

        <main class="user-page">


            <!-- ============================================= -->
            <!-- PAGE HEADER -->
            <!-- ============================================= -->

            <div class="user-header">

                <div class="user-title">

                    <h2>
                        <i class="fa-solid fa-users me-2 text-primary"></i>
                        Manage Users
                    </h2>

                    <p>
                        View and manage registered users.
                    </p>

                </div>


                <div class="user-header-actions">

                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        onclick="loadUsers()">

                        <i class="fa-solid fa-arrows-rotate me-2"></i>
                        Refresh

                    </button>


                    <button
                        type="button"
                        class="btn btn-primary"
                        onclick="exportUsers()">

                        <i class="fa-solid fa-file-export me-2"></i>
                        Export Users

                    </button>

                </div>

            </div>


            <!-- ============================================= -->
            <!-- MESSAGE -->
            <!-- ============================================= -->

            <div
                id="userMessage"
                class="alert d-none"
                role="alert">
            </div>


            <!-- ============================================= -->
            <!-- USER STATISTICS -->
            <!-- ============================================= -->

            <div class="row g-4">


                <!-- TOTAL USERS -->

                <div class="col-xl-3 col-md-6">

                    <div class="user-stat-card">

                        <div class="user-stat-content">

                            <div>

                                <div class="user-stat-label">
                                    Total Users
                                </div>

                                <div
                                    class="user-stat-value"
                                    id="totalUsersCount">

                                    0

                                </div>

                            </div>


                            <div class="user-stat-icon total">

                                <i class="fa-solid fa-users"></i>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- MALE USERS -->

                <div class="col-xl-3 col-md-6">

                    <div class="user-stat-card">

                        <div class="user-stat-content">

                            <div>

                                <div class="user-stat-label">
                                    Male Users
                                </div>

                                <div
                                    class="user-stat-value"
                                    id="maleUsersCount">

                                    0

                                </div>

                            </div>


                            <div class="user-stat-icon active">

                                <i class="fa-solid fa-person"></i>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- FEMALE USERS -->

                <div class="col-xl-3 col-md-6">

                    <div class="user-stat-card">

                        <div class="user-stat-content">

                            <div>

                                <div class="user-stat-label">
                                    Female Users
                                </div>

                                <div
                                    class="user-stat-value"
                                    id="femaleUsersCount">

                                    0

                                </div>

                            </div>


                            <div class="user-stat-icon pending">

                                <i class="fa-solid fa-person-dress"></i>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- OTHER USERS -->

                <div class="col-xl-3 col-md-6">

                    <div class="user-stat-card">

                        <div class="user-stat-content">

                            <div>

                                <div class="user-stat-label">
                                    Other Users
                                </div>

                                <div
                                    class="user-stat-value"
                                    id="otherUsersCount">

                                    0

                                </div>

                            </div>


                            <div class="user-stat-icon blocked">

                                <i class="fa-solid fa-user"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <!-- ============================================= -->
            <!-- SEARCH & FILTER -->
            <!-- ============================================= -->

            <div class="user-filter-card">


                <div class="user-filter-title">

                    <i class="fa-solid fa-filter me-2 text-primary"></i>

                    Search & Filter Users

                </div>


                <div class="row g-3 align-items-center">


                    <!-- SEARCH -->

                    <div class="col-lg-6">

                        <div class="input-group">

                            <span class="input-group-text">

                                <i class="fa-solid fa-search"></i>

                            </span>


                            <input
                                type="search"
                                id="userSearch"
                                class="form-control"
                                placeholder="Search by name, email, mobile or user ID..."
                                autocomplete="off">

                        </div>

                    </div>


                    <!-- GENDER FILTER -->

                    <div class="col-lg-4">

                        <div class="user-filter-buttons">


                            <button
                                type="button"
                                class="btn btn-outline-primary filter-btn active"
                                data-gender="">

                                All

                            </button>


                            <button
                                type="button"
                                class="btn btn-outline-primary filter-btn"
                                data-gender="Male">

                                Male

                            </button>


                            <button
                                type="button"
                                class="btn btn-outline-primary filter-btn"
                                data-gender="Female">

                                Female

                            </button>


                            <button
                                type="button"
                                class="btn btn-outline-primary filter-btn"
                                data-gender="Other">

                                Other

                            </button>

                        </div>

                    </div>


                    <!-- RESET -->

                    <div class="col-lg-2">

                        <button
                            type="button"
                            class="btn btn-secondary w-100"
                            onclick="resetUserFilters()">

                            <i class="fa-solid fa-rotate-left me-2"></i>

                            Reset

                        </button>

                    </div>

                </div>

            </div>


            <!-- ============================================= -->
            <!-- USERS TABLE -->
            <!-- ============================================= -->

            <div class="user-table-card">


                <!-- TABLE HEADER -->

                <div class="user-table-header">

                    <div>

                        <h5>

                            <i class="fa-solid fa-user-group me-2 text-primary"></i>

                            All Registered Users

                        </h5>


                        <small>
                            View and manage registered users.
                        </small>

                    </div>


                    <span
                        class="badge bg-primary"
                        id="userCountBadge">

                        0 Users

                    </span>

                </div>


                <!-- ========================================= -->
                <!-- TABLE -->
                <!-- ========================================= -->

                <div class="user-table-wrapper">

                    <table class="table user-table">


                        <thead>

                            <tr>

                                <th>User ID</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Mobile</th>

                                <th>Gender</th>

                                <th>Address</th>

                                <th>Created At</th>

                                <th class="text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody id="userTableBody">

                            <tr>

                                <td
                                    colspan="8"
                                    class="text-center text-muted py-5">

                                    <i
                                        class="fa-solid fa-spinner fa-spin me-2">
                                    </i>

                                    Loading users...

                                </td>

                            </tr>

                        </tbody>


                    </table>

                </div>


                <!-- ========================================= -->
                <!-- PAGINATION -->
                <!-- ========================================= -->

                <div
                    id="userPagination"
                    class="user-pagination">

                </div>


            </div>


        </main>


        <!-- ================================================= -->
        <!-- FOOTER -->
        <!-- ================================================= -->

        <%@ include file="adminFooter.jsp" %>


    </div>


    <!-- ===================================================== -->
    <!-- BOOTSTRAP JS -->
    <!-- ===================================================== -->

    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
    </script>


    <!-- ===================================================== -->
    <!-- COMMON JS -->
    <!-- ===================================================== -->

    <script
        src="${pageContext.request.contextPath}/js/common.js">
    </script>


    <!-- ===================================================== -->
    <!-- MANAGE USERS JS -->
    <!-- ===================================================== -->

    <script
        src="${pageContext.request.contextPath}/js/manageUsers.js">
    </script>


</body>

</html>