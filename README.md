# MM Music

A full-stack music memo and playlist manager built with React, Node/Express, Prisma, PostgreSQL, and Clerk.

**Live Demo:** [mmmusic-frontend.vercel.app](https://mmmusic-frontend.vercel.app/)

## Overview

MM Music is a monorepo app for browsing curated music collections, creating personal music memos, exploring music by country on an interactive map, and managing YouTube-based playlists per user.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, SASS
- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** Clerk
- **Hosting:** Vercel (frontend)

## Key Features

- Secure sign-in and user-scoped data
- Personal music memos and collections per account
- Curated music browsing and search
- Interactive world map for country-based music exploration
- Add/remove songs from libraries
- YouTube music playlist integration
- Responsive UI for desktop and mobile

## Project Structure

- `apps/frontend` — React client
- `apps/backend` — Express API + Prisma
- `shared` — shared types and seed data
- `docker-compose.yml` — local PostgreSQL container

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Docker Desktop
- Clerk account

### 1) Clone and install

```bash
git clone https://github.com/sionkimadd/mms_music.git
cd mms_music
npm install
```

### 2) Configure environment variables

Create `apps/frontend/.env`:

```env
VITE_API_BASE=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_insertClerkPublishableKeyHere
VITE_EMAILJS_SERVICE_ID=service_insertAlphanumericKeyHere
VITE_EMAILJS_TEMPLATE_ID=template_insertTemplateIDHere
VITE_EMAILJS_PUBLIC_KEY=p-insertPublicKeyHere
```

Create `apps/backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/postgres
FRONTEND_URL=http://localhost:5173
CLERK_SECRET_KEY=sk_test_insertSecretKeyHere
CLERK_PUBLISHABLE_KEY=pk_test_insertClerkPublishableKeyHere
```

### 3) Start PostgreSQL

```bash
npm run dev:db
```

### 4) Prepare Prisma

```bash
npm run generate:backend
npm run migrate:backend
npm run seed:backend
```

### 5) Run the app

```bash
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:3000

## Available Scripts

From the repo root:

- `npm run dev` — start frontend and backend together
- `npm run dev:db` — start the PostgreSQL container
- `npm run start:frontend` — run the Vite app only
- `npm run start:backend` — run the API only
- `npm run generate:backend` — generate Prisma client
- `npm run migrate:backend` — run Prisma migrations
- `npm run seed:backend` — seed the database

Backend tests:

```bash
npm run test --workspace=@mms_music/backend
```

## API Surface

Base path: `/api/v1`

Common areas include:

- Music collections and category management
- User playlist CRUD
- YouTube music list retrieval

All protected routes expect `Authorization: Bearer <token>`.

## Deployment

### Recommended setup

- **Frontend:** deploy `apps/frontend` to Vercel
- **Backend:** deploy `apps/backend` to Render
- **Database:** use a hosted PostgreSQL instance such as Render Postgres, Neon, or Supabase

### Frontend on Vercel

- Set the project root directory to `apps/frontend`
- Build command: `npm run vercel-build`
- Output directory: `dist`
- Environment variables: `VITE_API_BASE`, `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

### Backend on Render

- Set the project root directory to `apps/backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start:prod`
- Environment variables: `DATABASE_URL`, `FRONTEND_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`
- Set `FRONTEND_URL` to your Vercel domain and `VITE_API_BASE` on the frontend to your Render API URL

### Deployment notes

- Keep the frontend and backend as two separate services
- Use the deployed backend URL for all browser API calls
- Make sure the backend database is reachable from Render
- `PORT` is provided automatically by Render at runtime



