<%@ page contentType="text/html;charset=UTF-8" language="java"%>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>TravelAI - Travel Recommendation System</title>


<!-- Bootstrap -->
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet">


<!-- Font Awesome -->
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


<!-- Google Font -->
<link
	href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
	rel="stylesheet">

<link rel="stylesheet" href="css/index.css">

</head>


<body>



	<!-- NAVBAR -->


	<nav class="navbar navbar-expand-lg">


		<div class="container">


			<a class="navbar-brand" href="index.jsp"> <i
				class="fa-solid fa-earth-americas"></i> TravelAI

			</a>



			<button class="navbar-toggler" data-bs-toggle="collapse"
				data-bs-target="#menu">


				<span class="navbar-toggler-icon"></span>


			</button>



			<div class="collapse navbar-collapse" id="menu">


				<ul class="navbar-nav ms-auto align-items-center gap-2">
					<li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
					<li class="nav-item"><a class="nav-link" href="#popular">Destinations</a></li>
					<li class="nav-item"><a class="nav-link" href="#about">About</a></li>
					<li class="nav-item"><a class="nav-link" href="#faq">FAQ</a></li>
					<li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
					<li class="nav-item d-flex align-items-center gap-2 ms-lg-2" id="navAuthContainer">
						<a href="login.jsp" class="btn btn-outline-primary btn-login px-3">Login</a>
						<a href="register.jsp" class="btn btn-primary btn-register px-3">Register</a>
					</li>
				</ul>


			</div>


		</div>


	</nav>

	<!-- ================= HERO ================= -->

	<section class="hero" id="home">

		<div class="container">

			<div class="row align-items-center">

				<div class="col-lg-7">

					<div class="hero-content">

						<h1>
							Discover Your Next <span>Dream Vacation</span>
						</h1>

						<p>Explore thousands of destinations with AI-powered travel
							recommendations. Find the perfect trip based on your budget,
							interests, season, and travel style.</p>


						<div class="hero-btn">

							<a href="recommendation.jsp" class="btn btn-warning btn-lg auth-gate-btn" data-target="recommendation.jsp">
								<i class="fa-solid fa-magnifying-glass"></i> Explore Now
							</a> <a href="#popular" class="btn btn-outline-light btn-lg">
								View Destinations </a>

						</div>



						<!-- Search Card -->

						<div class="search-card mt-4">

							<form id="homeSearchForm" action="recommendation.jsp">


								<div class="row g-3">


									<div class="col-md-4">

										<label class="form-label"> Destination </label> <input
											type="text" name="destination" class="form-control"
											placeholder="Goa">

									</div>




									<div class="col-md-4">

										<label class="form-label"> Budget </label> <select
											name="budget" class="form-select">


											<option value="">Select Budget</option>


											<option>₹5,000 - ₹10,000</option>


											<option>₹10,000 - ₹25,000</option>


											<option>₹25,000 - ₹50,000</option>


											<option>Above ₹50,000</option>


										</select>

									</div>






									<div class="col-md-4">

										<label class="form-label"> Season </label> <select
											name="season" class="form-select">


											<option value="">Select Season</option>


											<option>Summer</option>


											<option>Winter</option>


											<option>Monsoon</option>


										</select>


									</div>






									<div class="col-md-12 mt-3">


										<button type="submit" class="btn btn-primary search-btn w-100">


											<i class="fa-solid fa-plane-departure"></i> Find My Perfect
											Trip


										</button>


									</div>


								</div>


							</form>


						</div>

						<!-- Search Card End -->



					</div>


				</div>


			</div>





			<!-- Floating Cards -->


			<div class="float-card card1">

				<i class="fa-solid fa-location-dot"></i>

				<h5>500+ Places</h5>

				<p>Explore worldwide destinations</p>

			</div>





			<div class="float-card card2">

				<i class="fa-solid fa-star"></i>

				<h5>4.9 Rating</h5>

				<p>Loved by travelers</p>

			</div>


		</div>


	</section>
	<!-- ================= STATISTICS ================= -->


	<section class="py-5">

		<div class="container">


			<div class="row text-center g-4">


				<div class="col-lg-3 col-md-6">


					<div class="p-4">


						<h1 class="fw-bold text-primary">10K+</h1>


						<p>Happy Travelers</p>


					</div>


				</div>



				<div class="col-lg-3 col-md-6">


					<div class="p-4">


						<h1 class="fw-bold text-primary">500+</h1>


						<p>Amazing Destinations</p>


					</div>


				</div>




				<div class="col-lg-3 col-md-6">


					<div class="p-4">


						<h1 class="fw-bold text-primary">150+</h1>


						<p>Travel Packages</p>


					</div>


				</div>




				<div class="col-lg-3 col-md-6">


					<div class="p-4">


						<h1 class="fw-bold text-primary">4.9★</h1>


						<p>Customer Rating</p>


					</div>


				</div>



			</div>


		</div>


	</section>





	<!-- ================= FEATURES ================= -->


	<section class="py-5 bg-light" id="about">


		<div class="container">


			<div class="section-title">


				<h2>Why Choose TravelAI?</h2>


				<p>We make your journey simple, smart and memorable</p>


			</div>




			<div class="row g-4">



				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow p-4 text-center h-100">


						<div class="mb-3">


							<i class="fa-solid fa-brain fa-3x text-primary"></i>


						</div>


						<h4>Smart Recommendations</h4>


						<p>Our intelligent system suggests destinations according to
							your budget, season and interests.</p>


					</div>


				</div>




				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow p-4 text-center h-100">


						<div class="mb-3">


							<i class="fa-solid fa-shield-halved fa-3x text-primary"></i>


						</div>


						<h4>Safe & Secure</h4>


						<p>Enjoy secure booking, trusted places and verified travel
							information.</p>


					</div>


				</div>





				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow p-4 text-center h-100">


						<div class="mb-3">


							<i class="fa-solid fa-clock fa-3x text-primary"></i>


						</div>


						<h4>Save Your Time</h4>


						<p>Get personalized travel plans without spending hours
							searching.</p>


					</div>


				</div>



				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow p-4 text-center h-100">


						<div class="mb-3">


							<i class="fa-solid fa-map-location-dot fa-3x text-primary"></i>


						</div>


						<h4>Hidden Locations</h4>


						<p>Discover beautiful places that are less crowded and unique.

						</p>


					</div>


				</div>





				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow p-4 text-center h-100">


						<div class="mb-3">


							<i class="fa-solid fa-comments fa-3x text-primary"></i>


						</div>


						<h4>Travel Support</h4>


						<p>Get assistance before, during and after your trip.</p>


					</div>


				</div>





				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow p-4 text-center h-100">


						<div class="mb-3">


							<i class="fa-solid fa-earth-americas fa-3x text-primary"></i>


						</div>


						<h4>Worldwide Experience</h4>


						<p>Explore destinations from mountains to beaches worldwide.</p>


					</div>


				</div>



			</div>


		</div>


	</section>



	<!-- ================= CATEGORY SECTION ================= -->


	<section class="py-5">


		<div class="container">


			<div class="section-title">


				<h2>Explore By Category</h2>


				<p>Choose your travel style</p>


			</div>



			<div class="row g-4">



				<div class="col-md-3 col-sm-6">


					<div class="card text-center shadow border-0 p-4">


						<i class="fa-solid fa-umbrella-beach fa-3x text-warning mb-3"></i>


						<h5>Beach</h5>


						<p>Relax near oceans</p>


					</div>


				</div>





				<div class="col-md-3 col-sm-6">


					<div class="card text-center shadow border-0 p-4">


						<i class="fa-solid fa-mountain-sun fa-3x text-success mb-3"></i>


						<h5>Adventure</h5>


						<p>Mountains & trekking</p>


					</div>


				</div>





				<div class="col-md-3 col-sm-6">


					<div class="card text-center shadow border-0 p-4">


						<i class="fa-solid fa-city fa-3x text-danger mb-3"></i>


						<h5>City Tours</h5>


						<p>Explore modern cities</p>


					</div>


				</div>





				<div class="col-md-3 col-sm-6">


					<div class="card text-center shadow border-0 p-4">


						<i class="fa-solid fa-camera fa-3x text-info mb-3"></i>


						<h5>Photography</h5>


						<p>Beautiful landscapes</p>


					</div>


				</div>



			</div>


		</div>


	</section>
	<!-- ================= POPULAR DESTINATIONS ================= -->

	<section class="py-5" id="popular">

		<div class="container">


			<div class="section-title">

				<h2>Popular Destinations</h2>

				<p>Explore the most loved places by travelers</p>

			</div>



			<div class="row g-4">



				<!-- Goa -->

				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow-lg overflow-hidden">


						<div class="position-relative">


							<img
								src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80"
								class="img-fluid w-100"
								style="height: 280px; object-fit: cover;">


							<div class="position-absolute top-0 end-0 m-3">


								<span class="badge bg-warning text-dark p-2"> ⭐ 4.8 </span>


							</div>


						</div>


						<div class="card-body">


							<h4>Goa</h4>


							<p>Beautiful beaches, nightlife and water adventures.</p>


							<div class="d-flex justify-content-between">


								<strong> ₹18,000 </strong> <a href="recommendation.jsp" class="btn btn-primary rounded-pill auth-gate-btn" data-target="recommendation.jsp"> Explore </a>


							</div>


						</div>


					</div>


				</div>




				<!-- Manali -->


				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow-lg overflow-hidden">


						<div class="position-relative">


							<img
								src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
								class="img-fluid w-100"
								style="height: 280px; object-fit: cover;">



							<div class="position-absolute top-0 end-0 m-3">


								<span class="badge bg-warning text-dark p-2"> ⭐ 4.9 </span>


							</div>


						</div>


						<div class="card-body">


							<h4>Manali</h4>


							<p>Snow mountains, adventure and beautiful valleys.</p>


							<div class="d-flex justify-content-between">


								<strong> ₹25,000 </strong> <a href="recommendation.jsp" class="btn btn-primary rounded-pill auth-gate-btn" data-target="recommendation.jsp"> Explore </a>


							</div>


						</div>


					</div>


				</div>





				<!-- Kerala -->


				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow-lg overflow-hidden">


						<div class="position-relative">


							<img
								src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80"
								class="img-fluid w-100"
								style="height: 280px; object-fit: cover;">



							<div class="position-absolute top-0 end-0 m-3">


								<span class="badge bg-warning text-dark p-2"> ⭐ 4.7 </span>


							</div>


						</div>


						<div class="card-body">


							<h4>Kerala</h4>


							<p>Backwaters, nature and peaceful experiences.</p>


							<div class="d-flex justify-content-between">


								<strong> ₹22,000 </strong> <a href="recommendation.jsp" class="btn btn-primary rounded-pill auth-gate-btn" data-target="recommendation.jsp"> Explore </a>


							</div>


						</div>


					</div>


				</div>




				<!-- Kashmir -->


				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow-lg overflow-hidden">


						<img
							src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
							class="img-fluid" style="height: 280px; object-fit: cover;">



						<div class="card-body">


							<h4>Kashmir</h4>


							<p>Paradise on Earth with beautiful valleys.</p>


							<div class="d-flex justify-content-between">


								<strong> ₹35,000 </strong> <a href="recommendation.jsp" class="btn btn-primary rounded-pill auth-gate-btn" data-target="recommendation.jsp"> Explore </a>


							</div>


						</div>


					</div>


				</div>






				<!-- Ladakh -->


				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow-lg overflow-hidden">


						<img
							src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
							class="img-fluid" style="height: 280px; object-fit: cover;">



						<div class="card-body">


							<h4>Leh Ladakh</h4>


							<p>Adventure roads and mountain landscapes.</p>


							<div class="d-flex justify-content-between">


								<strong> ₹40,000 </strong> <a href="recommendation.jsp" class="btn btn-primary rounded-pill auth-gate-btn" data-target="recommendation.jsp"> Explore </a>


							</div>


						</div>


					</div>


				</div>






				<!-- Rajasthan -->


				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow-lg overflow-hidden">


						<img
							src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"
							class="img-fluid" style="height: 280px; object-fit: cover;">



						<div class="card-body">


							<h4>Rajasthan</h4>


							<p>Royal culture, forts and heritage places.</p>


							<div class="d-flex justify-content-between">


								<strong> ₹20,000 </strong> <a href="recommendation.jsp" class="btn btn-primary rounded-pill auth-gate-btn" data-target="recommendation.jsp"> Explore </a>


							</div>


						</div>


					</div>


				</div>




			</div>


		</div>


	</section>






	<!-- ================= TRAVEL PACKAGES ================= -->


	<section class="py-5 bg-light">


		<div class="container">


			<div class="section-title">


				<h2>Trending Packages</h2>


				<p>Best travel packages selected for you</p>


			</div>




			<div class="row g-4">



				<div class="col-lg-4">


					<div class="card border-0 shadow h-100">


						<div class="card-body p-4">


							<h3>Goa Premium Trip</h3>


							<div class="text-warning mb-3">★★★★★</div>


							<ul class="list-unstyled">


								<li><i class="fa-solid fa-calendar text-primary"></i> 4
									Days / 3 Nights</li>


								<li><i class="fa-solid fa-hotel text-primary"></i> Luxury
									Hotel</li>


								<li><i class="fa-solid fa-utensils text-primary"></i> Food
									Included</li>


								<li><i class="fa-solid fa-car text-primary"></i> Transport
									Included</li>


							</ul>


							<h4 class="text-primary">₹18,999</h4>


							<a href="booking.jsp" class="btn btn-primary rounded-pill w-100 auth-gate-btn" data-target="booking.jsp"> Book Now </a>


						</div>


					</div>


				</div>





				<div class="col-lg-4">


					<div class="card border-0 shadow h-100">


						<div class="card-body p-4">


							<h3>Manali Adventure</h3>


							<div class="text-warning mb-3">★★★★★</div>


							<ul class="list-unstyled">


								<li><i class="fa-solid fa-calendar text-primary"></i> 5
									Days / 4 Nights</li>


								<li><i class="fa-solid fa-person-hiking text-primary"></i>
									Adventure Activities</li>


								<li><i class="fa-solid fa-hotel text-primary"></i> Mountain
									Resort</li>


								<li><i class="fa-solid fa-camera text-primary"></i>
									Sightseeing</li>


							</ul>


							<h4 class="text-primary">₹26,999</h4>


							<a href="booking.jsp" class="btn btn-primary rounded-pill w-100 auth-gate-btn" data-target="booking.jsp"> Book Now </a>


						</div>


					</div>


				</div>





				<div class="col-lg-4">


					<div class="card border-0 shadow h-100">


						<div class="card-body p-4">


							<h3>Kerala Relax Tour</h3>


							<div class="text-warning mb-3">★★★★★</div>


							<ul class="list-unstyled">


								<li><i class="fa-solid fa-calendar text-primary"></i> 6
									Days / 5 Nights</li>


								<li><i class="fa-solid fa-water text-primary"></i> House
									Boat Stay</li>


								<li><i class="fa-solid fa-camera text-primary"></i> Nature
									Tour</li>


								<li><i class="fa-solid fa-utensils text-primary"></i>
									Traditional Food</li>


							</ul>


							<h4 class="text-primary">₹30,999</h4>


							<a href="booking.jsp" class="btn btn-primary rounded-pill w-100 auth-gate-btn" data-target="booking.jsp"> Book Now </a>


						</div>


					</div>


				</div>


			</div>


		</div>


	</section>
	<!-- ================= CUSTOMER REVIEWS ================= -->

	<section class="py-5">

		<div class="container">


			<div class="section-title">

				<h2>What Our Travelers Say</h2>

				<p>Thousands of happy travelers trust us</p>

			</div>



			<div class="row g-4">


				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow p-4 h-100">


						<div class="text-warning mb-3">★★★★★</div>


						<p>"TravelAI made my vacation planning extremely easy. The
							recommendation was perfect according to my budget."</p>


						<div class="d-flex align-items-center mt-3">


							<img src="https://randomuser.me/api/portraits/men/32.jpg"
								width="55" height="55" class="rounded-circle">


							<div class="ms-3">

								<h6 class="mb-0">Rahul Sharma</h6>

								<small> Mumbai, India </small>

							</div>


						</div>


					</div>


				</div>





				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow p-4 h-100">


						<div class="text-warning mb-3">★★★★★</div>


						<p>"I found amazing destinations which I never knew before.
							The personalized suggestions were awesome."</p>


						<div class="d-flex align-items-center mt-3">


							<img src="https://randomuser.me/api/portraits/women/44.jpg"
								width="55" height="55" class="rounded-circle">


							<div class="ms-3">

								<h6 class="mb-0">Priya Patel</h6>

								<small> Pune, India </small>

							</div>


						</div>


					</div>


				</div>






				<div class="col-lg-4 col-md-6">


					<div class="card border-0 shadow p-4 h-100">


						<div class="text-warning mb-3">★★★★★</div>


						<p>"The booking process was simple and the travel package was
							worth every penny."</p>


						<div class="d-flex align-items-center mt-3">


							<img src="https://randomuser.me/api/portraits/men/76.jpg"
								width="55" height="55" class="rounded-circle">


							<div class="ms-3">

								<h6 class="mb-0">Amit Verma</h6>

								<small> Delhi, India </small>

							</div>


						</div>


					</div>


				</div>


			</div>


		</div>


	</section>






	<!-- ================= TRAVEL GALLERY ================= -->


	<section class="py-5 bg-light">


		<div class="container">


			<div class="section-title">

				<h2>Travel Gallery</h2>

				<p>Explore beautiful moments from around the world</p>


			</div>




			<div class="row g-3">


				<div class="col-lg-4 col-md-6">


					<img
						src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
						class="img-fluid rounded shadow"
						style="height: 300px; width: 100%; object-fit: cover;">


				</div>



				<div class="col-lg-4 col-md-6">


					<img
						src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
						class="img-fluid rounded shadow"
						style="height: 300px; width: 100%; object-fit: cover;">


				</div>




				<div class="col-lg-4 col-md-6">


					<img
						src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1"
						class="img-fluid rounded shadow"
						style="height: 300px; width: 100%; object-fit: cover;">


				</div>




				<div class="col-lg-4 col-md-6">


					<img
						src="https://images.unsplash.com/photo-1548013146-72479768bada"
						class="img-fluid rounded shadow"
						style="height: 300px; width: 100%; object-fit: cover;">


				</div>




				<div class="col-lg-4 col-md-6">


					<img
						src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
						class="img-fluid rounded shadow"
						style="height: 300px; width: 100%; object-fit: cover;">


				</div>




				<div class="col-lg-4 col-md-6">


					<img
						src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
						class="img-fluid rounded shadow"
						style="height: 300px; width: 100%; object-fit: cover;">


				</div>


			</div>


		</div>


	</section>







	<!-- ================= FAQ ================= -->


	<section class="py-5">


		<div class="container">


			<div class="section-title">


				<h2>Frequently Asked Questions</h2>


				<p>Everything you need to know before travelling</p>


			</div>





			<div class="accordion" id="faq">



				<div class="accordion-item">


					<h2 class="accordion-header">


						<button class="accordion-button" data-bs-toggle="collapse"
							data-bs-target="#one">How does Travel Recommendation
							work?</button>


					</h2>


					<div id="one" class="accordion-collapse collapse show"
						data-bs-parent="#faq">


						<div class="accordion-body">Our system recommends
							destinations based on your budget, preferred season, location and
							interests.</div>


					</div>


				</div>







				<div class="accordion-item">


					<h2 class="accordion-header">


						<button class="accordion-button collapsed"
							data-bs-toggle="collapse" data-bs-target="#two">Can I
							customize my travel package?</button>


					</h2>


					<div id="two" class="accordion-collapse collapse"
						data-bs-parent="#faq">


						<div class="accordion-body">Yes, users can select
							destinations, duration, budget and activities according to their
							needs.</div>


					</div>


				</div>







				<div class="accordion-item">


					<h2 class="accordion-header">


						<button class="accordion-button collapsed"
							data-bs-toggle="collapse" data-bs-target="#three">Is
							online booking secure?</button>


					</h2>


					<div id="three" class="accordion-collapse collapse"
						data-bs-parent="#faq">


						<div class="accordion-body">Yes, all booking information is
							securely managed through our platform.</div>


					</div>


				</div>






				<div class="accordion-item">


					<h2 class="accordion-header">


						<button class="accordion-button collapsed"
							data-bs-toggle="collapse" data-bs-target="#four">Can I
							cancel my booking?</button>


					</h2>


					<div id="four" class="accordion-collapse collapse"
						data-bs-parent="#faq">


						<div class="accordion-body">Cancellation depends on the
							selected package and booking policy.</div>


					</div>


				</div>




			</div>


		</div>


	</section>
	<!-- ================= NEWSLETTER ================= -->

	<section class="py-5 bg-primary text-white" id="contact">

		<div class="container text-center">


			<h2 class="fw-bold">Subscribe For Travel Updates</h2>


			<p class="mb-4">Get latest destinations, offers and travel
				packages directly in your inbox.</p>



			<div class="row justify-content-center">


				<div class="col-lg-6">


					<div class="input-group">


						<input type="email" class="form-control form-control-lg"
							placeholder="Enter your email">


						<button class="btn btn-warning px-4">Subscribe</button>


					</div>


				</div>


			</div>


		</div>


	</section>






	<!-- ================= FOOTER ================= -->

	<footer class="bg-dark text-white pt-5 pb-3">


		<div class="container">


			<div class="row g-4">



				<div class="col-lg-4">


					<h3 class="fw-bold">

						<i class="fa-solid fa-earth-asia"></i> TravelAI

					</h3>


					<p>Discover amazing destinations with personalized travel
						recommendations. Plan your perfect journey with us.</p>



					<div>


						<a href="#" class="text-white fs-4 me-3"> <i
							class="fa-brands fa-facebook"></i>

						</a> <a href="#" class="text-white fs-4 me-3"> <i
							class="fa-brands fa-instagram"></i>

						</a> <a href="#" class="text-white fs-4 me-3"> <i
							class="fa-brands fa-twitter"></i>

						</a> <a href="#" class="text-white fs-4"> <i
							class="fa-brands fa-linkedin"></i>

						</a>


					</div>


				</div>






				<div class="col-lg-2 col-md-6">


					<h5>Quick Links</h5>


					<ul class="list-unstyled">


						<li class="mb-2"><a href="#"
							class="text-white text-decoration-none"> Home </a></li>


						<li class="mb-2"><a href="#"
							class="text-white text-decoration-none"> Destinations </a></li>


						<li class="mb-2"><a href="#"
							class="text-white text-decoration-none"> Packages </a></li>


						<li class="mb-2"><a href="#"
							class="text-white text-decoration-none"> About </a></li>


					</ul>


				</div>






				<div class="col-lg-3 col-md-6">


					<h5>Services</h5>


					<ul class="list-unstyled">


						<li class="mb-2"><i class="fa-solid fa-plane"></i> Flight
							Booking</li>


						<li class="mb-2"><i class="fa-solid fa-hotel"></i> Hotel
							Booking</li>


						<li class="mb-2"><i class="fa-solid fa-map"></i> Tour
							Packages</li>


						<li class="mb-2"><i class="fa-solid fa-headset"></i> 24/7
							Support</li>


					</ul>


				</div>






				<div class="col-lg-3">


					<h5>Contact Us</h5>


					<p>

						<i class="fa-solid fa-location-dot"></i> Pune, Maharashtra

					</p>


					<p>

						<i class="fa-solid fa-phone"></i> +91 9876543210

					</p>


					<p>

						<i class="fa-solid fa-envelope"></i> support@travelai.com

					</p>


				</div>



			</div>



			<hr class="mt-4">



			<div class="text-center">


				<p class="mb-0">© 2026 TravelAI. All Rights Reserved.</p>


			</div>


		</div>


	</footer>


	<button id="topBtn" class="btn btn-primary rounded-circle">


		<i class="fa-solid fa-arrow-up"></i>


	</button>


	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

	<!-- Authentication Required Modal -->
	<div class="modal fade" id="authRequiredModal" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content border-0 shadow-lg" style="border-radius: 20px; overflow: hidden;">
				<div class="modal-header border-0 bg-primary text-white p-4">
					<h5 class="modal-title fw-bold" id="authModalLabel">
						<i class="fa-solid fa-lock me-2 text-warning"></i> Sign In to Explore
					</h5>
					<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body p-4 text-center">
					<div class="mb-3">
						<div style="width: 70px; height: 70px; margin: 0 auto; background: rgba(13, 110, 253, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
							<i class="fa-solid fa-compass fa-2x text-primary"></i>
						</div>
					</div>
					<h5 class="fw-bold mb-2">Welcome to TravelAI</h5>
					<p class="text-muted mb-4">
						To explore AI-powered personalized recommendations, view destinations, and book your dream vacation, please log in to your account or register a new account.
					</p>
					<div class="d-grid gap-2">
						<a href="login.jsp?msg=auth_required" id="authModalLoginLink" class="btn btn-primary btn-lg rounded-pill py-2 fw-semibold">
							<i class="fa-solid fa-right-to-bracket me-2"></i> Log In
						</a>
						<a href="register.jsp" class="btn btn-outline-primary btn-lg rounded-pill py-2 fw-semibold">
							<i class="fa-solid fa-user-plus me-2"></i> Register New Account
						</a>
					</div>
				</div>
				<div class="modal-footer border-0 bg-light justify-content-center py-3">
					<small class="text-muted">Takes less than 1 minute to create an account!</small>
				</div>
			</div>
		</div>
	</div>

	<script src="js/index.js"></script>




</body>

</html>
