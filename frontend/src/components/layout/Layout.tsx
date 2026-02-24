import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import {
    LayoutDashboard,
    MapPin,
    Box,
    LogOut,
    History,
    Menu,
    X
} from 'lucide-react';
import { Role } from '../../interfaces/types';

const Layout: React.FC = () => {
    const { role, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
            ? 'bg-primary/20 text-white shadow-glow border border-primary/30'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`;

    return (
        <div className="flex min-h-screen bg-[url('/bg-mesh.png')] bg-cover bg-fixed">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 glass-card m-0 rounded-none border-t-0 border-b-0 border-l-0
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold text-gradient">SmartLocker</h1>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {role === Role.USER && (
                        <>
                            <NavLink 
                                to="/dashboard" 
                                className={navItemClass}
                                onClick={() => console.log('Dashboard clicked')}
                            >
                                <LayoutDashboard size={20} /> Dashboard
                            </NavLink>
                            <NavLink 
                                to="/locations" 
                                className={navItemClass}
                                onClick={() => console.log('Locations clicked')}
                            >
                                <MapPin size={20} /> Locations
                            </NavLink>
                            <NavLink 
                                to="/my-lockers" 
                                className={navItemClass}
                                onClick={() => console.log('My Lockers clicked')}
                            >
                                <Box size={20} /> My Items
                            </NavLink>
                            <NavLink 
                                to="/transactions" 
                                className={navItemClass}
                                onClick={() => console.log('Transactions clicked')}
                            >
                                <History size={20} /> Transactions
                            </NavLink>
                        </>
                    )}

                    {role === Role.ADMIN && (
                        <>
                            <NavLink 
                                to="/admin/dashboard" 
                                className={navItemClass}
                                onClick={() => console.log('Admin Overview clicked')}
                            >
                                <LayoutDashboard size={20} /> Overview
                            </NavLink>
                            <NavLink 
                                to="/admin/states" 
                                className={navItemClass}
                                onClick={() => console.log('Admin States clicked')}
                            >
                                <MapPin size={20} /> States & Cities
                            </NavLink>
                            <NavLink 
                                to="/admin/locker-points" 
                                className={navItemClass}
                                onClick={() => console.log('Admin Locker Points clicked')}
                            >
                                <MapPin size={20} /> Locker Points
                            </NavLink>
                            <NavLink 
                                to="/admin/lockers" 
                                className={navItemClass}
                                onClick={() => console.log('Admin Lockers clicked')}
                            >
                                <Box size={20} /> Manage Lockers
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <div className="mb-4 px-4">
                        <p className="text-sm text-slate-400">Signed in as</p>
                        <p className="font-semibold text-white truncate">{role}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full relative">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center p-4 glass-card m-4 rounded-xl sticky top-4 z-30">
                    <button onClick={() => setSidebarOpen(true)} className="text-white">
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-lg">SmartLocker</span>
                </header>

                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
