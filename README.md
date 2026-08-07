# Ledger - Advance Banking Transaction System

## Project Overview

Ledger - Advance Banking Transaction System is a full-stack MERN-based banking application developed to simulate the core operations of a modern digital banking environment. The system provides secure financial transaction processing through a role-based architecture consisting of Super Admin, Admin, Cashier, and Customer modules.

The project follows a modular client-server architecture consisting of three independent applications:

- Customer Application
- Admin Management Portal
- Backend REST API

Ledger enables secure account management, fund transfers, cash deposits, cash withdrawals, fund allocation, transaction monitoring, and administrative operations while ensuring data integrity through MongoDB transactions and JWT-based authentication.

The system is designed with scalability, security, reliability, and maintainability in mind, making it suitable for software engineering projects, educational demonstrations, and enterprise-level banking workflow simulations.

## Technology Stack

Ledger is built using the MERN stack along with modern frontend libraries and backend technologies to provide a secure, scalable, and responsive banking application.

| Category | Technologies |
|----------|--------------|
| **Frontend** | React.js, React Router DOM, Bootstrap 5, Material UI (MUI), React Bootstrap |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication & Security** | JSON Web Token (JWT), bcryptjs, Cookie Parser |
| **HTTP Communication** | Axios |
| **Charts & Analytics** | ApexCharts, React ApexCharts |
| **Notifications** | React Toastify |
| **Animations** | Lottie React, DotLottie React |
| **Receipt Generation** | HTML-to-Image |
| **Email Service** | Nodemailer |
| **Development Tools** | Vite, Nodemon, ESLint |
| **Environment Configuration** | Dotenv |
| **Version Control** | Git, GitHub |

### Development Environment

- **Frontend Framework:** React.js (Vite)
- **Backend Runtime:** Node.js
- **Backend Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Operating System:** Windows
- **API Architecture:** RESTful API        


## Installation Guide

### Prerequisites

Before running the project, make sure the following software is installed:

- Node.js (v20 or later recommended)
- MongoDB Community Server
- MongoDB Compass (Optional)
- Git (Optional)

### Step 1: Extract the Project

Extract the project ZIP file to your preferred location.

## Environment Variables

The project uses environment variables for configuration.

Create a `.env` file in each application by copying the provided `.env.example` file.

### Server

Copy:

```text
.env.example → .env
```

Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/ledger?replicaSet=rs0
JWT_SECRET=YOUR_JWT_SECRET
EMAIL_USER=YOUR_EMAIL
EMAIL_PASS=YOUR_EMAIL_PASSWORD
```
### Server.js 
 for creating your super admin uncoment the code and enter your details
  if (!exists) {
           await userModel.create({
    //     name: "Your Name",
    //     email: "Super Admin Email",
    //     password: "Your Password 123",
    //     name: "System Admin",
    //     email: "your AdminEmail",
    //     password: "your Password",
    //     role: "SUPER_ADMIN",
    //   });

    //   console.log("Super Admin created successfully via Server Boot!");
    // } else {
    //   console.log("Super Admin already exists in Database.");
    // }
### Customer Application

Copy:

```text
.env.example → .env
```

Example:

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

### Admin Management Portal

Copy:

```text
.env.example → .env
```

Example:

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

> **Important:** The repository contains only `.env.example` files. Before running the project, rename or copy each `.env.example` file to `.env` and update the values according to your local environment.

## Running the Project

### Start Backend Server

```bash
cd Server
npm run dev
```

---

### Start Customer Application

```bash
cd Client
npm run dev
```

---

### Start Admin Portal

```bash
cd Admin
npm run dev
```

After starting all three applications, open the URLs provided by Vite in your browser.

## Author

**Developed by**

**Obaid ur Rehman**

Software Engineering Student

---

Copyright © 2026

All Rights Reserved.