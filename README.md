# Locker Exchange API

📦 A backend system that allows two users to exchange items **without meeting in person** using physical lockers placed at different locations. One user drops an item into a locker, and the receiver collects it securely using OTP verification.

---

## Use Case Example

1. Sender (User A) adds an item to an available locker
2. Sender provides the receiver’s phone number or email during item creation
3. Receiver goes to the locker location
4. Receiver enters their phone number or email to request an OTP
5. System sends OTP to the receiver (via SMS or Email)
6. Receiver enters the OTP
7. OTP is verified successfully
8. Locker opens and the receiver collects the item
9. When the receiver collects the item, automatically send an email to the sender saying item collected
10. Locker status is updated to AVAILABLE again

---

***Technology Stack***

Backend: FastAPI
Database: PostgreSQL
ORM: SQLAlchemy (Async)
Authentication: OTP with Argon2 (Passlib)
Python Version: 3.10+

---

## Core Features

- User authentication (JWT access & refresh tokens)
- Role-based access (Admin / User)
- Locker management by location (no GPS required)
- Item drop & collect flow with OTP
- SMS notification using Twilio
- Admin force-clear and locker management

---

## Project Structure

FASTAPI2/
├── backend/                         # Backend application root
│   ├── app/                         # Main FastAPI application package
│   │   ├── api/                     # API layer (routes/controllers)
│   │   │   ├── v1/                  # API version v1
│   │   │   │   ├── admin/           # Admin-only routes
│   │   │   │   │   ├── routers.py   # Admin router (create/update/delete lockers)
│   │   │   │   │   └── __init__.py
│   │   │   │   ├── items.py         # Item-related routes (add, request OTP, collect)
│   │   │   │   ├── lockers.py       # Locker public routes (list, by place, details)
│   │   │   │   ├── users.py         # Auth routes (signup, login, me, refresh)
│   │   │   │   ├── routers.py       # Combines all v1 routers
│   │   │   │   └── __init__.py
│   │   │   └── __init__.py
│   │   ├── core/                    # Core application logic
│   │   │   ├── config.py            # Environment variables & settings
│   │   │   ├── database.py          # Database connection & session
│   │   │   ├── hashing.py           # Password hashing utilities
│   │   │   ├── security.py          # Auth dependencies & role checks
│   │   │   └── token.py             # JWT access & refresh token logic
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   │   ├── auth.py              # User model & Role enum
│   │   │   ├── items.py             # Item model
│   │   │   ├── locker.py            # Locker model
│   │   │   └── __init__.py
│   │   ├── schemas/                 # Pydantic schemas (request/response)
│   │   │   ├── auth.py              # Auth request/response schemas
│   │   │   ├── item.py              # Item schemas
│   │   │   ├── locker.py            # Locker schemas
│   │   │   └── __init__.py
│   │   ├── services/                # External & business services
│   │   │   ├── notifications.py     # Notification abstraction
│   │   │   ├── otp.py               # OTP generation & verification
│   │   │   ├── sms.py               # Twilio SMS integration
│   │   │   └── __init__.py
│   │   ├── main.py                  # FastAPI app entry point
│   │   └── __init__.py
│   ├── .env                         # Environment variables (not committed)
│   ├── README.md                    # Backend-specific documentation
│   └── venv/                        # Python virtual environment
├── .gitignore                       # Git ignored files
└── README.md                        # Project root documentation
└── requirements.txt                 # project dependencies


## Installation & Setup

Follow these steps to install dependencies and run the server locally.

---

### 1. Prerequisites

Make sure the following are installed on your system:

- Python **3.10 or higher**
- pip (comes with Python)
- Git
- PostgreSQL (optional – SQLite is supported for development)

Check Python version:

```bash
python --version

---

### 2. Clone The Repository
git clone <your-repository-url>
cd backend

---

### 3. Create and Activate Virtual Environment (Recommended)
python -m venv venv
venv\Scripts\activate

---

### 4. Install Dependencies
Install all required Python packages using requirements.txt
pip install --upgrade pip
pip install -r requirements.txt

---

### 5. Configure Environment Variables
Create a .env file inside the backend/ directory.

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=josh@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx
EMAIL_FROM=your_email@gmail.com

DATABASE_URL='postgresql+asyncpg://postgres:password@localhost:5432/database_name'

ACCESS_SECRET_KEY="access_secret_key"
REFRESH_SECRET_KEY="refresh_secret_key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_MINUTES=10080

---

### 6. Start the Server
Run the FastAPI development server:
uvicorn app.main:app --reload

---

### 7. Access the Application

Once the server is running, you can access the application using the following URLs:

- **API Base URL**  
  http://127.0.0.1:8000

- **Swagger API Documentation** (Interactive)  
  http://127.0.0.1:8000/docs

- **ReDoc API Documentation** (Readable format)  
  http://127.0.0.1:8000/redoc

---

## Authentication Flow

- **Signup** → Create user account
- **Login** → Receive `access_token` and `refresh_token`
- **Refresh** → Generate new access token
- **Authorization** → `Authorization: Bearer <access_token>`

---

## API Modules Overview

### USERS AUTH

#### POST `/Auth/signup`
Create a new user account.

**Body**
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "StrongPassword@123"
}
```

