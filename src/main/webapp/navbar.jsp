<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
	<div class="container">
		<a class="navbar-brand" href="dashboard.jsp"><i
			class="fa-solid fa-plane"></i> Travel AI</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
			data-bs-target="#navbarMenu">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarMenu">
			<ul class="navbar-nav ms-auto">
				<li class="nav-item"><span class="nav-link text-warning"
					id="welcomeUser">Welcome</span></li>
				<li class="nav-item"><a class="nav-link" href="dashboard.jsp">Dashboard</a></li>
				<li class="nav-item"><a class="nav-link"
					href="recommendation.jsp">Recommendation</a></li>
				<li class="nav-item"><a class="nav-link" href="profile.jsp">Profile</a></li>
				<li class="nav-item"><a class="nav-link" href="favorites.jsp">Favorites</a></li>
				<li class="nav-item"><a href="#" class="nav-link text-danger"
					onclick="logoutUser();return false;">Logout</a></li>
			</ul>
		</div>
	</div>
</nav>
