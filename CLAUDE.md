# Pa-Pa Baby Shop E-commerce Project

## Project Summary
Building a modern e-commerce store for **Pa-Pa** - a Bulgarian baby shop.

## Key Decisions Made
- **Platform**: Medusa.js (backend) + Next.js (frontend)
- **Frontend**: Custom built with Next.js + React 19 + Tailwind CSS
- **Database**: PostgreSQL on Neon (free tier)
- **Image Hosting**: Cloudflare R2 (planned)
- **Card Payments**: ProCredit Bank vPOS (target 0.5% fee)
- **Other Payments**: COD (0%) + Bank transfer (0%)
- **Shipping**: Speedy or Econt (whichever offers better rates)
- **Products**: 10,000+ via custom API sync from supplier
- **Monthly Cost**: ~$10-15/mo
- **Timeline**: 6-8 weeks

## Technical Stack
- **Backend**: Medusa.js v2.12.5 (Node.js/TypeScript)
- **Frontend**: Next.js 15.3.8 + React 19 + Tailwind CSS
- **Database**: PostgreSQL 16 on Neon
- **UI Components**: @medusajs/ui + custom design system
- **Styling**: Tailwind CSS

## Project Structure
```
C:\PaPa\
├── papa-store/              # Medusa backend
│   ├── src/
│   ├── medusa-config.ts
│   └── .env                 # DATABASE_URL configured
├── papa-store-storefront/   # Next.js frontend
│   ├── src/
│   │   └── design-system/   # Custom design system
│   └── .env.local           # MEDUSA keys configured
└── CLAUDE.md                # This file
```

## Development URLs
- **Storefront**: http://localhost:8000
- **Medusa Admin**: http://localhost:9000/app
- **Medusa API**: http://localhost:9000

## Admin Credentials
- Email: admin@papa.bg
- Password: admin123

## Database
- **Provider**: Neon (free PostgreSQL)
- **Connection**: Configured in papa-store/.env

## Current Status
- [x] Medusa.js backend set up
- [x] Next.js frontend set up
- [x] PostgreSQL database connected (Neon)
- [x] Database migrations run
- [x] Sample data seeded
- [x] Admin user created
- [x] Both servers running
- [ ] Bulgarian settings (BGN, 20% VAT)
- [ ] Design system implementation (IN PROGRESS)
- [ ] Custom components
- [ ] Supplier API integration
- [ ] Payment integration (ProCredit vPOS)
- [ ] Shipping integration (Speedy/Econt)

## Design System (In Progress)
Location: `papa-store-storefront/src/design-system/`

### Color Palette
- Primary: Soft Coral Pink (#FF6B52)
- Secondary: Baby Blue (#0EA5E9)
- Accent: Mint (#14B8A6), Sunny Yellow (#EAB308), Lavender (#A855F7), Peach (#F97316)
- Neutrals: Warm Gray tones

### Typography
- Display Font: Nunito (playful, rounded)
- Body Font: Poppins (readable)

### Files Created
- `tokens.ts` - Design tokens (colors, typography, spacing)

## Bulgarian Specifics
- Currency: BGN (лв)
- Tax: 20% VAT (ДДС)
- Language: Bulgarian
- COD is critical (60-70% of BG customers use it)
- Legal: GDPR + 14-day return policy

## Commands
```bash
# Start Medusa backend
cd papa-store && npm run dev

# Start Next.js frontend
cd papa-store-storefront && npm run dev

# Run database migrations
cd papa-store && npx medusa db:migrate

# Seed database
cd papa-store && npm run seed

# Create admin user
cd papa-store && npx medusa user -e email@example.com -p password
```

## Full Plan
See: C:\Users\doich\.claude\plans\humble-rolling-tower.md
