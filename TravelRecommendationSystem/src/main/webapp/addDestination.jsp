<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Add Destination | TravelAI Admin</title>

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

            <div class="destination-page-header mb-4">

                <div>

                    <h2 class="fw-bold mb-1">

                        <i class="fa-solid fa-location-dot
                                  me-2 text-primary"></i>

                        Add Destination

                    </h2>

                    <p class="text-muted mb-0">
                        Add a new travel destination.
                    </p>

                </div>

                <a
                    href="manageDestination.jsp"
                    class="btn btn-outline-secondary rounded-pill px-4">

                    <i class="fa-solid fa-arrow-left me-2"></i>

                    Back

                </a>

            </div>

            <div
                id="destinationMessage"
                class="alert d-none"
                role="alert">
            </div>

            <div class="destination-form-card">

                <form id="addDestinationForm">

                    <div class="row g-4">

                        <div class="col-lg-8">

                            <div class="row g-3">

                                <div class="col-md-6">

                                    <label class="form-label">
                                        Destination Name
                                    </label>

                                    <input
                                        type="text"
                                        id="name"
                                        class="form-control"
                                        maxlength="100"
                                        required>

                                </div>

                                <div class="col-md-6">

                                    <label class="form-label">
                                        Budget
                                    </label>

                                    <input
                                        type="number"
                                        id="budget"
                                        class="form-control"
                                        min="0"
                                        step="0.01"
                                        required>

                                </div>

                                <div class="col-md-6">

                                    <label class="form-label">
                                        Season
                                    </label>

                                    <select
                                        id="season"
                                        class="form-select"
                                        required>

                                        <option value="">
                                            Select Season
                                        </option>

                                        <option value="Summer">
                                            Summer
                                        </option>

                                        <option value="Winter">
                                            Winter
                                        </option>

                                        <option value="Monsoon">
                                            Monsoon
                                        </option>

                                        <option value="Spring">
                                            Spring
                                        </option>

                                        <option value="Autumn">
                                            Autumn
                                        </option>

                                    </select>

                                </div>

                                <div class="col-md-6">

                                    <label class="form-label">
                                        Category
                                    </label>

                                    <select
                                        id="category"
                                        class="form-select"
                                        required>

                                        <option value="">
                                            Select Category
                                        </option>

                                        <option value="Beach">
                                            Beach
                                        </option>

                                        <option value="Mountain">
                                            Mountain
                                        </option>

                                        <option value="Adventure">
                                            Adventure
                                        </option>

                                        <option value="Historical">
                                            Historical
                                        </option>

                                        <option value="Religious">
                                            Religious
                                        </option>

                                        <option value="City">
                                            City
                                        </option>

                                        <option value="Wildlife">
                                            Wildlife
                                        </option>

                                    </select>

                                </div>

                                <div class="col-md-6">

                                    <label class="form-label">
                                        Rating
                                    </label>

                                    <input
                                        type="number"
                                        id="rating"
                                        class="form-control"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        required>

                                </div>

                                <div class="col-12">

                                    <label class="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        id="description"
                                        class="form-control"
                                        rows="6"
                                        maxlength="1000"
                                        required></textarea>

                                </div>

                            </div>

                        </div>

                        <div class="col-lg-4">

                            <div class="image-upload-card">

                                <label class="form-label fw-semibold">
                                    Destination Image
                                </label>

                                <div
                                    id="imagePreviewContainer"
                                    class="image-preview">

                                    <i class="fa-solid fa-image"></i>

                                    <span>
                                        Image preview
                                    </span>

                                </div>

                                <input
                                    type="file"
                                    id="destinationImage"
                                    class="form-control mt-3"
                                    accept="image/*"
                                    required>

                                <small class="text-muted d-block mt-2">
                                    JPG, JPEG, PNG, WEBP images only.
                                </small>

                            </div>

                        </div>

                    </div>

                    <div
                        class="d-flex justify-content-end
                               gap-2 mt-4 pt-4 border-top">

                        <a
                            href="manageDestination.jsp"
                            class="btn btn-light px-4">

                            Cancel

                        </a>

                        <button
                            type="submit"
                            id="saveDestinationBtn"
                            class="btn btn-primary px-4">

                            <i class="fa-solid fa-save me-2"></i>

                            Save Destination

                        </button>

                    </div>

                </form>

            </div>

        </div>

        <%@ include file="adminFooter.jsp" %>

    </div>

    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
    </script>

    <script
        src="${pageContext.request.contextPath}/js/common.js">
    </script>

    <script
        src="${pageContext.request.contextPath}/js/addDestination.js">
    </script>

</body>

</html>