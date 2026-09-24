# Travel Recommendation System

A full-stack AI-powered travel recommendation and management platform.

## Project Structure

`
Travel-Recommendation-System/
+-- TravelRecommendationSystem/   # Frontend (JSP + Maven Tomcat)
+-- TravelManagementSystem/       # Backend (Spring Boot REST API)
`

## Frontend - TravelRecommendationSystem

Built with JSP, Bootstrap 5, and Vanilla JS. Served via Apache Tomcat.

### Run
`
cd TravelRecommendationSystem
mvn tomcat7:run
`
Access at: http://localhost:8090

## Backend - TravelManagementSystem

Built with Spring Boot 4, Spring Security, JWT, JPA/Hibernate, MySQL.

### Prerequisites
- Java 21+, MySQL 8.x on port 3306
- Create database: travel

### Run
`
cd TravelManagementSystem
./mvnw spring-boot:run
`
API at: http://localhost:8080

### Default Admin Credentials
- admin@travelai.com / admin123
- admin@gmail.com / admin123

## Tech Stack
- Frontend: JSP, Bootstrap 5, JavaScript
- Backend: Spring Boot 4, Spring Security
- Auth: JWT
- Database: MySQL 8 + Hibernate JPA
- Email: JavaMail (Gmail SMTP)
- Build: Maven

## Author
Shriram Gawali - github.com/gawalishriram
