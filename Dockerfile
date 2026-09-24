# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Convert CRLF to LF in case of Windows line endings and make executable
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw
# Download dependencies first (cache step)
RUN ./mvnw dependency:go-offline || true

# Copy the rest of the source code and build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Make the uploads directory in case it needs to store files locally
RUN mkdir -p /app/uploads/destinations
RUN chmod 777 /app/uploads/destinations

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
