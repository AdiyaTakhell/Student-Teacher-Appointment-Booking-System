# Student–Teacher Appointment Booking System

A full-stack appointment booking and messaging system for students and teachers, with role-based dashboards (Admin, Teacher, Student), real-time messaging, and appointment management.

**Status:** Prototype / development-ready

---

**Table of Contents**
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment variables](#environment-variables)
  - [Install & Run (Development)](#install--run-development)
  - [Build & Deploy](#build--deploy)
- [API & Socket Overview](#api--socket-overview)
- [Data Models (high level)](#data-models-high-level)
- [Scripts & Useful Commands](#scripts--useful-commands)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This repository contains a Student–Teacher Appointment Booking System split into two top-level folders: `client/` (React + Vite frontend) and `server/` (Node.js + Express backend). The app supports:

- Role-based authentication (Admin, Teacher, Student)
- Appointment creation, retrieval, status updates
- Real-time messages via WebSockets (Socket.IO)
- Admin management scripts (e.g., create admin seed)

## Features

- User registration and login
- Student-facing appointment booking UI
- Teacher dashboard for managing appointments
- Admin dashboard for user and appointment oversight
- Real-time chat between users
- Rate limiting, security middleware, input sanitization on server

## Tech Stack

- Frontend: React 19, Vite, TailwindCSS
- State/data: React Query (`@tanstack/react-query`)
- UI: lucide-react, shared components
- HTTP client: `axios`
- Charts: `recharts`
- Realtime: `socket.io-client`
- Backend: Node.js, Express
- DB: MongoDB via `mongoose`
- Auth: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- Dev tooling: `nodemon` (server), `vite` (client)

Dependencies are defined in `client/package.json` and `server/package.json`.

## Architecture

- `client/` contains the React app (pages, components, API helpers in `src/api`).
- `server/` contains Express routes, controllers, services, and Mongoose models under `src/`.
- Socket.IO is used in the backend to enable real-time messaging; clients connect using `socket.io-client`.

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- npm or yarn
- MongoDB (local or cloud Atlas)

### Environment variables

Create a `.env` file in `server/` with at least the following values:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Adjust names/keys to match `server/src/config/db.js` and `server/src/utils/jwt.js` if needed.

### Install & Run (Development)

Open two terminals (one for backend, one for frontend):

```bash
# In one terminal: server
cd server
npm install
npm run dev

# In the other terminal: client
cd client
npm install
npm run dev
```

This starts the Express server (with `nodemon`) and the Vite dev server. The client is configured to call the API via code in `client/src/api` — update the base URL there if your server runs on a different host/port.

### Build & Deploy

To build the frontend for production:

```bash
cd client
npm run build
```

Then serve the static build from any static host or integrate with the Express server if you prefer a single deploy unit.

For the server, use `npm start` (production) or a process manager such as PM2, systemd, or containerize with Docker.

### Deployment — Vercel (frontend) and hosting recommendations (backend)

- Deploy the frontend to Vercel (recommended for the `client/` app):
  1. In Vercel dashboard click **Import Project** and select your repository.
  2. When configuring the project, set **Root Directory** to `client` (this is important for monorepos).
  3. Framework Preset: **Vite**. Build Command: `npm run build`. Output Directory: `dist`.
  4. Add any required environment variables under **Settings → Environment Variables** (for example `VITE_API_BASE_URL` or `REACT_APP_API_URL`, matching your client API config). These are only needed if your frontend reads them at build time.
  5. Deploy — Vercel will build and publish the site. The project includes `client/vercel.json` which rewrites all routes to `index.html` for SPA routing.

- Backend hosting (recommended separate service):
  - The `server/` Express app is stateful and expects a long-running Node process and MongoDB. Recommended hosts: Render, Railway, Fly.io, Heroku, or a Docker host.
  - Example Render setup:
    - Create a new Web Service, connect your repo and set **Root Directory** to `server`.
    - Start Command: `npm start` (or `node src/server.js`).
    - Set environment variables in the service settings: `MONGO_URI`, `JWT_SECRET`, `COOKIE_SECRET`, `CLIENT_URL` (set to your Vercel URL), etc.
    - Ensure CORS on the server allows your Vercel domain.

- Monorepo notes / serverless: you can deploy both frontend and backend on Vercel but the Express app must be adapted to Vercel Serverless Functions (or rebuilt as separate API functions). If you want that, I can convert endpoints into Vercel functions or add `vercel.json` rewrites for API routes.

- After deployment: update `CLIENT_URL` / `VITE_API_BASE_URL` and restart the backend service if necessary.


## API & Socket Overview

- REST routes live under `server/src/modules/*/*.routes.js` — examples:
  - `auth` routes: register/login endpoints in `server/src/modules/auth/`
  - `appointments` routes: booking and management in `server/src/modules/appointments/`
  - `messages` routes: message persistence in `server/src/modules/messages/`

- Real-time messaging: Socket.IO server is configured in `server/src/server.js` (or near entry). Client connects using `socket.io-client` and listens/emits message events.

Refer to the controller and service files for exact route paths and request/response shapes.

## Data Models (high level)

- `User` — roles (admin/teacher/student), credentials, profile
- `Appointment` — student, teacher, date/time, status, notes
- `Message` — from, to, content, timestamp

See `server/src/models/` for full schemas and fields.

## Scripts & Useful Commands

- `cd server && npm run dev` — start server in dev with `nodemon`
- `cd client && npm run dev` — start Vite dev server
- `cd server && npm run start` — run production server
- `cd server && npm run seed:admin` — run `createAdmin.js` to create an initial admin user
- `cd client && npm run lint` — run ESLint

## Contributing

- Open an issue describing a bug or feature request.
- Fork the repo, create a branch, and send a pull request with a clear description.
- Maintain code style consistent with the existing codebase.

## Where to look next

- Frontend entry: `client/src/main.jsx` and `client/src/App.jsx`
- Backend entry: `server/src/server.js` and `server/src/app.js`
- Auth context: `client/src/context/AuthContext.jsx`
- Routes & controllers: `server/src/modules/*`

