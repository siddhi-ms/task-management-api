# Task Management System (MERN)

A full-stack task management application with JWT authentication, role-based access control, task CRUD, centralized validation/error handling, and a React client.

## Features

- User registration and login with JWT-based authentication.
- Role-based authorization (`user`, `admin`).
- Protected task APIs.
- Task CRUD operations.
- Ownership-based access for normal users.
- Admin visibility across all tasks.
- Pagination and filtering on task listing:
	- `page`
	- `limit`
	- `status`
	- `search` (title)
- Centralized request validation with consistent error responses.
- Centralized error handling for validation, ObjectId, JWT, duplicate email, and unexpected errors.
- React dashboard with:
	- Login/Register
	- Protected route
	- Add/Edit/Delete tasks
	- Loading and success/error states

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- Validation (`express-validator`)
- Security and logging (`helmet`, `cors`, `morgan`)

### Frontend

- React (Vite)
- Axios
- React Router DOM

## Setup

### 1. Clone and install backend

```bash
git clone <your-repository-url>
cd task_management-api
npm install
```

### 2. Configure backend environment

Create `.env` in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_management
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=1d
```

### 3. Run backend

```bash
npm run dev
```

### 4. Install and run frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on Vite default port and calls backend via `VITE_API_BASE_URL`.

## Environment Variables

### Backend (`task_management-api/.env`)

- `PORT`: API port (default: `5000`).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for signing/verifying JWTs.
- `JWT_EXPIRES_IN`: Token expiration (example: `1d`).

### Frontend (`task_management-api/client/.env`)

- `VITE_API_BASE_URL`: Backend base URL (example: `http://localhost:5000`).

## API Endpoints

Base URL: `http://localhost:5000`

### Health

- `GET /api/v1/health`

### Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Tasks (Protected)

Requires header:

```http
Authorization: Bearer <token>
```

- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks` - List tasks (supports `page`, `limit`, `status`, `search`)
- `GET /api/v1/tasks/:id` - Get task by ID
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

## Folder Structure

```text
task_management-api/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   `-- pages/
|   |-- package.json
|   `-- vite.config.js
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   `-- validators/
|-- server.js
|-- package.json
|-- postman-collection-api.json
`-- README.md
```

## Future Scalability

- Add refresh tokens and token revocation strategy.
- Introduce Redis for session/token blacklist and caching frequent queries.
- Add API rate limiting and request throttling.
- Add background jobs (email notifications, reminders) with a queue system.
- Add test coverage (unit/integration/e2e) with CI pipelines.
- Add soft deletes and audit logs for tasks and user actions.
- Add database indexes for high-volume filtering/search use cases.
- Add API versioning and OpenAPI/Swagger docs.
- Containerize with Docker and deploy with environment-based configs.

