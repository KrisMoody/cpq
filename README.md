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

## Tech Stack

- **Frontend**: [Nuxt 4](https://nuxt.com/) with [Vue 3](https://vuejs.org/)
- **UI Components**: [Nuxt UI](https://ui.nuxt.com/) with [Tailwind CSS 4](https://tailwindcss.com/)
- **Data Tables**: [@tanstack/vue-table](https://tanstack.com/table/latest)
- **Charts**: [ApexCharts](https://apexcharts.com/) via vue3-apexcharts
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Database Hosting**: [Neon](https://neon.tech/) (serverless Postgres)

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

   Update `.env` with your database connection string:
   ```
   DATABASE_URL="postgresql://..."
   ```

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

## License

Private - All rights reserved
