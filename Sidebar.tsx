import React, { ReactNode } from 'react';
import {
    LayoutDashboard,
    Users,
    Truck,
    ClipboardList,
    Archive,
    Zap,
    Package,
    DollarSign,
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: 'dashboard' | 'orders' | 'clients' | 'suppliers' | 'history' | 'sales' | 'products') => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    logo: string | null;
    setLogo: (logo: string | null) => void;
}

export function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, logo, setLogo }: SidebarProps) {
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setLogo(base64);
                localStorage.setItem('conserta_aqui_logo', base64);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <aside className={`
      fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-400 flex flex-col border-r border-slate-900 shadow-2xl transition-transform duration-300
      md:relative md:translate-x-0
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
            <div className="p-8 flex flex-col md:flex-row items-center gap-4 border-b border-slate-900/50">
                <label className="relative group cursor-pointer flex-shrink-0">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    {logo ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg shadow-indigo-900/20 group-hover:border-indigo-500 transition-all">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20 group-hover:shadow-indigo-500/50 transition-all">
                            <Zap className="text-white" size={20} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none">
                        <span className="text-[8px] font-bold text-white uppercase">Alterar</span>
                    </div>
                </label>

                <div>
                    <h1 className="font-bold text-white text-lg tracking-tight leading-none uppercase">Conserta<span className="text-blue-500">Aqui</span></h1>
                    <p className="text-[10px] font-medium text-slate-500 tracking-widest uppercase mt-1">Gestão Pro</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                <SidebarLink active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} icon={<LayoutDashboard size={20} />} label="Visão Geral" />
                <SidebarLink active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }} icon={<ClipboardList size={20} />} label="Ordens de Serviço" />
                <SidebarLink active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }} icon={<Package size={20} />} label="Produtos" />
                <SidebarLink active={activeTab === 'sales'} onClick={() => { setActiveTab('sales'); setIsMobileMenuOpen(false); }} icon={<DollarSign size={20} />} label="Vendas / PDV" />
                <SidebarLink active={activeTab === 'history'} onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }} icon={<Archive size={20} />} label="Histórico" />
                <SidebarLink active={activeTab === 'clients'} onClick={() => { setActiveTab('clients'); setIsMobileMenuOpen(false); }} icon={<Users size={20} />} label="Clientes" />
                <SidebarLink active={activeTab === 'suppliers'} onClick={() => { setActiveTab('suppliers'); setIsMobileMenuOpen(false); }} icon={<Truck size={20} />} label="Fornecedores" />
            </nav>

            <div className="p-6 mt-auto border-t border-slate-900 bg-slate-950/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                        AD
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-white">Administrador</p>
                        <p className="text-[10px] text-slate-500">Logado agora</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function SidebarLink({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${active ? 'text-white bg-slate-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>}
            <span className={`transform transition-transform ${active ? 'text-blue-400' : 'group-hover:text-slate-300'}`}>{icon}</span>
            <span className="text-sm font-medium tracking-wide">{label}</span>
        </button>
    );
}
