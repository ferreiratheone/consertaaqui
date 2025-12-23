import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';
import { Client, Order, Product, SaleItem } from '../types';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: Partial<Order>) => void;
    order?: Order;
    clients: Client[];
    products: Product[];
}

export function OrderModal({ isOpen, onClose, onSave, order, clients, products }: OrderModalProps) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<Partial<Order>>({
        status: 'Pendente',
        items: [],
        price: 0,
        servicePrice: 0
    });

    const [clientSearch, setClientSearch] = useState('');
    const [isClientListOpen, setIsClientListOpen] = useState(false);
    const [productSearch, setProductSearch] = useState('');

    useEffect(() => {
        if (order) {
            const clientName = clients.find(c => c.id === order.clientId)?.name || '';
            setClientSearch(clientName);
            setFormData({
                ...order,
                items: order.items || [],
                servicePrice: order.servicePrice || order.price // Backwards compatibility
            });
        } else {
            setClientSearch('');
            setFormData({
                status: 'Pendente',
                items: [],
                price: 0,
                servicePrice: 0,
                createdAt: new Date().toISOString()
            });
        }
    }, [order, isOpen]);

    // Recalculate total whenever service price or items change
    useEffect(() => {
        const itemsTotal = (formData.items || []).reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const serviceTotal = Number(formData.servicePrice || 0);
        setFormData(prev => ({ ...prev, price: itemsTotal + serviceTotal }));
    }, [formData.items, formData.servicePrice]);

    const handleAddProduct = (product: Product) => {
        const currentItems = formData.items || [];
        const existing = currentItems.find(i => i.productId === product.id);

        let newItems;
        if (existing) {
            newItems = currentItems.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
            newItems = [...currentItems, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
        }
        setFormData({ ...formData, items: newItems });
    };

    const handleRemoveItem = (productId: number) => {
        setFormData({ ...formData, items: (formData.items || []).filter(i => i.productId !== productId) });
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 flex flex-col md:flex-row">

                {/* Left Side: Order Details */}
                <div className="p-8 flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 capitalize">{order ? 'Editar O.S.' : 'Nova O.S.'}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors md:hidden"><X size={24} /></button>
                    </div>

                    <form id="order-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cliente</label>
                            <div className="relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Buscar cliente..."
                                        value={clientSearch}
                                        onChange={(e) => {
                                            setClientSearch(e.target.value);
                                            setIsClientListOpen(true);
                                        }}
                                        onFocus={() => setIsClientListOpen(true)}
                                        className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-3 rounded-xl outline-none focus:border-indigo-500"
                                    />
                                    {formData.clientId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, clientId: undefined });
                                                setClientSearch('');
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                {isClientListOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50 custom-scrollbar">
                                        {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).length > 0 ? (
                                            clients
                                                .filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
                                                .map(client => (
                                                    <button
                                                        key={client.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, clientId: client.id });
                                                            setClientSearch(client.name);
                                                            setIsClientListOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm border-b border-slate-50 last:border-none flex justify-between items-center group"
                                                    >
                                                        <span className="font-medium text-slate-700 group-hover:text-indigo-600">{client.name}</span>
                                                        <span className="text-[10px] text-slate-400">{client.phone}</span>
                                                    </button>
                                                ))
                                        ) : (
                                            <div className="p-4 text-center text-slate-500 text-sm">
                                                Nenhum cliente encontrado.
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Keep hidden input for form validation if needed, or handle validation manually */}
                                <input
                                    tabIndex={-1}
                                    className="opacity-0 h-0 absolute"
                                    required
                                    value={formData.clientId || ''}
                                    onChange={() => { }}
                                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Selecione um cliente da lista')}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Aparelho</label>
                                <input
                                    value={formData.device || ''}
                                    onChange={e => setFormData({ ...formData, device: e.target.value })}
                                    placeholder="Ex: iPhone 11"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Marca</label>
                                <input
                                    value={formData.brand || ''}
                                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                    placeholder="Ex: Apple"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Defeito Relatado</label>
                            <input
                                value={formData.issue || ''}
                                onChange={e => setFormData({ ...formData, issue: e.target.value })}
                                placeholder="Ex: Tela Quebrada"
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mão de Obra (R$)</label>
                                <input
                                    type="number" step="0.01"
                                    value={formData.servicePrice || ''}
                                    onChange={e => setFormData({ ...formData, servicePrice: Number(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-700"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Previsão</label>
                                <input
                                    type="date"
                                    value={formData.forecast || ''}
                                    onChange={e => setFormData({ ...formData, forecast: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observações</label>
                            <textarea
                                value={formData.observations || ''}
                                onChange={e => setFormData({ ...formData, observations: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500 h-24 resize-none"
                            />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-500">Mão de Obra</span>
                                <span className="font-mono text-slate-800">R$ {Number(formData.servicePrice || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-500">Peças/Produtos</span>
                                <span className="font-mono text-slate-800">R$ {((formData.items || []).reduce((acc, i) => acc + (i.price * i.quantity), 0)).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-lg font-black text-indigo-600">
                                <span>Total Geral</span>
                                <span>R$ {Number(formData.price || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">
                            Salvar Ordem de Serviço
                        </button>
                    </form>
                </div>

                {/* Right Side: Product Selection */}
                <div className="w-full md:w-80 bg-slate-50 border-l border-slate-100 p-6 flex flex-col h-[500px] md:h-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-700">Adicionar Produtos</h4>
                        <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hidden md:block"><X size={20} /></button>
                    </div>

                    <div className="relative mb-4">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-sm outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4">
                        {filteredProducts.map(fp => (
                            <button
                                key={fp.id}
                                onClick={() => handleAddProduct(fp)}
                                disabled={fp.quantity <= 0}
                                className="w-full flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-500 transition-all group disabled:opacity-50 text-left"
                            >
                                <div>
                                    <p className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{fp.name}</p>
                                    <p className="text-[10px] text-slate-400">Estoque: {fp.quantity}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-indigo-600">R$ {fp.price.toFixed(2)}</span>
                                    <Plus size={14} className="text-slate-300 group-hover:text-indigo-500" />
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                        <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2">Itens Adicionados</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {(formData.items?.length === 0) && <p className="text-center text-xs text-slate-400 italic py-2">Nenhum item adicionado</p>}
                            {formData.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm p-2 bg-white rounded border border-slate-100">
                                    <div>
                                        <span className="font-medium text-slate-700 block text-xs">{item.name}</span>
                                        <span className="text-[10px] text-slate-500">{item.quantity}x R$ {item.price.toFixed(2)}</span>
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.productId)} className="text-red-400 hover:text-red-600">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
