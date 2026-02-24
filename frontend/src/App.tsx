import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Layout from './components/layout/Layout';
import { Role } from './interfaces/types';

import Login from './pages/public/Login.tsx';
import Signup from './pages/public/Signup.tsx';
import Landing from './pages/public/Landing.tsx';
// User Pages
import UserDashboard from './pages/user/UserDashboard.tsx';
import Locations from './pages/user/Locations.tsx';
import MyLockers from './pages/user/MyLockers.tsx';
import Transactions from './pages/user/Transactions.tsx';
import StoreItem from './pages/user/StoreItem.tsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStates from './pages/admin/ManageStates';
import ManageLockerPoints from './pages/admin/ManageLockerPoints';
import ManageLockers from './pages/admin/ManageLockers';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: Role[] }) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="flex-center h-screen">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Redirect to home/dashboard if unauthorized
  }

  return children;
};

const AppRoutes = () => {
  const { role } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Root redirect based on role */}
      <Route path="/app" element={<Navigate to={role === Role.ADMIN ? "/admin/dashboard" : "/dashboard"} replace />} />

      <Route element={<Layout />}>
        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={[Role.USER]}><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/locations" element={
          <ProtectedRoute allowedRoles={[Role.USER]}><Locations /></ProtectedRoute>
        } />
        <Route path="/store-item/:lockerId/:pointName/:lockerName" element={
          <ProtectedRoute allowedRoles={[Role.USER]}><StoreItem /></ProtectedRoute>
        } />
        <Route path="/my-lockers" element={
          <ProtectedRoute allowedRoles={[Role.USER]}><MyLockers /></ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute allowedRoles={[Role.USER]}><Transactions /></ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/states" element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}><ManageStates /></ProtectedRoute>
        } />
        <Route path="/admin/locker-points" element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}><ManageLockerPoints /></ProtectedRoute>
        } />
        <Route path="/admin/lockers" element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}><ManageLockers /></ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
