# Task Manager API

A RESTful API for managing tasks with authentication, filtering, and pagination.
Built with **Node.js, Express, MongoDB, and JWT authentication**.
Includes **security middleware** like Helmet, Rate Limiting, and CORS for production readiness.

---

## Features

* User registration and login (JWT-based authentication)
* Create, read, update, and delete tasks
* Task filtering by status, search query, and due date
* Pagination and sorting
* Validation using `express-validator`
* Secure endpoints with `checkAuth` and `checkAuthor` middleware
* Production-level security:

    * **Helmet** for HTTP headers
    * **Rate limiting** for request control
    * **CORS** for safe frontend communication

---

##  Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JSON Web Token (JWT)
* **Validation:** express-validator
* **Security:** Helmet, express-rate-limit, CORS
* **Environment management:** dotenv

---

## ⚙Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/task-manager-api.git
   cd task-manager-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory or copy from the example:

   ```bash
   cp .env.example .env
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Server runs on**

   ```
   http://localhost:4444
   ```

---

## Environment Variables

| Variable      | Description                     |
| ------------- | ------------------------------- |
| `MONGODB_URI` | MongoDB connection string       |
| `JWT_SECRET`  | Secret key for JWT              |
| `JWT_EXPIRE`  | Token expiration (e.g. `30d`)   |
| `CLIENT_URL`  | URL of your frontend (for CORS) |
| `PORT`        | Server port (default: 4444)     |

Example `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskdb
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
PORT=4444
```

---

## API Endpoints

### **Auth**

| Method | Endpoint    | Description                  |
| ------ | ----------- | ---------------------------- |
| `POST` | `/register` | Register new user            |
| `POST` | `/login`    | Login user and get JWT token |
| `GET`  | `/me`       | Get current user info        |

### **Tasks**

| Method   | Endpoint            | Description                               |
| -------- | ------------------- | ----------------------------------------- |
| `GET`    | `/tasks`            | Get all tasks (with filters & pagination) |
| `GET`    | `/tasks/my`         | Get tasks of logged-in user               |
| `GET`    | `/tasks/:id`        | Get a single task by ID                   |
| `POST`   | `/tasks`            | Create new task                           |
| `PATCH`  | `/tasks/:id`        | Update task (only author)                 |
| `PATCH`  | `/tasks/:id/status` | Update task status                        |
| `DELETE` | `/tasks/:id`        | Delete task                               |

---

## Security Highlights

* **Helmet:** adds secure HTTP headers to prevent XSS and clickjacking.
* **Rate limiting:** limits requests per IP (global + login-specific).
* **CORS:** allows cross-origin requests only from the defined frontend.
* **Trust Proxy:** configured for Render/Heroku hosting environments.

---

## Deployment

1. Push the project to GitHub.
2. Deploy backend on [Render](https://render.com) as a **Web Service**.

    * Build command: `npm install`
    * Start command: `npm run start`
    * Add environment variables from `.env`.
3. If you build a React frontend, deploy it on Render as a **Static Site** and connect via `CLIENT_URL`.

---

## About

This project was built as part of my backend development portfolio.
It demonstrates practical use of authentication, validation, and production-level security setup for RESTful APIs using Node.js.
