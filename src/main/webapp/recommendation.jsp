<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"
	language="java"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Recommendation | Travel AI</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet">
<link
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
	rel="stylesheet">
<link href="css/common.css" rel="stylesheet">
<link href="css/recommendation.css" rel="stylesheet">
</head>
<body><%@ include file="navbar.jsp"%><div
		class="container mt-4">
		<div id="message" class="alert" style="display: none"></div>
		<h2 class="page-title">Travel Recommendation</h2>
		<div class="card">
			<div class="card-body">
				<div class="row">
					<div class="col-md-4 mb-3">
						<label>Budget</label><input type="number" id="budget"
							class="form-control" min="1">
					</div>
					<div class="col-md-4 mb-3">
						<label>Travel Type</label><select id="type" class="form-select"><option
								value="">Select</option>
							<option>Adventure</option>
							<option>Family</option>
							<option>Couple</option>
							<option>Friends</option></select>
					</div>
					<div class="col-md-4 mb-3">
						<label>Season</label><select id="season" class="form-select"><option
								value="">Select</option>
							<option>Summer</option>
							<option>Winter</option>
							<option>Monsoon</option></select>
					</div>
				</div>
				<button type="button" class="btn btn-primary" onclick="recommend()">Generate
					Recommendation</button>
				<a href="dashboard.jsp" class="btn btn-success">Dashboard</a>
			</div>
		</div>
		<div class="row" id="result"></div>
	</div><%@ include file="footer.jsp"%><script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
	<script src="js/common.js"></script>
	<script src="js/logoutUser.js"></script>
	<script src="js/recommendation.js"></script>
</body>
</html>
