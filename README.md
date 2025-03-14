# 📝 Task Management App
A full-stack **task management application** built with:
- **Backend:** NestJS + MongoDB
- **Frontend:** Next.js (React) + Redux Toolkit
- **Database:** MongoDB Atlas
- **Containerization:** Docker (for easier setup)

---

## 🚀 Getting Started
Follow these steps to run the project **locally** (without Docker) or using **Docker**.

### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** (v18+) → [Download Here](https://nodejs.org/)
- **MongoDB** → [Download Here](https://www.mongodb.com/try/download/community) or setup a MongoDB account for **MongoDB Atlas** (used by default in this project)
- **Docker** (optional) → [Install Here](https://docs.docker.com/get-docker/)

---

## 📌 Option 1: Run the App with Docker (Recommended)
If you want to **skip manual setup**, 

# Clone the Repository

```bash
git clone https://github.com/Darkboy17/task-management-app.git
cd task-management-app
```

Use MongoDB Atlas:
```
Create a free account on MongoDB Atlas.
Get your MongoDB Connection URI.
```
Then, create a .env file under root directory and paste the following:
```makefile

MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@your-cluster.mongodb.net/tasks-management
NEXT_PUBLIC_API_URL=http://localhost:4000
```
Replace ```YOUR_PASSWORD``` with your password.

Finally, simply run:

```sh
docker-compose up --build
```

This will automatically:
```
✅ Spin up MongoDB, Backend, and Frontend inside containers.
✅ Expose the backend at http://localhost:4000
✅ Expose the frontend at http://localhost:3001


```
---
Open your browser and visit [http://localhost:3001](http://localhost:3001)

## 📌 Option 2: Run Locally (Without Docker)

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/Darkboy17/task-management-app.git
cd task-management-app
```

### 3️⃣ Start MongoDB

Use MongoDB Atlas:
```
Create a free account on MongoDB Atlas.
Get your MongoDB Connection URI.
```
Create a .env file inside under the root folder (task-management-app) and paste the following:

```makefile
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@your-cluster.mongodb.net/tasks-management
NEXT_PUBLIC_API_URL=http://localhost:4000

Replace YOUR_PASSWORD with your password.
```


### 4️⃣ Start the Backend

```bash
cd backend
npm install
npm run start
```

Runs the NestJS backend on http://localhost:3000.

### 5️⃣ Start the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Runs the Next.js frontend on http://localhost:3001.

---

## 🧪 Running the Test Suite
You can run tests for both frontend and backend.

### 1️⃣ Run Backend Tests

```bash
cd backend
npm run test
```

Runs Jest unit and integration tests for the NestJS API.

### 2️⃣ Run Frontend Tests

```bash
cd ../frontend
npm run test
```

Runs Jest tests for React components, Redux slices, and async thunks.

The test results will be save in a file called "test-report.html" under the test-reports directory.

---

## 🎯 API Endpoints

| Method | Endpoint    | Description             |
|--------|-------------|-------------------------|
| GET    | /tasks      | Fetch all tasks         |
| GET    | /tasks/:id  | Fetch a task by id      |
| POST   | /tasks      | Add a new task          |
| PATCH  | /tasks/:id  | Update an existing task |
| DELETE | /tasks/:id  | Delete a task by id     |

---

## ❓ Troubleshooting

### Technical Issues
If there's an issue with the app running smoothly, use the following to see what's wrong (given that you opted Option 1):

```bash
docker ps
```
If you ran the app locally without "docker compose up --build" or Option 2, you will need to observe the terminals for error logs where you ran the backend and the frontend.

---

## 🎉 Now you're all set! Start creating your tasks.
