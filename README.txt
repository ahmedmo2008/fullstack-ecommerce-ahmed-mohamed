AERO ATERRA — FULL-STACK E-COMMERCE PLATFORM
===============================================

PROJECT SUMMARY
---------------
Aterra is a full-stack e-commerce platform for a boutique store selling
well-made everyday objects (ceramics, textiles, tools, lighting). It supports
two roles, Customer and Admin. Customers can browse, search, filter, sort
and paginate products, manage a shopping cart, place orders, and leave
reviews. Admins manage products (including image upload), categories,
orders, and view store statistics from a dedicated dashboard.

This is a Capstone Project built to demonstrate a complete full-stack
workflow: environment setup, authentication and role management, product
and shopping features, frontend/backend integration with proper state
management, database design across two databases, additional services, and
a full testing and delivery pipeline.


TECHNOLOGIES USED
------------------
Frontend:
  - React 18 (Vite)
  - Tailwind CSS
  - React Router (dynamic routing)
  - TanStack React Query (server state)
  - React Context (auth state, cart state)
  - Axios (API integration)
  - Vitest + React Testing Library (component testing)
  - Mock Service Worker / MSW (API mocking in tests)

Backend:
  - Node.js + Express
  - PostgreSQL + Prisma ORM (users, products, categories, cart, orders)
  - MongoDB + Mongoose (product reviews, activity logs)
  - JWT authentication, bcryptjs password hashing
  - express-validator (input validation)
  - Multer (product image upload to local disk)
  - Nodemailer (welcome email on registration)
  - Jest + Supertest (unit and integration testing)

Delivery:
  - Docker + Docker Compose (frontend, backend, PostgreSQL, MongoDB)
  - Nginx (serves the built frontend in production)


PROJECT STRUCTURE
------------------
frontend/     React application (own package.json, own Dockerfile)
backend/      Express API application (own package.json, own Dockerfile)
docker-compose.yml   Runs all four services together
.env.example         Explains how to set up backend/.env and frontend/.env


HOW TO RUN THE PROJECT (DOCKER — RECOMMENDED)
-----------------------------------------------
Prerequisites: Docker and Docker Compose installed.

1. Copy the environment file templates:
     cp backend/.env.example backend/.env
     cp frontend/.env.example frontend/.env

2. Open backend/.env and set JWT_SECRET to any long random string.
   (SMTP_* values can be left blank — the app logs a message and
   continues instead of failing if no SMTP server is configured.)

3. From the project root, run:
     docker compose up --build

4. Wait for all four containers (postgres, mongo, backend, frontend) to
   start. The backend automatically runs its database migrations and
   seeds sample data (categories, products, an Admin account and a
   Customer account) every time it starts.

5. Open the Frontend URL below in your browser.

To stop everything:
     docker compose down

To stop and also delete all stored data (fresh database next time):
     docker compose down -v


HOW TO RUN THE PROJECT (WITHOUT DOCKER — MANUAL)
---------------------------------------------------
Requires local PostgreSQL and MongoDB instances running.

Backend:
     cd backend
     cp .env.example .env      (edit DATABASE_URL, MONGO_URI, JWT_SECRET)
     npm install
     npx prisma migrate dev
     node prisma/seed.js
     npm run dev

Frontend:
     cd frontend
     cp .env.example .env
     npm install
     npm run dev


PROJECT URLS
------------
Frontend:              http://localhost:5173
Backend API:            http://localhost:5000/api
Backend Health Check:   http://localhost:5000/api/health


TEST ACCOUNT CREDENTIALS
--------------------------
These accounts are created automatically by the Seed Data included in
this project (backend/prisma/seed.js) every time the backend starts.

Admin account:
     email:    admin@aterra.shop
     password: Admin123!

Customer account:
     email:    customer@aterra.shop
     password: Customer123!


RUNNING TESTS
-------------
Backend (Jest unit tests + Supertest integration tests):
     cd backend
     npm test
   Note: integration tests require DATABASE_URL to point to a reachable
   PostgreSQL database (the same one used by the app is fine). MongoDB
   is provided automatically in-memory by mongodb-memory-server for
   these tests, no setup needed.

Frontend (Vitest + React Testing Library, API mocked with MSW):
     cd frontend
     npm test


IMPORTANT NOTES
----------------
- Product images are stored on local disk inside the backend container,
  in a Docker volume (backend_uploads), so they persist across restarts.
- All secrets and connection strings are read from environment variables
  (backend/.env and frontend/.env) and are never hardcoded in source code.
  Only placeholder values are committed, in backend/.env.example and
  frontend/.env.example.
- The seed script is idempotent: re-running it (which happens on every
  backend container start) will not create duplicate categories,
  products, or users.
- If SMTP credentials are not provided, the welcome email step is
  skipped with a log message instead of failing user registration.
