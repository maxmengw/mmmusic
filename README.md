# MMS Music

A full-stack music streaming platform featuring curated Filipino, Korean, and Chinese music collections with personalized user libraries.

**Live Demo:** [mms-music-frontend.vercel.app](https://mms-music-frontend.vercel.app)

---

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, SASS  
**Backend:** Node.js, Express, TypeScript, Prisma ORM  
**Database:** PostgreSQL  
**Auth:** Clerk  
**Hosting:** Vercel (Frontend)

---

## Features

- Secure authentication and user sessions
- Personal music collections per user
- Browse Filipino, Korean, and Chinese music
- Real-time search across all categories
- Add/remove songs from your library
- YouTube playlist integration
- Responsive design

---

## Local Setup

### Prerequisites

Before running this application locally, ensure you have:

- **Node.js** 18 or higher
- **npm** 9 or higher
- **Docker Desktop** (for PostgreSQL database)
- **Clerk Account** (free tier available at [clerk.com](https://clerk.com))
- **Git** for version control

### Step 1: Clone Repository
```bash
git clone https://github.com/sionkimadd/mms_music.git
cd mms_music
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs dependencies for both frontend and backend using npm workspaces.

### Step 3: Environment Variables Setup

#### Frontend Environment Variables

Create `apps/frontend/.env` file:
```env
VITE_EMAILJS_SERVICE_ID=service_insertAlphanumericKeyHere
VITE_EMAILJS_TEMPLATE_ID=template_insertTemplateIDHere
VITE_EMAILJS_PUBLIC_KEY=p-insertPublicKeyHere
 
VITE_API_BASE=http://localhost:3000 
VITE_CLERK_PUBLISHABLE_KEY=pk_test_insertClerkPublishableKeyHere
```

**Required Variables:**
- `VITE_API_BASE` - Backend API URL (use `http://localhost:3000` for local development)
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key from your Clerk dashboard
- `VITE_EMAILJS_SERVICE_ID` - EmailJS service ID for sending contact form emails (get from EmailJS dashboard)
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS template ID that defines your email format (create in EmailJS templates)
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS public key to authorize email sending from your app (found in EmailJS account settings)

`To setup emailjs:` https://www.emailjs.com/

#### Backend Environment Variables

Create `apps/backend/.env` file:
```env
PORT=3000
# DATABASE_URL="file:./dev.db"
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/postgres
FRONTEND_URL=http://localhost:5173
 
CLERK_SECRET_KEY=sk_test_insertSecretKeyHere
CLERK_PUBLISHABLE_KEY=pk_test_insertClerkPublishableKeyHere
```

**Required Variables:**
- `PORT` - Port for backend server (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS (use `http://localhost:5173` for local)
- `DATABASE_URL` - PostgreSQL connection string (uses Docker container on port 5434)
- `CLERK_PUBLISHABLE_KEY` - Clerk publishable key (same as frontend)
- `CLERK_SECRET_KEY` - Clerk secret key from your Clerk dashboard

`To setup Clerk authentication:` https://clerk.com → Create App → Copy API Keys to `.env` files


### Step 4: Database Setup

#### Start PostgreSQL Database
```bash
docker-compose up -d
```

This starts a PostgreSQL container on port 5434. Verify it's running:
```bash
docker ps
```

You should see a container named `postgres` running.

#### Run Prisma Migrations

Navigate to backend directory and run migrations:
```bash
npm run prisma:reset  
npm run migrate:backend  
npm run seed:backend   
npm run generate:backend   
```

#### Verify Database (Optional)

Open Prisma Studio to view your database:
```bash
npx prisma studio
```

This opens a browser at `http://localhost:5555` where you can see your database tables.

### Step 5: Run the Application

#### Option A: Run Both Frontend and Backend Together

From the root directory:
```bash
npm run dev
```

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run start:backend
```

**Terminal 2 - Frontend:**
```bash
npm run start:frontend
```

**Note:** The publishable key is safe to use in frontend code - it's meant to be public.

### Step 6: Access the Application

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Prisma Studio:** [http://localhost:5555](http://localhost:5555) (if running)


---

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

**Base:** `/api/v1`

### Music Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/filipinomusic` | Get Filipino music |
| POST | `/filipinomusic/add` | Add Filipino song |
| DELETE | `/filipinomusic/delete` | Delete Filipino song |
| GET | `/koreanmusic` | Get Korean music |
| POST | `/koreanmusic/add` | Add Korean song |
| DELETE | `/koreanmusic/delete` | Delete Korean song |
| GET | `/chinesemusic` | Get Chinese music |
| POST | `/chinesemusic/add` | Add Chinese song |
| DELETE | `/chinesemusic/delete` | Delete Chinese song |

### Playlist Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/playlist` | Get user's playlists |
| POST | `/playlist/add` | Add video to playlist |
| DELETE | `/playlist/:videoid` | Delete video from playlist |

### YouTube Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/youtubemusicslist` | Get YouTube music playlists |

---

## Deployment

**Frontend (Vercel):**
- Root Directory: `apps/frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `VITE_API_BASE`, `VITE_CLERK_PUBLISHABLE_KEY`,`VITE_EMAILJS_*`

**Backend:**
- Any Node.js hosting platform 
- Environment Variables: `DATABASE_URL`, `CLERK_*`, `PORT`

