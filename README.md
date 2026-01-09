
## Demo Credentials

These accounts are for testing and evaluation purposes only.

### Admin

* Email: `admin@classconnect.com`
* Password: `adminpassword123`

### Teacher

* Email: `strange@teacher.com`
* Password: `password123`

### Student

* Email: `peter@student.com`
* Password: `password123`

---

# Student–Teacher Appointment Booking System

A full-stack appointment booking and real-time messaging system for educational environments. The platform supports role-based access for **Admins**, **Teachers**, and **Students**, enabling appointment scheduling, management, and direct communication.

**Status:** Prototype / Development-ready

---

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Environment Variables](#environment-variables)
  * [Install & Run (Development)](#install--run-development)
  * [Build & Deploy](#build--deploy)
  * [Deployment Guide](#deployment-guide)
* [API & Socket Overview](#api--socket-overview)
* [Data Models (High Level)](#data-models-high-level)
* [Scripts & Useful Commands](#scripts--useful-commands)
* [Contributing](#contributing)
* [License](#license)

---

## Project Overview

This repository contains a **Student–Teacher Appointment Booking System** split into two main directories:

* `client/` — React + Vite frontend
* `server/` — Node.js + Express backend

The application provides:

* Role-based authentication and authorization
* Appointment booking and management
* Real-time messaging using WebSockets
* Administrative tools for user and system management

---

## Features

* Secure user registration and login
* Role-based dashboards (Admin, Teacher, Student)
* Student appointment booking interface
* Teacher appointment management panel
* Admin overview of users and appointments
* Real-time chat between users
* Server-side security features:

  * Rate limiting
  * Input sanitization
  * Authentication middleware

---

## Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* React Query (`@tanstack/react-query`)
* Axios
* Recharts
* Socket.IO Client
* lucide-react

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JSON Web Tokens
* bcryptjs
* Socket.IO

### Tooling

* nodemon
* npm
* ESLint

Dependencies are defined in `client/package.json` and `server/package.json`.

---

## Architecture

### Client (`client/`)

* React application
* Pages, reusable components, and hooks
* API helpers in `src/api`
* Context-based authentication

### Server (`server/`)

* Express application
* Modular structure (`modules/` for auth, appointments, messages)
* Mongoose models in `models/`
* Socket.IO server integrated at application entry

The frontend communicates with the backend via REST APIs and Socket.IO for real-time features.

---

## Getting Started

### Prerequisites

* Node.js 18 or higher
* npm or yarn
* MongoDB (local or MongoDB Atlas)

---

### Environment Variables

Create a `.env` file inside the `server/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Ensure variable names match:

* `server/src/config/db.js`
* `server/src/utils/jwt.js`

---

### Install & Run (Development)

Run backend and frontend in separate terminals.

**Backend**

```bash
cd server
npm install
npm run dev
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

* Backend runs with `nodemon`
* Frontend runs on the Vite dev server
* Update API base URLs in `client/src/api` if needed

---

### Build & Deploy

**Build frontend**

```bash
cd client
npm run build
```

Build output is generated in `client/dist`.

**Run backend (production)**

```bash
cd server
npm run start
```

Use PM2, Docker, or another process manager for production.

---

### Deployment Guide

#### Frontend (Vercel)

1. Import repository into Vercel
2. Set **Root Directory** to `client`
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Configure environment variables if required (`VITE_API_BASE_URL`)
7. Deploy

`client/vercel.json` handles SPA routing.

#### Backend (Render, Railway, Fly.io, Heroku)

* Root Directory: `server`
* Start command: `npm start`
* Required environment variables:

  * `MONGO_URI`
  * `JWT_SECRET`
  * `CLIENT_URL`

Ensure CORS allows your frontend domain.

---

## API & Socket Overview

### REST API

Routes are organized by module:

* `auth` — authentication and authorization
* `appointments` — booking and status management
* `messages` — message persistence

Routes location:

```
server/src/modules/*/*.routes.js
```

---

### Real-Time Messaging

* Socket.IO server initialized in `server/src/server.js`
* Clients connect via `socket.io-client`
* Supports real-time chat and message events

---

## Data Models (High Level)

### User

* Role: admin / teacher / student
* Credentials
* Profile data

### Appointment

* Student reference
* Teacher reference
* Date and time
* Status and notes

### Message

* Sender
* Receiver
* Content
* Timestamp

Schemas are defined in `server/src/models/`.

---

## Scripts & Useful Commands

```bash
cd server && npm run dev
cd server && npm run start
cd server && npm run seed:admin

cd client && npm run dev
cd client && npm run build
cd client && npm run lint
```

---

## Contributing

1. Open an issue describing the bug or feature
2. Fork the repository
3. Create a feature branch
4. Submit a pull request with a clear description

Maintain existing code style and structure.

---

