# Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Build backend
FROM maven:3.9-eclipse-temurin-17 AS backend-builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests -q

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy backend jar
COPY --from=backend-builder /app/target/*.jar app.jar

# Copy frontend build to resources/static
COPY --from=frontend-builder /app/frontend/dist static/

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api-docs || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
