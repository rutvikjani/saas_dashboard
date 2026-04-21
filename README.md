# Nova — SaaS Dashboard

**A production-ready full-stack SaaS admin dashboard with role-based access, revenue tracking, customer management, and project planning.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://saas-dashboard-gold-tau.vercel.app)

**[Live Demo](https://saas-dashboard-gold-tau.vercel.app)** · Backend may take ~30 seconds to wake up on first visit (free tier hosting).

---

## Overview

Nova is a full-stack SaaS operations dashboard built for early-stage founders and small teams. It replaces the need for multiple tools by combining revenue metrics, customer management, project tracking, and team roles into one clean interface.

---

## Features

| Feature | Description |
|---------|-------------|
| Authentication | JWT access + refresh tokens, protected routes |
| Role-Based Access | Admin and Staff roles with different permissions |
| Overview | KPI cards, revenue chart, user growth, activity feed |
| Analytics | Traffic stats, device sources, conversion metrics |
| Customers | Search, filter, pagination, CRUD, bulk import, export |
| Revenue | MRR, ARR, churn rate, monthly breakdown charts |
| Projects | Kanban board with task management and progress tracking |
| File Import | CSV, Excel (.xlsx/.xls), and PDF support with column mapping |
| Export | Download customer data as CSV or Excel |
| UI | Dark/light mode, responsive design, loading skeletons |

---

## Role-Based Access

| Page | Admin | Staff |
|------|:-----:|:-----:|
| Overview | Full | Full |
| Analytics | Full | Hidden |
| Customers | Full | View only |
| Revenue | Full | Hidden |
| Projects | Full | Full |
| Settings | Full | Profile & Password only |

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand + TanStack React Query
- Recharts
- Papaparse + SheetJS (file parsing)

**Backend**
- Node.js + Express.js
- JWT authentication (access + refresh tokens)
- MongoDB Atlas + Mongoose

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free)
- npm

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/saas-dashboard.git
cd saas-dashboard
```

**2. Install dependencies**

```bash
# API
cd api && npm install

# Web
cd ../web && npm install
```

**3. Configure environment variables**

Create `api/.env` from the example:

```bash
cd api
copy .env.example .env
```

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Create `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**4. Set up MongoDB Atlas**

1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster in the region closest to you
3. Under **Database Access** — add a user with read/write permissions
4. Under **Network Access** — add `0.0.0.0/0` to allow all connections
5. Under **Database → Connect → Drivers** — copy the connection string
6. Paste it as `MONGO_URI` in `api/.env`

> If `mongodb+srv://` fails due to DNS issues on your network, use the direct connection string format available from Atlas.

**5. Seed the database**

```bash
cd api
npm run seed
```

**6. Start development servers**

```bash
# Terminal 1 — API (http://localhost:5000)
cd api && npm run dev

# Terminal 2 — Web (http://localhost:3000)
cd web && npm run dev
```

---

## Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@demo.com | password123 | Full access to all pages |
| Staff | staff@demo.com | password123 | Limited access |

---

## File Import

Customers can be imported from **CSV**, **Excel**, or **PDF** files.

**Import flow:**
1. Go to Customers → click **Import**
2. Upload your file (drag and drop supported)
3. Map your columns to Nova fields — auto-detect available
4. Preview the first 5 rows before importing
5. Confirm — data imports in batches

**Download a sample template** directly from the import page to see the expected format.

| Field | Required |
|-------|:--------:|
| name | Yes |
| email | Yes |
| company | No |
| phone | No |
| plan | No |
| status | No |
| country | No |
| mrr | No |

---

## Project Structure

```
saas-dashboard/
├── api/                        # Express.js backend
│   ├── controllers/            # Route handlers
│   ├── middleware/             # Auth + role guards
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── utils/                  # DB, JWT, seed, indexes
│   └── server.js
│
└── web/                        # Next.js 14 frontend
    ├── app/
    │   ├── auth/               # Login + register pages
    │   └── dashboard/          # All dashboard pages
    │       └── customers/
    │           └── import/     # File import page
    ├── components/
    │   ├── layout/             # Sidebar + Topbar
    │   └── ui/                 # Reusable components
    ├── hooks/                  # React Query hooks
    └── lib/                    # API client, stores, utils
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/refresh` | Cookie | Refresh token |
| POST | `/api/auth/logout` | — | Logout |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/users` | Admin | List users |
| PUT | `/api/users/profile` | Yes | Update profile |
| PUT | `/api/users/password` | Yes | Change password |
| GET | `/api/customers` | Yes | List customers |
| POST | `/api/customers` | Admin | Create customer |
| PUT | `/api/customers/:id` | Admin | Update customer |
| DELETE | `/api/customers/:id` | Admin | Delete customer |
| GET | `/api/analytics/overview` | Yes | Dashboard KPIs |
| GET | `/api/analytics/traffic` | Admin | Traffic data |
| GET | `/api/revenue/summary` | Admin | Revenue summary |
| GET | `/api/revenue` | Admin | Monthly data |
| GET | `/api/projects` | Yes | List projects |
| POST | `/api/projects` | Yes | Create project |
| PUT | `/api/projects/:id/tasks/:taskId` | Yes | Update task |
| GET | `/api/health` | — | Health check |

---

## Deployment

**Vercel (Frontend)**
1. Import repo → set Root Directory to `web`
2. Add env var: `NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api`
3. Deploy

**Render (Backend)**
1. Import repo → set Root Directory to `api`
2. Build: `npm install` · Start: `node server.js`
3. Add all env vars from `.env.example`

**MongoDB Atlas**
- Use free M0 tier
- Set Network Access to `0.0.0.0/0`

---

## Notes

- `.env` and `.env.local` are in `.gitignore` — never commit them
- Run `npm run seed` to reset the database to demo data at any time
- Set `CLIENT_URL` on Render to your Vercel URL to avoid CORS issues
- Render free tier sleeps after 15 min of inactivity — first request will be slow