import React, { useState } from 'react';
import { Package, Plus, Trash2, Search } from 'lucide-react';
import { Product } from '../types';

interface ProductsViewProps {
    products: Product[];
    onAddProduct: (p: Product) => void;
    onUpdateProduct: (p: Product) => void;
    onDeleteProduct: (id: number) => void;
}

export function ProductsView({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: ProductsViewProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProduct.name || !currentProduct.price) return;

        const newProduct: Product = {
            id: currentProduct.id || Date.now(),
            name: currentProduct.name,
            price: Number(currentProduct.price),
            cost: Number(currentProduct.cost || 0),
            quantity: Number(currentProduct.quantity || 0),
            sku: currentProduct.sku || ''
        };

        if (currentProduct.id) {
            onUpdateProduct(newProduct);
        } else {
            onAddProduct(newProduct);
        }
        setIsProductModalOpen(false);
        setCurrentProduct({});
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Package className="text-indigo-600" size={28} /> Estoque de Produtos
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Gerencie seu inventário de peças e produtos para venda.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => { setCurrentProduct({}); setIsProductModalOpen(true); }}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={18} /> Novo Produto
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Produto</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Preço Venda</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Custo</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Estoque</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-400">Nenhum produto encontrado.</td>
                            </tr>
                        )}
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                                <td className="px-6 py-4 font-bold text-emerald-600">R$ {product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-slate-500">R$ {product.cost.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.quantity < 5 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                        {product.quantity} un
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setCurrentProduct(product); setIsProductModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-colors"><Plus size={16} className="rotate-45" /></button> {/* Rotate Plus for Edit look if Pen not available or stylistic choice, actually Lucid has Pencil */}
                                        <button onClick={() => onDeleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">{currentProduct.id ? 'Editar Produto' : 'Novo Produto'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Produto</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" autoFocus required
                                    value={currentProduct.name || ''} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preço Venda</label>
                                    <input type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" required
                                        value={currentProduct.price || ''} onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Custo</label>
                                    <input type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium"
                                        value={currentProduct.cost || ''} onChange={e => setCurrentProduct({ ...currentProduct, cost: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estoque Inicial</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" required
                                        value={currentProduct.quantity || ''} onChange={e => setCurrentProduct({ ...currentProduct, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU (Opcional)</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium"
                                        value={currentProduct.sku || ''} onChange={e => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">Salvar Produto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
