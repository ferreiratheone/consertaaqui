import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Client, Order, Supplier, Stats, Product, Sale, STORE_INFO } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { OrdersView } from './components/OrdersView';
import { HistoryView } from './components/HistoryView';
import { SalesView } from './components/SalesView';
import { DataManagement } from './components/DataManagement';
import { PrintLayout } from './components/PrintLayout';
import { OSCard } from './components/OSCard'; // Kept for types or direct use if needed, but integration is via Views
import { OrderModal } from './components/OrderModal';
import { StatusBadge } from './components/StatusBadge'; // Idem
import { ProductsView } from './components/ProductsView';
import { SplashScreen } from './components/SplashScreen';

// --- Empty Initial Data ---
const initialClients: Client[] = [];
const initialSuppliers: Supplier[] = [];
const initialOrders: Order[] = [];
const initialHistory: Order[] = [];
const initialProducts: Product[] = [];
const initialSales: Sale[] = [];

// --- Storage Helpers ---
const loadData = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key}`, e);
    return fallback;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'clients' | 'suppliers' | 'history' | 'sales' | 'products'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Check if logo exists in localStorage, otherwise use default from public folder
  const [logo, setLogo] = useState<string | null>(() => {
    const stored = localStorage.getItem('conserta_aqui_logo');
    return stored || '/logo.png';
  });

  // Data State - Initialized from LocalStorage
  const [clients, setClients] = useState<Client[]>(() => loadData('clients', initialClients));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadData('suppliers', initialSuppliers));
  const [orders, setOrders] = useState<Order[]>(() => loadData('orders', initialOrders));
  const [historyOrders, setHistoryOrders] = useState<Order[]>(() => loadData('historyOrders', initialHistory));
  const [products, setProducts] = useState<Product[]>(() => loadData('products', initialProducts));
  const [sales, setSales] = useState<Sale[]>(() => loadData('sales', initialSales));

  // --- AUTO-SAVE LOGIC ---
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('historyOrders', JSON.stringify(historyOrders));
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [clients, suppliers, orders, historyOrders, products, sales]);

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'client' | 'supplier' | 'order' | ''>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentEdit, setCurrentEdit] = useState<any>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // --- ARCHIVING LOGIC ---
  useEffect(() => {
    const archiveOrders = () => {
      // Simplified archiving for demo/stability - moves old completed orders
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const toArchive = orders.filter(o => o.status === 'Concluído' && new Date(o.createdAt) < thirtyDaysAgo);
      if (toArchive.length > 0) {
        setHistoryOrders(prev => [...prev, ...toArchive]);
        setOrders(prev => prev.filter(o => !toArchive.includes(o)));
      }
    };
    archiveOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length]);

  // --- ACTIONS ---
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (modalType === 'client') {
      const newClient = { id: currentEdit ? currentEdit.id : Date.now(), ...data } as Client;
      if (currentEdit) setClients(clients.map(c => c.id === currentEdit.id ? newClient : c));
      else setClients([...clients, newClient]);
    } else if (modalType === 'supplier') {
      const newSupplier = { id: currentEdit ? currentEdit.id : Date.now(), ...data } as Supplier;
      if (currentEdit) setSuppliers(suppliers.map(s => s.id === currentEdit.id ? newSupplier : s));
      else setSuppliers([...suppliers, newSupplier]);
    } else if (modalType === 'order') {
      const orderData: Order = {
        id: currentEdit ? currentEdit.id : (orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 2024001),
        clientId: parseInt(data.clientId as string),
        device: data.device as string,
        brand: data.brand as string,
        serial: data.serial as string,
        issue: data.issue as string,
        technician: 'Técnico Responsável', // Simplify for now
        status: (currentEdit ? currentEdit.status : 'Pendente'),
        price: parseFloat(data.price as string || '0'),
        createdAt: currentEdit ? currentEdit.createdAt : new Date().toISOString(),
        forecast: data.forecast as string,
        observations: data.observations as string
      };
      if (currentEdit) setOrders(orders.map(o => o.id === currentEdit.id ? orderData : o));
      else setOrders([...orders, orderData]);
    }
    setIsModalOpen(false);
    setCurrentEdit(null);
  };

  const handleDelete = (type: string, id: number) => {
    if (confirm('Tem certeza?')) {
      if (type === 'client') setClients(clients.filter(c => c.id !== id));
      if (type === 'supplier') setSuppliers(suppliers.filter(s => s.id !== id));
      if (type === 'order') setOrders(orders.filter(o => o.id !== id));
      if (type === 'history') setHistoryOrders(historyOrders.filter(o => o.id !== id));
      if (type === 'sale') setSales(sales.filter(s => s.id !== id));
    }
  };

  const handleFinalizeOrder = (order: Order) => {
    if (confirm('Deseja finalizar esta ordem de serviço? O status será alterado para Concluído.')) {
      setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'Concluído' } : o));
    }
  };

  const handleImportData = (data: any) => {
    if (data.clients) setClients(data.clients);
    if (data.orders) setOrders(data.orders);
    if (data.suppliers) setSuppliers(data.suppliers);
    if (data.historyOrders) setHistoryOrders(data.historyOrders);
    // Add products/sales import if available in newer backups, backward comp check
  };

  const stats: Stats = {
    pending: orders.filter(o => o.status === 'Pendente').length,
    active: orders.filter(o => ['Em Análise', 'Aguardando Peça'].includes(o.status)).length,
    done: orders.filter(o => o.status === 'Concluído').length,
    revenue: orders.reduce((acc, curr) => acc + curr.price, 0) + sales.reduce((acc, curr) => acc + curr.total, 0)
  };

  // --- ACTIONS ---
  // ... existing handler code ... //

  // --- SPLASH SCREEN STATE ---
  const [showSplash, setShowSplash] = useState(true);

  // --- RENDER ---
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (printingOrder) {
    return <PrintLayout
      order={printingOrder}
      client={clients.find(c => c.id === printingOrder.clientId)}
      onClose={() => setPrintingOrder(null)}
      logo={logo}
    />;
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab as any}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        logo={logo}
        setLogo={setLogo}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-[#F1F5F9]">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {['dashboard', 'orders', 'sales'].includes(activeTab) === false && (
              <input
                type="text"
                placeholder="Pesquisar..."
                className="hidden md:block pl-4 pr-4 py-2 bg-slate-100 rounded-xl text-sm w-64 focus:bg-white border border-transparent focus:border-indigo-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            {['orders', 'clients', 'suppliers'].includes(activeTab) && (
              <button
                onClick={() => {
                  setModalType(activeTab === 'orders' ? 'order' : activeTab === 'clients' ? 'client' : 'supplier');
                  setCurrentEdit(null);
                  setIsModalOpen(true);
                }}
                className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 transition-all"
              >
                + Novo
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <DataManagement
              clients={clients}
              orders={orders}
              suppliers={suppliers}
              historyOrders={historyOrders}
              onImport={handleImportData}
            />

            {activeTab === 'dashboard' && <Dashboard stats={stats} orders={orders} clients={clients} onPrint={setPrintingOrder} />}

            {activeTab === 'orders' && (
              <OrdersView
                orders={orders}
                clients={clients}
                searchTerm={searchTerm}
                onEdit={(o) => { setCurrentEdit(o); setModalType('order'); setIsModalOpen(true); }}
                onDelete={handleDelete}
                onPrint={setPrintingOrder}
                onFinalize={handleFinalizeOrder}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                historyOrders={historyOrders}
                sales={sales}
                clients={clients}
                onDelete={(id, type) => handleDelete(type === 'order' ? 'history' : 'sale', id)}
                onPrint={setPrintingOrder}
              />
            )}

            {activeTab === 'products' && (
              <ProductsView
                products={products}
                onAddProduct={(p) => setProducts([...products, p])}
                onUpdateProduct={(p) => setProducts(products.map(prod => prod.id === p.id ? p : prod))}
                onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
              />
            )}

            {activeTab === 'sales' && (
              <SalesView
                products={products}
                onUpdateProduct={(p) => setProducts(products.map(prod => prod.id === p.id ? p : prod))}
                onRegisterSale={(s) => setSales([...sales, s])}
              />
            )}

            {/* Simplified Tables for Clients/Suppliers (could correspond to reused generic table component or inline here, keeping brief for brevity) */}
            {(activeTab === 'clients' || activeTab === 'suppliers') && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Nome</th>
                      <th className="px-6 py-4">Contato</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(activeTab === 'clients' ? clients : suppliers)
                      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium">{item.name}</td>
                          <td className="px-6 py-4 text-slate-500">{item.phone}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDelete(activeTab === 'clients' ? 'client' : 'supplier', item.id)} className="text-red-500 hover:text-red-700 font-bold text-xs">Excluir</button>
                            <button onClick={() => { setCurrentEdit(item); setModalType(activeTab === 'clients' ? 'client' : 'supplier'); setIsModalOpen(true); }} className="ml-4 text-indigo-500 hover:text-indigo-700 font-bold text-xs">Editar</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL - Clients / Suppliers */}
      {isModalOpen && modalType !== 'order' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* ... existing modal for client/supplier ... */}
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold mb-6 text-slate-800 capitalize">
              {currentEdit ? 'Editar' : 'Novo'} {modalType}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              {modalType === 'client' && (
                <>
                  <input name="name" placeholder="Nome" defaultValue={currentEdit?.name} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500" required />
                  <input name="phone" placeholder="Telefone" defaultValue={currentEdit?.phone} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500" required />
                  <input name="cpf" placeholder="CPF" defaultValue={currentEdit?.cpf} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500" />
                </>
              )}
              {modalType === 'supplier' && (
                <>
                  <input name="name" placeholder="Nome" defaultValue={currentEdit?.name} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500" required />
                  <input name="phone" placeholder="Telefone" defaultValue={currentEdit?.phone} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500" required />
                </>
              )}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200">Cancelar</button>
                <button type="submit" className="flex-1 py-3 font-bold text-white bg-slate-900 rounded-xl hover:bg-black shadow-lg">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW ORDER MODAL */}
      <OrderModal
        isOpen={isModalOpen && modalType === 'order'}
        onClose={() => setIsModalOpen(false)}
        clients={clients}
        products={products}
        order={currentEdit}
        onSave={(orderData) => {
          const newOrder = {
            ...orderData,
            id: currentEdit ? currentEdit.id : (orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 2024001),
            createdAt: currentEdit ? currentEdit.createdAt : new Date().toISOString()
          } as Order;

          if (currentEdit) setOrders(orders.map(o => o.id === currentEdit.id ? newOrder : o));
          else setOrders([...orders, newOrder]);

          setIsModalOpen(false);
          setCurrentEdit(null);
        }}
      />
    </div>
  );
}