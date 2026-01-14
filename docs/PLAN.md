# E-commerce Implementation Plan: Pa-Pa Bulgarian Baby Shop

## Executive Summary

Building a modern e-commerce platform for a Bulgarian baby shop using **Spring Boot REST API** + **Next.js frontend**.

### Final Decision
- **Backend**: Spring Boot 3 (Java 21) REST API
- **Frontend**: Next.js (existing storefront, adapted)
- **Database**: Supabase PostgreSQL (free tier: 500MB, 2 projects)
- **Hosting**: Railway (backend $5-10/mo) + Vercel (frontend $0)
- **Total Cost**: $5-15/mo

### Why Supabase for Database?
- **Excellent dashboard** - Visual table editor, SQL editor
- **Free tier** - 500MB storage, sufficient for 10k products
- **Automatic backups** - Daily backups included
- **Good monitoring** - Query performance, storage usage
- **Standard PostgreSQL** - Works perfectly with Spring Data JPA
- **EU region available** - Low latency for Bulgaria

### Why Spring Boot?
- **User has extensive Java background** - fastest development path
- **30-60 second builds** - vs Medusa's 15-20 minutes
- **Enterprise-grade** - battle-tested, stable
- **Simple deployment** - Railway auto-detects Java
- **Excellent tooling** - IntelliJ IDEA, Spring ecosystem

