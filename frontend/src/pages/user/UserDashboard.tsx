import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosClient';
import { 
    Package, 
    Clock, 
    ShieldCheck, 
    MapPin, 
    Activity,
    Lock,
    ChevronRight,
    Sun,
    Moon,
    Cloud,
    Mail,
    Phone,
    CheckCircle,
    TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');
    const [greetingIcon, setGreetingIcon] = useState(<Sun />);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Fetch active booking
    const { data: activeBooking } = useQuery({
        queryKey: ['active-booking'],
        queryFn: async () => {
            try {
                const response = await api.get('/items/active');
                return response.data;
            } catch (error) {
                console.error('Failed to fetch active booking:', error);
                return null;
            }
        },
        retry: 1,
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    // Time-aware greeting
    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            const time = new Date();
            setCurrentTime(time);
            
            if (hour >= 5 && hour < 12) {
                setGreeting('Good Morning');
                setGreetingIcon(<Sun className="text-yellow-400" />);
            } else if (hour >= 12 && hour < 17) {
                setGreeting('Good Afternoon');
                setGreetingIcon(<Cloud className="text-blue-400" />);
            } else {
                setGreeting('Good Evening');
                setGreetingIcon(<Moon className="text-indigo-400" />);
            }
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // Mock data - in real app, this would come from APIs
    const lockerStats = {
        activeLockers: activeBooking ? 1 : 0,
        totalTransactions: 8,
        savedTime: '2.5 hours'
    };

    const recentActivity = [
        ...(activeBooking ? [{
            id: 'active-booking',
            action: 'Locker Booked',
            location: activeBooking.locker_name || 'Unknown Location',
            time: 'Just now',
            status: 'active'
        }] : []),
        { id: 2, action: 'Package Collected', location: 'Airport Terminal', time: '1 day ago', status: 'completed' },
        { id: 3, action: 'Reserved Locker', location: 'Central Station', time: '3 days ago', status: 'completed' }
    ];

    const quickActions = [
        {
            title: activeBooking ? 'View Booking' : 'Reserve a Locker',
            description: activeBooking ? 'Manage your active locker booking' : 'Find and book a secure locker near you',
            icon: activeBooking ? <Lock size={24} /> : <MapPin size={24} />,
            color: activeBooking ? 'from-emerald-500 to-teal-600' : 'from-violet-500 to-purple-600',
            link: activeBooking ? '/my-lockers' : '/locations',
            primary: true,
            disabled: !!activeBooking
        },
        {
            title: 'My Lockers',
            description: 'View and manage your active lockers',
            icon: <Lock size={24} />,
            color: 'from-blue-500 to-cyan-600',
            link: '/my-lockers',
            primary: false
        },
        {
            title: 'Activity History',
            description: 'Track all your locker transactions',
            icon: <Clock size={24} />,
            color: 'from-emerald-500 to-teal-600',
            link: '/history',
            primary: false
        }
    ];

    const getUserInitials = (name?: string) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Welcome Section - Hero Card */}
                <div className="glass-card p-8 mb-8 relative overflow-hidden animate-slide-up">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-cyan-600/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* User Welcome */}
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex-center text-white font-bold text-xl shadow-lg">
                                        {getUserInitials(user?.name)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                                </div>
                                
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {greetingIcon}
                                        <h1 className="text-3xl lg:text-4xl font-bold text-white">
                                            {greeting}, {user?.name?.split(' ')[0] || 'User'}!
                                        </h1>
                                    </div>
                                    <p className="text-slate-300 text-lg">
                                        Your secure storage solution is ready. Keep your items safe and accessible.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Time Display */}
                            <div className="text-right">
                                <div className="text-2xl font-mono text-white">
                                    {currentTime.toLocaleTimeString()}
                                </div>
                                <div className="text-slate-400 text-sm">
                                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Action Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {quickActions.map((action, index) => (
                        <div key={action.title} className="relative">
                            {action.disabled ? (
                                <div className="group relative overflow-hidden rounded-2xl opacity-75 cursor-not-allowed">
                                    <div className="glass-card p-6 h-full border border-white/10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-700 opacity-50"></div>
                                        <div className="relative z-10">
                                            <div className="inline-flex p-3 rounded-xl bg-slate-600 text-white mb-4 shadow-lg">
                                                {action.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {action.title}
                                            </h3>
                                            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                                                {action.description}
                                            </p>
                                            <div className="flex items-center text-slate-400 font-medium">
                                                You already have an active locker booking
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                    <Link
                                        to={action.link}
                                        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className={`glass-card p-6 h-full border border-white/10 hover:border-white/20`}>
                                            {/* Gradient background on hover */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                            
                                            <div className="relative z-10">
                                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} text-white mb-4 shadow-lg`}>
                                                    {action.icon}
                                                </div>
                                                
                                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                                    {action.title}
                                                </h3>
                                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                                    {action.description}
                                                </p>
                                                
                                                <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                                                    {action.primary ? 'Get Started' : 'View Details'}
                                                    <ChevronRight size={18} className="ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                        </div>
                    ))}
                </div>

                {/* Stats & Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Active Booking Card */}
                    {activeBooking && (
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Lock className="text-emerald-400" size={20} />
                                        Booked Locker
                                    </h2>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                        <CheckCircle size={12} className="text-emerald-400" />
                                        <span className="text-emerald-400 text-xs font-medium">ACTIVE</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2">Locker ID</label>
                                            <div className="text-white font-mono text-lg">{activeBooking.locker_id}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2">Status</label>
                                            <div className="text-emerald-400 font-semibold">Booked</div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2">Booking Date</label>
                                            <div className="text-white">{formatDate(activeBooking.created_at)}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2">Collection Date</label>
                                            <div className="text-white">{formatDate(activeBooking.collection_date) || 'Not scheduled'}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <Mail size={12} className="text-slate-500" />
                                                Receiver Email
                                            </label>
                                            <div className="text-white">{activeBooking.receiver_email}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <Phone size={12} className="text-slate-500" />
                                                Receiver Phone
                                            </label>
                                            <div className="text-white">{activeBooking.receiver_phone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Regular Stats (when no active booking) */}
                    {!activeBooking && (
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                                            <Lock size={20} />
                                        </div>
                                        <span className="text-xs text-emerald-400 font-medium">+12%</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{lockerStats.activeLockers}</h3>
                                    <p className="text-slate-400 text-sm">Active Lockers</p>
                                </div>

                                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                            <Activity size={20} />
                                        </div>
                                        <span className="text-xs text-emerald-400 font-medium">+8%</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{lockerStats.totalTransactions}</h3>
                                    <p className="text-slate-400 text-sm">Total Transactions</p>
                                </div>

                                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                            <TrendingUp size={20} />
                                        </div>
                                        <span className="text-xs text-emerald-400 font-medium">Saved</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{lockerStats.savedTime}</h3>
                                    <p className="text-slate-400 text-sm">Time Saved</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                            <Link to="/history" className="text-primary text-sm hover:underline">
                                View All
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/10 transition-all animate-slide-up" style={{ animationDelay: `${700 + index * 100}ms` }}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex-center ${
                                            activity.status === 'active' 
                                                ? 'bg-emerald-500/20 text-emerald-400' 
                                                : 'bg-slate-700 text-slate-400'
                                        }`}>
                                            {activity.status === 'active' ? <Package size={18} /> : <Clock size={18} />}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">{activity.action}</h4>
                                            <p className="text-slate-400 text-sm">{activity.location}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-sm">{activity.time}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            activity.status === 'active' 
                                                ? 'bg-emerald-500/20 text-emerald-400' 
                                                : 'bg-slate-700 text-slate-400'
                                        }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Account Status Card */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '700ms' }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex-center text-white">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Account Status</h3>
                                    <p className="text-emerald-400 text-sm">Premium Member</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Member Since</span>
                                    <span className="text-white font-medium">Jan 2024</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Verification</span>
                                    <span className="text-emerald-400 font-medium">Verified</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Storage Limit</span>
                                    <span className="text-white font-medium">10 Items</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 p-4 bg-slate-800/40 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 text-sm">Storage Used</span>
                                    <span className="text-white font-medium">2/10</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '800ms' }}>
                            <h3 className="font-bold text-white mb-4">Quick Tips</h3>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Use QR codes for faster locker access
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Share OTPs securely with recipients
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Track all your transactions in history
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
