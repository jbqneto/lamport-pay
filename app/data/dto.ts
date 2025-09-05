import { Coin } from "@/lib/generated/prisma";

export type CreateInvoiceDTO = {
  createdById: string;
  merchantId: string;
  amount: number | string;     
  coin: Coin;                  
  validForSeconds?: number;    
  memo?: string | null;
};

export type CreateMerchantDTO = {
  ownerId: string;
  name: string;
  usdcTokenAccount?: string | null; // merchant USDC ATA (optional at creation)
  usdtTokenAccount?: string | null; // merchant USDT ATA (optional at creation)
};

export type UpdateMerchantDTO = {
  name?: string;
  usdcTokenAccount?: string | null;
  usdtTokenAccount?: string | null;
  status?: 'active' | 'disabled';
};