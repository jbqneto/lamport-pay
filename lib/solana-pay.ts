import { PublicKey } from "@solana/web3.js";
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

export interface SolanaPayParams {
  recipient: string;
  amount: number;
  reference: PublicKey;
  label?: string;
  message?: string;
  memo?: string;
  token: PublicKey;
}

export function generateSolanaPayURL(params: SolanaPayParams): string {
  return encodeURL({
    recipient: new PublicKey(params.recipient),
    amount: new BigNumber(params.amount),
    splToken: params.token,
    reference: params.reference,
    label: params.label,
    message: params.message,
    memo: params.memo,
  }).toString()
}

export function generateMockReference(): string {
  // Generate a random 32-byte reference key (base58 encoded)
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateMockMerchantKey(): string {
  // Generate a mock Solana public key
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}