import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Web3AuthProvider } from '@web3auth/modal/react';
import { W3AProvider } from '@/components/app/context/web2auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LamportPay - Seedless USDC invoices on Solana',
  description: 'Clean, flat, and fast USDC invoicing for small merchants on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <W3AProvider>
            <Navigation />
            <main className="min-h-screen bg-background">
              {children}
            </main>
          </W3AProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}