<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"
	language="java"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Register | TravelAI</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet">
<link
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
	rel="stylesheet">
<link
	href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
	rel="stylesheet">
<link href="css/register.css" rel="stylesheet">
<style>
.input-group .form-control {
	border-top-right-radius: 0 !important;
	border-bottom-right-radius: 0 !important;
}
.btn-toggle-pass {
	background: #ffffff !important;
	color: #64748b !important;
	border: none !important;
	border-top-right-radius: 12px !important;
	border-bottom-right-radius: 12px !important;
	padding: 0 16px !important;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.1rem;
	cursor: pointer;
}
.btn-toggle-pass:hover {
	color: #0d6efd !important;
	background: #f8fafc !important;
}
</style>
</head>
<body>
	<div class="container">
		<div class="register-box">
			<div class="logo">
				<i class="fa-solid fa-user-plus"></i>
			</div>
			<h2>Create Your Travel Account</h2>
			<div id="message" class="alert" style="display: none"></div>
			<div class="row">
				<div class="col-md-6 mb-3">
					<label>Full Name</label><input type="text" id="name"
						class="form-control" placeholder="Enter Full Name">
				</div>
				<div class="col-md-6 mb-3">
					<label>Email</label><input type="email" id="email"
						class="form-control" placeholder="Enter Email">
				</div>
				<div class="col-md-6 mb-3">
					<label>Mobile Number</label><input type="text" id="mobile"
						class="form-control" placeholder="Mobile Number" maxlength="10">
				</div>
				<div class="col-md-6 mb-3">
					<label>Gender</label><select id="gender" class="form-select"><option
							value="">Select Gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">Other</option></select>
				</div>
				<div class="col-md-6 mb-3">
					<label class="form-label">Password</label>
					<div class="input-group">
						<input type="password" id="password"
							class="form-control" placeholder="Create Password">
						<button type="button" class="btn btn-toggle-pass" onclick="togglePassVisibility('password', this)" title="Show/Hide Password">
							<i class="fa-solid fa-eye"></i>
						</button>
					</div>
				</div>
				<div class="col-md-6 mb-3">
					<label class="form-label">Confirm Password</label>
					<div class="input-group">
						<input type="password"
							id="confirmPassword" class="form-control"
							placeholder="Confirm Password">
						<button type="button" class="btn btn-toggle-pass" onclick="togglePassVisibility('confirmPassword', this)" title="Show/Hide Password">
							<i class="fa-solid fa-eye"></i>
						</button>
					</div>
				</div>
				<div class="col-12 mb-3">
					<label>Address</label>
					<textarea id="address" class="form-control" rows="3"
						placeholder="Enter Address"></textarea>
				</div>
			</div>
			<button type="button" class="btn btn-register"
				onclick="registerUser()">
				<i class="fa-solid fa-paper-plane"></i> Create Account
			</button>
			<div class="text-center mt-4">
				Already have an account? <a href="login.jsp">Login Here</a>
			</div>
			<div class="text-center mt-2">
				<a href="index.jsp">Back To Home</a>
			</div>
		</div>
	</div>
	<script src="js/register.js"></script>
</body>
</html>
