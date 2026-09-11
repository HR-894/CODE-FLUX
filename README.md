# CampusOS — Unified Campus Operations Platform

CampusOS is a modern, full-stack campus management and operations platform for institutions. It provides facilities dispatch, academic scheduling, student complaint tracking, campus directory search, and mobile access.

---

## Architecture Overview

```
Systems-Architect-Hub/
├── artifacts/
│   ├── api-server/         # Node.js Express 5 API backend with Drizzle ORM
│   ├── campus-os-web/      # React 19 + Vite + Tailwind frontend application
│   ├── campus-os-mobile/   # Expo / React Native cross-platform mobile client
│   └── mockup-sandbox/     # UI prototyping & component canvas
├── lib/
│   ├── api-client-react/   # Type-safe React Query hooks & custom fetch client
│   ├── api-spec/           # OpenAPI contracts and codegen specifications
│   ├── api-zod/            # Zod validation schemas
│   └── db/                 # Drizzle ORM schemas and PostgreSQL migrations
├── Dockerfile.api          # Backend API multi-stage container build
├── Dockerfile.web          # Frontend Nginx production container build
└── docker-compose.yml      # Orchestrates PostgreSQL, API server, and Web frontend
```

---

## Quickstart (Local Development)

### 1. Prerequisites
- **Node.js**: v22+
- **pnpm**: v9+ (or v11)
- **PostgreSQL**: v15+ (or run via Docker)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Push Database Schema
If you have a running PostgreSQL database (e.g. `postgres://campus_admin:campus_secret_password@localhost:5432/campus_os`):
```bash
pnpm --filter @workspace/db run push
```

### 5. Run Development Servers
Start both backend API and frontend concurrently:
```bash
# Start API server (port 5000)
pnpm run dev:api

# Start Web application (port 5173 with automatic /api proxy to backend)
pnpm run dev:web
```

---

## Customization & Branding

CampusOS is built to be easily customizable for any school, university, or enterprise:

### Brand Name, Logos & Taglines
Edit `artifacts/campus-os-web/src/config/branding.ts`:
```typescript
export const BRAND_CONFIG = {
  appName: 'CampusOS',                   // Your application name
  markText: 'C',                         // Logo mark letter
  tagline: 'operations, clarified',      // Subtitle
  workspaceKicker: 'Student workspace',  // Header badge
  institution: 'Metropolitan University',// Institution name
  statusText: 'Campus systems live',     // Status indicator
  statusSubtext: 'Reference data refreshed this morning.',
  theme: {
    primaryColor: '#0284c7',
    accentColor: '#38bdf8',
  },
};
```

### Custom SVG Logos & Favicons
- **Browser Favicon**: `artifacts/campus-os-web/public/favicon.svg`
- **Brand SVG Logo**: `artifacts/campus-os-web/src/assets/logo.svg`
- **Mobile Splash & Icon**: `artifacts/campus-os-mobile/assets/images/icon.png`

---

## Production Self-Hosting

### Option A: Docker Compose (Recommended)

Run the complete full-stack environment with a single command:
```bash
# Start PostgreSQL, API Server, and Web Frontend
docker compose up -d

# View running container logs
docker compose logs -f

# Shut down services
docker compose down
```

- Web application: `http://localhost:8080` (or `WEB_PORT`)
- Backend API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

### Option B: Bare Metal / VPS / Cloud Server

1. **Build all packages:**
```bash
pnpm run build
```

2. **Run the API server:**
```bash
export DATABASE_URL="postgres://user:password@db-host:5432/campus_os"
export PORT=5000
pnpm run start:api
```

3. **Run the Web application:**
```bash
export WEB_PORT=3000
export API_TARGET="http://localhost:5000"
pnpm --filter @workspace/campus-os-web run serve:prod
```

Or deploy `artifacts/campus-os-web/dist/public` directly to any static host (Cloudflare Pages, Vercel, Netlify, AWS S3 + CloudFront).

---

## Mobile App (Expo)

To start the Expo development server:
```bash
pnpm --filter @workspace/campus-os-mobile run dev
```
Use the Expo Go app on your physical device or run on iOS Simulator (`pnpm --filter @workspace/campus-os-mobile run ios`) / Android Emulator (`pnpm --filter @workspace/campus-os-mobile run android`).
