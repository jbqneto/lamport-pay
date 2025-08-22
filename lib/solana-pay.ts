export interface SolanaPayParams {
  recipient: string;
  amount: number;
  token?: string;
  reference?: string;
  label?: string;
  message?: string;
  memo?: string;
}

// USDC mint address on Solana mainnet
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export function generateSolanaPayURL(params: SolanaPayParams): string {
  const baseURL = 'solana:';
  const urlParams = new URLSearchParams();
  
  // Add required parameters
  if (params.amount) {
    urlParams.append('amount', params.amount.toString());
  }
  
  // Add optional parameters
  if (params.token || params.token === '') {
    urlParams.append('spl-token', params.token || USDC_MINT);
  } else {
    urlParams.append('spl-token', USDC_MINT);
  }
  
  if (params.reference) {
    urlParams.append('reference', params.reference);
  }
  
  if (params.label) {
    urlParams.append('label', params.label);
  }
  
  if (params.message) {
    urlParams.append('message', params.message);
  }
  
  if (params.memo) {
    urlParams.append('memo', params.memo);
  }

  return `${baseURL}${params.recipient}?${urlParams.toString()}`;
}

export function generateReference(): string {
  // Generate a random 32-byte reference key (base58 encoded)
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateMerchantKey(): string {
  // Generate a mock Solana public key
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}