import React, { useRef } from 'react';
import { Download, Upload, Database, AlertCircle } from 'lucide-react';
import { Client, Order, Supplier } from '../types';

interface DataManagementProps {
    clients: Client[];
    orders: Order[];
    suppliers: Supplier[];
    historyOrders: Order[];
    onImport: (data: any) => void;
}

export function DataManagement({ clients, orders, suppliers, historyOrders, onImport }: DataManagementProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = {
            clients,
            orders,
            suppliers,
            historyOrders,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conserta-aqui-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target?.result as string);
                    if (confirm(`Deseja substituir TODOS os dados atuais pelos dados do arquivo de backup de ${new Date(importedData.exportedAt || Date.now()).toLocaleDateString()}?`)) {
                        onImport(importedData);
                        alert('Dados importados com sucesso!');
                    }
                } catch (error) {
                    alert('Erro ao importar arquivo: Formato inválido.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between mb-8 overflow-hidden relative">
            <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                    <Database size={20} className="text-indigo-400" /> Backup & Segurança
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Salvo Automaticamente
                    </span>
                </h3>
                <p className="text-slate-400 text-xs text-justify">
                    Seus dados são salvos automaticamente no navegador.
                </p>
            </div>
            {/* Backup buttons removed as requested */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div >
    );
}
