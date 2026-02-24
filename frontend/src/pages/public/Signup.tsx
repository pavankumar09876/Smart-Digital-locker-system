import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

const Signup: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            await api.post('/Auth/signup', {
                name: data.name,
                email: data.email,
                password: data.password
            });

            navigate('/login');
        } catch (error: any) {
            console.error(error);
            setError('root', {
                message: error.response?.data?.detail || 'Signup failed. Please try again.'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-8 w-full max-w-md animate-fade-in relative z-10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gradient">
                        Create Account
                    </h2>
                    <p className="text-slate-400 mt-2">Join Smart Digital Locker System</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                {...register('name', { required: 'Name is required', minLength: 3 })}
                                className="input-field pl-10"
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.name && <p className="text-error text-xs mt-1">{errors.name.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="input-field pl-10"
                                placeholder="name@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-error text-xs mt-1">{errors.email.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                {...register('password', { required: 'Password is required', minLength: 6 })}
                                className="input-field pl-10"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-error text-xs mt-1">{errors.password.message as string}</p>}
                    </div>

                    {errors.root && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {errors.root.message as string}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn btn-primary py-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?
                    <Link to="/login" className="text-primary hover:text-primary-hover font-medium ml-1 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Background Orbs */}
            <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
        </div>
    );
};

export default Signup;
