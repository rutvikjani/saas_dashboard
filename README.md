# Nova — SaaS Dashboard

A production-ready full-stack SaaS admin dashboard built with Next.js 14, Express.js, MongoDB, and Tailwind CSS.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Express](https://img.shields.io/badge/Express-4.18-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Auth**: JWT access + refresh tokens, role-based (Admin/Staff), protected routes
- **Overview**: KPI cards, revenue chart, user growth, activity feed
- **Analytics**: Traffic stats, device sources, channel breakdown, monthly table
- **Customers**: Search, filter, pagination, CRUD with modals
- **Revenue**: MRR/ARR, churn, breakdown charts, billing summary
- **Projects**: Kanban board with drag status updates, progress tracking
- **Settings**: Profile, company, password, theme, notifications
- **UI**: Dark/light mode, skeleton loaders, toast notifications, responsive

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm / yarn

---

### 1. Clone & Install

```bash
# Install API deps
cd api
npm install
cp .env.example .env   # Fill in your values

# Install web deps
cd ../web
npm install
cp .env.example .env.local
```

### 2. Configure Environment

**`api/.env`**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/saas_dashboard
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**`web/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Seed Database

```bash
cd api
npm run seed
```

This creates:
- Admin user: `admin@demo.com` / `password123`
- Staff user: `staff@demo.com` / `password123`
- 50 sample customers
- 12 months of revenue data
- 4 projects with tasks
- Activity logs

### 4. Run Development

```bash
# Terminal 1 — API
cd api
npm run dev       # Runs on http://localhost:5000

# Terminal 2 — Web
cd web
npm run dev       # Runs on http://localhost:3000
```

Open http://localhost:3000 and log in with the demo credentials.

---

## Project Structure

```
saas-dashboard/
├── api/                          # Express.js Backend
│   ├── controllers/              # Route handlers
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── analyticsController.js
│   │   ├── revenueController.js
│   │   └── projectController.js
│   ├── middleware/
│   │   └── auth.js               # JWT auth + role guard
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Customer.js
│   │   ├── Revenue.js
│   │   ├── Project.js
│   │   └── ActivityLog.js
│   ├── routes/                   # Express routers
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── customers.js
│   │   ├── analytics.js
│   │   ├── revenue.js
│   │   └── projects.js
│   ├── utils/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── jwt.js                # Token helpers
│   │   └── seed.js               # Data seeder
│   ├── server.js                 # Entry point
│   └── package.json
│
└── web/                          # Next.js 14 Frontend
    ├── app/
    │   ├── auth/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   └── dashboard/
    │       ├── layout.tsx        # Auth guard + sidebar
    │       ├── page.tsx          # Overview
    │       ├── analytics/page.tsx
    │       ├── customers/page.tsx
    │       ├── revenue/page.tsx
    │       ├── projects/page.tsx
    │       └── settings/page.tsx
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx
    │   │   └── Topbar.tsx
    │   └── ui/
    │       └── index.tsx         # Card, KpiCard, Modal, Table, Badge, etc.
    ├── hooks/
    │   └── useQueries.ts         # React Query hooks
    ├── lib/
    │   ├── api.ts                # Axios + interceptors
    │   ├── authStore.ts          # Zustand auth store
    │   ├── themeStore.ts         # Zustand theme store
    │   └── utils.ts              # Formatters + helpers
    └── package.json
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/auth/logout` | — | Logout + clear cookie |
| GET | `/api/auth/me` | ✓ | Get current user |
| GET | `/api/users` | Admin | List all users |
| PUT | `/api/users/profile` | ✓ | Update profile |
| PUT | `/api/users/password` | ✓ | Change password |
| GET | `/api/customers` | ✓ | List + filter customers |
| POST | `/api/customers` | ✓ | Create customer |
| PUT | `/api/customers/:id` | ✓ | Update customer |
| DELETE | `/api/customers/:id` | ✓ | Delete customer |
| GET | `/api/analytics/overview` | ✓ | Dashboard KPIs |
| GET | `/api/analytics/traffic` | ✓ | Traffic data |
| GET | `/api/revenue/summary` | ✓ | MRR/ARR summary |
| GET | `/api/revenue` | ✓ | Monthly revenue list |
| GET | `/api/projects` | ✓ | List projects |
| POST | `/api/projects` | ✓ | Create project |
| PUT | `/api/projects/:id` | ✓ | Update project |
| PUT | `/api/projects/:id/tasks/:taskId` | ✓ | Update task status |

---

## Production Deployment

### Backend (Railway / Render / Fly.io)
```bash
cd api
# Set NODE_ENV=production in your platform env vars
npm start
```

### Frontend (Vercel)
```bash
cd web
# Set NEXT_PUBLIC_API_URL=https://your-api.railway.app/api
vercel deploy
```

### MongoDB
Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier and set `MONGO_URI` to your connection string.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| State | Zustand + TanStack React Query |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Auth | JWT (access + refresh tokens) |
| Database | MongoDB + Mongoose |
| HTTP Client | Axios with interceptors |
| Notifications | react-hot-toast |

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | password123 |
| Staff | staff@demo.com | password123 |
