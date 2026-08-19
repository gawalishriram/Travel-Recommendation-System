<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>View Destination | TravelAI Admin</title>

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

                        Destination Details

                    </h2>

                    <p class="text-muted mb-0">
                        View complete destination information.
                    </p>

                </div>

                <div class="d-flex gap-2">

                    <a
                        id="editButton"
                        href="#"
                        class="btn btn-warning rounded-pill px-4">

                        <i class="fa-solid fa-pen me-2"></i>

                        Edit

                    </a>

                    <a
                        href="manageDestination.jsp"
                        class="btn btn-outline-secondary rounded-pill px-4">

                        <i class="fa-solid fa-arrow-left me-2"></i>

                        Back

                    </a>

                </div>

            </div>

            <div
                id="destinationMessage"
                class="alert d-none"
                role="alert">
            </div>

            <div
                id="loadingMessage"
                class="text-center py-5">

                <i
                    class="fa-solid fa-spinner fa-spin
                           fa-2x text-primary">
                </i>

                <p class="mt-3 text-muted">
                    Loading destination...
                </p>

            </div>

            <div
                id="destinationDetails"
                class="destination-details-card d-none">

                <div class="row g-0">

                    <div class="col-lg-5">

                        <div
                            id="destinationImage"
                            class="details-image-wrapper">

                        </div>

                    </div>

                    <div class="col-lg-7">

                        <div class="p-4 p-lg-5">

                            <h2
                                id="destinationName"
                                class="fw-bold mb-3">
                            </h2>

                            <div
                                class="d-flex
                                       flex-wrap
                                       gap-2 mb-4">

                                <span
                                    id="destinationCategory"
                                    class="badge bg-primary">
                                </span>

                                <span
                                    id="destinationSeason"
                                    class="badge bg-success">
                                </span>

                                <span
                                    id="destinationRating"
                                    class="badge bg-warning text-dark">
                                </span>

                            </div>

                            <h6 class="fw-semibold">
                                Description
                            </h6>

                            <p
                                id="destinationDescription"
                                class="text-muted">
                            </p>

                            <div class="row g-3 mt-3">

                                <div class="col-sm-6">

                                    <div
                                        class="destination-info-box">

                                        <small
                                            class="text-muted d-block">

                                            Destination ID

                                        </small>

                                        <strong
                                            id="destinationId">
                                        </strong>

                                    </div>

                                </div>

                                <div class="col-sm-6">

                                    <div
                                        class="destination-info-box">

                                        <small
                                            class="text-muted d-block">

                                            Budget

                                        </small>

                                        <strong
                                            id="destinationBudget">
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        <%@ include file="adminFooter.jsp" %>

    </div>

    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
    </script>

    <script
        src="${pageContext.request.contextPath}/js/viewDestination.js">
    </script>

</body>

</html>