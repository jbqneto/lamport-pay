'use client';

import { createQR, encodeURL } from '@solana/pay';
import { Keypair, PublicKey } from '@solana/web3.js';
import dynamic from 'next/dynamic';
import BigNumber from 'bignumber.js';

const QRCodeBox = dynamic(
  () => import('@/components/app/qrcode-box').then(m => m.QRCodeBox),
  { ssr: false }
);

type Props = { url: string, children?: React.ReactNode; };

export function TmpQrCode({ url, children }: Props) {

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm flex items-center justify-center">
      <QRCodeBox size={256} value={url} className="h-auto w-full max-w-[320px]" />
    </div>
  );
}