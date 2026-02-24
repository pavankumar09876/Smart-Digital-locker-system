# Smart Digital Locker System 🔐

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A robust, secure, and contactless item exchange system using smart physical lockers. This full-stack application enables users to deposit items into lockers and allows receivers to collect them securely using OTP verification, eliminating the need for parties to meet in person.

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Authentication Flow](#-authentication-flow)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

### Core Functionality
- **Secure Storage**: Military-grade encryption and physical locker integration logic.
- **Contactless Exchange**: Deposit items and share a secure OTP for collection.
- **Role-Based Access**: Distinct dashboards and capabilities for **Users** and **Admins**.
- **Location Intelligence**: Hierarchical management of locker locations (State > City > Locker Point).
- **Real-time Billing**: Automated billing system (₹50/hr) with transaction tracking.

### User Features
- **Dashboard**: View active lockers and transaction history.
- **Locker Search**: Find lockers by location availability.
- **Secure Collection**: Retrieve items using OTP verification via SMS/Email.

### Admin Features
- **Infrastructure Management**: Manage States, Cities, and Locker Points.
- **Locker Oversight**: Create, delete, and force-clear lockers.
- **System Overview**: Monitor system health and usage statistics.

## 🛠️ Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 18 + Vite | High-performance UI library with fast build tool. |
| **Language** | TypeScript | Static typing for better developer experience. |
| **Styling**  | Tailwind CSS | Utility-first CSS framework for rapid UI development. |
| **State**    | TanStack Query | Powerful asynchronous state management. |

| **Backend**  | FastAPI | Modern, fast (high-performance) web framework for Python. |
| **Database** | PostgreSQL | Robust, open-source object-relational database system. |
| **ORM**      | SQLAlchemy (Async) | Python SQL toolkit and Object Relational Mapper. |
| **Caching**  | Redis | In-memory data structure store for caching & rate limiting. |
| **Auth**     | JWT + Argon2 | Secure token-based authentication and password hashing. |

## 📂 Project Structure

```bash
Smart_digital_locker_system/
├── backend/           # FastAPI application, database models, and API logic
│   ├── app/           # Core application code
│   ├── tests/         # Pytest suites
│   └── requirements.txt
├── frontend/          # React application
│   ├── src/           # Components, pages, hooks, and utils
│   └── package.json
└── README.md          # Project documentation
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.10+)
- PostgreSQL
- Redis Server

### 1. Backend Setup

Navigate to the backend directory and set up the Python environment.

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in `backend/app/` with your configuration (Database URL, JWT secrets, Twilio credentials, etc.). See `backend/README.md` for details.

Run the server:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies.

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env

# Run development server
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🔐 Authentication Flow

1. **Sign Up**: Users register with Name, Email, and Password.
2. **Login**: Returns an Access Token (short-lived) and Refresh Token.
3. **Usage**: The frontend attaches the Access Token to API requests via Axios interceptors.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---
Built with ❤️ using **FastAPI** and **React**.