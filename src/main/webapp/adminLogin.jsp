<%@ page language="java"
contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
 content="width=device-width, initial-scale=1.0">

<title>Admin Login | Travel Recommendation System</title>

<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet">

<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

<link
	href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
	rel="stylesheet">

<link rel="stylesheet" href="css/adminLogin.css">

</head>

<body>

<div class="login-container">

```
<div class="login-card">

	<div class="logo">
		<i class="fa-solid fa-user-shield"></i>
	</div>

	<h2 class="title">
		Admin Login
	</h2>

	<p class="subtitle">
		TravelAI Administration Panel
	</p>

	<div
		id="adminLoginMessage"
		class="alert d-none"
		role="alert">
	</div>

	<form id="adminLoginForm">

		<div class="mb-3">

			<label class="form-label">

				<i class="fa-solid fa-envelope"></i>
				Admin Email

			</label>

			<div class="input-group">

				<span class="input-group-text">
					<i class="fa-solid fa-envelope"></i>
				</span>

				<input
					type="email"
					id="email"
					name="email"
					class="form-control"
					placeholder="Enter Admin Email"
					autocomplete="email"
					required>

			</div>

		</div>

		<div class="mb-3">

			<label class="form-label">

				<i class="fa-solid fa-lock"></i>
				Password

			</label>

			<div class="input-group">

				<span class="input-group-text">
					<i class="fa-solid fa-lock"></i>
				</span>

				<input
					type="password"
					id="password"
					name="password"
					class="form-control"
					placeholder="Enter Admin Password"
					autocomplete="current-password"
					required>

				<button
					type="button"
					class="eye-btn"
					onclick="togglePassword('password','passIcon')">

					<i
						id="passIcon"
						class="fa-solid fa-eye">
					</i>

				</button>

			</div>

		</div>

		<div class="login-options">

			<div class="remember-me">

				<input
					type="checkbox"
					id="rememberMe">

				<label for="rememberMe">
					Remember Me
				</label>

			</div>

			<a href="#" class="forgot">
				Forgot Password?
			</a>

		</div>

		<button
			type="submit"
			id="adminLoginBtn"
			class="btn-login">

			<i class="fa-solid fa-right-to-bracket"></i>
			Login Dashboard

		</button>

	</form>

	<div class="back-home">

		<a href="index.jsp">

			<i class="fa-solid fa-arrow-left"></i>
			Back To Home

		</a>

	</div>

	<div class="footer-text">

		<i class="fa-solid fa-plane"></i>
		AI Travel Recommendation System

	</div>

</div>
```

</div>

<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
</script>

<script src="js/adminLogin.js"></script>

</body>

</html>
