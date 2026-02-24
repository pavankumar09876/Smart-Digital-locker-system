import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Lock, Mail, Loader2, Eye, EyeOff, Shield, Zap } from 'lucide-react';
import api from '../../api/axiosClient';
import { Role } from '../../interfaces/types';

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();
    const { login, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const from = location.state?.from?.pathname;
            if (from) {
                navigate(from, { replace: true });
            } else {
                // Redirect to appropriate dashboard based on role
                if (user.role === Role.ADMIN) {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            }
        }
    }, [isAuthenticated, user, navigate, location]);

    // Show loading while checking authentication
    if (isAuthenticated && user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-purple-400" size={40} />
                    <p className="text-white text-lg">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    const onSubmit = async (data: any) => {
        try {
            const response = await api.post('/Auth/login', data);

            const { access_token, refresh_token } = response.data;
            login(access_token, refresh_token);

        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.detail || 'Login failed. Please check credentials.';
            setError('root', {
                message: typeof errorMessage === 'string' ? errorMessage : 'Login failed. Please check credentials.'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000" />
                <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl animate-bounce animation-delay-1000" />
            </div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className="glass-card p-8 w-full max-w-md animate-fade-in relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-3xl flex-center mx-auto mb-6 border border-white/30 shadow-2xl animate-bounce animation-delay-500">
                        <Shield size={40} className="text-white drop-shadow-lg" />
                    </div>
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-slate-300 text-sm flex items-center justify-center gap-2">
                        <Zap size={16} className="text-yellow-400" />
                        Sign in to access your digital locker
                        <Zap size={16} className="text-yellow-400" />
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
                            <Mail size={16} className="text-purple-400" />
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused === 'email' ? 'text-purple-400' : 'text-slate-500'}`} size={18} />
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="input-field pl-10 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 hover:bg-white/15 hover:border-purple-400/50 focus:bg-white/20"
                                placeholder="name@example.com"
                                autoComplete="email"
                                onFocus={() => setIsFocused('email')}
                                onBlur={() => setIsFocused('')}
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs mt-1 animate-shake">{errors.email.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
                            <Lock size={16} className="text-blue-400" />
                            Password
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused === 'password' ? 'text-blue-400' : 'text-slate-500'}`} size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: 'Password is required' })}
                                className="input-field pl-10 pr-10 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 hover:bg-white/15 hover:border-blue-400/50 focus:bg-white/20"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onFocus={() => setIsFocused('password')}
                                onBlur={() => setIsFocused('')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-300"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1 animate-shake">{errors.password.message as string}</p>}
                    </div>

                    {errors.root && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center backdrop-blur-sm animate-shake">
                            {errors.root.message as string}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin" size={20} />
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Shield size={20} />
                                <span>Get Started</span>
                            </div>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-300">
                    Don't have an account?
                    <Link to="/signup" className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-300 hover:to-blue-300 font-medium ml-1 transition-all duration-300 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
