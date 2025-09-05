import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;

if (!DEFAULT_TOKEN) {
  throw new Error('Missing USDC token env');
}

export interface SolanaPayParams {
  recipient: string;
  amount: number;
  reference: PublicKey;
  label?: string;
  message?: string;
  memo?: string;
  token?: string;
}

export async function getUsdcBalance(opts: {
  address: PublicKey | string;
}) {
  const ENV = process.env.NEXT_PUBLIC_ENV || 'prod';
  const RPC_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_RPC;
  const MINT_ADDRESS = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;

  if (!RPC_ADDRESS || !MINT_ADDRESS) throw new Error('Missing configuration variables');
  
  const rpc = clusterApiUrl(ENV === 'dev' ? 'devnet' : 'mainnet-beta')
  const conn = new Connection(rpc, 'confirmed');
  const owner = typeof opts.address === 'string' ? new PublicKey(opts.address) : opts.address;

  const resp = await conn.getParsedTokenAccountsByOwner(owner, {
    mint: new PublicKey(MINT_ADDRESS)
  })

  if (resp.value.length === 0) return 0;

  const accountInfo = resp.value[0].account.data.parsed.info;
  const ui = accountInfo.tokenAmount.uiAmount ?? 0;
  return ui as number;
} 

export async function getTokenBallance(opts: {
  address: PublicKey | string;
  mint: PublicKey | string;
}) {

}

export function generateTxPayUrl(params: SolanaPayParams): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';  
  const label = encodeURIComponent(params.label ?? 'LamportPay');
  const message = encodeURIComponent(params.message ?? 'Payment');
  const receiver = params.recipient;

  const url = baseUrl + `/api/tx/usdc?receiver=${receiver}&amount=${params.amount}&label=${label}&message=${message}`;

  return encodeURI(url);
}

export function generateSolanaPayURL(params: SolanaPayParams): string {
  const token = params.token || DEFAULT_TOKEN;

  if (!token) throw new Error('Missing USDC token env');
  
  return encodeURL({
    recipient: new PublicKey(params.recipient),
    amount: new BigNumber(params.amount),
    splToken: new PublicKey(token),
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