<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>View Destinations | TravelAI Admin</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">

    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">

    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/css/admin.css">

    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/css/manageDestination.css">

</head>

<body>

    <%@ include file="adminSidebar.jsp" %>

    <div class="main">

        <%@ include file="adminTopbar.jsp" %>

        <div class="container-fluid px-3 px-md-4 py-4">

            <div
                class="d-flex flex-column flex-md-row
                       justify-content-between
                       align-items-md-center
                       gap-3 mb-4">

                <div>

                    <h2 class="fw-bold mb-1">

                        <i class="fa-solid fa-location-dot
                                  me-2 text-primary"></i>

                        View Destinations

                    </h2>

                    <p class="text-muted mb-0">

                        Search, update, view and delete
                        travel destinations.

                    </p>

                </div>

                <a
                    href="addDestination.jsp"
                    class="btn btn-primary rounded-pill px-4">

                    <i class="fa-solid fa-plus me-2"></i>

                    Add Destination

                </a>

            </div>

            <div
                id="destinationMessage"
                class="alert d-none"
                role="alert">
            </div>

            <div
                class="table-card
                       bg-white
                       rounded-4
                       shadow-sm">

                <div class="p-4 border-bottom">

                    <div
                        class="row g-3
                               align-items-center">

                        <div class="col-lg-6">

                            <h4 class="mb-1">

                                <i class="fa-solid fa-list
                                          me-2 text-primary"></i>

                                All Destinations

                            </h4>

                            <p
                                id="destinationCount"
                                class="text-muted mb-0">

                                Loading destinations...

                            </p>

                        </div>

                        <div class="col-lg-6">

                            <div
                                class="d-flex
                                       flex-column
                                       flex-sm-row
                                       gap-2
                                       justify-content-lg-end">

                                <div
                                    class="input-group
                                           destination-search">

                                    <span
                                        class="input-group-text">

                                        <i
                                            class="fa-solid
                                                   fa-search">
                                        </i>

                                    </span>

                                    <input
                                        type="search"
                                        id="destinationSearch"
                                        class="form-control"
                                        placeholder="Search destination...">

                                </div>

                                <button
                                    type="button"
                                    id="refreshDestinationsBtn"
                                    class="btn btn-outline-primary">

                                    <i
                                        class="fa-solid
                                               fa-arrows-rotate">
                                    </i>

                                    <span
                                        class="d-none d-sm-inline">
                                        Refresh
                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                <div class="table-responsive">

                    <table
                        class="table table-hover
                               align-middle
                               mb-0
                               destination-table">

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

                                <th class="text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody
                            id="destinationTableBody">

                            <tr>

                                <td
                                    colspan="9"
                                    class="text-center
                                           text-muted
                                           py-5">

                                    <i
                                        class="fa-solid
                                               fa-spinner
                                               fa-spin
                                               me-2">
                                    </i>

                                    Loading destinations...

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

        <%@ include file="adminFooter.jsp" %>

    </div>

    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
    </script>

    <script
        src="${pageContext.request.contextPath}/js/manageDestination.js">
    </script>

</body>

</html>