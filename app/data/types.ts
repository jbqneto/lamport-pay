import { InvoiceStatus } from "@/lib/generated/prisma";

export type CreateInvoice = {
  title: string;
  amount: number;
  recipient: string;   // pubkey base58
  reference: string;  // pubkey base58
  label?: string;
  message?: string;
};

export type ChainCurrency = 'USDC' | 'SOL';

export type ListInvoicesFilter = {
  merchantId: string;
  status?: InvoiceStatus;
  take?: number;                       // default: 20
  cursor?: string | null;              // pagination cursor (id)
};

export type ListMerchantsFilter = {
  ownerId: string;
  status?: 'active' | 'disabled';
  take?: number;           // default 20
  cursor?: string | null;  // pagination cursor (merchant id)
};