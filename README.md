# Nova — SaaS Dashboard

> A production-ready full-stack SaaS admin dashboard built with Next.js 14, Express.js, MongoDB Atlas, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js) ![Express](https://img.shields.io/badge/Express-4.18-green?style=flat-square&logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

---

## Preview

> Login with `admin@demo.com / password123` to explore all features.

---

## Features

- **Auth** — JWT access + refresh tokens, role-based (Admin/Staff), protected routes
- **Overview** — KPI cards, revenue chart, user growth, activity feed
- **Analytics** — Traffic stats, device sources, channel breakdown *(Admin only)*
- **Customers** — Search, filter, pagination, full CRUD *(Staff: view only)*
- **Revenue** — MRR/ARR, churn rate, breakdown charts, billing summary *(Admin only)*
- **Projects** — Kanban board with task status updates and progress tracking
- **Settings** — Profile, password change, theme toggle, notifications *(Company tab: Admin only)*
- **UI** — Dark/light mode, loading skeletons, toast notifications, fully responsive

---

## Role-Based Access

| Page | Admin | Staff |
|------|-------|-------|
| Overview | Full | Full |
| Analytics | Full | Hidden |
| Customers | Full | View only |
| Revenue | Full | Hidden |
| Projects | Full | Full |
| Settings | Full | Profile & Password only |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand + TanStack React Query |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Authentication | JWT (access + refresh tokens) |
| Database | MongoDB Atlas + Mongoose |
| HTTP Client | Axios with interceptors |
| Notifications | react-hot-toast |

---

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free)
- npm

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/saas-dashboard.git
cd saas-dashboard
```

### 2. Install dependencies

```powershell
# API
cd api
npm install

# Web
cd ../web
npm install
```

### 3. Configure environment variables

```powershell
# API
cd api
copy .env.example .env
```

Edit `api/.env`:
```env
PORT=5000
MONGO_URI=mongodb://username:password@ac-xxxxx-shard-00-00.xxxxx.mongodb.net:27017,ac-xxxxx-shard-00-01.xxxxx.mongodb.net:27017,ac-xxxxx-shard-00-02.xxxxx.mongodb.net:27017/saas_dashboard?ssl=true&replicaSet=atlas-xxxxxx&authSource=admin&appName=Cluster0
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

```powershell
# Web
cd ../web
copy .env.example .env.local
```

Edit `web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a free **M0** cluster — select region closest to you
3. **Database Access** — Add a database user with username and password
4. **Network Access** — Add IP Address — Allow Access from Anywhere (`0.0.0.0/0`)
5. **Database** — Connect — Drivers — copy the connection string
6. Replace `<password>` with your actual password
7. Paste it as `MONGO_URI` in `api/.env`

> **Note:** If `mongodb+srv://` gives DNS errors on your network, use the direct connection string format from Atlas — Connect — Drivers.

### 5. Seed the database

```powershell
cd api
npm run seed
```

Expected output:
```
MongoDB connected: cluster0.xxxxx.mongodb.net
Cleared existing data
Created users
Created 50 customers
Created revenue data
Created projects
Created activity logs

Seed complete!
Admin: admin@demo.com / password123
Staff: staff@demo.com / password123
```

### 6. Run the development servers

**Terminal 1 — API:**
```powershell
cd api
npm run dev
```

**Terminal 2 — Web:**
```powershell
cd web
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@demo.com | password123 | Full access |
| Staff | staff@demo.com | password123 | Limited access |

---

## Project Structure

```
saas-dashboard/
├── api/                          # Express.js Backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── analyticsController.js
│   │   ├── revenueController.js
│   │   └── projectController.js
│   ├── middleware/
│   │   └── auth.js               # JWT auth + role guard
│   ├── models/
│   │   ├── User.js
│   │   ├── Customer.js
│   │   ├── Revenue.js
│   │   ├── Project.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── customers.js
│   │   ├── analytics.js
│   │   ├── revenue.js
│   │   └── projects.js
│   ├── utils/
│   │   ├── db.js
│   │   ├── jwt.js
│   │   └── seed.js
│   ├── server.js
│   └── package.json
│
└── web/                          # Next.js 14 Frontend
    ├── app/
    │   ├── auth/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   └── dashboard/
    │       ├── layout.tsx
    │       ├── page.tsx
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
    │       └── index.tsx
    ├── hooks/
    │   └── useQueries.ts
    ├── lib/
    │   ├── api.ts
    │   ├── authStore.ts
    │   ├── themeStore.ts
    │   └── utils.ts
    └── package.json
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/auth/logout` | — | Logout |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/users` | Admin | List all users |
| PUT | `/api/users/profile` | Yes | Update profile |
| PUT | `/api/users/password` | Yes | Change password |
| GET | `/api/customers` | Yes | List + filter customers |
| POST | `/api/customers` | Admin | Create customer |
| PUT | `/api/customers/:id` | Admin | Update customer |
| DELETE | `/api/customers/:id` | Admin | Delete customer |
| GET | `/api/analytics/overview` | Yes | Dashboard KPIs |
| GET | `/api/analytics/traffic` | Admin | Traffic data |
| GET | `/api/revenue/summary` | Admin | MRR/ARR summary |
| GET | `/api/revenue` | Admin | Monthly revenue list |
| GET | `/api/projects` | Yes | List projects |
| POST | `/api/projects` | Yes | Create project |
| PUT | `/api/projects/:id` | Yes | Update project |
| PUT | `/api/projects/:id/tasks/:taskId` | Yes | Update task |

---

## Notes

- Never commit `.env` or `.env.local` files — they are already in `.gitignore`
- Run `npm run seed` any time you want to reset the database to demo data
- On production, set `CLIENT_URL` to your frontend deployment URL to avoid CORS errors
- Render free tier spins down after 15 minutes of inactivity — first request may be slow