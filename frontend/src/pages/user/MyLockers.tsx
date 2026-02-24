import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../api/axiosClient';
import { 
    Key, 
    Loader2, 
    CheckCircle, 
    Clock, 
    ArrowRight,
    ShieldCheck,
    Lock,
    Unlock,
    AlertCircle,
    Mail,
    Phone,
    Eye,
    EyeOff,
    Copy,
    Zap
} from 'lucide-react';

const MyLockers: React.FC = () => {
    const [lockerId, setLockerId] = useState('');
    const [otp, setOtp] = useState('');
    const [contact, setContact] = useState('');
    const [step, setStep] = useState<'ID' | 'OTP' | 'RESULT'>('ID');
    const [collectResult, setCollectResult] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showOtp, setShowOtp] = useState(false);
    const [copiedId, setCopiedId] = useState(false);

    // Timer for OTP expiration (5 minutes)
    useEffect(() => {
        if (step === 'OTP' && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && step === 'OTP') {
            // Handle expiration visual if needed, but backend handles actual validation
        }
    }, [step, timeLeft]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    const resetForm = () => {
        setStep('ID');
        setLockerId('');
        setOtp('');
        setContact('');
        setCollectResult(null);
        setShowOtp(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Validation functions
    const isValidLockerId = (id: string) => {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(id);
    };

    const isValidContact = (contact: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+?\d{1,3}[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
        return emailRegex.test(contact) || phoneRegex.test(contact);
    };

    // Request OTP
    const requestOtpMutation = useMutation({
        mutationFn: async () => {
            return api.post(`/Items/lockers/${lockerId}/request-otp`, { contact });
        },
        onSuccess: () => {
            setStep('OTP');
            setTimeLeft(300); // 5 minutes
        },
        onError: (err: any) => {
            alert(err.response?.data?.detail || 'Failed to send OTP. Check Locker ID.');
        }
    });

    // Collect Item
    const collectMutation = useMutation({
        mutationFn: async () => {
            return api.post(`/Items/lockers/${lockerId}/collect`, { otp });
        },
        onSuccess: (data) => {
            setCollectResult(data.data);
            setStep('RESULT');
        },
        onError: (err: any) => {
            alert(err.response?.data?.detail || 'Collection failed. Invalid OTP or expired.');
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Hero Section */}
                <div className="text-center mb-12 animate-slide-up">
                    <div className="relative inline-block mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex-center mx-auto mb-8 shadow-2xl">
                            <Lock size={56} className="text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-slate-900 flex-center animate-pulse">
                            <Key size={20} className="text-white" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4">
                        Collect Item
                    </h1>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
                        Retrieve your package securely with one-time password authentication
                    </p>
                    
                    {/* Security Badge */}
                    <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <span className="text-emerald-300 font-medium">Secure Collection System</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Security Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-emerald-400" />
                                Security Features
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex-center flex-shrink-0">
                                        <Lock size={16} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">End-to-End Encryption</div>
                                        <div className="text-xs text-slate-400">Your data is always protected</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex-center flex-shrink-0">
                                        <Clock size={16} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">5-Minute OTP</div>
                                        <div className="text-xs text-slate-400">Auto-expiration for security</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex-center flex-shrink-0">
                                        <Zap size={16} className="text-violet-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">Instant Access</div>
                                        <div className="text-xs text-slate-400">Quick verification process</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Process Steps */}
                        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                            <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex-center text-sm font-bold ${
                                        step === 'ID' ? 'bg-violet-500 text-white' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                        1
                                    </div>
                                    <span className={`text-sm ${step === 'ID' ? 'text-white font-medium' : 'text-slate-400'}`}>
                                        Enter Locker ID
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex-center text-sm font-bold ${
                                        step === 'OTP' ? 'bg-violet-500 text-white' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                        2
                                    </div>
                                    <span className={`text-sm ${step === 'OTP' ? 'text-white font-medium' : 'text-slate-400'}`}>
                                        Verify with OTP
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex-center text-sm font-bold ${
                                        step === 'RESULT' ? 'bg-violet-500 text-white' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                        3
                                    </div>
                                    <span className={`text-sm ${step === 'RESULT' ? 'text-white font-medium' : 'text-slate-400'}`}>
                                        Collect Item
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Main Form */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-8 relative overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-600/10 rounded-full blur-2xl"></div>
                            
                            <div className="relative z-10">
                                {/* Step 1: Locker ID */}
                                {step === 'ID' && (
                                    <div className="space-y-8 animate-fade-in">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-2">Enter Locker Details</h2>
                                            <p className="text-slate-400">Provide your locker identification and contact information</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                    <Lock size={16} className="text-violet-400" />
                                                    Locker ID
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showOtp ? "text" : "password"}
                                                        value={lockerId}
                                                        onChange={(e) => setLockerId(e.target.value)}
                                                        className={`input-field pr-24 ${!isValidLockerId(lockerId) && lockerId ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-violet-400'}`}
                                                        placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowOtp(!showOtp)}
                                                        className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(lockerId)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-400 transition-colors"
                                                    >
                                                        {copiedId ? <CheckCircle size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                                    </button>
                                                </div>
                                                <p className={`text-xs mt-2 flex items-center gap-2 ${!isValidLockerId(lockerId) && lockerId ? 'text-red-400' : 'text-slate-500'}`}>
                                                    <AlertCircle size={12} />
                                                    {!isValidLockerId(lockerId) && lockerId ? 'Invalid Locker ID format. Must be a valid UUID.' : 'Found in your confirmation email or SMS'}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                    <Mail size={16} className="text-violet-400" />
                                                    Contact Information
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={contact.includes('@') ? "email" : "tel"}
                                                        value={contact}
                                                        onChange={(e) => setContact(e.target.value)}
                                                        className={`input-field pl-12 ${!isValidContact(contact) && contact ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-violet-400'}`}
                                                        placeholder="Registered receiver email or phone"
                                                        required
                                                    />
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {contact.includes('@') ? <Mail size={18} /> : <Phone size={18} />}
                                                    </div>
                                                </div>
                                                <p className={`text-xs mt-2 ${!isValidContact(contact) && contact ? 'text-red-400' : 'text-slate-500'}`}>
                                                    {!isValidContact(contact) && contact ? 'Invalid email or phone number format.' : 'Must match the contact used during item storage'}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => requestOtpMutation.mutate()}
                                            disabled={requestOtpMutation.isPending || !isValidLockerId(lockerId) || !isValidContact(contact)}
                                            className="btn btn-primary w-full h-14 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                {requestOtpMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={20} />
                                                        Sending OTP...
                                                    </>
                                                ) : (
                                                    <>
                                                        Request OTP
                                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </span>
                                            {lockerId && contact && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Step 2: OTP Verification */}
                                {step === 'OTP' && (
                                    <div className="space-y-8 animate-fade-in">
                                        <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex-center animate-pulse">
                                                    <CheckCircle size={24} className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">OTP Sent Successfully!</h3>
                                                    <p className="text-emerald-300 text-sm">Check your email or SMS for the 6-digit code</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                    <Key size={16} className="text-violet-400" />
                                                    Enter One-Time Password
                                                </label>
                                                <div className={`text-sm font-mono flex items-center gap-2 px-3 py-1 rounded-full ${
                                                    timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                                                }`}>
                                                    <Clock size={14} />
                                                    {formatTime(timeLeft)}
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                className="input-field text-center text-4xl tracking-[0.3em] font-mono h-20 border-slate-700 focus:border-violet-400"
                                                placeholder="•••••••"
                                                maxLength={6}
                                                autoFocus
                                            />
                                            <p className="text-xs text-slate-500 text-center">
                                                Enter the 6-digit code sent to your registered contact
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setStep('ID')}
                                                className="btn btn-secondary h-14"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={() => collectMutation.mutate()}
                                                disabled={collectMutation.isPending || otp.length !== 6}
                                                className="btn btn-primary h-14 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {collectMutation.isPending ? (
                                                        <>
                                                            <Loader2 className="animate-spin" size={18} />
                                                            Verifying...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Unlock size={18} />
                                                            Unlock Locker
                                                        </>
                                                    )}
                                                </span>
                                                {otp.length === 6 && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Success */}
                                {step === 'RESULT' && collectResult && (
                                    <div className="text-center space-y-8 animate-fade-in">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex-center mx-auto mb-6 shadow-2xl animate-bounce-in">
                                                <Unlock size={48} className="text-white" />
                                            </div>
                                            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full animate-ping opacity-20"></div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-3xl font-bold text-white mb-3">Locker Unlocked Successfully!</h3>
                                            <p className="text-slate-300 text-lg">Please collect your item and ensure the locker door is properly closed</p>
                                        </div>

                                        <div className="bg-slate-800/60 p-6 rounded-2xl text-left space-y-4 border border-white/10">
                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                <span className="text-slate-400">Collection Time</span>
                                                <span className="font-semibold text-white">{(collectResult.total_amount / 50).toFixed(1)} hours</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                <span className="text-slate-300 font-medium">Total Amount</span>
                                                <span className="text-2xl font-bold text-emerald-400">₹{collectResult.total_amount}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-slate-500 text-sm">Locker ID</span>
                                                <span className="font-mono text-white">{collectResult.locker_id}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={resetForm}
                                            className="btn btn-primary w-full h-14 text-lg font-semibold shadow-lg group relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                <Lock size={20} />
                                                Collect Another Item
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLockers;
