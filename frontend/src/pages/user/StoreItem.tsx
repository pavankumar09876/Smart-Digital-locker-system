import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from '../../api/axiosClient';
import type { ItemCreate } from '../../interfaces/types';
import { useAuth } from '../../auth/AuthContext';
import { Box, Phone, Mail, FileText, ArrowLeft, ArrowRight, CheckCircle, Loader2, Edit, X } from 'lucide-react';

const StoreItem: React.FC = () => {
    const { lockerId, pointName, lockerName } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<ItemCreate | null>(null);

    // Initialize form with user email if available
    const { register, handleSubmit, trigger, formState: { errors }, watch } = useForm<ItemCreate>({
        defaultValues: {
            your_email: user?.email || '',
        }
    });

    const mutation = useMutation({
        mutationFn: (data: ItemCreate) => api.post('/Items/', data),
        onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/my-lockers');
            }, 3000); // Show success animation for 3 seconds
        },
        onError: (error: any) => {
            alert(error.response?.data?.detail || 'Failed to store item');
        }
    });

    const onSubmit = (data: ItemCreate) => {
        if (!lockerId) return;
        setFormData(data);
        // Don't call mutation here - just store the data and move to confirmation
    };

    const nextStep = async () => {
        let valid = false;
        if (step === 1) {
            valid = await trigger(['name', 'description']);
        } else if (step === 2) {
            valid = await trigger(['your_email', 'receiver_emailid', 'receiver_phone_number']);
        }

        if (valid) {
            const currentData = watch();
            setFormData(currentData);
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleConfirmBooking = () => {
        if (formData && lockerId) {
            mutation.mutate({
                ...formData,
                locker_id: lockerId,
            });
        }
    };

    const handleEditDetails = () => {
        setStep(1);
    };

    return (
        <>
        <div className="max-w-3xl mx-auto animate-fade-in px-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6">
                <ArrowLeft size={18} /> Cancel & Back
            </button>

            <div className="glass-card overflow-hidden">
                {/* Header & Steps */}
                <div className="bg-slate-900/50 p-6 border-b border-white/5">
                    <h1 className="text-2xl font-bold text-white mb-6">Store Item</h1>

                    {/* Stepper */}
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-300 -z-10"
                            style={{ width: `${((step - 1) / 2) * 100}%` }} />

                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`flex flex-col items-center gap-2 ${step >= s ? 'text-primary' : 'text-slate-500'}`}>
                                <div className={`w-10 h-10 rounded-full flex-center font-bold border-2 transition-all duration-300 bg-slate-900 ${step >= s ? 'border-primary text-primary shadow-glow' : 'border-slate-700 text-slate-500'}`}>
                                    {step > s ? <CheckCircle size={20} /> : s}
                                </div>
                                <span className="text-xs font-semibold hidden sm:block">
                                    {s === 1 ? 'Details' : s === 2 ? 'Receiver' : 'Confirm'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8">
                    <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between text-sm">
                        <span className="text-slate-300">Locker Location: <strong className="text-white">{pointName}</strong></span>
                        <span className="text-slate-300">Locker ID: <strong className="text-white">{lockerName || lockerId?.slice(0, 8)}</strong></span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Step 1: Item Details */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Item Name</label>
                                    <div className="relative">
                                        <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            {...register('name', { required: 'Item name is required' })}
                                            className="input-field pl-10"
                                            placeholder="e.g. Dell XPS Laptop"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 text-slate-500" size={18} />
                                        <textarea
                                            {...register('description')}
                                            className="input-field pl-10 h-32 resize-none"
                                            placeholder="Add any specific details about the contents..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Receiver Details */}
                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Email (Sender)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            {...register('your_email', {
                                                required: 'Your email is required',
                                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                            })}
                                            className="input-field pl-10"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.your_email && <p className="text-error text-xs mt-1">{errors.your_email.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Receiver Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                {...register('receiver_emailid', {
                                                    required: 'Receiver email is required',
                                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                                })}
                                                className="input-field pl-10"
                                                placeholder="receiver@example.com"
                                            />
                                        </div>
                                        {errors.receiver_emailid && <p className="text-error text-xs mt-1">{errors.receiver_emailid.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Receiver Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                {...register('receiver_phone_number', { required: 'Receiver phone is required' })}
                                                className="input-field pl-10"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                        {errors.receiver_phone_number && <p className="text-error text-xs mt-1">{errors.receiver_phone_number.message}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in text-center">
                                <div className="w-20 h-20 bg-primary/20 rounded-full flex-center mx-auto mb-4 border border-primary/30 shadow-glow">
                                    <CheckCircle size={40} className="text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Review Details</h3>
                                <p className="text-slate-400">Please verify the information before confirming reservation.</p>

                                <div className="bg-slate-800/40 rounded-xl p-6 text-left space-y-3 border border-white/10">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-400">Item Name</span>
                                        <span className="font-semibold text-white">{formData?.name || watch('name')}</span>
                                    </div>
                                    {formData?.description && (
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-slate-400">Description</span>
                                            <span className="font-semibold text-white">{formData.description}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-400">Sender</span>
                                        <span className="font-semibold text-white">{formData?.your_email || watch('your_email')}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-400">Receiver</span>
                                        <span className="font-semibold text-white">{formData?.receiver_emailid || watch('receiver_emailid')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Phone</span>
                                        <span className="font-semibold text-white">{formData?.receiver_phone_number || watch('receiver_phone_number')}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-6">
                            {step > 1 ? (
                                step === 3 ? (
                                    <button type="button" onClick={handleEditDetails} className="btn btn-secondary px-6">
                                        <Edit size={18} /> Edit Details
                                    </button>
                                ) : (
                                    <button type="button" onClick={prevStep} className="btn btn-secondary px-6">
                                        Back
                                    </button>
                                )
                            ) : (
                                <div></div> // spacer
                            )}

                            {step < 3 ? (
                                <button type="button" onClick={nextStep} className="btn btn-primary px-8">
                                    Next <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleConfirmBooking}
                                    disabled={mutation.isPending}
                                    className="btn btn-primary px-8 w-full sm:w-auto min-w-[150px]"
                                >
                                    {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Confirm & Book Locker'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* Success Animation Popup */}
        {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="glass-card p-8 text-center animate-bounce-in max-w-md mx-4 relative">
                    <button 
                        onClick={() => {
                            setShowSuccess(false);
                            navigate('/my-lockers');
                        }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex-center mx-auto mb-6 shadow-glow animate-pulse">
                        <CheckCircle size={48} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Locker Added Successfully!</h2>
                    <p className="text-slate-300 mb-6">Your item has been stored in the locker securely.</p>
                    <div className="flex items-center justify-center gap-2 text-primary mb-4">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm">Redirecting to your lockers...</span>
                    </div>
                    <button 
                        onClick={() => {
                            setShowSuccess(false);
                            navigate('/my-lockers');
                        }}
                        className="btn btn-primary w-full"
                    >
                        Go to My Lockers
                    </button>
                </div>
            </div>
        )}
        </>
    );
};

export default StoreItem;
