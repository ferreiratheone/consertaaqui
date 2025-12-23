import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Search, CalendarRange, Archive, Trash2, Printer, ChevronLeft, ChevronRight, ShoppingBag, Wrench, DollarSign } from 'lucide-react';
import { Order, Client, Sale } from '../types';
import { StatusBadge } from './StatusBadge';

interface HistoryViewProps {
    historyOrders: Order[];
    sales: Sale[];
    clients: Client[];
    onDelete: (id: number, type: 'order' | 'sale') => void;
    onPrint: (o: Order) => void;
}

type HistoryItem =
    | { type: 'order'; data: Order; date: string; id: number; total: number; clientName: string }
    | { type: 'sale'; data: Sale; date: string; id: number; total: number; clientName: string };

export function HistoryView({ historyOrders, sales, clients, onDelete, onPrint }: HistoryViewProps) {
    const [filters, setFilters] = useState({
        search: '',
        type: 'all', // 'all', 'order', 'sale'
        dateStart: '',
        dateEnd: '',
        minPrice: '',
        maxPrice: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 30;

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, historyOrders, sales]);

    const combinedHistory: HistoryItem[] = useMemo(() => {
        const orderItems: HistoryItem[] = historyOrders.map(o => ({
            type: 'order',
            data: o,
            date: o.createdAt,
            id: o.id,
            total: o.price,
            clientName: clients.find(c => c.id === o.clientId)?.name || 'Cliente Removido'
        }));

        const saleItems: HistoryItem[] = sales.map(s => ({
            type: 'sale',
            data: s,
            date: s.createdAt,
            id: s.id,
            total: s.total,
            clientName: 'Consumidor Final' // Sales usually don't have linked clients in this simple POS
        }));

        return [...orderItems, ...saleItems];
    }, [historyOrders, sales, clients]);

    const filteredAndSortedHistory = useMemo(() => {
        const filtered = combinedHistory.filter(item => {
            const matchesSearch =
                filters.search === '' ||
                item.id.toString().includes(filters.search) ||
                item.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.type === 'order' && item.data.device.toLowerCase().includes(filters.search.toLowerCase()));

            const matchesType = filters.type === 'all' || item.type === filters.type;

            const itemDate = new Date(item.date).getTime();
            const matchesDateStart = !filters.dateStart || itemDate >= new Date(filters.dateStart).getTime();
            const matchesDateEnd = !filters.dateEnd || itemDate <= new Date(filters.dateEnd).getTime();

            const matchesMinPrice = !filters.minPrice || item.total >= parseFloat(filters.minPrice);
            const matchesMaxPrice = !filters.maxPrice || item.total <= parseFloat(filters.maxPrice);

            return matchesSearch && matchesType && matchesDateStart && matchesDateEnd && matchesMinPrice && matchesMaxPrice;
        });

        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [combinedHistory, filters]);

    const totalPages = Math.ceil(filteredAndSortedHistory.length / ITEMS_PER_PAGE);
    const paginatedData = filteredAndSortedHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const clearFilters = () => setFilters({ search: '', type: 'all', dateStart: '', dateEnd: '', minPrice: '', maxPrice: '' });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Advanced Filters Panel */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <Filter size={16} /> Filtros Avançados
                    </h3>
                    <button onClick={clearFilters} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline">
                        Limpar Filtros
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Buscar</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="ID, Cliente, Aparelho..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"
                                value={filters.search}
                                onChange={e => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Tipo</label>
                        <select
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                            value={filters.type}
                            onChange={e => setFilters({ ...filters, type: e.target.value })}
                        >
                            <option value="all">Todos</option>
                            <option value="order">Ordens de Serviço</option>
                            <option value="sale">Vendas</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Data Início</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"
                            value={filters.dateStart}
                            onChange={e => setFilters({ ...filters, dateStart: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Data Fim</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"
                            value={filters.dateEnd}
                            onChange={e => setFilters({ ...filters, dateEnd: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Valor Min</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors"
                            value={filters.minPrice}
                            onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Archive size={18} /> Histórico Completo</h3>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{filteredAndSortedHistory.length} registros</span>
                </div>

                <div className="overflow-x-auto">
                    {paginatedData.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">ID / Detalhes</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Valor Total</th>
                                    <th className="px-6 py-4">Status / Pagamento</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedData.map(item => (
                                    <tr key={`${item.type}-${item.id}`} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.type === 'order' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                                    <Wrench size={12} /> O.S.
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                                    <ShoppingBag size={12} /> Venda
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-indigo-600 mb-0.5">#{item.id}</span>
                                                <span className="text-sm font-medium text-slate-800">
                                                    {item.type === 'order'
                                                        ? item.data.device
                                                        : `${item.data.items.length} itens`
                                                    }
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {item.clientName}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                            R$ {item.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.type === 'order' ? (
                                                <StatusBadge status={item.data.status} />
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                    <DollarSign size={12} /> {item.data.paymentMethod}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {item.type === 'order' && (
                                                    <button onClick={() => onPrint(item.data)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Reimprimir"><Printer size={16} /></button>
                                                )}
                                                <button onClick={() => onDelete(item.id, item.type)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Excluir Permanentemente"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <CalendarRange size={24} className="text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-medium text-sm">Nenhum registro encontrado no histórico com estes filtros.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Footer */}
                {filteredAndSortedHistory.length > ITEMS_PER_PAGE && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} /> Anterior
                        </button>

                        <span className="text-sm text-slate-500 font-medium">
                            Página <span className="text-slate-900 font-bold">{currentPage}</span> de <span className="text-slate-900 font-bold">{totalPages}</span>
                        </span>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Próxima <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
