# Dayly — MERN To-Do App

A clean, good-looking personal to-do app where you plan your whole day and tick tasks off. Each person signs up, logs in, and gets their own private list. Built on the **MERN stack** (MongoDB, Express, React, Node.js) with JWT authentication.

![Stack](https://img.shields.io/badge/stack-MERN-4f46e5) ![License](https://img.shields.io/badge/license-MIT-8b5cf6)

## Features

- **Sign up & log in** — secure JWT auth, passwords hashed with bcrypt
- **Private task lists** — every user only ever sees their own tasks
- **Add, edit, delete tasks** — double-click a task to rename it inline
- **Tick tasks done** — one click, with a live "today's progress" ring
- **Categories** — tag each task (Work, Personal, Study, Health…) with colored chips
- **Filters & search** — filter by status (All / Active / Done) or category, and search by keyword
- **Polished UI** — Tailwind CSS, Plus Jakarta Sans, smooth micro-interactions, fully responsive, keyboard-accessible

## Tech stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | React 18, Vite, React Router, Tailwind CSS, Axios      |
| Backend    | Node.js, Express                                       |
| Database   | MongoDB with Mongoose                                  |
| Auth       | JSON Web Tokens (JWT) + bcryptjs                        |

## Project structure

```
mern-todo-app/
├── server/                 # Express API
│   ├── config/db.js        # MongoDB connection
│   ├── models/             # User & Task schemas
│   ├── middleware/         # JWT auth guard
│   ├── controllers/        # Auth & task logic
│   ├── routes/             # /api/auth and /api/tasks
│   ├── server.js           # App entry point
│   └── .env.example        # Environment template
└── client/                 # React app (Vite)
    ├── src/
    │   ├── api/axios.js     # Axios instance w/ token interceptor
    │   ├── context/         # AuthContext (login state)
    │   ├── components/      # Navbar, TaskForm, TaskItem, Filters…
    │   ├── pages/           # Login, Signup, Dashboard
    │   └── utils/           # Category colors
    └── vite.config.js       # Dev proxy /api → :5000
```

## Prerequisites

- **[Node.js](https://nodejs.org/) 18 or newer** (includes npm)
- **MongoDB** — either:
  - a local install ([MongoDB Community Server](https://www.mongodb.com/try/download/community)), or
  - a free cloud database from [MongoDB Atlas](https://www.mongodb.com/atlas/database) (no install needed)

## Getting started

You'll run **two terminals**: one for the backend, one for the frontend.

### 1. Backend (API)

```bash
cd server
npm install

# Create your environment file from the template
cp .env.example .env        # Windows PowerShell: copy .env.example .env
```

Open `server/.env` and set your values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_todo
JWT_SECRET=some_long_random_string_change_me
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> **Using MongoDB Atlas instead of local?** Set `MONGO_URI` to the connection
> string from your Atlas cluster, e.g.
> `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/mern_todo`

Start the server:

```bash
npm run dev      # auto-reloads on changes (uses nodemon)
# or: npm start
```

You should see `✅ MongoDB connected` and `🚀 Server running on http://localhost:5000`.

### 2. Frontend (React)

In a **second terminal**:

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints — **http://localhost:5173**. Create an account and start adding tasks.

> The Vite dev server proxies all `/api` requests to `http://localhost:5000`,
> so you don't need to configure any URLs for local development.

## How authentication works

1. On signup/login the server returns a signed **JWT**.
2. The token is stored in the browser and attached as `Authorization: Bearer <token>` on every request (see `client/src/api/axios.js`).
3. Protected task routes verify the token and load the matching user (`server/middleware/authMiddleware.js`).
4. Every task is tied to its owner, so users can only read and change their own tasks.

## API reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint        | Body                          | Description                |
| ------ | --------------- | ----------------------------- | -------------------------- |
| POST   | `/auth/signup`  | `{ name, email, password }`   | Create account, get token  |
| POST   | `/auth/login`   | `{ email, password }`         | Log in, get token          |
| GET    | `/auth/me`      | — (Bearer token)              | Get the current user       |

### Tasks (all require a Bearer token)

| Method | Endpoint             | Body / Query                          | Description               |
| ------ | -------------------- | ------------------------------------- | ------------------------- |
| GET    | `/tasks`             | `?status=&category=&search=`          | List your tasks           |
| POST   | `/tasks`             | `{ title, notes?, category? }`        | Create a task             |
| PUT    | `/tasks/:id`         | `{ title?, notes?, category?, completed? }` | Update a task       |
| PATCH  | `/tasks/:id/toggle`  | —                                     | Flip done / not done      |
| DELETE | `/tasks/:id`         | —                                     | Delete a task             |

## Troubleshooting

- **`MongoDB connection error`** — Make sure MongoDB is running locally (`mongod`), or that your Atlas `MONGO_URI` is correct and your IP is allow-listed in Atlas.
- **Login works but tasks won't load** — Confirm the backend is running on port 5000 and check the browser console/network tab.
- **CORS errors** — Ensure `CLIENT_URL` in `server/.env` matches where the React app runs (default `http://localhost:5173`).
- **Port already in use** — Change `PORT` in `server/.env`, or the `server.port` in `client/vite.config.js`.

## Building for production

```bash
cd client
npm run build      # outputs static files to client/dist
```

Serve `client/dist` from any static host and point it at your deployed API by
setting `VITE_API_URL` before building (see `client/.env.example`).

## License

MIT — use it, learn from it, make it yours.
