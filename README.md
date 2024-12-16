# Law Firm Directory

A web application for managing law firm data and their websites, with an API for downstream consumers.

## Features

- CRUD operations for law firm data
- REST API for data access
- PostgreSQL database with Prisma ORM
- Built with Next.js 14, TypeScript, and modern web technologies

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- pnpm (recommended) or npm

### Development Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the database:

   ```bash
   docker compose up -d
   ```

4. Set up the database schema:

   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at http://localhost:3000

## API Routes

### GET /api/lawfirms

Retrieve all law firms

### POST /api/lawfirms

Create a new law firm

```json
{
  "name": "Example Law Firm",
  "website": "https://example.com",
  "active": true
}
```

### PUT /api/lawfirms

Update an existing law firm

```json
{
  "id": "law_firm_id",
  "name": "Updated Law Firm Name",
  "website": "https://updated-example.com",
  "active": true
}
```

## Database Schema

The main entity is the `LawFirm` model with the following fields:

- `id`: Unique identifier
- `name`: Law firm name
- `website`: Law firm website URL
- `active`: Whether the law firm is active
- `metadata`: JSON field for additional data
- `lastScrapedAt`: Timestamp of last website scrape
- `scrapeStatus`: Status of the last scrape operation

## Future Considerations

The application is designed with extensibility in mind:

- Metadata field for additional properties
- Scraping-related fields for tracking website updates
- RESTful API design for easy integration
- Type-safe database operations with Prisma
