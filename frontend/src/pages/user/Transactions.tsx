import React from 'react';
import { Clock, Download } from 'lucide-react';

const Transactions: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Transactions</h1>
                <button className="btn btn-secondary text-sm">
                    <Download size={16} /> Export
                </button>
            </div>

            <div className="glass-card p-8 text-center text-slate-400">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
                <p className="max-w-md mx-auto">
                    Your past transactions and billing history will appear here once you collect items.
                </p>
            </div>
        </div>
    );
};

export default Transactions;
