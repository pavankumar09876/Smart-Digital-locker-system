# Smart Digital Locker System - Backend

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)
[![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio)](https://www.twilio.com/)

A robust, secure backend API for a contactless item exchange system using smart physical lockers. Built with FastAPI, this system enables users to deposit items in lockers and allows receivers to collect them securely using OTP verification via SMS or email.

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based authentication with access and refresh tokens
- **👥 Role-Based Access Control**: User and Admin roles with appropriate permissions
- **📦 Locker Management**: Location-based locker system without GPS dependency
- **🔄 Item Exchange Flow**: Secure deposit and collection with OTP verification
- **💰 Automated Billing**: ₹50 per hour billing system with transaction tracking
- **📱 Multi-Channel Notifications**: SMS (Twilio) and Email (SMTP) notifications
- **⚡ Rate Limiting**: Redis-based rate limiting for API protection
- **🔒 Security**: Argon2 password hashing, OTP security, and input validation
- **📊 Admin Dashboard**: Locker management and force-clear capabilities

## 🛠️ Technology Stack

### Backend Framework
- **FastAPI**: High-performance async web framework
- **Python 3.10+**: Modern Python with async support

### Database & ORM
- **PostgreSQL**: Robust relational database
- **SQLAlchemy**: Async ORM with PostgreSQL support
- **Alembic**: Database migration tool

### Security & Authentication
- **JWT**: JSON Web Tokens for authentication
- **Argon2**: Secure password and OTP hashing
- **Passlib**: Password hashing library

### External Services
- **Twilio**: SMS notifications and OTP delivery
- **Redis**: Caching and rate limiting
- **SMTP**: Email notifications

### Development Tools
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server
- **Rich**: Beautiful CLI output

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── core/                   # Core functionality
│   │   ├── config.py           # Environment variables & settings
│   │   ├── database.py         # Database connection & session
│   │   ├── hashing.py          # Password & OTP hashing utilities
│   │   ├── security.py         # Authentication & role-based access
│   │   ├── token.py            # JWT token generation & validation
│   │   ├── rate_limiter.py     # Redis-based rate limiting
│   │   └── redis.py            # Redis client configuration
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── auth.py             # User model & Role enum
│   │   ├── state.py            # State model
│   │   ├── city.py             # City model
│   │   ├── locker_point.py     # Locker point model
│   │   ├── locker.py           # Locker model
│   │   ├── items.py            # Item model
│   │   └── transcation.py      # Transaction model
│   ├── schemas/                # Pydantic request/response schemas
│   │   ├── auth.py             # Authentication schemas
│   │   ├── state.py            # State schemas
│   │   ├── city.py             # City schemas
│   │   ├── locker_point.py     # Locker point schemas
│   │   ├── locker.py           # Locker schemas
│   │   └── item.py             # Item schemas
│   ├── services/               # Business logic services
│   │   ├── otp.py              # OTP generation & verification
│   │   ├── sms.py              # Twilio SMS integration
│   │   ├── notifications.py    # Notification orchestration
│   │   ├── email_templates.py  # Email template definitions
│   │   └── billing.py          # Billing calculation logic
│   └── api/
│       └── v1/                 # API version 1
│           ├── routers.py      # Main API router
│           ├── users.py        # Authentication endpoints
│           ├── lockers.py      # Locker management endpoints
│           ├── items.py        # Item operations endpoints
│           ├── states.py       # State management endpoints
│           ├── cities.py       # City management endpoints
│           ├── locker_points.py # Locker point endpoints
│           └── admin/
│               └── routers.py  # Admin-only endpoints
├── .env                        # Environment variables (not committed)
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🗄️ Database Schema

### Core Entities

- **Users**: Authentication and role management
- **States**: Geographic state information
- **Cities**: City information within states
- **Locker Points**: Physical locations containing lockers
- **Lockers**: Individual storage units
- **Items**: Items stored in lockers
- **Transactions**: Billing and transaction records

### Relationships

```
State (1) ──── (N) City (1) ──── (N) LockerPoint (1) ──── (N) Locker (1) ──── (1) Item
```

## 🔧 Installation & Setup

### Prerequisites

- Python 3.10 or higher
- PostgreSQL database
- Redis server
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-digital-locker-system/backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On Unix/MacOS
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the `backend/app/` directory:

```env
# Database
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/locker_db

# JWT Configuration
ACCESS_SECRET_KEY=your_access_secret_key_here
REFRESH_SECRET_KEY=your_refresh_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_MINUTES=10080

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Redis Configuration
REDIS_URL=redis://localhost:6379

# OTP Configuration
OTP_EXPIRY_MINUTES=10
```

### 5. Database Setup

```bash
# Initialize database tables
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The database tables will be created automatically on startup.

## 🚀 Running the Application

### Development Server

```bash
uvicorn app.main:app --reload
```

The API will be available at:
- **API Base URL**: http://127.0.0.1:8000
- **Interactive API Docs**: http://127.0.0.1:8000/docs
- **Alternative Docs**: http://127.0.0.1:8000/redoc

### Production Deployment

```bash
# Using uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Using gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📡 API Endpoints

### Authentication (`/Auth`)
- `POST /Auth/signup` - User registration
- `POST /Auth/login` - User login
- `POST /Auth/refresh` - Refresh access token
- `GET /Auth/me` - Get current user info
- `GET /Auth/` - Get all users (Admin only)

### Lockers (`/lockers`)
- `GET /lockers/` - List available lockers
- `GET /lockers/{locker_id}` - Get locker details
- `GET /lockers/by-place?location=AreaName` - Search lockers by location

### Items (`/Items`)
- `POST /Items/` - Add item to locker
- `POST /Items/lockers/{locker_id}/request-otp` - Request OTP for collection
- `POST /Items/lockers/{locker_id}/collect` - Collect item with OTP

### Admin Operations (`/Admin`)
- `POST /Admin/` - Create new locker
- `PUT /Admin/{locker_id}` - Update locker
- `DELETE /Admin/{locker_id}` - Delete locker
- `DELETE /Admin/{locker_id}/force-clear` - Force clear occupied locker

### Location Management
- `GET /states/all` - Get all states
- `POST /states/` - Create state (Admin)
- `GET /cities/` - Get all cities
- `POST /cities/` - Create city (Admin)
- `GET /locker-points/` - Get locker points
- `POST /locker-points/` - Create locker point (Admin)

## 🔐 Authentication Flow

1. **Registration**: User creates account with email and password
2. **Login**: User authenticates and receives access + refresh tokens
3. **API Access**: Include `Authorization: Bearer <access_token>` header
4. **Token Refresh**: Use refresh token to get new access token when expired

## 🛡️ Security Features

- **Password Security**: Argon2 hashing for passwords
- **OTP Security**: Time-limited OTPs with secure hashing
- **Rate Limiting**: Redis-based protection against abuse
- **Input Validation**: Pydantic schemas for all inputs
- **CORS Protection**: Configured for allowed origins
- **Role-Based Access**: Admin/User permissions enforcement

## 💰 Billing System

- **Rate**: ₹50 per hour
- **Calculation**: Automatic based on storage duration
- **Transaction Tracking**: Complete audit trail
- **Notifications**: Email alerts for billing information

## 📱 Notification System

### SMS Notifications (Twilio)
- OTP delivery for item collection
- Status updates

### Email Notifications
- Item storage confirmation (sender)
- Collection notification (receiver)
- Billing information

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

## 📊 Monitoring & Logging

- **Structured Logging**: JSON-formatted logs
- **Error Tracking**: Comprehensive error handling
- **Performance Monitoring**: Async operation tracking
- **Redis Monitoring**: Connection and performance metrics

## 🔄 API Versioning

Current API version: **v1**
- Base path: `/api/v1/`
- Version headers for future compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 style guidelines
- Write comprehensive tests
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Future Enhancements

- [ ] Locker size support
- [ ] Camera verification system
- [ ] QR code collection
- [ ] Advanced analytics dashboard
- [ ] Mobile app API endpoints
- [ ] Multi-language support
- [ ] Advanced search and filtering

---

**Built with ❤️ using FastAPI**
