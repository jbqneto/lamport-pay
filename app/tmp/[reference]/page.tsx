// app/tmp/[reference]/page.tsx  (Server Component - SSR)
import { cookies } from 'next/headers';
import { Keypair, PublicKey } from '@solana/web3.js';
import { CreateInvoice } from '@/app/data/types';
import { TmpQrCode } from '@/components/app/tmp/tmp-qrcode';
import { generateSolanaPayURL, generateTxPayUrl } from '@/lib/solana-utils';

type Props = { params: Promise<{ reference: string }> };

export default async function Page({ params }: Props) {
  const { reference } = await params;

  // 1) tente ler a cookie da sessão
  const store = await cookies();
  const raw = store.get('lamport-pay_tmp_invoice')?.value;

  let invoice: CreateInvoice | null = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as CreateInvoice;
      // garanta que a URL acessada bate com a reference da cookie
      if (parsed.reference === reference) invoice = parsed;
    } catch {}
  }

  // 2) fallback (sem cookie): padrão de doação
  if (!invoice) {
    invoice = {
      title: 'Support the project',
      amount: 10,
      recipient: process.env.MERCHANT_DEFAULT_ADDRESS!,
      reference, // use a da URL
      label: 'LamportPay',
      message: 'Demo invoice (default).',
    };
  }

const recipient = invoice.recipient;
const amount = invoice.amount
const label = invoice.title;
const message = invoice.message;
const referencePk = invoice.reference ? new PublicKey(invoice.reference) : Keypair.generate().publicKey;

const url = generateTxPayUrl({ recipient, amount, reference: referencePk, label, message });

  console.log('Generated URL:', url);

  // 4) UI: QR grande à esquerda, detalhes à direita
  return (
    <div className="container py-16">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        
        <TmpQrCode url={url.toString()}>
          
        </TmpQrCode>


        <aside className="space-y-4">
          <h1 className="text-2xl font-bold">{invoice.title}</h1>
          <div className="text-muted-foreground">
            <p><span className="font-medium">Amount:</span> {invoice.amount} USDC</p>
            <p className="break-all">
              <span className="font-medium">Recipient:</span> {invoice.recipient}
            </p>
            <p className="break-all">
              <span className="font-medium">Reference:</span> {invoice.reference}
            </p>
          </div>

          <div className="rounded-xl border bg-muted/30 p-4 text-sm">
            This page is a demo preview. No obligations. For production, generate an
            invoice from your dashboard.
          </div>

          <a href="/" className="inline-flex px-4 py-2 rounded-md border hover:bg-accent">
            ← Back to home
          </a>
        </aside>
      </div>
    </div>
  );
}
