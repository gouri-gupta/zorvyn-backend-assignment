# 🚀 Zorvyn Backend Assignment

Backend system for **Finance Data Processing and Role-Based Access Control (RBAC)** built using **Node.js, Express, and MongoDB**.

---

## 📌 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Roles:
  - Admin
  - Analyst
  - Viewer

---

### 👤 User Management (Admin Only)
- Create user
- Update user
- Get all users (with filters)
- Get single user
- Email validation & duplicate check
- Password hashing using bcrypt

---

### 💰 Transaction Management
- Create transaction
- Get all transactions (role-based access)
- Get single transaction (ownership enforced)
- Update transaction (Admin only)
- Delete transaction (Admin only)

---

### 📊 Dashboard APIs (Analytics)
- Total Income
- Total Expenses
- Net Balance
- Category-wise breakdown
- Recent transactions

👉 Uses MongoDB Aggregation Pipeline

---

## 🔒 Role Access Summary

| Role    | Access |
|--------|--------|
| Viewer | Own data only |
| Analyst | All data (read-only) |
| Admin  | Full access |

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt

---

## ⚙️ Setup Instructions

### 1. Clone repository
```bash
git clone https://github.com/gouri-gupta/zorvyn-backend-assignment.git
cd zorvyn-backend-assignment
```
### 2. Install dependencies
```bash
npm install
```
### 3. Create .env file
```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run server
```bash
npm run dev
```

---

## 📡 API Endpoints (Sample)

### 🔐 Auth
- POST /api/auth/login
- POST /api/auth/register

### 👤 Users (Admin)
- POST /api/users
- GET /api/users
- GET /api/users/:id
- PATCH /api/users/:id

### 💰 Transactions
- POST /api/transactions
- GET /api/transactions
- GET /api/transactions/:id
- PATCH /api/transactions/:id
- DELETE /api/transactions/:id

### 📊 Dashboard
- GET /api/dashboard

---

## 📌 Key Highlights

- Proper MVC architecture
- Strong validation at controller level
- Ownership enforcement (not just route-level security)
- Clean and modular code structure
- Production-ready practices

---

## 👩‍💻 Author
- Gouri Gupta

