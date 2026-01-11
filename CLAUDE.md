# Pa-Pa Baby Shop E-commerce Project

## Project Summary
Building a modern e-commerce store for **Pa-Pa** - a Bulgarian baby shop.

## Key Decisions Made
- **Backend**: Spring Boot 3.2 REST API (Java 21)
- **Frontend**: Next.js + React 19 + Tailwind CSS
- **Database**: PostgreSQL on Railway
- **Image Hosting**: Cloudflare R2 (planned)
- **Card Payments**: ProCredit Bank vPOS (target 0.5% fee)
- **Other Payments**: COD (0%) + Bank transfer (0%)
- **Shipping**: Speedy or Econt (whichever offers better rates)
- **Products**: 10,000+ via custom API sync from supplier
- **Monthly Cost**: ~$10-15/mo
- **Timeline**: 5-6 weeks

## Technical Stack
- **Backend**: Spring Boot 3.2.1 (Java 21)
- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Database**: PostgreSQL on Railway
- **Authentication**: JWT
- **API Documentation**: SpringDoc OpenAPI (Swagger)

## Project Structure
```
C:\PaPa\
├── papa-api/                    # Spring Boot backend
│   ├── src/main/java/bg/papa/
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # JPA repositories
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Request/Response DTOs
│   │   ├── config/              # Security, CORS config
│   │   └── security/            # JWT authentication
│   └── src/main/resources/
│       └── application.yml      # Configuration
├── papa-store-storefront/       # Next.js frontend
│   └── src/
│       └── design-system/       # Custom design system
└── CLAUDE.md                    # This file
```

## Development URLs
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs
- **Frontend**: http://localhost:3000

## API Endpoints
### Public
- `GET /api/health` - Health check
- `GET /api/products` - List products (paginated)
- `GET /api/products/{handle}` - Get product by handle
- `GET /api/categories` - List categories
- `POST /api/cart` - Create cart
- `POST /api/auth/register` - Register customer
- `POST /api/auth/login` - Login

### Protected (JWT required)
- `GET /api/customers/me` - Get current customer
- `GET /api/orders` - List customer orders

### Admin (ADMIN role required)
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `POST /api/admin/sync/products` - Trigger supplier sync

## Database
- **Provider**: Railway PostgreSQL
- **Connection**: jdbc:postgresql://shuttle.proxy.rlwy.net:35983/railway
- **Local Config**: papa-api/src/main/resources/application-local.yml

## Current Status
- [x] Spring Boot project created
- [x] Railway PostgreSQL connected
- [x] JPA entities defined (Product, Category, Cart, Order, Customer)
- [x] JWT authentication configured
- [x] Product API working
- [x] Health endpoint working
- [ ] Cart and Checkout APIs
- [ ] Customer registration/login
- [ ] Bulgarian settings (BGN, 20% VAT)
- [ ] Supplier API integration
- [ ] Payment integration (ProCredit vPOS)
- [ ] Shipping integration (Speedy/Econt)
- [ ] Connect frontend to Spring Boot API
- [ ] Deploy to Railway

## Design System
Location: `papa-store-storefront/src/design-system/`

### Color Palette
- Primary: Soft Coral Pink (#FF6B52)
- Secondary: Baby Blue (#0EA5E9)
- Accent: Mint (#14B8A6), Sunny Yellow (#EAB308), Lavender (#A855F7), Peach (#F97316)
- Neutrals: Warm Gray tones

### Typography
- Display Font: Nunito (playful, rounded)
- Body Font: Poppins (readable)

## Bulgarian Specifics
- Currency: BGN (лв)
- Tax: 20% VAT (ДДС)
- Language: Bulgarian
- COD is critical (60-70% of BG customers use it)
- Legal: GDPR + 14-day return policy

## Commands
```bash
# Start Spring Boot backend (requires Java 21)
cd papa-api
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.9.10-hotspot
mvn spring-boot:run -Dspring-boot.run.profiles=local

# Start Next.js frontend
cd papa-store-storefront
npm run dev
```

## Deployment
- **Backend**: Railway (auto-detects Java)
- **Frontend**: Vercel or Railway
- **Database**: Railway PostgreSQL (already configured)
