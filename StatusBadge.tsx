import React from 'react';

export function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Pendente': 'bg-amber-50 text-amber-600 border-amber-100',
        'Em Análise': 'bg-blue-50 text-blue-600 border-blue-100',
        'Aguardando Peça': 'bg-purple-50 text-purple-600 border-purple-100',
        'Concluído': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    };
    return <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${styles[status] || 'bg-gray-50 text-gray-500'}`}>{status}</span>;
}
