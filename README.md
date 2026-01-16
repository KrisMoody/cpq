# CPQ (Configure, Price, Quote) POC

A proof-of-concept CPQ (Configure, Price, Quote) application built with modern web technologies. This system enables sales teams to configure complex products, apply dynamic pricing, and generate accurate quotes.

## Features

### Product Management
- **Product Catalog** - Manage standalone products and configurable bundles
- **Product Features & Options** - Define configurable options for bundle products
- **Categories** - Hierarchical product categorization with parent/child relationships
- **Attributes** - Flexible attribute system with multiple types (text, number, boolean, select, date)
- **Units of Measure** - Customizable units with conversion factors

### Pricing
- **Price Books** - Multiple price books for different customer segments or regions
- **Price Tiers** - Volume-based pricing with quantity breaks
- **Cost & Margin Tracking** - Track costs and minimum margins for approval workflows

### Quoting
- **Quote Builder** - Interactive quote creation with product configuration
- **Bundle Configurator** - Configure product bundles with feature selection
- **Quote Line Items** - Manage quantities, pricing, and nested bundle components
- **Quote Preview** - Professional quote preview for customer presentation

### Discounts & Pricing Rules
- **Discount Management** - Percentage or fixed amount discounts
- **Discount Scopes** - Line item, quote-level, or category-based discounts
- **Discount Tiers** - Volume-based discount tiers
- **Manual Discounts** - Sales rep discretionary discounts with approval tracking
- **Rules Engine** - Configurable rules for pricing and configuration logic

### Tax Management
- **Tax Rates** - Country and state/region-level tax rates
- **Category Tax Rules** - Tax rates by product category
- **Tax Exemptions** - Customer tax exemption tracking

### Customer Management
- **Customer Records** - Full customer information including addresses
- **Customer Price Books** - Assign specific price books to customers
- **Tax Exemption Handling** - Track exemption certificates and expiry dates

### Authentication
- **Neon Auth Integration** - Secure authentication using Neon's managed auth service
- **Email/Password Authentication** - User registration with email verification
- **Session Management** - HTTP-only cookie-based sessions
- **Route Protection** - All routes protected by default

## Tech Stack

- **Frontend**: [Nuxt 4](https://nuxt.com/) with [Vue 3](https://vuejs.org/)
- **UI Components**: [Nuxt UI](https://ui.nuxt.com/) with [Tailwind CSS 4](https://tailwindcss.com/)
- **Data Tables**: [@tanstack/vue-table](https://tanstack.com/table/latest)
- **Charts**: [ApexCharts](https://apexcharts.com/) via vue3-apexcharts
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Database Hosting**: [Neon](https://neon.tech/) (serverless Postgres)
- **Authentication**: [Neon Auth](https://neon.com/docs/auth/overview) (managed auth service)

## Project Structure

```
├── app/
│   ├── components/      # Vue components
│   │   ├── cpq/         # CPQ-specific components (quote builder, configurator)
│   │   ├── tables/      # Data table components
│   │   ├── categories/  # Category tree components
│   │   └── learn/       # Educational/documentation components
│   ├── composables/     # Vue composables for shared logic
│   ├── layouts/         # Page layouts
│   └── pages/           # File-based routing pages
├── prisma/
│   └── schema.prisma    # Database schema
├── server/              # Server-side API routes
└── public/              # Static assets
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- Yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KrisMoody/cpq.git
   cd cpq
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your connection strings:
   ```
   DATABASE_URL="postgresql://..."
   NEON_AUTH_URL="https://<project-id>.<region>.neon.tech/auth"
   ```

   Get your `NEON_AUTH_URL` from the Neon dashboard under the Auth tab.

4. Push database schema:
   ```bash
   yarn db:push
   ```

5. Seed the database (optional):
   ```bash
   yarn db:seed
   ```

## Development

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

### Database Commands

```bash
# Push schema changes to database
yarn db:push

# Seed database with sample data
yarn db:seed

# Open Prisma Studio (database GUI)
yarn db:studio
```

## Production

Build the application for production:

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

## Authentication

This project uses [Neon Auth](https://neon.com/docs/auth/overview) for authentication. The integration includes:

- **Login/Register pages** - Email/password authentication with mandatory email verification
- **Session management** - Secure HTTP-only cookie-based sessions
- **Route protection** - All routes protected by default (client + server middleware)
- **User menu** - User dropdown in sidebar with sign out

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEON_AUTH_URL` | Neon Auth service URL (from Neon dashboard) |
| `ANTHROPIC_API_KEY` | Optional - for AI features |

### Adding OAuth Providers (Future)

OAuth is prepared in the architecture but not enabled initially. To add OAuth:
1. Configure providers in the Neon Auth dashboard
2. Add provider buttons to login/register pages
3. The `signInWithOAuth(provider)` method is already available in `useNeonAuth()`

### Adding Public Routes (Future)

Currently all routes require authentication. To add public routes:
1. Update `AUTH_PAGES` array in `app/middleware/auth.global.ts`
2. Optionally exclude paths in `server/middleware/01.auth.ts`

## License

Private - All rights reserved
