import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosClient';
import type { Locker } from '../../interfaces/types';
import { AlertTriangle, Loader2, Trash2, CheckSquare, Square, RefreshCw, Download } from 'lucide-react';

const ManageLockers: React.FC = () => {
    const queryClient = useQueryClient();
    const [filterPoint, setFilterPoint] = useState('');
    const [selectedLockers, setSelectedLockers] = useState<string[]>([]);

    // Fetch Locker Points for dropdown
    const { data: lockerPoints } = useQuery({
        queryKey: ['locker-points'],
        queryFn: () => api.get('/locker-points/').then(res => res.data)
    });

    // Fetch All Lockers
    const { data: lockers, isLoading } = useQuery<Locker[]>({
        queryKey: ['lockers', filterPoint],
        queryFn: () => api.get(`/lockers/${filterPoint ? `?locker_point_name=${filterPoint}` : ''}`).then(res => res.data)
    });

    // Add Locker
    const createMutation = useMutation({
        mutationFn: (lockerPointId: string) => api.post('/Admin/', { locker_point: lockerPointId }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lockers'] }),
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to create locker';
            alert(errorMessage);
        }
    });

    // Delete Locker
    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/Admin/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lockers'] }),
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete locker';
            alert(errorMessage);
        }
    });

    // Force Clear
    const forceClearMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/Admin/${id}/force-clear`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lockers'] });
            alert('Locker force cleared successfully.');
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to force clear locker';
            alert(errorMessage);
        }
    });

    // Bulk Operations
    const bulkDeleteMutation = useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map(id => api.delete(`/Admin/${id}`))),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lockers'] });
            setSelectedLockers([]);
            alert(`${ids.length} lockers deleted successfully.`);
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete lockers';
            alert(errorMessage);
        }
    });

    const bulkForceClearMutation = useMutation({
        mutationFn: (ids: string[]) => Promise.all(ids.map(id => api.delete(`/Admin/${id}/force-clear`))),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lockers'] });
            setSelectedLockers([]);
            alert(`${ids.length} lockers force cleared successfully.`);
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to force clear lockers';
            alert(errorMessage);
        }
    });

    // Selection handlers
    const handleSelectAll = () => {
        if (selectedLockers.length === lockers?.length) {
            setSelectedLockers([]);
        } else {
            setSelectedLockers(lockers?.map(l => l.id) || []);
        }
    };

    const handleSelectLocker = (lockerId: string) => {
        setSelectedLockers(prev => 
            prev.includes(lockerId) 
                ? prev.filter(id => id !== lockerId)
                : [...prev, lockerId]
        );
    };

    const exportData = () => {
        const csvContent = [
            ['Locker ID', 'Status', 'Locker Point', 'Created At'],
            ...(lockers || []).map(locker => [
                locker.id,
                locker.status,
                locker.locker_point_name,
                new Date(locker.created_at).toLocaleString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lockers_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const [selectedPointForAdd, setSelectedPointForAdd] = useState('');

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="glass-card p-6 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="text-xs text-slate-400 mb-1 block">Add Locker to Point</label>
                    <select
                        value={selectedPointForAdd}
                        onChange={e => setSelectedPointForAdd(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Locker Point</option>
                        {lockerPoints?.map((lp: any) => (
                            <option key={lp.id} value={lp.id}>{lp.name} ({lp.city_name || 'City ID: ' + lp.city_id})</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => createMutation.mutate(selectedPointForAdd)}
                    disabled={!selectedPointForAdd || createMutation.isPending}
                    className="btn btn-primary h-[42px] whitespace-nowrap"
                >
                    {createMutation.isPending ? <Loader2 className="animate-spin" /> : 'Add Locker Unit'}
                </button>
            </div>

            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Manage Lockers</h2>
                    <div className="flex gap-3">
                        {selectedLockers.length > 0 && (
                            <>
                                <button
                                    onClick={() => bulkDeleteMutation.mutate(selectedLockers)}
                                    disabled={bulkDeleteMutation.isPending}
                                    className="btn btn-secondary flex items-center gap-2 text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Selected ({selectedLockers.length})
                                </button>
                                <button
                                    onClick={() => bulkForceClearMutation.mutate(selectedLockers)}
                                    disabled={bulkForceClearMutation.isPending}
                                    className="btn btn-secondary flex items-center gap-2 text-sm"
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    Clear Selected ({selectedLockers.length})
                                </button>
                            </>
                        )}
                        <button
                            onClick={exportData}
                            className="btn btn-secondary flex items-center gap-2 text-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4 gap-4">
                    <input
                        placeholder="Filter by Locker Point Name..."
                        className="input-field w-64"
                        value={filterPoint}
                        onChange={e => setFilterPoint(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSelectAll}
                            className="btn btn-secondary flex items-center gap-2 text-sm"
                        >
                            {selectedLockers.length === lockers?.length ? (
                                <Square className="w-4 h-4" />
                            ) : (
                                <CheckSquare className="w-4 h-4" />
                            )}
                            {selectedLockers.length === lockers?.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <span className="text-slate-400 text-sm">
                            {selectedLockers.length} of {lockers?.length} selected
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {isLoading ? (
                        <div className="col-span-full py-12 flex-center">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : lockers?.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            No lockers found.
                        </div>
                    ) : (
                        lockers?.map(locker => (
                            <div key={locker.id} className="bg-slate-800/50 rounded-lg p-4 border border-white/5 relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedLockers.includes(locker.id)}
                                            onChange={() => handleSelectLocker(locker.id)}
                                            className="w-4 h-4 text-primary rounded border-slate-600 focus:ring-2 focus:ring-primary/20"
                                        />
                                        <h3 className="font-bold text-white">{locker.name}</h3>
                                    </div>
                                    <span className={`badge ${locker.status === 'AVAILABLE' ? 'badge-available' :
                                        locker.status === 'OCCUPIED' ? 'badge-occupied' : 'badge-maintenance'
                                        }`}>
                                        {locker.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-4">{locker.locker_point_name}</p>

                                <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                                    {locker.status === 'OCCUPIED' && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to FORCE CLEAR this locker? This will remove the active item.')) {
                                                    forceClearMutation.mutate(locker.id);
                                                }
                                            }}
                                            className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 flex-1 text-xs flex-center gap-1"
                                            title="Force Clear"
                                        >
                                            <AlertTriangle size={14} /> Clear
                                        </button>
                                    )}

                                    {locker.status === 'AVAILABLE' && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Delete this locker unit?')) {
                                                    deleteMutation.mutate(locker.id);
                                                }
                                            }}
                                            className="p-2 rounded bg-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex-1 text-xs flex-center gap-1"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageLockers;
