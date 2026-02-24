import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../api/axiosClient';
import type { State } from '../../interfaces/types';
import { Plus, Trash2, MapPin, ChevronRight, Loader2 } from 'lucide-react';

const ManageStates: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedState, setSelectedState] = useState<State | null>(null);

    // Fetch All Data
    const { data: states } = useQuery<State[]>({
        queryKey: ['states'],
        queryFn: () => api.get('/states/all').then(res => res.data)
    });

    // Create State
    const { register: registerState, handleSubmit: submitState, reset: resetState } = useForm<{ name: string }>();
    const createStateMutation = useMutation({
        mutationFn: (data: { name: string }) => api.post('/states/', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
            resetState();
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to create state';
            alert(errorMessage);
        }
    });

    // Create City
    const { register: registerCity, handleSubmit: submitCity, reset: resetCity } = useForm<{ name: string }>();
    const createCityMutation = useMutation({
        mutationFn: (data: { name: string }) => api.post('/cities/', { ...data, state_id: selectedState?.id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
            resetCity();
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to create city';
            alert(errorMessage);
        }
    });

    // Delete State
    const deleteStateMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/states/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
            setSelectedState(null);
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete state';
            alert(errorMessage);
        }
    });

    // Delete City
    const deleteCityMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/cities/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete city';
            alert(errorMessage);
        }
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Left Panel: States */}
            <div className="space-y-6">
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">States</h2>
                    <form onSubmit={submitState(data => createStateMutation.mutate(data))} className="flex gap-2 mb-6">
                        <input
                            {...registerState('name', { required: true })}
                            className="input-field"
                            placeholder="New State Name"
                        />
                        <button disabled={createStateMutation.isPending} className="btn btn-primary px-3">
                            {createStateMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
                        </button>
                    </form>

                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {states?.map(state => (
                            <div
                                key={state.id}
                                onClick={() => setSelectedState(state)}
                                className={`
                                    p-4 rounded-lg cursor-pointer flex justify-between items-center transition-all border
                                    ${selectedState?.id === state.id
                                        ? 'bg-primary/20 border-primary/50'
                                        : 'bg-white/5 border-transparent hover:bg-white/10'}
                                `}
                            >
                                <span className="font-medium text-white">{state.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400">{state.cities?.length || 0} Cities</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteStateMutation.mutate(state.id); }}
                                        className="text-slate-500 hover:text-red-400 p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel: Cities */}
            <div className="space-y-6">
                {selectedState ? (
                    <div className="glass-card p-6 h-full animate-fade-in">
                        <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
                            <span className="text-white">{selectedState.name}</span>
                            <ChevronRight size={14} />
                            <span>Cities management</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-4">Cities in {selectedState.name}</h2>

                        <form onSubmit={submitCity(data => createCityMutation.mutate(data))} className="flex gap-2 mb-6">
                            <input
                                {...registerCity('name', { required: true })}
                                className="input-field"
                                placeholder="New City Name"
                            />
                            <button disabled={createCityMutation.isPending} className="btn btn-primary px-3">
                                {createCityMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
                            </button>
                        </form>

                        <div className="space-y-2">
                            {/* We must look up the FRESH state data from the 'states' array to get updated cities */}
                            {states?.find(s => s.id === selectedState.id)?.cities?.map(city => (
                                <div key={city.id} className="p-3 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span>{city.name}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteCityMutation.mutate(city.id)}
                                        className="text-slate-500 hover:text-red-400 p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {(!states?.find(s => s.id === selectedState.id)?.cities?.length) && (
                                <p className="text-slate-500 text-sm italic">No cities added yet.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-6 h-full flex-center flex-col text-slate-500 border-dashed border-2 border-slate-700">
                        <MapPin size={48} className="mb-4 opacity-50" />
                        <p>Select a state to manage cities</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageStates;
