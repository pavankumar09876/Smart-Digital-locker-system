import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosClient';
import type { State, LockerPoint, LockerMini } from '../../interfaces/types';
import { 
    MapPin, 
    Search, 
    Box, 
    Loader2, 
    Navigation,
    Clock,
    ShieldCheck,
    TrendingUp,
    Filter,
    ChevronDown,
    Star,
    Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Locations: React.FC = () => {
    const navigate = useNavigate();
    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [isSearching, setIsSearching] = useState(false);

    // Fetch States
    const { data: states, isLoading } = useQuery<State[]>({
        queryKey: ['states'],
        queryFn: async () => {
            const res = await api.get('/states/all');
            return res.data;
        }
    });

    const activeState = states?.find(s => s.name === selectedState);
    const activeCity = activeState?.cities?.find(c => c.name === selectedCity);

    const handleSearch = () => {
        if (selectedState && selectedCity) {
            setIsSearching(true);
            setTimeout(() => {
                setIsSearching(false);
            }, 1000);
        }
    };

    useEffect(() => {
        if (selectedState && selectedCity) {
            handleSearch();
        }
    }, [selectedState, selectedCity]);

    const popularLocations = [
        { state: 'California', city: 'Los Angeles', icon: <Star size={16} /> },
        { state: 'New York', city: 'New York City', icon: <TrendingUp size={16} /> },
        { state: 'Texas', city: 'Houston', icon: <Users size={16} /> }
    ];

    const handleLockerClick = (lockerPoint: LockerPoint, locker: LockerMini, index: number) => {
        navigate(`/store-item/${locker.id}/${lockerPoint.name}/Locker ${index + 1}`);
    };
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex-center mx-auto mb-6 shadow-lg animate-pulse">
                            <MapPin size={40} className="text-white" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Finding Locations</h2>
                    <p className="text-slate-400">Loading secure locker points near you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header Section */}
                <div className="text-center mb-12 animate-slide-up">
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex-center mx-auto mb-6 shadow-2xl">
                            <MapPin size={48} className="text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex-center">
                            <Navigation size={16} className="text-white" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4">
                        Find a Locker
                    </h1>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
                        Browse secure locations near you and reserve your locker in seconds
                    </p>
                </div>

                {/* Enhanced Search Section */}
                <div className="glass-card p-8 mb-8 relative overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-600/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Filter className="text-violet-400" size={20} />
                            <h2 className="text-xl font-bold text-white">Search Locations</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="relative">
                                <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                    <MapPin size={16} className="text-violet-400" />
                                    State
                                </label>
                                <div className="relative">
                                    <select
                                        className="input-field pl-12 appearance-none cursor-pointer"
                                        value={selectedState}
                                        onChange={e => { setSelectedState(e.target.value); setSelectedCity(''); }}
                                    >
                                        <option value="">Choose your state</option>
                                        {states?.map(s => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                    <Navigation size={16} className="text-violet-400" />
                                    City
                                </label>
                                <div className="relative">
                                    <select
                                        className="input-field pl-12 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={selectedCity}
                                        onChange={e => setSelectedCity(e.target.value)}
                                        disabled={!selectedState}
                                    >
                                        <option value="">Choose your city</option>
                                        {activeState?.cities?.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={handleSearch}
                                    disabled={!selectedState || !selectedCity || isSearching}
                                    className="btn btn-primary w-full h-14 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {isSearching ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search size={20} />
                                                Search Lockers
                                            </>
                                        )}
                                    </span>
                                    {selectedState && selectedCity && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Popular Locations */}
                        {!selectedState && (
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <h3 className="text-sm font-semibold text-slate-400 mb-4">Popular Locations</h3>
                                <div className="flex flex-wrap gap-3">
                                    {popularLocations.map((location, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedState(location.state);
                                                setTimeout(() => setSelectedCity(location.city), 100);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-violet-500/10 border border-slate-700 hover:border-violet-500/30 rounded-lg text-slate-300 hover:text-violet-300 transition-all duration-200 group"
                                        >
                                            <span className="text-violet-400">{location.icon}</span>
                                            <span className="text-sm font-medium">{location.city}, {location.state}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            {/* Results Section */}
                <div className="space-y-8">
                    {isSearching ? (
                        <div className="text-center py-20 animate-slide-up">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex-center mx-auto mb-6 shadow-lg">
                                    <Search size={40} className="text-white animate-bounce" />
                                </div>
                                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Searching Lockers</h3>
                            <p className="text-slate-400">Finding the best locations for you...</p>
                        </div>
                    ) : (
                        <>
                            {activeCity?.locker_points?.map((point, pointIndex) => (
                                <div key={point.id} className="glass-card p-8 transition-all duration-300 hover:border-primary/30 animate-slide-up" style={{ animationDelay: `${300 + pointIndex * 100}ms` }}>
                                    {/* Location Header */}
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex-center shadow-lg">
                                                <MapPin className="text-white" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2">{point.name}</h3>
                                                <p className="text-slate-400 flex items-center gap-2">
                                                    <Navigation size={16} />
                                                    {point.address || 'Address not available'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-emerald-400">
                                                    {point.lockers?.filter(l => l.status === 'AVAILABLE').length || 0}
                                                </div>
                                                <div className="text-sm text-slate-400">Available</div>
                                            </div>
                                            <div className="w-px h-12 bg-slate-700"></div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-slate-300">
                                                    {point.lockers?.length || 0}
                                                </div>
                                                <div className="text-sm text-slate-400">Total</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lockers Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {point.lockers?.map((locker, idx) => {
                                            const isAvailable = locker.status === 'AVAILABLE';
                                            return (
                                                <button
                                                    key={locker.id}
                                                    disabled={!isAvailable}
                                                    onClick={() => handleLockerClick(point, locker, idx)}
                                                    className={`
                                                        group relative p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 transform
                                                        ${isAvailable
                                                            ? 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 hover:from-emerald-500/10 hover:to-teal-500/10 hover:border-emerald-500/40 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/20 cursor-pointer'
                                                            : 'border-slate-700 bg-slate-800/50 cursor-not-allowed opacity-50 grayscale'}
                                                        animate-slide-up
                                                    `}
                                                    style={{ animationDelay: `${400 + pointIndex * 100 + idx * 50}ms` }}
                                                >
                                                    {/* Status Badge */}
                                                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                    
                                                    <Box
                                                        size={32}
                                                        className={`transition-all duration-300 ${isAvailable ? 'text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110' : 'text-red-400'}`}
                                                    />
                                                    
                                                    <div className="text-center">
                                                        <span className={`text-sm font-bold ${isAvailable ? 'text-emerald-100' : 'text-slate-500'}`}>
                                                            Locker {idx + 1}
                                                        </span>
                                                        <div className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full mt-2 ${isAvailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                                            {isAvailable ? 'Available' : 'Occupied'}
                                                        </div>
                                                    </div>

                                                    {/* Hover Effect */}
                                                    {isAvailable && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Location Stats */}
                                    <div className="mt-8 pt-6 border-t border-white/10">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3 text-slate-300">
                                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex-center">
                                                    <ShieldCheck size={20} className="text-emerald-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">Secure</div>
                                                    <div className="text-xs text-slate-500">24/7 Monitoring</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-300">
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex-center">
                                                    <Clock size={20} className="text-blue-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">Flexible</div>
                                                    <div className="text-xs text-slate-500">Any Duration</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-300">
                                                <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex-center">
                                                    <Users size={20} className="text-violet-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">Shared</div>
                                                    <div className="text-xs text-slate-500">Multi-User</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Empty States */}
                            {selectedCity && (!activeCity?.locker_points || activeCity.locker_points.length === 0) && (
                                <div className="text-center py-20 glass-card p-12 animate-slide-up">
                                    <div className="w-24 h-24 bg-slate-800 rounded-full flex-center mx-auto mb-6">
                                        <MapPin size={48} className="text-slate-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">No Locations Found</h3>
                                    <p className="text-slate-400 text-lg max-w-md mx-auto">
                                        There are no locker points listed in {selectedCity} yet. 
                                        Try searching in a nearby city or check back later.
                                    </p>
                                </div>
                            )}

                            {!selectedCity && (
                                <div className="text-center py-24 animate-slide-up">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full flex-center mx-auto mb-8 border-2 border-violet-500/30">
                                            <Search size={48} className="text-violet-400 animate-pulse" />
                                        </div>
                                        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-ping opacity-10"></div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">Start Your Search</h3>
                                    <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
                                        Select a State and City above to discover secure locker locations near you
                                    </p>
                                    
                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-violet-400 mb-2">{states?.length || 0}+</div>
                                            <div className="text-slate-400">States Covered</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-emerald-400 mb-2">1000+</div>
                                            <div className="text-slate-400">Locker Points</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-400 mb-2">5000+</div>
                                            <div className="text-slate-400">Active Lockers</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Locations;
