// app/page.tsx  (SSR)
import { HomeProvider } from '@/components/app/context/main-context';
import DemoFormCard from '@/components/app/home/demo-form-card';
import { createPublicKeyRandomReference } from './server/crypto.util';
import { HowItWorks } from '@/components/app/home/how-it-works';
import { SupportedWallets } from '@/components/app/home/suppoerted-wallets';
import { Benefits } from '@/components/app/home/benefits';

export default async function HomePage() {
  const usdcTokenAddress = process.env.USDC_MINT_ADDRESS;

  if (!usdcTokenAddress) {
    throw new Error('USDC_MINT_ADDRESS is not defined in environment variables.');
  }

  const initial = {
    title: 'Donate for the project',
    amount: 10,
    receiver: process.env.MERCHANT_DEFAULT_ADDRESS!!,
    reference: await createPublicKeyRandomReference()
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container py-16">
        {/* Hero + Interactive demo */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Left: hero copy + CTAs */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-foreground">
                Seedless USDC invoices on Solana
              </h1>
              <p className="text-xl text-gray-600 dark:text-muted-foreground leading-relaxed">
                Generate invoices seamlessly and receive USDC payments directly in your wallet—no seed phrase required
              </p>
            </div>


            <Benefits />
            <SupportedWallets className="pt-3" />
          </div>

          {/* Right: Interactive demo card (com QR dentro) */}
            <HomeProvider initial={initial}>
              <DemoFormCard />
            </HomeProvider>
        </div>
        <HowItWorks />
      </div>
    </div>
  );
}
