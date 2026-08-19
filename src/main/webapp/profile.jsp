<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"
	language="java"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>My Profile | Travel AI</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet">
<link
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
	rel="stylesheet">
<link href="css/common.css" rel="stylesheet">
<link href="css/profile.css" rel="stylesheet">
</head>
<body><%@ include file="navbar.jsp"%><section
		class="profile-page">
		<div class="container">
			<div class="profile-header">
				<div class="profile-avatar">
					<i class="fa-solid fa-user"></i>
				</div>
				<div>
					<h1>My Profile</h1>
					<p>View and update your personal information</p>
				</div>
			</div>
			<div id="message" class="alert" style="display: none"></div>
			<div class="profile-card">
				<h4>Personal Information</h4>
				<input type="hidden" id="userId">
				<div class="row g-4">
					<div class="col-md-6">
						<label>Full Name</label><input id="name" class="profile-input"
							type="text">
					</div>
					<div class="col-md-6">
						<label>Email</label><input id="email" class="profile-input"
							type="email">
					</div>
					<div class="col-md-6">
						<label>Mobile Number</label><input id="mobile"
							class="profile-input" type="text" maxlength="10">
					</div>
					<div class="col-md-6">
						<label>Gender</label><select id="gender" class="profile-input"><option
								value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option></select>
					</div>
					<div class="col-12">
						<label>Address</label>
						<textarea id="address" class="profile-input" rows="4"></textarea>
					</div>
				</div>
				<hr>
				<h4>Change Password</h4>
				<p class="text-muted">Leave blank if you don't want to change
					it.</p>
				<div class="row g-4">
					<div class="col-md-6">
						<label>New Password</label><input id="password"
							class="profile-input" type="password">
					</div>
					<div class="col-md-6">
						<label>Confirm Password</label><input id="confirmPassword"
							class="profile-input" type="password">
					</div>
				</div>
				<div class="profile-actions">
					<button class="btn btn-primary" type="button"
						onclick="updateProfile()">
						<i class="fa-solid fa-floppy-disk"></i> Update Profile
					</button>
					<a class="btn btn-success" href="dashboard.jsp">Back to
						Dashboard</a>
				</div>
			</div>
		</div>
	</section><%@ include file="footer.jsp"%><script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
	<script src="js/common.js"></script>
	<script src="js/logoutUser.js"></script>
	<script src="js/profile.js"></script>
</body>
</html>
