import React from 'react';
import { Inbox } from 'lucide-react';
import { Order, Client } from '../types';
import { OSCard } from './OSCard';

interface OrdersViewProps {
    orders: Order[];
    clients: Client[];
    searchTerm: string;
    onEdit: (o: Order) => void;
    onDelete: (t: string, id: number) => void;
    onPrint: (o: Order) => void;
    onFinalize: (o: Order) => void;
}

export function OrdersView({ orders, clients, searchTerm, onEdit, onDelete, onPrint, onFinalize }: OrdersViewProps) {
    if (orders.length === 0) {
        return (
            <EmptyState
                title="Nenhuma O.S. Registrada"
                description="Crie sua primeira ordem de serviço para começar a gerenciar sua assistência."
            />
        );
    }

    // Filter orders based on search
    const filteredOrders = orders.filter(o =>
        o.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toString().includes(searchTerm) ||
        clients.find(c => c.id === o.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Separate Active/Pending from Completed
    const activeOrders = filteredOrders.filter(o => o.status !== 'Concluído');
    const completedOrders = filteredOrders.filter(o => o.status === 'Concluído');

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

            {/* Active Orders Section */}
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 px-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Pendentes & Em Andamento
            </h3>

            {activeOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-12">
                    {activeOrders.map(o => (
                        <OSCard
                            key={o.id}
                            order={o}
                            client={clients.find(c => c.id === o.clientId)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onPrint={onPrint}
                            onFinalize={onFinalize}
                        />
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mb-10">
                    Não há ordens pendentes.
                </div>
            )}

            {/* Completed Orders Section */}
            {completedOrders.length > 0 && (
                <>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 px-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Concluídos (Recentes)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 pb-10">
                        {completedOrders.map(o => (
                            <OSCard
                                key={o.id}
                                order={o}
                                client={clients.find(c => c.id === o.clientId)}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onPrint={onPrint}
                                onFinalize={onFinalize}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function EmptyState({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-in fade-in zoom-in duration-300 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                <Inbox size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">{description}</p>
        </div>
    );
}
