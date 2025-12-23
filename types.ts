export interface Client {
  id: number;
  name: string;
  phone: string;
  cpf: string;
  obs?: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  category: string;
}

export interface Order {
  id: number;
  clientId: number;
  device: string;
  brand: string;
  serial?: string;
  issue: string;
  status: 'Pendente' | 'Em Análise' | 'Aguardando Peça' | 'Concluído';
  price: number;
  createdAt: string;
  forecast: string;
  technician?: string;
  observations?: string;
  items?: SaleItem[]; // Products added to the service
  servicePrice?: number; // Price of the service itself (labor)
}

export interface Stats {
  pending: number;
  active: number;
  done: number;
  revenue: number;
}

export const STORE_INFO = {
  name: "CONSERTA AQUI",
  cnpj: "54.173.868/0001-12",
  address: "Rua Boa Morte, 494 - Centro, Limeira-SP",
  phone: "(19) 983442-1758",
  email: "contato@consertaaqui.com"
};

export interface Product {
  id: number;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  sku?: string;
}

export interface SaleItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: number;
  items: SaleItem[];
  total: number;
  paymentMethod: 'Pix' | 'Dinheiro' | 'Cartão Crédito' | 'Cartão Débito';
  createdAt: string;
  discount?: number;
}