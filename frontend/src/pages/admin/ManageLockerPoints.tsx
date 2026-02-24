import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../api/axiosClient';
import type { State } from '../../interfaces/types';
import { Trash2, Loader2 } from 'lucide-react';

const ManageLockerPoints: React.FC = () => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, watch, setValue } = useForm();
    const selectedStateId = watch('state_id');

    // Reset city dropdown when state changes
    React.useEffect(() => {
        if (selectedStateId) {
            setValue('city_id', '');
        }
    }, [selectedStateId, setValue]);

    const { data: states } = useQuery<State[]>({
        queryKey: ['states'],
        queryFn: () => api.get('/states/all').then(res => res.data)
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.post('/locker-points/', { ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
            reset();
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to create locker point';
            alert(errorMessage);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/locker-points/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['states'] }),
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete locker point';
            alert(errorMessage);
        }
    });

    const activeState = states?.find(s => s.id === selectedStateId);

    // Flatten all locker points for display
    const allLockerPoints = states?.flatMap(s => s.cities?.flatMap(c => c.locker_points?.map(lp => ({
        ...lp,
        city_name: c.name,
        state_name: s.name
    })) || []) || []) || [];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-6">Add New Locker Point</h2>
                <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">State</label>
                        <select {...register('state_id', { required: true })} className="input-field">
                            <option value="">Select State</option>
                            {states?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">City</label>
                        <select {...register('city_id', { required: true })} className="input-field" disabled={!selectedStateId}>
                            <option value="">Select City</option>
                            {activeState?.cities?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Point Name</label>
                        <input {...register('name', { required: true })} className="input-field" placeholder="e.g. Central Station" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Address</label>
                        <input {...register('address')} className="input-field" placeholder="123 Main St" />
                    </div>

                    <button disabled={createMutation.isPending} className="btn btn-primary h-[42px]">
                        {createMutation.isPending ? <Loader2 className="animate-spin" /> : 'Add Point'}
                    </button>
                </form>
            </div>

            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-6">Existing Locker Points</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 border-b border-white/10 text-sm">
                                <th className="p-3">Name</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Address</th>
                                <th className="p-3">Lockers</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allLockerPoints.map((point: any) => (
                                <tr key={point.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-medium">{point.name}</td>
                                    <td className="p-3 text-slate-400 text-sm">{point.city_name}, {point.state_name}</td>
                                    <td className="p-3 text-slate-400 text-sm max-w-[200px] truncate">{point.address}</td>
                                    <td className="p-3">
                                        <span className="badge badge-maintenance bg-slate-700 text-slate-300">
                                            {point.lockers?.length || 0}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => deleteMutation.mutate(point.id)}
                                            className="text-slate-500 hover:text-red-400"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {allLockerPoints.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-500">No locker points found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageLockerPoints;
