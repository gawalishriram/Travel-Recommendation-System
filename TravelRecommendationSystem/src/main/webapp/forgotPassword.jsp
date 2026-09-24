<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Forgot Password | TravelAI</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="${pageContext.request.contextPath}/css/login.css" rel="stylesheet">
<style>
.step-badge {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: #0062ff;
	color: #fff;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	font-size: 13px;
	margin-right: 8px;
}
.input-group .form-control {
	border-top-right-radius: 0 !important;
	border-bottom-right-radius: 0 !important;
}
.btn-toggle-eye {
	background: #ffffff !important;
	border: 1px solid #ced4da !important;
	border-left: none !important;
	color: #6c757d !important;
	border-top-right-radius: 12px !important;
	border-bottom-right-radius: 12px !important;
	padding: 0 16px !important;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
.btn-toggle-eye:hover {
	color: #0d6efd !important;
	background: #f8fafc !important;
}
</style>
</head>
<body>
	<div class="login-container">
		<div class="login-card">
			<div class="logo">
				<i class="fa-solid fa-key"></i>
			</div>
			<h2 class="title">Reset Password</h2>
			<p class="subtitle">Enter your email to receive a 6-digit verification code</p>

			<div id="message" class="alert d-none" role="alert"></div>

			<!-- STEP 1: ENTER EMAIL -->
			<div id="step1">
				<form id="forgotForm" onsubmit="requestResetToken(event)">
					<div class="mb-3">
						<label for="forgotEmail" class="form-label">
							<i class="fa-solid fa-envelope"></i> Registered Email
						</label>
						<input type="email" id="forgotEmail" class="form-control" placeholder="Enter your registered email (e.g. name@gmail.com)" required>
					</div>
					<button type="submit" id="requestBtn" class="btn btn-login mt-2">
						<i class="fa-solid fa-paper-plane me-2"></i> Send Verification Code
					</button>
				</form>
			</div>

			<!-- STEP 2: ENTER CODE & NEW PASSWORD -->
			<div id="step2" class="d-none">
				<div class="alert alert-info py-2 px-3 mb-3 small" id="tokenNotice">
					<i class="fa-solid fa-envelope-circle-check me-1 text-primary"></i> Verification code dispatched!
				</div>

				<form id="resetForm" onsubmit="submitNewPassword(event)">
					<div class="mb-3">
						<label for="resetToken" class="form-label">
							<i class="fa-solid fa-shield-halved"></i> 6-Digit Email Verification Code
						</label>
						<input type="text" id="resetToken" class="form-control text-center fw-bold fs-5 letter-spacing-2" placeholder="• • • • • •" maxlength="10" required>
					</div>
					<div class="mb-3">
						<label for="newPassword" class="form-label">
							<i class="fa-solid fa-lock"></i> New Password
						</label>
						<div class="input-group">
							<input type="password" id="newPassword" class="form-control" placeholder="At least 6 characters" minlength="6" required>
							<button type="button" class="btn btn-toggle-eye" onclick="togglePasswordVisibility('newPassword', 'eyeNew')" title="Show/Hide password">
								<i class="fa-solid fa-eye" id="eyeNew"></i>
							</button>
						</div>
					</div>
					<div class="mb-3">
						<label for="confirmNewPassword" class="form-label">
							<i class="fa-solid fa-lock-check"></i> Confirm New Password
						</label>
						<div class="input-group">
							<input type="password" id="confirmNewPassword" class="form-control" placeholder="Re-enter new password" minlength="6" required>
							<button type="button" class="btn btn-toggle-eye" onclick="togglePasswordVisibility('confirmNewPassword', 'eyeConfirm')" title="Show/Hide password">
								<i class="fa-solid fa-eye" id="eyeConfirm"></i>
							</button>
						</div>
					</div>
					<button type="submit" id="resetBtn" class="btn btn-login mt-2">
						<i class="fa-solid fa-check me-2"></i> Update Password
					</button>
					<div class="d-flex gap-2 mt-2">
						<button type="button" id="resendBtn" class="btn btn-outline-primary w-50 rounded-pill" onclick="resendCode()">
							<i class="fa-solid fa-rotate-right me-1"></i> Resend Code
						</button>
						<button type="button" class="btn btn-outline-secondary w-50 rounded-pill" onclick="backToStep1()">
							← Change Email
						</button>
					</div>
				</form>
			</div>

			<div class="text-center register-text mt-4">
				Remember your password? <a href="login.jsp">Back to Login</a>
			</div>
			<div class="back-home">
				<a href="index.jsp"><i class="fa-solid fa-arrow-left"></i> Back To Home</a>
			</div>
		</div>
	</div>

	<script src="js/forgotPassword.js"></script>
</body>
</html>
