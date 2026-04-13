# University Equipment Booking System

A web service for online booking of university equipment (laboratory devices, computers, projectors, etc.).

## 🚀 Quick Deploy to Railway

Deploy this application to Railway in minutes:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
```bash
# Using Railway CLI
./deploy-railway.sh
```

## Technology Stack

- **Backend**: Java 17+ with Spring Boot 3.2
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **Build Tool**: Maven
- **Security**: JWT authentication with Spring Security
- **API Documentation**: OpenAPI/Swagger

## Features

- User registration and authentication (JWT)
- Equipment management (CRUD operations)
- Equipment booking with conflict detection
- Role-based access control (Student, Professor, Admin)
- Booking approval/rejection workflow
- RESTful API with Swagger documentation

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Java 17+ (for local development)
- Maven 3.8+ (for local development)

### Running with Docker Compose

1. **Clone the repository** (if not already done)

2. **Create environment file** (optional, defaults are provided):
   ```bash
   cp .env.example .env
   ```

3. **Build and start the application**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - PostgreSQL: localhost:5432
   - PGAdmin (optional): http://localhost:8081

### Running with PGAdmin (optional)

```bash
docker-compose --profile tools up --build
```

## Default Credentials

The application comes with sample users for testing:

| Username    | Password   | Role      |
|-------------|------------|-----------|
| student1    | password   | STUDENT   |
| professor1  | password   | PROFESSOR |
| admin       | password   | ADMIN     |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login` | Login and get JWT token |
| POST   | `/api/auth/refresh` | Refresh JWT token |

### Equipment

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | `/api/equipment` | Get all equipment | Auth |
| GET    | `/api/equipment/{id}` | Get equipment by ID | Auth |
| GET    | `/api/equipment/available` | Get available equipment | Auth |
| POST   | `/api/equipment` | Create equipment | Admin |
| PUT    | `/api/equipment/{id}` | Update equipment | Admin |
| DELETE | `/api/equipment/{id}` | Delete equipment | Admin |

### Bookings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | `/api/bookings` | Get user's bookings | Auth |
| GET    | `/api/bookings/{id}` | Get booking by ID | Auth |
| POST   | `/api/bookings` | Create new booking | Auth |
| POST   | `/api/bookings/{id}/cancel` | Cancel booking | Auth |
| GET    | `/api/bookings/equipment/{id}` | Get equipment bookings | Auth |
| PUT    | `/api/bookings/{id}/status` | Update booking status | Admin/Professor |

### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | `/api/admin/users` | Get all users | Admin |
| GET    | `/api/admin/bookings` | Get all bookings | Admin |
| PUT    | `/api/admin/users/{id}/role` | Update user role | Admin |

### User

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | `/api/me` | Get current user info | Auth |

## API Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newstudent",
    "email": "student@university.edu",
    "password": "password123",
    "department": "Computer Science"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "password"
  }'
```

### Create a booking (with JWT token)

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "equipmentId": 1,
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T12:00:00Z",
    "purpose": "Lab experiment"
  }'
```

### Get available equipment for a date range

```bash
curl -X GET "http://localhost:8080/api/equipment/available?startTime=2024-01-15T00:00:00Z&endTime=2024-01-16T00:00:00Z" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Local Development

### Build and run locally

```bash
# Start PostgreSQL with Docker
docker-compose up -d db

# Build the application
mvn clean package

# Run the application
mvn spring-boot:run
```

### Run tests

```bash
mvn test
```

## Project Structure

```
univer_booking/
├── docker-compose.yml              # Local development with Docker
├── docker-compose.railway.yml      # Railway-like environment setup
├── Dockerfile                      # Multi-stage build for Railway
├── railway.json                    # Railway deployment configuration
├── deploy-railway.sh               # Railway deployment helper script
├── RAILWAY_DEPLOYMENT.md           # Detailed Railway deployment guide
├── pom.xml
├── .env.example
├── src/
│   ├── main/
│   │   ├── java/com/univer/booking/
│   │   │   ├── config/             # Configuration classes
│   │   │   │   └── RailwayConfig.java  # Railway DATABASE_URL parser
│   │   │   ├── controller/         # REST controllers
│   │   │   ├── dto/                # Data Transfer Objects
│   │   │   ├── exception/          # Exception handling
│   │   │   ├── model/              # JPA entities
│   │   │   ├── repository/         # Data access layer
│   │   │   ├── security/           # JWT security
│   │   │   └── service/            # Business logic
│   │   └── resources/
│   │       ├── db/migration/       # Flyway migrations
│   │       └── application.yml
│   └── test/
└── README.md
```

## Deployment

### Deploy to Railway (Recommended)

The application is fully configured for one-click deployment to Railway:

1. **Automatic Database Setup**: Railway provides PostgreSQL automatically
2. **Environment Variables**: The application parses Railway's `DATABASE_URL` 
3. **Health Checks**: Built-in Docker health checks for monitoring
4. **Frontend Bundling**: React frontend is bundled with the backend JAR

See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for complete instructions.

**Quick start:**
```bash
./deploy-railway.sh
```

### Local Development

See the original sections above for local development instructions.

## Database Schema

The application uses Flyway for database migrations:

- **V1**: Users table
- **V2**: Equipment and Equipment Categories tables
- **V3**: Bookings table
- **V4**: Sample data

## Configuration

Key configuration options in `application.yml`:

| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Application port | 8080 |
| `jwt.secret` | JWT signing secret | (change in production!) |
| `jwt.expiration` | JWT token expiration (ms) | 86400000 (24h) |
| `spring.datasource.*` | Database connection | postgres@localhost:5432 |

## Troubleshooting

### Port already in use

If port 8080 or 5432 is already in use, modify the `.env` file:

```env
APP_PORT=8081
DB_PORT=5433
```

### Database connection issues

Ensure PostgreSQL container is healthy:

```bash
docker-compose ps
docker-compose logs db
```

### JWT authentication issues

Make sure to include the Bearer token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## License

MIT License - see LICENSE file for details.
