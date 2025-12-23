import React, { useState } from 'react';
import { ShoppingCart, Trash2, DollarSign, Search } from 'lucide-react';
import { Product, Sale, SaleItem } from '../types';

interface SalesViewProps {
    products: Product[];
    onUpdateProduct: (p: Product) => void;
    onRegisterSale: (s: Sale) => void;
}

export function SalesView({ products, onUpdateProduct, onRegisterSale }: SalesViewProps) {
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('Pix');
    const [searchTerm, setSearchTerm] = useState('');

    const addToCart = (product: Product) => {
        if (product.quantity <= 0) return alert('Produto sem estoque!');

        const existing = cart.find(item => item.productId === product.id);
        if (existing) {
            if (existing.quantity >= product.quantity) return alert('Estoque insuficiente!');
            setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;

        // Update stock
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                onUpdateProduct({ ...product, quantity: product.quantity - item.quantity });
            }
        });

        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const sale: Sale = {
            id: Date.now(),
            items: cart,
            total,
            paymentMethod,
            createdAt: new Date().toISOString()
        };

        onRegisterSale(sale);
        setCart([]);
        alert('Venda realizada com sucesso!');
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products Grid */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar produto para vender..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium shadow-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                disabled={product.quantity <= 0}
                                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                <h4 className="font-bold text-slate-800 mb-1 truncate text-lg">{product.name}</h4>
                                <p className="text-indigo-600 font-black text-xl">R$ {product.price.toFixed(2)}</p>
                                <div className="mt-3 flex justify-between items-end">
                                    <p className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.quantity > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-600'}`}>
                                        {product.quantity} un
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl flex flex-col h-[calc(100vh-120px)] sticky top-24">
                    <h3 className="font-bold text-xl text-slate-800 flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><ShoppingCart size={24} /></div>
                        Carrinho de Compras
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                                <ShoppingCart size={48} strokeWidth={1.5} />
                                <p className="font-medium">Seu carrinho está vazio</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.productId} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{item.name}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-bold text-slate-800">R$ {(item.quantity * item.price).toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item.productId)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-center text-2xl font-black text-slate-900">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total</span>
                            <span>R$ {cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Forma de Pagamento</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                            >
                                <option value="Pix">Pix</option>
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Cartão Crédito">Cartão Crédito</option>
                                <option value="Cartão Débito">Cartão Débito</option>
                            </select>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="w-full py-5 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3 text-lg"
                        >
                            <DollarSign size={24} /> Finalizar Venda
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
