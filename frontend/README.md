# Smart Locker System - Frontend

This is a modern, responsive React + TypeScript frontend for the Smart Digital Locker System.

## Features

- **Authentication**: JWT-based secure login/signup with Role-based access (User/Admin).
- **User Dashboard**:
  - View Locker Locations (States > Cities > Points).
  - Store Items in real-time.
  - Collect Items using Secure OTP.
- **Admin Dashboard**:
  - Manage States and Cities.
  - Manage Locker Points.
  - Manage Lockers (Create, Delete, Force Clear).
  - View System Overview.

## Tech Stack

- **Framework**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism, Utility-first approach)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios with Interceptors

## Setup & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Configure Environment**
   - Create a `.env` file in the root (optional if defaults work).
   - Default API URL: `http://localhost:8000/api/v1`
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Backend Assumptions & Notes

- **API Structure**: Expects `/api/v1/*` endpoints.
- **Auth**: Expects `OAuth2` compatible or standard JSON Login flow.
  - Current implementation uses `POST /Auth/login` with query params `email` & `password` to match backend `Depends()` behavior observed in code analysis.
- **Locations**: Hierarchical data (State -> City -> LockerPoint -> Locker).
- **Missing Endpoints Handled**:
  - No "Get My Items" or "Get My Transactions" endpoints were found in the backend analysis.
  - "My Lockers" page uses a direct "Collect by ID" form instead of a list.
  - "Transactions" page is a placeholder.

## Folder Structure

- `src/api` - Axios client setup.
- `src/auth` - Auth Context & Guards.
- `src/components` - Reusable UI & Layouts.
- `src/pages` - Application screens (Public, User, Admin).
- `src/interfaces` - TypeScript definitions matching Pydantic schemas.
