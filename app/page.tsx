// app/page.tsx  (SSR)
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Shield, QrCode, CheckCircle, DollarSign } from 'lucide-react';
import { generateReference, generateMerchantKey as getMerchantKey } from '@/lib/solana-pay';
import { HomeProvider } from '@/components/app/context/main-context';
import DemoFormCard from '@/components/app/home/demo-form-card';
import MainQrCode from '@/components/app/home/main-qrcode';
import { ScrollButton } from '@/components/app/scroll-button';
import { createPublicKeyRandomReference } from './server/crypto.util';

export default async function HomePage() {
  const usdcTokenAddress = process.env.USDC_MINT_ADDRESS;

  if (!usdcTokenAddress) {
    throw new Error('USDC_MINT_ADDRESS is not defined in environment variables.');
  }

  const initial = {
    title: 'Donate for the project',
    amount: 10,
    receiver: process.env.MERCHANT_DEFAULT_ADDRESS!!,
    reference: await createPublicKeyRandomReference(),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Left Column - Hero Content (SSR, igual ao seu) */}
          <div className="space-y-8">
            {/* ... hero exatamente como está ... */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-foreground">
                Seedless USDC invoices on Solana
              </h1>
              <p className="text-xl text-gray-600 dark:text-muted-foreground leading-relaxed">
                Generate invoices seamlessly and receive USDC payments directly in your wallet—no seed phrase required
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard"><Button size="lg" className="btn-primary text-base px-8 py-3">Create Invoice</Button></Link>
              <ScrollButton targetId="demo" label="Try interactive demo" />
            </div>
            {/* pills ... */}
          </div>

          {/* Right Column - Interactive Demo (Client, mas dentro da mesma coluna) */}
          <div className="demo-card" id="demo">
            <HomeProvider initial={initial}>
              <DemoFormCard />
            </HomeProvider>
          </div>
        </div>

        {/* QR-first UX Section (usa o MESMO estado/URL) */}
        <HomeProvider initial={initial}>
          <div className="mb-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">QR-first UX</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Generate invoices with QR codes for a streamlined, user-friendly payment experience
                </p>
              </div>
              <div className="flex justify-center">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <MainQrCode className="h-auto max-w-full" />
                </div>
              </div>
            </div>
          </div>
        </HomeProvider>

        {/* resto da página (SSR) permanece idêntico */}
      </div>
    </div>
  );
}
