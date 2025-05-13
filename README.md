# CRUD API

This is a simple CRUD (Create, Read, Update, Delete) API built with **Node.js** and **TypeScript** using an **in-memory database**. It supports development and production environments, and includes a multi-process cluster mode with a load balancer for horizontal scaling.

---

## 📦 Installation

1. **Clone the repository**
   ```bash
    git clone <your-repo-url>
    cd <your-project-folder>
   ```

2. **Install dependencies**
   ```bash
    npm install
   ```

3. **Create a `.env` file**
   ```env
    PORT = 4000
    DB_SERVICE_PORT = 5000
   ```

---

## ▶️ Running the Application

### 🛠 Development Mode
```bash
npm run start:dev
```

### 🚀 Production Mode
```bash
npm run start:prod
```

### 🧪 Run Tests
```bash
npm run test
```

---

## 🔁 Cluster Mode (Horizontal Scaling)

You can run the app in multi-process mode using the Node.js `Cluster` API. A load balancer will distribute requests in a **round-robin** fashion to workers.

### Start in Cluster Mode

```bash
npm run start:multi
```

### How It Works

- Main process listens on `PORT` (e.g. `4000`) and distributes traffic
- Worker processes listen on `PORT + 1`, `PORT + 2`, ...
- Example (for 4 logical cores and `PORT=4000`):
  - Load balancer: `http://localhost:4000/api`
  - Workers:
    - `http://localhost:4001/api`
    - `http://localhost:4002/api`
    - `http://localhost:4003/api`

### Cluster DB Consistency

Workers share a consistent in-memory state:
1. `POST` to `localhost:4001/api/users` → user created
2. `GET` from `localhost:4002/api/users` → returns user
3. `DELETE` from `localhost:4003/api/users` → deletes user
4. `GET` from `localhost:4001/api/users` → user not found

---

## 🌐 API Endpoints

Base URL: `/api/users`

### 📋 Get All Users

- **GET** `/api/users`
- Returns an array of all users.
- **200 OK**

### 🔍 Get User by ID

- **GET** `/api/users/:id`
- Returns the user with the given `id`.
- **200 OK** – User found
- **400 Bad Request** – Invalid UUID
- **404 Not Found** – User not found

### ➕ Create New User

- **POST** `/api/users`
- Creates a new user.
- Request body:
  ```json
  {
    "username": "John",
    "age": 30,
    "hobbies": ["reading", "gaming"]
  }
  ```
- **201 Created** – User created
- **400 Bad Request** – Missing required fields

### ✏️ Update User by ID

- **PUT** `/api/users/:id`
- Updates an existing user.
- Request body:
  ```json
  {
    "username": "Updated Name",
    "age": 25,
    "hobbies": ["coding"]
  }
  ```
- **200 OK** – User updated
- **400 Bad Request** – Invalid UUID or missing fields
- **404 Not Found** – User not found

### ❌ Delete User by ID

- **DELETE** `/api/users/:id`
- Deletes a user by ID.
- **204 No Content** – User deleted
- **400 Bad Request** – Invalid UUID
- **404 Not Found** – User not found

---

## 🧾 User Object Schema

Each user object includes:

```ts
{
  id: string;       // uuid (auto-generated)
  username: string; // required
  age: number;      // required
  hobbies: string[]; // required
}
```

---

## ❗ Error Handling

- **404 Not Found** – For unknown endpoints
- **400 Bad Request** – For invalid UUID or body
- **500 Internal Server Error** – For unexpected server issues

---

## 🧰 Tools & Technologies

- Node.js (v22.x.x)
- TypeScript
- UUID for unique IDs
- dotenv for environment variables
- ts-node-dev / nodemon for development
- Node.js Cluster API for scaling

---

## 📄 License

This project is part of the [RS School Node.js Course](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md).