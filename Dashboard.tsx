import React, { ReactNode } from 'react';
import {
    ClipboardList,
    Printer,
    Clock,
    Zap,
    CheckCircle2,
    DollarSign
} from 'lucide-react';
import { Order, Client, Stats } from '../types';
import { StatusBadge } from './StatusBadge';

interface DashboardProps {
    stats: Stats;
    orders: Order[];
    clients: Client[];
    onPrint: (o: Order) => void;
}

export function Dashboard({ stats, orders, clients, onPrint }: DashboardProps) {
    const recent = [...orders].reverse().slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Pendentes" value={stats.pending} icon={<Clock size={24} className="text-white" />} color="from-amber-400 to-orange-500" />
                <StatCard title="Na Bancada" value={stats.active} icon={<Zap size={24} className="text-white" />} color="from-blue-500 to-indigo-600" />
                <StatCard title="Prontos" value={stats.done} icon={<CheckCircle2 size={24} className="text-white" />} color="from-emerald-400 to-emerald-600" />
                <StatCard title="Receita Est." value={`R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<DollarSign size={24} className="text-white" />} color="from-slate-700 to-slate-900" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2"><ClipboardList size={16} /> Atividades Recentes</h3>
                </div>
                <div className="overflow-x-auto flex-1">
                    {recent.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Cliente</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Aparelho</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recent.map(o => (
                                    <tr key={o.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-bold text-indigo-600 text-xs">#{o.id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-700 text-sm">{clients.find(c => c.id === o.clientId)?.name}</td>
                                        <td className="px-6 py-4"><span className="text-sm text-slate-600">{o.device}</span></td>
                                        <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => onPrint(o)} className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Imprimir">
                                                <Printer size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <p className="text-slate-400 font-medium text-sm">Nenhuma atividade recente.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: ReactNode; color: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg transform rotate-3`}>
                {icon}
            </div>
        </div>
    );
}
