# Pa-Pa Baby Shop API

Spring Boot REST API for the Pa-Pa Bulgarian baby shop e-commerce platform.

## Tech Stack

- **Framework**: Spring Boot 3.2
- **Language**: Java 21
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT
- **API Documentation**: SpringDoc OpenAPI (Swagger)

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.9+
- PostgreSQL database (or Supabase account)

### Configuration

1. Copy environment variables:
```bash
cp src/main/resources/application.yml src/main/resources/application-local.yml
```

2. Update `application-local.yml` with your database credentials:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://your-host:5432/your-db
    username: your-username
    password: your-password
```

### Running Locally

```bash
# Run with Maven
./mvnw spring-boot:run

# Or with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### API Documentation

Once running, visit:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

## API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `GET /api/products` - List products
- `GET /api/products/{handle}` - Get product by handle
- `GET /api/categories` - List categories
- `POST /api/cart` - Create cart
- `POST /api/auth/register` - Register customer
- `POST /api/auth/login` - Login

### Protected Endpoints (require JWT)

- `GET /api/customers/me` - Get current customer
- `GET /api/orders` - List customer orders

### Admin Endpoints (require ADMIN role)

- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `POST /api/admin/sync/products` - Trigger supplier sync

## Deployment

### Railway

1. Connect GitHub repository to Railway
2. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ORIGINS`
3. Deploy!

### Docker

```bash
# Build image
docker build -t papa-api .

# Run container
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://... \
  -e JWT_SECRET=your-secret \
  papa-api
```

## License

Proprietary - Pa-Pa Baby Shop
