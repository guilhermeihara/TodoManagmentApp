# Todo App - Frontend

A modern, responsive todo application built with **React**, **TypeScript**, and **Material-UI (MUI)**. It provides a clean, accessible interface for managing tasks with authentication, real-time UX via React Query, and production-ready tooling.

> **Scope (current): Web-only** — This README documents the **frontend**. You can run it standalone for UI work, but most features require a running API. When the backend is available, point the env var to it and everything will hook up automatically.

---

## 🚀 Features

- **Authentication**: Secure user registration and login
- **Task Management**: Create, read, update, and delete todos
- **Real-time UX**: Optimistic updates, background refetches with TanStack React Query
- **Responsive Design**: Works on desktop and mobile
- **Material Design**: MUI components with custom theme
- **Form Validation**: React Hook Form + Zod
- **Toast Notifications**: `react-hot-toast`
- **Virtualization**: Efficient large lists with React Virtuoso
- **Testing**: Jest + React Testing Library

---

## 🧠 Design Decisions & Trade‑offs

- **Material UI for speed & consistency**: chose **MUI** to accelerate UI modeling using well‑tested components and a coherent design system (good defaults for accessibility, responsiveness). *Trade‑off*: theming beyond the basics can be verbose; bundle size can grow if many components are imported.
- **TanStack Query for server comms**: centralizes data fetching/caching, auto refetch, and stale data handling. We use **optimistic updates** to make mutations feel instant. *Trade‑off*: if the server ultimately fails, the UI rolls back to the previous state, which can briefly confuse users. We mitigate with toasts and an immediate revalidation to keep UI and server in sync.
- **Auth flow (simple)**: users log in against the backend; the **user object and accessToken are stored in `localStorage`** for persistence. An **Axios interceptor** injects `Authorization: Bearer <token>` on requests. If the token is missing/expired and the API returns **401**, we clear storage and log the user out.
- **Security consideration**: `localStorage` keeps the flow simple, but is susceptible to XSS token theft. For production‑grade security, consider **HTTP‑only, Secure cookies**, short‑lived access tokens with **refresh tokens/rotation**, and strict Content Security Policy.

---

## 🛠️ Tech Stack

### Core

- **React 19** (modern React features)
- **TypeScript**
- **Vite** (dev server & build)
- **Material-UI (MUI)**

### State & Forms

- **TanStack React Query** (server state)
- **React Hook Form** (form state)
- **Zod** (schema validation)

### UI/UX

- **Lucide React** (icons)
- **react-hot-toast** (toasts)
- **react-virtuoso** (virtualized lists)

### Dev Tools

- **ESLint**, **Prettier**
- **Jest**, **@testing-library/react**

### Utilities

- **Axios** (HTTP)
- **date-fns**, **date-fns-tz** (dates & timezones)

---

## 📋 Prerequisites

- **Node.js 18+**
- **npm** or **yarn** (or **pnpm**)
- **Docker** (optional, for containerized setup)

---

## 🏃‍♂️ Getting Started

### Local Development (Web-only)

1) **Clone & enter project**

```bash
git clone <repository-url>
cd todoapp
```

1) **Install dependencies**

```bash
npm install
# or
yarn install
```

1) **Start the dev server**

```bash
npm run dev
# or
yarn dev
```

Open <http://localhost:3000>.

> **Note:** Without a running API, the app will show auth failures or empty data. This is expected in web-only mode.

---

## 🔧 Configuration

### Vite

- Dev server runs on **:3000** and auto-opens browser
- React plugin with Fast Refresh

### MUI Theme

- Located at `src/lib/muiTheme.ts`
- Customize palette, typography, component defaults, and breakpoints

---

## 📜 Available Scripts

### Dev

- `npm run dev` — Start dev server with HMR
- `npm run preview` — Preview the production build locally

### Build

- `npm run build` — Production build (TypeScript + Vite)
- `tsc -b && vite build` — Equivalent explicit steps

### Quality & Tests

- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm run test` — Jest + RTL
- `npm run test:watch` — Watch mode
- `npm run test:coverage` — Coverage report

---

## 🔌 API Expectations (UI ↔ API)

### Auth

- `POST /api/auth/register` → `{ email, password }` → `201 Created`
- `POST /api/auth/login` → `{ email, password }` → `{ token, user }`
  - On success we persist `{ token, user }` to **localStorage** and set up an Axios **request interceptor** to attach `Authorization: Bearer <token>`.
  - On **401 Unauthorized** responses (expired/invalid token), a **response interceptor** clears storage and logs the user out.

### Tasks (authenticated)

- `GET /api/tasks` → paged list with filters/search/sort
- `POST /api/tasks` → create task (optimistic update applied client‑side)
- `GET /api/tasks/:id` → single task
- `PATCH /api/tasks/:id` → partial update (optimistic update + rollback on error)
- `DELETE /api/tasks/:id` → delete (optimistic remove + rollback on error)

### Task shape (example)

```json
{
  "id": "7b3e7f3f-6d0a-4d02-bd0a-2f3b1c1f9c7a",
  "title": "Write README",
  "description": "Finish the docs",
  "status": "Pending",
  "priority": "High",
  "dueAt": "2025-10-05T15:00:00Z",
  "createdAt": "2025-10-03T01:00:00Z",
  "updatedAt": "2025-10-03T01:10:00Z"
}
```

---

## 🧪 Testing

### Run tests

```bash
npm run test
```

Includes:

- **Jest** — test runner & assertions
- **React Testing Library** — component tests
- **@testing-library/jest-dom** — DOM matchers
- **@testing-library/user-event** — user interactions

---

## ⚡ Performance

- Virtualized lists via **react-virtuoso** for large datasets
- React Query caching & background refetch
- Code-splitting at route/component boundaries (if configured)

---

## 🔐 Security Notes

- **Token storage**: we currently persist `{ user, accessToken }` in **localStorage** for simplicity and offline persistence.
- **Interceptors**: Axios request interceptor adds `Authorization: Bearer <token>`; response interceptor logs out on `401`.
- **XSS risk**: localStorage is readable by injected scripts. In production, prefer **HTTP‑only cookies**, short‑lived access tokens, refresh tokens, and a strict CSP.
- **CORS**: API should allow the UI origin (e.g., `http://localhost:3000`).

---

## 🧰 Troubleshooting

- **CORS errors**: ensure API allows `http://localhost:3000`
- **401 Unauthorized**: verify login flow and token attachment
- **Docker**: confirm containers share a network and ports `3000:80` (frontend) and `5001:5001` (API) are free

---

## 🚀 Production Deployment

### Manual

```bash
npm run build
# serve ./dist with any static server (nginx, apache, caddy, etc.)
```

---

## ✅ Next Additions (nice-to-haves)

- React Query Devtools gated by `VITE_ENABLE_REACT_QUERY_DEVTOOLS`
- Toasts for mutation success/error
- E2E tests (Playwright)
- i18n and theming modes (light/dark)
