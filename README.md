# MediCart — Full-Stack Online Pharmacy

A production-grade e-commerce pharmacy application built with **Next.js 15**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS**.

![MediCart](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

---

## Features

### Customer-Facing
- **Product Catalog** — 150+ medicines with filtering, sorting, and full-text search
- **Shopping Cart** — Real-time cart with promo codes, taxes, and delivery calculation
- **Wishlist** — Persistent wishlist synced with database
- **Prescription Upload** — 4-step flow with status tracking and pharmacist review
- **Flash Deals** — Live countdown timers with rotating offers
- **Health Blog** — Category-filtered articles with search
- **User Authentication** — JWT-based auth with httpOnly cookies
- **Order Management** — Create orders, track status, earn MediCoins loyalty rewards

### Admin Portal
- **Secure Staff Gateway** — PIN-protected portal at `/portal`, separate from public site
- **Dashboard** — Real-time KPIs: revenue, orders, users, pending prescriptions
- **Product Management** — Full CRUD with inventory control
- **Order Management** — Status updates (Pending → Shipped → Delivered)
- **Prescription Queue** — Approve/reject with pharmacist notes and verification codes
- **User Management** — Customer accounts with order history
- **Analytics** — Revenue trends and conversion metrics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict) |
| Database | PostgreSQL (Neon serverless) |
| ORM | Prisma 6 |
| Auth | Custom JWT via `jose` + httpOnly cookies |
| Styling | Tailwind CSS v3 + Framer Motion |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/umairhaider-dev/medicart.git
cd medicart
npm install
```

### 2. Set up Neon database

1. Go to [neon.tech](https://neon.tech) and create a free project
2. Copy the **Connection String** from the dashboard
3. Create `.env.local`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="your-32-char-secret-key-here!!"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Push schema & seed

```bash
npm run db:push      # Push schema to database
npm run db:seed      # Seed products + demo users
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Customer | demo@medicart.com | demo123 |
| Admin | admin@medicart.com | admin123 |

Admin portal: [http://localhost:3000/portal](http://localhost:3000/portal) (PIN: `1234`)

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, sets httpOnly cookie |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Current user from cookie |
| GET | `/api/products` | Products with filtering & pagination |
| GET | `/api/products/:id` | Single product |
| GET/POST | `/api/orders` | User orders |
| GET/POST | `/api/wishlist` | Wishlist toggle |
| GET/POST | `/api/prescriptions` | Prescription management |
| GET | `/api/admin/dashboard` | Admin KPIs *(admin only)* |
| GET/PATCH | `/api/admin/orders/:id` | Order status *(admin only)* |
| GET/PATCH | `/api/admin/prescriptions/:id` | Rx review *(admin only)* |
| GET | `/api/admin/users` | All customers *(admin only)* |
| GET/POST/PATCH/DELETE | `/api/admin/products` | Product CRUD *(admin only)* |

---

## Deployment

### Vercel (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project** → select your repo
3. Add environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
4. Deploy — Vercel auto-runs `prisma generate && next build`

---

## Project Structure

```
src/
├── app/
│   ├── api/              # 18 REST API route handlers
│   ├── admin/            # Protected admin dashboard pages
│   ├── portal/           # Staff access gateway
│   └── ...               # Customer pages
├── components/           # 20+ reusable components
├── store/                # React Context stores (cart, auth, wishlist, prescriptions)
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # JWT helpers
│   └── products.ts       # Product data + types
prisma/
├── schema.prisma         # Full database schema (9 models)
└── seed.ts               # Database seeder
```

---

## License

MIT — built by [Umair Haider](https://github.com/umairhaider-dev)