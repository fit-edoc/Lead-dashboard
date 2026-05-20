# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and Next.js/TailwindCSS.

## Features
- **JWT Authentication** (Login/Register)
- **Role-Based Access Control** (Admin vs Sales User)
  - Admins can delete leads, sales users cannot.
- **Leads CRUD**
- **Advanced Filtering, Sorting & Search**
  - Search by Name/Email (Debounced)
  - Filter by Status and Source
  - Sort by Latest/Oldest
- **Pagination** on both frontend and backend
- **Dark Mode Support**
- **CSV Export** for leads
- **Responsive & Modern UI** utilizing Shadcn UI and TailwindCSS v4.

## Tech Stack
- **Frontend**: Next.js 15 (React), TypeScript, TailwindCSS v4, Zustand, Shadcn UI
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)
- Docker (optional)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file based on `.env.example`
4. `npm run dev` to start the backend on port 5000.

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` to start the frontend on port 3000.

### Docker Setup
You can run the entire application (MongoDB + Backend + Frontend) using Docker Compose:
```bash
docker-compose up --build
```
The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## API Documentation
### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Leads (Requires Bearer Token)
- `GET /api/leads` - Get all leads (Query params: search, status, source, sort, page)
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead (Admin only)
