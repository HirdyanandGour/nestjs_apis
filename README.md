# News Portal REST API (NestJS + Prisma + MySQL)

Production-ready REST API for a News Portal with JWT-protected admin endpoints.

## Features
- NestJS modular architecture
- Prisma ORM with MySQL
- JWT auth for admin APIs
- Modules: Auth, Users, News, Category, Comment
- Pagination and search support
- Role-based authorization (ADMIN)

## Setup
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and migrate:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```
4. Seed admin and categories:
   ```bash
   npm run seed
   ```
5. Start server:
   ```bash
   npm run start:dev
   ```

## API Prefix
- `api/v1`

## Key Endpoints
- `POST /api/v1/auth/login`
- `POST /api/v1/news` (ADMIN)
- `PATCH /api/v1/news/:id` (ADMIN)
- `DELETE /api/v1/news/:id` (ADMIN)
- `GET /api/v1/news/latest`
- `GET /api/v1/news/breaking`
- `GET /api/v1/news/trending`
- `GET /api/v1/news/category/:categoryId`
- `GET /api/v1/news/search?search=keyword&page=1&limit=10`
- `GET /api/v1/categories`
- `POST /api/v1/categories` (ADMIN)
- `POST /api/v1/comments`
- `GET /api/v1/comments/news/:newsId`

## Default Seeded Admin
- email: `admin@newsportal.com`
- password: `Admin@123`

## Notes
- Public endpoints are marked with `@Public()`.
- All other endpoints require JWT.
- Admin-only endpoints are protected using `@Roles(UserRole.ADMIN)`.