---

#### POST `/Auth/login`
Authenticate user and return tokens.

**Body**
```json
{
  "email": "john@example.com",
  "password": "StrongPassword@123"
}
```

**Response**
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer"
}
```

---

#### POST `/Auth/refresh`
Generate a new access token using refresh token.

**Body**
```json
{
  "refresh_token": "..."
}
```

---

#### GET `/Auth/`
Get all users (Admin only).

---

#### GET `/Auth/me`
Get currently logged-in user details.

---

### USERS LOCKERS

#### GET `/lockers/`
Get all lockers.

---

#### GET `/lockers/by-place?location=AreaName`
Get lockers by physical place name.

**Query Param**
- `location` – string

---

#### GET `/lockers/{locker_id}`
Get locker details by ID.

---

### ITEMS

#### POST `/Items/`
Add item to an available locker.

**Auth**: User

---

#### POST `/Items/lockers/{locker_id}/request-otp`
Request OTP to collect an item.

- Generates OTP
- Stores hashed OTP
- Sends OTP via SMS

---

#### POST `/Items/lockers/{locker_id}/collect`
Collect item using OTP.

**Body**
```json
{
  "otp": "123456"
}
```

---

### ADMIN ROUTES (Role = admin)

#### POST `/Admin/`
Create a new locker.

---

#### PUT `/Admin/{locker_id}`
Update locker details.

---

#### DELETE `/Admin/{locker_id}`
Delete locker (only if empty).

---

#### DELETE `/Admin/{locker_id}/force-clear`
Force clear locker even if occupied.

- Deletes item
- Marks locker as AVAILABLE

---

## Key Features 

🔐 Secure OTP-based authentication (Argon2 hashing)

⏱️ Time-limited OTP expiration

📦 Locker availability management

🚀 Asynchronous FastAPI backend

🗄️ PostgreSQL / SQLAlchemy ORM

🔄 Status tracking for lockers and items


## Locker Concept (No GPS)

- Lockers are identified by **human-readable locations** (e.g., "Mall Entrance", "Metro Station A")
- Users search lockers by place name
- No latitude/longitude required

---

## Security

- Password hashing using Argon2
- OTP hashed before storage
- JWT-based authentication
- Role-based route protection

---

## Future Enhancements

- 🔐Locker size support
- 📷 Locker camera verification
- 📊 Admin dashboard
- 🔑 QR-code based collection
- 🧾 Audit logs

---

## Licence

- This project is intended for educational and internal use.
- Licensing can be added based on deployment needs.


## System Flow Diagram (Conceptual)

┌──────────┐
│  Sender  │
│ (User A) │
└────┬─────┘
     │ 1. Login / Signup
     ▼
┌──────────────────────┐
│ Authentication Layer │
│ (JWT Access Token)   │
└────┬─────────────────┘
     │
     │ 2. Add Item + Receiver Info
     │    (Phone / Email)
     ▼
┌──────────────────────┐
│      Item Service    │
│  - Create Item       │
│  - Assign Locker     │
│  - Save Receiver     │
└────┬─────────────────┘
     │
     │ 3. Locker becomes OCCUPIED
     ▼
┌──────────────────────┐
│        Locker        │
│  Physical Location   │
│  (e.g. Mall, Metro)  │
└─────────┬────────────┘
          │
          │ Receiver arrives
          ▼
┌──────────┐
│ Receiver │
└────┬─────┘
     │ 4. Enter Phone / Email
     ▼
┌──────────────────────┐
│      OTP Service     │
│  - Validate Receiver │
│  - Generate OTP      │
│  - Hash OTP          │
└────┬─────────────────┘
     │
     │ 5. Send OTP
     ▼
┌──────────────────────┐
│ Notification Service │
│   (SMS / Email)      │
│      Twilio          │
└─────────┬────────────┘
          │
          │ 6. Enter OTP
          ▼
┌──────────────────────┐
│ OTP Verification     │
│ - Verify Hash        │
│ - Check Expiry       │
└────┬─────────────────┘
     │
     │ 7. Success
     ▼
┌──────────────────────┐
│   Locker Opens       │
│ Item is Collected    │
│ Locker → AVAILABLE   │
└──────────────────────┘

## Admin Control Flow (Diagram)

┌──────────┐
│  Admin   │
└────┬─────┘
     │ Admin Login
     ▼
┌──────────────────────┐
│ Role-Based Security  │
│ (admin only access)  │
└────┬─────────────────┘
     │
     ├── Create Locker
     ├── Update Locker
     ├── Delete Locker
     └── Force Clear Locker
             │
             ▼
     ┌────────────────────┐
     │ Occupied Locker    │
     │ Item Removed       │
     │ Locker AVAILABLE   │
     └────────────────────┘
