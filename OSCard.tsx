import React from 'react';
import {
    Users,
    Trash2,
    Edit2,
    Printer,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { Order, Client } from '../types';
import { StatusBadge } from './StatusBadge';

interface OSCardProps {
    order: Order;
    client?: Client;
    onEdit: (o: Order) => void;
    onDelete: (t: string, id: number) => void;
    onPrint: (o: Order) => void;
    onFinalize: (o: Order) => void;
}

export const OSCard: React.FC<OSCardProps> = ({ order, client, onEdit, onDelete, onPrint, onFinalize }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md text-[10px]">#{order.id}</span>
                    <StatusBadge status={order.status} />
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">R$ {order.price.toFixed(2)}</p>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold text-slate-800">{order.device}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{order.brand}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">{client?.name || 'Cliente Removido'}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 pl-6 leading-relaxed">"{order.issue}"</p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400" title={`Previsão: ${order.forecast}`}>
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(order.forecast).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                </div>
                <div className="flex gap-2">
                    {order.status !== 'Concluído' && (
                        <button
                            onClick={() => onFinalize(order)}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-all"
                            title="Finalizar Ordem"
                        >
                            <CheckCircle2 size={16} />
                        </button>
                    )}
                    <button onClick={() => onDelete('order', order.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Excluir"><Trash2 size={16} /></button>
                    <button onClick={() => onEdit(order)} className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Editar"><Edit2 size={16} /></button>
                    <button onClick={() => onPrint(order)} className="p-2 text-slate-300 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all" title="Imprimir"><Printer size={16} /></button>
                </div>
            </div>
        </div>
    );
}
