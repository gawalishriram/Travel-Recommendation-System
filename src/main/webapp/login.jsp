<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Login | TravelAI</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet">
<link
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
	rel="stylesheet">
<link
	href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
	rel="stylesheet">
<link href="${pageContext.request.contextPath}/css/login.css"
	rel="stylesheet">
</head>
<body>
	<div class="login-container">
		<div class="login-card">
			<div class="logo">
				<i class="fa-solid fa-earth-americas"></i>
			</div>
			<h2 class="title">Welcome Back Traveller</h2>
			<p class="subtitle">Login to explore your dream destinations</p>
			<div id="message" class="alert d-none" role="alert"></div>
			<form id="loginForm">
				<div class="mb-3">
					<label for="email" class="form-label"><i
						class="fa-solid fa-envelope"></i> Email</label><input type="email"
						id="email" class="form-control" placeholder="Enter Email"
						autocomplete="email" required>
				</div>
				<div class="mb-3">
					<label for="password" class="form-label"><i
						class="fa-solid fa-lock"></i> Password</label>
					<div class="password-wrap">
						<input type="password" id="password" class="form-control"
							placeholder="Enter Password" autocomplete="current-password"
							required>
						<button type="button" id="passwordToggle" class="eye-btn">
							<i class="fa-solid fa-eye"></i>
						</button>
					</div>
				</div>
				<div class="login-options">
					<label><input type="checkbox" id="showPassword">
						Show Password</label>
				</div>
				<button type="submit" id="loginBtn" class="btn btn-login">
					<i class="fa-solid fa-right-to-bracket"></i> Login
				</button>
			</form>
			<div class="text-center register-text">
				Don't have an account? <a href="register.jsp">Register Here</a>
			</div>
			<div class="back-home">
				<a href="index.jsp"><i class="fa-solid fa-arrow-left"></i> Back
					To Home</a>
			</div>
		</div>
	</div>
	<script src="js/login.js"></script>
</body>
</html>
