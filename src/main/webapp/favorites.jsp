<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"
	language="java"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Favorites | Travel AI</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet">
<link
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
	rel="stylesheet">
<link href="css/common.css" rel="stylesheet">
<link href="css/favorites.css" rel="stylesheet">
</head>
<body><%@ include file="navbar.jsp"%><div
		class="container mt-4">
		<div id="message" class="alert" style="display: none"></div>
		<h2 class="page-title">My Favorite Destinations</h2>
		<div class="row" id="favoriteContainer">
			<div class="col-12 text-center">Loading...</div>
		</div>
		<a href="recommendation.jsp" class="btn btn-primary">Explore More</a>
	</div><%@ include file="footer.jsp"%><script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
	<script src="js/common.js"></script>
	<script src="js/logoutUser.js"></script>
	<script src="js/favorites.js"></script>
</body>
</html>
