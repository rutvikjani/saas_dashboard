# Nova — SaaS Dashboard

A production-ready full-stack SaaS admin dashboard built with Next.js 14, Express.js, MongoDB, and Tailwind CSS.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Express](https://img.shields.io/badge/Express-4.18-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Auth** — JWT access + refresh tokens, role-based (Admin/Staff), protected routes
- **Overview** — KPI cards, revenue chart, user growth, activity feed
- **Analytics** — Traffic stats, device sources, channel breakdown *(Admin only)*
- **Customers** — Search, filter, pagination, CRUD *(Staff: view only)*
- **Revenue** — MRR/ARR, churn, breakdown charts, billing summary *(Admin only)*
- **Projects** — Kanban board with task status updates, progress tracking
- **Settings** — Profile, password, theme, notifications *(Company tab: Admin only)*
- **UI** — Dark/light mode, skeleton loaders, toast notifications, fully responsive

## Role-Based Access

| Page | Admin | Staff |
|------|-------|-------|
| Overview | ✅ Full | ✅ Full |
| Analytics | ✅ Full | ❌ Hidden |
| Customers | ✅ Full | ✅ View only |
| Revenue | ✅ Full | ❌ Hidden |
| Projects | ✅ Full | ✅ Full |
| Settings | ✅ Full | ✅ Profile & Password only |

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

## Prerequisites

- Node.js 18+
- MongoDB (local) or MongoDB Atlas
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
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/saas_dashboard
JWT_SECRET=supersecretjwtkey123
JWT_REFRESH_SECRET=supersecretrefreshkey456
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

```powershell
# Web
cd ../web
copy .env.example .env.local
```

Edit `web/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

**If installed as a service:**
```powershell
Start-Service MongoDB
```

**If running manually:**
```powershell
New-Item -ItemType Directory -Force -Path "C:\data\db"
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

**Using MongoDB Compass:**
Open Compass and connect to `mongodb://localhost:27017` — MongoDB starts automatically when Compass opens.

### 5. Seed the database

```powershell
cd api
npm run seed
```

Output:
```
✅ MongoDB connected: localhost
🗑️  Cleared existing data
👥 Created users
👤 Created 50 customers
💰 Created revenue data
📋 Created projects
📝 Created activity logs

✅ Seed complete!
📧 Admin: admin@demo.com / password123
📧 Staff: staff@demo.com / password123
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
| GET | `/api/auth/me` | ✓ | Get current user |
| GET | `/api/users` | Admin | List all users |
| PUT | `/api/users/profile` | ✓ | Update profile |
| PUT | `/api/users/password` | ✓ | Change password |
| GET | `/api/customers` | ✓ | List + filter customers |
| POST | `/api/customers` | Admin | Create customer |
| PUT | `/api/customers/:id` | Admin | Update customer |
| DELETE | `/api/customers/:id` | Admin | Delete customer |
| GET | `/api/analytics/overview` | ✓ | Dashboard KPIs |
| GET | `/api/analytics/traffic` | Admin | Traffic data |
| GET | `/api/revenue/summary` | Admin | MRR/ARR summary |
| GET | `/api/revenue` | Admin | Monthly revenue list |
| GET | `/api/projects` | ✓ | List projects |
| POST | `/api/projects` | ✓ | Create project |
| PUT | `/api/projects/:id` | ✓ | Update project |
| PUT | `/api/projects/:id/tasks/:taskId` | ✓ | Update task |

---

## Notes

- Make sure MongoDB is running before starting the API
- Never commit `.env` or `.env.local` files — they are in `.gitignore`
- Run `npm run seed` any time you want to reset the database to demo data
- MongoDB Compass can be used to visually browse and manage your local database