import React, { useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';
import { Order, Client, STORE_INFO } from '../types';

interface PrintLayoutProps {
    order: Order;
    client?: Client;
    onClose: () => void;
    logo?: string | null;
}

export function PrintLayout({ order, client, onClose, logo }: PrintLayoutProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 100);

        const handleAfterPrint = () => {
            // Optional: Auto-close after print if desired, but user might want to reprint.
            // keeping manual close for better UX.
        };

        window.addEventListener('afterprint', handleAfterPrint);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, []);

    return (
        <>
            <div className="fixed top-4 right-4 print:hidden z-50">
                <button
                    onClick={onClose}
                    className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
                >
                    <X size={20} /> Fechar Visualização
                </button>
            </div>

            <div className="min-h-screen bg-white text-black font-sans text-[11px] leading-snug p-8 print:p-0">
                <div className="border border-black p-6 max-w-[210mm] mx-auto bg-white print:border-black print:p-0 print:border-none">
                    {/* Header Impressão */}
                    <div className="flex justify-between items-start border-b border-black pb-6 mb-6">
                        <div className="flex gap-5">
                            {logo ? (
                                <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />
                            ) : (
                                <div className="bg-black text-white p-4 rounded-xl flex items-center justify-center print:bg-black print:text-white">
                                    <Smartphone size={32} />
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-black tracking-tight uppercase">{STORE_INFO.name}</h1>
                                <p className="font-bold text-xs mt-1">CNPJ: {STORE_INFO.cnpj}</p>
                                <p className="text-[10px]">{STORE_INFO.address}</p>
                                <p className="text-[10px]">Tel: {STORE_INFO.phone} | {STORE_INFO.email}</p>
                            </div>
                        </div>
                        <div className="text-right pl-6 py-1">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Ordem de Serviço</h2>
                            <p className="text-3xl font-black my-1">#{order.id}</p>
                            <p className="text-[10px]">Entrada: <strong>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</strong></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="border border-black p-4 rounded-lg bg-slate-50 print:bg-slate-50">
                            <p className="font-black border-b border-black mb-3 uppercase text-[9px] text-slate-500 tracking-wider">Cliente</p>
                            <div className="space-y-1">
                                <p className="text-sm font-bold uppercase">{client?.name || 'Cliente Removido'}</p>
                                <div className="flex justify-between text-[10px]">
                                    <p>CPF: {client?.cpf}</p>
                                    <p>Tel: {client?.phone}</p>
                                </div>
                                {client?.obs && <p className="italic text-slate-600 border-t border-dashed border-slate-300 pt-2 mt-2 text-[10px]">Obs: {client.obs}</p>}
                            </div>
                        </div>
                        <div className="border border-black p-4 rounded-lg bg-slate-50 print:bg-slate-50">
                            <p className="font-black border-b border-black mb-3 uppercase text-[9px] text-slate-500 tracking-wider">Equipamento</p>
                            <div className="space-y-1">
                                <p className="text-sm font-bold">{order.device} <span className="text-slate-500 font-normal">({order.brand})</span></p>
                                <p className="text-[10px]">Nº Série/IMEI: <strong>{order.serial || 'Não informado'}</strong></p>
                                <p className="text-[10px]">Técnico: {order.technician || '__________________'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-black p-4 rounded-lg mb-6">
                        <p className="font-black border-b border-black mb-3 uppercase text-[9px] text-slate-500 tracking-wider">Defeito Relatado / Serviço</p>
                        <p className="min-h-[40px] whitespace-pre-wrap text-sm font-medium leading-relaxed">{order.issue}</p>

                        {order.items && order.items.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-dashed border-slate-300">
                                <p className="font-black mb-2 uppercase text-[9px] text-slate-500 tracking-wider">Peças & Produtos Adicionados</p>
                                <ul className="text-[10px] space-y-1">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between items-center border-b border-slate-100 pb-1">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span className="font-mono">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-4 pt-2 flex justify-between items-center text-xs font-bold border-t border-black">
                            <span>Mão de Obra</span>
                            <span className="font-mono">R$ {(order.servicePrice || (order.price - (order.items?.reduce((a, i) => a + i.price * i.quantity, 0) || 0))).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="border border-black p-4 rounded-lg mb-6">
                        <p className="font-black border-b border-black mb-3 uppercase text-[9px] text-slate-500 tracking-wider">Checklist de Entrada</p>
                        <div className="grid grid-cols-4 gap-y-3 gap-x-2 text-[10px]">
                            {['Liga', 'Display', 'Vidro', 'Wi-Fi', 'Rede', 'Áudio', 'Câm. Frontal', 'Câm. Traseira', 'Botões', 'Conector', 'Microfone', 'Sensores'].map(item => (
                                <div key={item} className="flex items-center gap-2">
                                    <div className="w-3 h-3 border border-black rounded-[2px]"></div>
                                    <span className="uppercase font-semibold text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-black p-4 rounded-lg bg-slate-50 mb-6 print:bg-slate-50">
                        <p className="font-black border-b border-black mb-3 uppercase text-[9px] text-slate-500 tracking-wider">Termos e Condições de Garantia</p>
                        <div className="text-[9px] text-justify leading-relaxed space-y-2 text-slate-700">
                            <p>
                                <strong>1. SERVIÇOS E PEÇAS:</strong> A garantia é de 90 (noventa) dias, conforme o Código de Defesa do Consumidor, e cobre exclusivamente o serviço executado e as peças substituídas. Não se estende a outras partes do aparelho.
                            </p>
                            <p>
                                <strong>2. PERDA DE GARANTIA:</strong> A garantia será automaticamente anulada se o aparelho apresentar: (a) Danos causados por contato com líquidos (oxidação); (b) Quedas, amassados, trincas ou danos físicos posteriores à entrega; (c) Manuseio por terceiros não autorizados; (d) Instalação de software malicioso.
                            </p>
                            <p>
                                <strong>3. APARELHOS MOLHADOS:</strong> Para equipamentos que tiveram contato com líquido, não há garantia de funcionamento permanente, pois a oxidação é um processo progressivo. O serviço visa a recuperação de dados e funcionalidade momentânea.
                            </p>
                            <p>
                                <strong>4. ABANDONO:</strong> Aparelhos não retirados no prazo máximo de 90 dias após a comunicação de conclusão ou orçamento serão considerados abandonados e poderão ser descartados ou vendidos para custear despesas, conforme Lei 1.234/56.
                            </p>
                            <p>
                                <strong>5. DADOS:</strong> A empresa não se responsabiliza por perda de dados (fotos, contatos, etc.). Recomendamos que o cliente realize backup prévio.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border border-black p-5 rounded-lg bg-slate-50 mb-12 print:bg-slate-50">
                        <div className="text-[10px] text-slate-600 max-w-[60%] leading-tight">
                            Declaro que li e concordo com os termos acima e autorizo a execução do serviço.
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Valor Estimado</p>
                            <p className="text-3xl font-black">R$ {order.price.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-24 px-10 mt-auto">
                        <div className="text-center">
                            <div className="border-t border-black mb-2"></div>
                            <p className="uppercase font-bold text-[10px]">{client?.name || 'Cliente'}</p>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-black mb-2"></div>
                            <p className="uppercase font-bold text-[10px]">{STORE_INFO.name}</p>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
