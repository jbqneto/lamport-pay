export interface Invoice {
  id: string;
  title: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELED' | 'EXPIRED';
  createdAt: string;
  reference?: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    title: 'Consulting Hour',
    amount: 120.0,
    status: 'PENDING',
    createdAt: '2025-01-20',
    reference: 'ref_' + Math.random().toString(36).substr(2, 9)
  },
  {
    id: 'INV-002',
    title: 'Maintenance Plan',
    amount: 89.9,
    status: 'PAID',
    createdAt: '2025-01-18',
    reference: 'ref_' + Math.random().toString(36).substr(2, 9)
  },
  {
    id: 'INV-003',
    title: 'Website Design',
    amount: 450.0,
    status: 'CANCELED',
    createdAt: '2025-01-15',
    reference: 'ref_' + Math.random().toString(36).substr(2, 9)
  },
  {
    id: 'INV-004',
    title: 'Logo Package',
    amount: 75.0,
    status: 'EXPIRED',
    createdAt: '2025-01-10',
    reference: 'ref_' + Math.random().toString(36).substr(2, 9)
  }
];

export const mockWalletData = {
  solBalance: 8.53,
  usdcBalance: 246.75,
  publicKey: 'B1aLcE4R3StK8mNp9JqW7xYzH5Vn2Fs8GtQwErTyUiOp'
};