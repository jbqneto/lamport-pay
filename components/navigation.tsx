'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { SignInButton } from './app/sign-in-button';
import { useWeb3Auth } from '@web3auth/modal/react';
import { useSolanaWallet } from '@web3auth/modal/react/solana';
import { Connection, PublicKey } from '@solana/web3.js';

export function Navigation() {
  const SOLANA_URL = process.env.NEXT_PUBLIC_SOLANA_RPC;
  const { setTheme, theme } = useTheme();
  const { isConnected, provider } = useWeb3Auth();
  const { accounts } = useSolanaWallet();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  if (!SOLANA_URL) {
    throw new Error('Missing SOLANA URL env');
  }

  const fetchWalletInfo = async () => {
    const pubkey = accounts?.[0] ?? null;

    if (!pubkey) return;
    
    setAddress(pubkey);

    const conn = new Connection(SOLANA_URL);
    const lamports = await conn.getBalance(new PublicKey(pubkey));
    
    setBalance(lamports / 1_000_000_000);
      

    console.log('Wallet address', accounts);
  }
  

  useEffect(() => {
    if (!isConnected) return;

    fetchWalletInfo()
    .catch((err) => console.error('Fetch wallet info error', err));

  }, [isConnected, accounts]);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">LamportPay</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="btn-ghost text-sm">
                Dashboard
              </Button>
            </Link>

            <SignInButton />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-ghost"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}