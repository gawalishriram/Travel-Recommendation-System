# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml ./
# We don't have mvnw in this folder, so we'll install maven
RUN apk add --no-cache maven
RUN mvn dependency:go-offline || true

COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# The frontend uses Spring Boot embedded tomcat so we can still run the WAR via java -jar
COPY --from=builder /app/target/*.war app.war

EXPOSE 8080
# Force Spring Boot to use a different port if needed (so it doesn't clash if run locally)
ENV SERVER_PORT=8080 
ENTRYPOINT ["java", "-jar", "app.war"]
