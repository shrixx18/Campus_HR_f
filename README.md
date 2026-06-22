# CampusHire Frontend

React + TypeScript SPA for the CampusHire campus placement platform. Connects to the [Campus_HR_b](https://github.com/shrixx18/Campus_HR_b) backend API gateway.

## Tech stack

- Vite + React 19 + TypeScript
- React Router v7
- TanStack Query
- Zustand (auth state)
- Axios (API client with JWT refresh)
- Tailwind CSS v4
- React Hook Form + Zod

## Prerequisites

- Node.js 18+
- Backend running at `http://20.219.9.65:8080` (see Campus_HR_b)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://20.219.9.65:8080` | Backend API gateway URL |

## User roles

- **Student** - self-register at `/register`, browse opportunities, apply, track applications
- **Coordinator** - self-register at `/register`, manage opportunities, view registrations, update application statuses

## Backend integration

For local backend development:

```bash
cd ../Campus_HR_b
docker compose up -d
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## MVP scope

**Included:** auth, profile, opportunity browse/apply, coordinator opportunity CRUD, registrations export, application status management

**Phase 2:** queries, notifications