### What Failed Previously
- **Medusa.js**: 15-20 minute rebuild times (admin dashboard compiles React app)
- **WooCommerce**: User rejected (doesn't want PHP/WordPress)

---

## Complete Options Analysis

### Category 1: Fully Managed Platforms

| Platform | Monthly Cost | Dev Time | Bulgarian Support | Verdict |
|----------|--------------|----------|-------------------|---------|
| **Shopify** | $39+ (2% fees) | 2-3 weeks | Limited (custom integrations needed) | Expensive, loses existing work |
| **BigCommerce** | $39+ | 3-4 weeks | Poor | Not recommended |
| **Squarespace** | $27-33 | 2 weeks | Poor, not for 10k products | Not suitable |
| **Wix** | $27+ | 2 weeks | Poor, performance issues | Not suitable |

### Category 2: Headless Commerce (Managed Backend)

| Platform | Monthly Cost | Dev Time | Bulgarian Support | Verdict |
|----------|--------------|----------|-------------------|---------|
| **Swell Commerce** | $99-500+ | 4-5 weeks | Custom integrations | Too expensive |
| **Commerce.js** | Variable | - | - | Company may have shut down - AVOID |
| **Vendure** | $10-20 | 5-6 weeks | Custom plugins needed | Good option, fast builds (~50s) |
| **Saleor Cloud** | $795/mo | 4-5 weeks | Custom plugins | Way too expensive |
| **Saleor Self-hosted** | $10-20 | 5-6 weeks | Custom plugins | Good, but Python stack |

### Category 3: Custom Backend Frameworks

| Framework | Monthly Cost | Dev Time | Build Time | Admin UI | Verdict |
|-----------|--------------|----------|------------|----------|---------|
| **Java + Spring Boot** | $10-20 | 8-12 weeks | 30-60s | NONE - build from scratch | NOT RECOMMENDED |
| **Node.js + Express** | $5-10 | 6-7 weeks | Instant | NONE - build from scratch | Viable but slow |
| **Python + Django** | $10-20 | 6-8 weeks | Instant | Built-in Django Admin | Good option |
| **Go (Golang)** | $5-10 | 8-10 weeks | Very fast | NONE | Wrong tool |
| **Ruby + Solidus** | $10-20 | 5-6 weeks | Moderate | Built-in | Ruby adds complexity |
| **.NET + nopCommerce** | $15-30 | 4-5 weeks | Moderate | Excellent | .NET infrastructure complexity |
| **PHP + Laravel/Bagisto** | $5-10 | 4-5 weeks | Instant | Excellent (Vue.js) | User rejected PHP |

### Category 4: Backend-as-a-Service + Next.js

| Option | Monthly Cost | Dev Time | Build Time | Deployments | Verdict |
|--------|--------------|----------|------------|-------------|---------|
| **Supabase + Next.js** | $0-25 | 5-6 weeks | 30-60s | 1 | Excellent option |
| **Firebase + Next.js** | $0-25 | 5-6 weeks | 30-60s | 1 | NoSQL = wrong for e-commerce |
| **PocketBase + Next.js** | $4-10 | 4-5 weeks | Instant | 2 | Cheapest, but SQLite limits |
| **Next.js API Routes Only** | $0-20 | 4-5 weeks | ~30s | 1 | **RECOMMENDED** |

---

## Why NOT Java + Spring Boot?

You asked about Java specifically. Here's the honest assessment:

### Java Advantages
- Enterprise-grade stability
- Strong typing catches errors at compile time
- Fast builds (30-60 seconds)
- Excellent for high-traffic applications

### Java Disadvantages (for this project)
- **No built-in admin UI** - must build everything from scratch
- **No e-commerce features** - Spring Boot is general-purpose
- **8-12 weeks development time** - rebuilding what frameworks provide free
- **Different language from frontend** - context switching
- **No plugin ecosystem** - ProCredit, Speedy, Econt all custom
- **Overkill for baby shop scale**

### Java Comparison

| What You Need | Medusa.js | Java/Spring Boot |
|---------------|-----------|------------------|
| Product catalog | Built-in | Build from scratch |
| Cart system | Built-in | Build from scratch |
| Checkout flow | Built-in | Build from scratch |
| Admin dashboard | Built-in | Build from scratch |
| Payment plugins | Plugin architecture | Build from scratch |
| Shipping plugins | Plugin architecture | Build from scratch |
| Development time | 6-8 weeks | 8-12 weeks |

**Verdict**: Java would take MORE time than Medusa.js while providing LESS functionality. The only thing Java solves is the build time issue, but there are better solutions.

---

## TOP 3 RECOMMENDATIONS

### #1: Next.js API Routes Only (RECOMMENDED)

**Why This is #1:**
- **Single codebase**: Frontend + API in one Next.js project
- **Single deployment**: Just deploy to Vercel
- **Uses your existing Neon PostgreSQL**: No migration needed
- **Fast builds**: ~30 seconds, not 15-20 minutes
- **$0-20/mo**: Fits your budget perfectly
- **4-5 weeks**: Fastest time to production

**Architecture:**
```
+--------------------------------------------------+
|              Next.js App (Vercel)                |
|  +----------------+    +---------------------+   |
|  |  Pages/App     |    |  API Routes         |   |
|  |  (Frontend)    |    |  /api/*             |   |
|  +----------------+    +---------------------+   |
+--------------------------------------------------+
                         |
              +----------v-----------+
              |   Neon PostgreSQL    |
              |   (Your existing DB) |
              +----------------------+
```

**Cost Breakdown:**
| Service | Cost |
|---------|------|
| Vercel | $0-20/mo |
| Neon PostgreSQL | $0 (free tier) |
| Cloudflare R2 (images) | $0 |
| **Total** | **$0-20/mo** |

---

### #2: Supabase + Next.js

**Why This is #2:**
- Built-in auth, real-time, storage
- Excellent admin dashboard (Supabase Studio)
- PostgreSQL with instant REST API
- Real-time subscriptions for inventory

**Cost:** $25/mo (Pro tier for production)

**Trade-off:** Slightly more expensive, adds Supabase dependency

---

### #3: Vendure (Self-Hosted)

**Why This is #3:**
- Modern TypeScript e-commerce framework
- Excellent admin dashboard included
- Fast builds (~50s with esbuild/Vite)
- Plugin architecture for Bulgarian integrations

**Cost:** $10-20/mo hosting

**Trade-off:** Learning NestJS, more complex than Next.js-only

---

## Final Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐
│    Next.js      │  REST   │  Spring Boot    │         │   Supabase   │
│   (Frontend)    │ ──────> │    (Backend)    │ ──────> │  PostgreSQL  │
│    Vercel       │   API   │    Railway      │   JPA   │              │
└─────────────────┘         └─────────────────┘         └──────────────┘
       $0/mo                     $5-10/mo                    $0/mo
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
              │ ProCredit │   │  Speedy   │   │ Supplier  │
              │   vPOS    │   │  /Econt   │   │    API    │
              └───────────┘   └───────────┘   └───────────┘
```

---

## Implementation Plan (5-6 Weeks)

### Week 1: Project Setup & Products

**Day 1-2: Spring Boot Setup**
- Create Spring Boot 3 project (start.spring.io)
- Configure dependencies (Web, JPA, Security, Validation)
- Connect to Supabase PostgreSQL
- Configure application.yml for dev/prod profiles

**Day 3-4: Entity Layer**
```java
// Core entities to create:
- Product, ProductVariant, Category
- Cart, CartItem
- Order, OrderItem
- Customer, Address
```

**Day 5: Product API**
```
GET  /api/products         - List (paginated, filtered, searchable)
GET  /api/products/{handle} - Single product
GET  /api/categories       - Category tree
```

### Week 2: Cart & Checkout

**Day 1-2: Cart System**
```
POST   /api/cart              - Create cart
GET    /api/cart/{id}         - Get cart
POST   /api/cart/{id}/items   - Add item
PATCH  /api/cart/{id}/items/{itemId} - Update quantity
DELETE /api/cart/{id}/items/{itemId} - Remove item
```

**Day 3-5: Checkout Flow**
```
POST  /api/checkout              - Create checkout from cart
PATCH /api/checkout/{id}/shipping - Set shipping
PATCH /api/checkout/{id}/payment  - Set payment method
POST  /api/checkout/{id}/complete - Complete order
```

### Week 3: Authentication & Customers

**Day 1-2: JWT Authentication**
- Spring Security configuration
- JWT token generation/validation
- Login/Register endpoints

**Day 3-4: Customer API**
```
POST /api/auth/register     - Register
POST /api/auth/login        - Login (returns JWT)
GET  /api/customers/me      - Get profile
PATCH /api/customers/me     - Update profile
GET  /api/customers/me/orders - Order history
```

**Day 5: Address Management**
```
GET    /api/customers/me/addresses     - List addresses
POST   /api/customers/me/addresses     - Add address
DELETE /api/customers/me/addresses/{id} - Remove
```

### Week 4: Bulgarian Integrations

**Day 1-2: ProCredit Bank vPOS**
```java
@RestController
@RequestMapping("/api/payments/procredit")
public class ProCreditController {
    @PostMapping("/init")     // Start payment
    @PostMapping("/webhook")  // Bank callback
    @GetMapping("/status/{id}") // Check status
}
```

**Day 3: Cash on Delivery**
```java
@PostMapping("/api/payments/cod")
// Mark order for COD, calculate COD fee
```

**Day 4-5: Speedy/Econt Shipping**
```java
@RestController
@RequestMapping("/api/shipping")
public class ShippingController {
    @PostMapping("/calculate")    // Get rates
    @GetMapping("/speedy/offices") // Pickup points
    @GetMapping("/econt/offices")  // Pickup points
    @PostMapping("/waybill")      // Generate waybill
}
```

### Week 5: Admin & Supplier Sync

**Day 1-2: Admin APIs**
```
GET    /api/admin/products       - List all
POST   /api/admin/products       - Create
PATCH  /api/admin/products/{id}  - Update
DELETE /api/admin/products/{id}  - Delete

GET    /api/admin/orders         - List all
PATCH  /api/admin/orders/{id}/status - Update status
POST   /api/admin/orders/{id}/ship   - Mark shipped
```

**Day 3-4: Supplier Sync**
```java
@Component
public class ProductSyncScheduler {
    @Scheduled(cron = "0 0 */4 * * *") // Every 4 hours
    public void syncStock() { }

    @Scheduled(cron = "0 0 2 * * *")   // 2 AM daily
    public void fullSync() { }
}
```

**Day 5: API Documentation**
- SpringDoc OpenAPI (Swagger UI)
- Available at `/swagger-ui.html`

### Week 6: Frontend Integration & Deploy

**Day 1-3: Connect Next.js to Spring Boot API**
- Replace Medusa SDK calls with fetch to Spring Boot
- Update data layer files
- Test all flows end-to-end

**Day 4-5: Deployment**
- Deploy Spring Boot to Railway
- Configure environment variables
- Final testing
- Go live!

---

## Technical Details

### Spring Boot Project Structure

```
papa-api/
├── src/main/java/bg/papa/
│   ├── PapaApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   └── JwtConfig.java
│   ├── controller/
│   │   ├── ProductController.java
│   │   ├── CartController.java
│   │   ├── CheckoutController.java
│   │   ├── AuthController.java
│   │   ├── PaymentController.java
│   │   ├── ShippingController.java
│   │   └── admin/AdminProductController.java
│   ├── service/
│   │   ├── ProductService.java
│   │   ├── CartService.java
│   │   ├── OrderService.java
│   │   └── SupplierSyncService.java
│   ├── repository/
│   │   ├── ProductRepository.java
│   │   ├── CartRepository.java
│   │   └── OrderRepository.java
│   ├── entity/
│   │   ├── Product.java
│   │   ├── Category.java
│   │   ├── Cart.java
│   │   ├── Order.java
│   │   └── Customer.java
│   ├── dto/
│   │   ├── request/
│   │   └── response/
│   ├── integration/
│   │   ├── ProCreditClient.java
│   │   ├── SpeedyClient.java
│   │   └── SupplierClient.java
│   └── scheduler/
│       └── ProductSyncScheduler.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   └── application-prod.yml
├── pom.xml
└── Dockerfile
```

### Database Schema (JPA Entities)

```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String handle;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String thumbnail;

    @Column(columnDefinition = "jsonb")
    private String images; // JSON array

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "compare_at_price", precision = 10, scale = 2)
    private BigDecimal compareAtPrice;

    @Column(unique = true)
    private String sku;

    private Integer stock = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductVariant> variants;

    private String supplierSku;
    private Boolean manualEntry = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String handle;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category parent;

    @OneToMany(mappedBy = "parent")
    private List<Category> children;

    @OneToMany(mappedBy = "category")
    private List<Product> products;
}

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String orderNumber; // PAP-000001

    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(columnDefinition = "jsonb")
    private String shippingAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 10, scale = 2)
    private BigDecimal shippingCost;

    @Column(precision = 10, scale = 2)
    private BigDecimal tax; // 20% VAT

    @Column(precision = 10, scale = 2)
    private BigDecimal total;

    private String shippingProvider; // SPEEDY, ECONT
    private String trackingNumber;
    private String waybillNumber; // товарителница

    @Column(precision = 10, scale = 2)
    private BigDecimal codAmount;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

