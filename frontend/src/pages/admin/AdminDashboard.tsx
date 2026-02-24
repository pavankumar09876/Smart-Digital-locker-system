import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosClient';
import { 
  Users, 
  MapPin, 
  Box, 
  Activity, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Settings,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch comprehensive stats
  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/Auth/').then(res => res.data)
  });

  const { data: states, refetch: refetchStates } = useQuery({
    queryKey: ['admin-states'],
    queryFn: () => api.get('/states/all').then(res => res.data)
  });

  // Calculate comprehensive statistics
  const totalLockers = states?.reduce((acc: number, state: any) => {
    return acc + state.cities?.reduce((cAcc: number, city: any) => {
      return cAcc + city.locker_points?.reduce((lAcc: number, lp: any) => {
        return lAcc + (lp.lockers?.length || 0);
      }, 0);
    }, 0);
  }, 0) || 0;

  const totalCities = states?.reduce((acc: number, state: any) => {
    return acc + (state.cities?.length || 0);
  }, 0) || 0;

  const totalLockerPoints = states?.reduce((acc: number, state: any) => {
    return acc + state.cities?.reduce((cAcc: number, city: any) => {
      return cAcc + (city.locker_points?.length || 0);
    }, 0);
  }, 0) || 0;

  // Calculate locker status
  const occupiedLockers = states?.reduce((acc: number, state: any) => {
    return acc + state.cities?.reduce((cAcc: number, city: any) => {
      return cAcc + city.locker_points?.reduce((lAcc: number, lp: any) => {
        return lAcc + (lp.lockers?.filter((l: any) => l.status === 'occupied').length || 0);
      }, 0);
    }, 0);
  }, 0) || 0;

  const availableLockers = totalLockers - occupiedLockers;
  const occupancyRate = totalLockers > 0 ? ((occupiedLockers / totalLockers) * 100).toFixed(1) : '0';

  const handleRefreshAll = async () => {
    setRefreshing(true);
    await Promise.all([refetchUsers(), refetchStates()]);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const mainStats = [
    { 
      label: 'Total Users', 
      value: users?.length || 0, 
      icon: Users, 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/10',
      change: '+12%',
      changeType: 'increase'
    },
    { 
      label: 'Active Lockers', 
      value: `${availableLockers}/${totalLockers}`, 
      icon: Box, 
      color: 'text-green-400', 
      bg: 'bg-green-400/10',
      change: '+5%',
      changeType: 'increase'
    },
    { 
      label: 'Occupancy Rate', 
      value: `${occupancyRate}%`, 
      icon: BarChart3, 
      color: 'text-purple-400', 
      bg: 'bg-purple-400/10',
      change: '+2.1%',
      changeType: 'increase'
    },
    { 
      label: 'System Health', 
      value: '98.5%', 
      icon: Activity, 
      color: 'text-orange-400', 
      bg: 'bg-orange-400/10',
      change: 'Stable',
      changeType: 'neutral'
    },
  ];

  const quickActions = [
    {
      title: 'Manage States & Cities',
      description: 'Add, edit, or remove states and cities',
      icon: MapPin,
      link: '/admin/states',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Locker Points',
      description: 'Manage locker locations and configurations',
      icon: MapPin,
      link: '/admin/locker-points',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Locker Management',
      description: 'Monitor and control individual lockers',
      icon: Box,
      link: '/admin/lockers',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences and policies',
      icon: Settings,
      link: '/admin/settings',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivity = [
    { type: 'user_register', message: 'New user registered', time: '2 mins ago', icon: Users, color: 'text-green-400' },
    { type: 'locker_occupied', message: 'Locker #A123 occupied', time: '5 mins ago', icon: Box, color: 'text-blue-400' },
    { type: 'system_alert', message: 'Low disk space warning', time: '15 mins ago', icon: AlertTriangle, color: 'text-orange-400' },
    { type: 'locker_maintenance', message: 'Locker #B456 maintenance complete', time: '1 hour ago', icon: CheckCircle, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">System overview and management</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefreshAll}
            className="btn btn-secondary flex items-center gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.changeType === 'increase' ? 'text-green-400' : 
                stat.changeType === 'decrease' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {stat.changeType !== 'neutral' && (
                  stat.changeType === 'increase' ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  to={action.link}
                  className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="p-6 relative z-10">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">{action.title}</h4>
                    <p className="text-slate-400 text-sm">{action.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            System Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
              <span className="text-slate-300">Total States</span>
              <span className="text-white font-semibold">{states?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
              <span className="text-slate-300">Total Cities</span>
              <span className="text-white font-semibold">{totalCities}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
              <span className="text-slate-300">Locker Points</span>
              <span className="text-white font-semibold">{totalLockerPoints}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
              <span className="text-slate-300">Total Lockers</span>
              <span className="text-white font-semibold">{totalLockers}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
              <span className="text-slate-300">Occupied Lockers</span>
              <span className="text-blue-400 font-semibold">{occupiedLockers}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
              <span className="text-slate-300">Available Lockers</span>
              <span className="text-green-400 font-semibold">{availableLockers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </h3>
          <button className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
            <Eye className="w-4 h-4" />
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
              <div className={`p-2 rounded-lg ${activity.color} bg-current/10`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.message}</p>
                <p className="text-slate-400 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
