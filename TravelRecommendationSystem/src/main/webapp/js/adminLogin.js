"use strict";

const ADMIN_LOGIN_API = "http://localhost:8080/admin/login";

document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("adminLoginForm");

if (!form) {
	return;
}

form.addEventListener("submit", loginAdmin);


});

function loginAdmin(event) {


event.preventDefault();

const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const button = document.getElementById("adminLoginBtn");

if (!emailElement || !passwordElement) {
	return;
}

const email = emailElement.value.trim();
const password = passwordElement.value;

if (!email || !password) {

	showMessage(
		"Email and password are required.",
		"danger"
	);

	return;
}

if (button) {

	button.disabled = true;

	button.innerHTML =
		'<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

}

fetch(ADMIN_LOGIN_API, {

	method: "POST",

	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json"
	},

	body: JSON.stringify({
		email: email,
		password: password
	})

})
.then(function (response) {

	return response.text().then(function (text) {

		let data = {};

		if (text) {

			try {
				data = JSON.parse(text);
			} catch (error) {
				data = {};
			}

		}

		if (!response.ok) {

			throw new Error(
				data.message ||
				"Invalid admin credentials."
			);

		}

		return data;

	});

})
.then(function (data) {

	if (!data.token) {

		throw new Error(
			"Login successful, but JWT token was not received."
		);

	}

	localStorage.setItem(
		"adminToken",
		data.token
	);

	localStorage.setItem(
		"adminId",
		data.adminId || ""
	);

	localStorage.setItem(
		"adminEmail",
		data.email || emailElement.value.trim()
	);

	localStorage.setItem(
		"adminRole",
		data.role || ""
	);

	localStorage.setItem(
		"adminLoggedIn",
		"true"
	);

	window.location.href = "adminDashboard.jsp";

})
.catch(function (error) {

	console.error(
		"Admin login error:",
		error
	);

	showMessage(
		error.message ||
		"Admin login failed.",
		"danger"
	);

})
.finally(function () {

	if (button) {

		button.disabled = false;

		button.innerHTML =
			'<i class="fa-solid fa-right-to-bracket"></i> Login Dashboard';

	}

});


}

function togglePassword(inputId, iconId) {


const input = document.getElementById(inputId);
const icon = document.getElementById(iconId);

if (!input || !icon) {
	return;
}

if (input.type === "password") {

	input.type = "text";

	icon.classList.remove("fa-eye");

	icon.classList.add("fa-eye-slash");

} else {

	input.type = "password";

	icon.classList.remove("fa-eye-slash");

	icon.classList.add("fa-eye");

}


}

function showMessage(text, type) {


const message =
	document.getElementById("adminLoginMessage");

if (!message) {
	return;
}

message.className =
	"alert alert-" + type;

message.textContent = text;

message.classList.remove("d-none");


}