public enum OrderStatus {
    PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}

public enum PaymentMethod {
    COD, BANK_TRANSFER, CARD
}

public enum PaymentStatus {
    PENDING, PAID, FAILED
}
```

### Application Configuration

**application.yml:**
```yaml
spring:
  application:
    name: papa-api
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

server:
  port: ${PORT:8080}

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000 # 24 hours

cors:
  allowed-origins: ${CORS_ORIGINS:http://localhost:3000}
```

**application-prod.yml:**
```yaml
spring:
  jpa:
    show-sql: false

logging:
  level:
    root: WARN
    bg.papa: INFO
```

### Supabase Connection

**Getting the connection string:**
1. Go to supabase.com → Your Project → Settings → Database
2. Copy "Connection string" (URI format)
3. Set as `DATABASE_URL` environment variable

```
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### Key Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Core -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>

    <!-- API Docs -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>

    <!-- Utility -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>

    <!-- Dev Tools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### Deployment to Railway

**Option 1: Auto-deploy (Recommended)**
1. Push code to GitHub
2. Railway → New Project → Deploy from GitHub
3. Select repository
4. Railway auto-detects Java/Maven
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://...supabase.com:6543/postgres
   JWT_SECRET=your-secret-key
   CORS_ORIGINS=https://papa.bg
   ```
6. Deploy!

**Option 2: Docker (More Control)**
```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]
```

**Build times:**
- Maven build: 30-60 seconds
- Docker build: 60-90 seconds
- Railway deploy: ~2 minutes total

---

## Project Structure

### New Project: papa-api (Spring Boot)
```
papa-api/                          # NEW - Create this
├── src/main/java/bg/papa/
│   ├── PapaApplication.java
│   ├── config/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   └── integration/
├── src/main/resources/
│   └── application.yml
├── pom.xml
└── Dockerfile
```

### Existing: papa-store-storefront (Next.js)
```
papa-store-storefront/             # MODIFY
├── src/
│   ├── lib/
│   │   ├── data/*.ts             # Rewrite to call Spring Boot API
│   │   └── config.ts             # Update API base URL
│   ├── modules/
│   │   └── checkout/*            # Update for new API
│   └── design-system/
│       └── tokens.ts             # KEEP - already done
└── package.json                  # Remove @medusajs dependencies
```

### Remove: papa-store (Medusa)
```
papa-store/                        # DELETE - no longer needed
```

### New: Supabase Project
```
Supabase Dashboard:
├── Tables (auto-created by JPA)
│   ├── products
│   ├── categories
│   ├── carts
│   ├── orders
│   └── customers
├── Authentication (optional - using JWT instead)
└── Storage (for product images)
```

---

## Verification & Testing

### Pre-Launch Checklist
- [ ] Test product listing with 10k products
- [ ] Test search and filtering
- [ ] Test cart add/remove/update
- [ ] Test COD checkout flow
- [ ] Test ProCredit vPOS payment
- [ ] Test bank transfer flow
- [ ] Test shipping calculation
- [ ] Test Speedy waybill generation
- [ ] Test admin product management
- [ ] Test supplier sync
- [ ] Mobile responsiveness
- [ ] Bulgarian language
- [ ] SSL/HTTPS working

### Performance Targets
- Product list load: <1 second
- Search results: <500ms
- Add to cart: <300ms
- Checkout complete: <2 seconds

---

## Cost Summary

| Service | Monthly Cost |
|---------|--------------|
| Railway (Spring Boot backend) | $5-10 |
| Vercel (Next.js frontend) | $0 |
| Railway PostgreSQL (database) | $0 (included) |
| Cloudflare R2 (product images) | ~$0.15 |
| Domain | ~$2 |
| **Total** | **$7-12/mo** |

**Note:** R2 is essentially free for our usage (10GB storage, millions of reads included free).

---

## Timeline Summary

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | Spring Boot setup + Products API | Product catalog working |
| 2 | Cart + Checkout APIs | Basic purchase flow |
| 3 | Auth + Customer APIs | User registration/login |
| 4 | Bulgarian Integrations | ProCredit, Speedy/Econt |
| 5 | Admin APIs + Supplier Sync + Enrichment | Product sync + enrichment pipeline |
| 6 | Admin Review Dashboard + Deploy | Review UI + Production launch |
| 7 | Product Enrichment Run | Enrich 10k products + manual review |

**Total: 6-7 weeks**

---

## Product Enrichment Pipeline

After products are imported from the supplier API with raw/incomplete data, an automated enrichment pipeline will enhance product information and source images.

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PRODUCT ENRICHMENT PIPELINE                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. IMPORT           Supplier API (Mistral) → PostgreSQL                │
│     ────────         Raw names, no images, basic data                   │
│                      Status: RAW                                        │
│                                                                         │
│  2. ENRICH           For each product:                                  │
│     ──────           • Web search (brand + product keywords)            │
│                      • Scrape Bulgarian e-commerce sites                │
│                      • Extract: proper name, description, specs         │
│                      • Download product images                          │
│                      • Calculate confidence score (0.0-1.0)             │
│                      Status: RAW → ENRICHING → ENRICHED                 │
│                                                                         │
│  3. OPTIMIZE         Process downloaded images:                         │
│     ────────         • Resize to standard sizes (800x800, 400x400)      │
│                      • Convert to WebP/AVIF for performance             │
│                      • Compress for fast loading                        │
│                      • Upload to Cloudflare R2                          │
│                      • Save R2 URLs to database                         │
│                                                                         │
│  4. REVIEW           Admin dashboard for QA:                            │
│     ──────           • Filter: needs review, low confidence, no image   │
│                      • Side-by-side: supplier name vs enriched name     │
│                      • Image preview with Accept/Replace/Skip           │
│                      • Bulk approve high-confidence matches             │
│                      Status: ENRICHED → REVIEW → APPROVED               │
│                                                                         │
│  5. PUBLISH          Approved products go live                          │
│     ───────          Status: APPROVED → PUBLISHED                       │
│                      Visible on storefront                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Product Status Flow

```
RAW → ENRICHING → ENRICHED → REVIEW → APPROVED → PUBLISHED
                     ↓
                  FAILED (needs manual intervention)
```

### Database Schema Updates

```java
@Entity
@Table(name = "products")
public class Product {
    // ... existing fields ...

    // Enrichment Status
    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.RAW;

    // Original supplier data (preserved)
    private String rawSupplierName;
    private String rawSupplierSku;

    // Enriched data (from web scraping)
    private String enrichedName;

    @Column(columnDefinition = "TEXT")
    private String enrichedDescription;

    private String enrichedBrand;
    private String enrichedIngredients;
    private String enrichedAgeRange;

    // Enrichment metadata
    private Double enrichmentConfidence;  // 0.0 - 1.0
    private String enrichmentSource;      // "gladen.bg", "dm.bg", etc.
    private LocalDateTime enrichedAt;

    // Image URLs (Cloudflare R2)
    private String thumbnailUrl;          // 400x400
    private String imageUrl;              // 800x800

    @Column(columnDefinition = "jsonb")
    private String additionalImages;      // JSON array of URLs

    // Review tracking
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    private String reviewNotes;
}

public enum ProductStatus {
    RAW,        // Just imported from supplier
    ENRICHING,  // Currently being processed
    ENRICHED,   // Web data found
    FAILED,     // Could not enrich (needs manual)
    REVIEW,     // Awaiting admin review
    APPROVED,   // Admin approved
    PUBLISHED   // Live on storefront
}
```

### Enrichment Service

```java
@Service
public class ProductEnrichmentService {

    @Autowired
    private WebSearchClient webSearchClient;

    @Autowired
    private ImageService imageService;

    @Autowired
    private R2StorageService r2Storage;

    public EnrichmentResult enrich(Product product) {
        // 1. Build search query from raw supplier name
        String query = buildSearchQuery(product.getRawSupplierName());

        // 2. Search Bulgarian e-commerce sites
        List<SearchResult> results = webSearchClient.search(query);

        // 3. Find best match
        SearchResult bestMatch = findBestMatch(results, product);

        // 4. Extract product data
        ProductData enrichedData = scrapeProductPage(bestMatch.getUrl());

        // 5. Download and process image
        byte[] imageBytes = downloadImage(enrichedData.getImageUrl());
        ProcessedImages images = imageService.processAndOptimize(imageBytes);

        // 6. Upload to R2
        String thumbnailUrl = r2Storage.upload(images.getThumbnail(), "products/thumb/");
        String fullImageUrl = r2Storage.upload(images.getFull(), "products/full/");

        // 7. Calculate confidence score
        double confidence = calculateConfidence(product, enrichedData);

        return EnrichmentResult.builder()
            .enrichedName(enrichedData.getName())
            .enrichedDescription(enrichedData.getDescription())
            .thumbnailUrl(thumbnailUrl)
            .imageUrl(fullImageUrl)
            .confidence(confidence)
            .source(bestMatch.getSource())
            .build();
    }
}
```

### Bulgarian E-commerce Sources

| Site | URL | Product Types | API/Scraping |
|------|-----|---------------|--------------|
| Gladen.bg | shop.gladen.bg | Baby food, diapers | Scraping |
| Palcho.bg | palcho.bg | All baby products | Scraping |
| dm Bulgaria | dm-drogeriemarkt.bg | Baby food, care | Scraping |
| Remedium.bg | remedium.bg | Baby food, health | Scraping |
| Magazin Ganchev | magazinganchev.bg | Ganchev products | Scraping |
| eMag.bg | emag.bg | All categories | Scraping |
| Ozone.bg | ozone.bg | All categories | Scraping |

### Image Processing Pipeline

```java
@Service
public class ImageService {

    public ProcessedImages processAndOptimize(byte[] originalImage) {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(originalImage));

        // Resize to standard dimensions
        BufferedImage thumbnail = resize(image, 400, 400);
        BufferedImage full = resize(image, 800, 800);

        // Convert to WebP for smaller file size
        byte[] thumbnailWebP = convertToWebP(thumbnail, 0.85f);
        byte[] fullWebP = convertToWebP(full, 0.90f);

        return new ProcessedImages(thumbnailWebP, fullWebP);
    }
}
```

### Cloudflare R2 Integration

```java
@Service
public class R2StorageService {

    @Value("${cloudflare.r2.account-id}")
    private String accountId;

    @Value("${cloudflare.r2.access-key}")
    private String accessKey;

    @Value("${cloudflare.r2.secret-key}")
    private String secretKey;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    private S3Client r2Client;

    @PostConstruct
    public void init() {
        r2Client = S3Client.builder()
            .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)))
            .region(Region.of("auto"))
            .build();
    }

    public String upload(byte[] data, String prefix) {
        String key = prefix + UUID.randomUUID() + ".webp";

        r2Client.putObject(
            PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType("image/webp")
                .build(),
            RequestBody.fromBytes(data)
        );

        return "https://images.papa.bg/" + key; // Custom domain
    }
}
```

### Admin Review Dashboard

**Features:**
- Filter products by status (ENRICHED, FAILED, LOW_CONFIDENCE)
- Side-by-side comparison: raw name vs enriched name
- Image preview with zoom
- Quick actions: Approve, Edit, Flag for manual review
- Bulk approve for confidence > 0.9
- Edit enriched data inline
- Upload replacement images

**API Endpoints:**
```
GET    /api/admin/enrichment/queue       - Products needing review
GET    /api/admin/enrichment/stats       - Enrichment statistics
PATCH  /api/admin/products/{id}/approve  - Approve enriched data
PATCH  /api/admin/products/{id}/reject   - Reject and flag for manual
POST   /api/admin/products/{id}/image    - Upload replacement image
```

### Enrichment Statistics Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                 ENRICHMENT OVERVIEW                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Total Products:     10,432                                 │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ✓ Published:        8,234  (79%)  ████████████████░░░░     │
│  ✓ Approved:           412  (4%)   ██░░░░░░░░░░░░░░░░░░     │
│  ⏳ In Review:          856  (8%)   ████░░░░░░░░░░░░░░░░     │
│  ⚠ Failed:             203  (2%)   █░░░░░░░░░░░░░░░░░░░     │
│  ○ Raw (Pending):      727  (7%)   ███░░░░░░░░░░░░░░░░░     │
│                                                             │
│  Average Confidence:  0.87                                  │
│  Images Found:        94%                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cost Estimate

| Service | Usage | Cost |
|---------|-------|------|
| Cloudflare R2 Storage | ~10GB for 10k products | $0.015/GB = ~$0.15/mo |
| R2 Operations | Class A (writes) | First 1M free |
| R2 Operations | Class B (reads) | First 10M free |
| **Total R2** | | **~$0.15/mo** |

### Timeline Addition

| Phase | Task | Duration |
|-------|------|----------|
| Week 5 | Build enrichment service | 2 days |
| Week 5 | Build R2 integration | 1 day |
| Week 5 | Build image processing | 1 day |
| Week 6 | Build admin review dashboard | 2 days |
| Week 6 | Run enrichment on all products | 1-2 days |
| Week 6 | Manual review of flagged items | Ongoing |

---

## Action Items Before Starting

### Immediate (Before Week 1)
1. **Create Supabase project** - Get database connection string
2. **Create GitHub repo** for `papa-api` (Spring Boot)
3. **Set up IntelliJ IDEA** with Spring Boot support

### During Development (Week 4)
4. **Contact ProCredit Bank** - Get vPOS API documentation
5. **Contact Speedy/Econt** - Get shipping API documentation
6. **Get supplier API docs** - For product sync

### Before Launch (Week 6)
7. **Create Railway account** - For backend deployment
8. **Configure production environment variables**
9. **Set up domain DNS**

---

## Quick Start Commands

```bash
# Create Spring Boot project
# Go to start.spring.io or use Spring Initializr in IntelliJ

# Run locally
./mvnw spring-boot:run

# Build JAR
./mvnw clean package

# Run JAR
java -jar target/papa-api-0.0.1.jar

# API available at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger-ui.html
```

---

## Summary

| Aspect | Decision |
|--------|----------|
| **Backend** | Spring Boot 3 (Java 21) |
| **Frontend** | Next.js (existing, adapted) |
| **Database** | Railway PostgreSQL |
| **Image Storage** | Cloudflare R2 |
| **Backend Hosting** | Railway ($5-10/mo) |
| **Frontend Hosting** | Railway (free tier) |
| **Build Time** | 30-60 seconds |
| **Total Cost** | $7-12/mo |
| **Timeline** | 6-7 weeks |
| **Product Enrichment** | Automated web scraping + admin review |
