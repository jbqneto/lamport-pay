'use client';

import { QRCodeBox } from '@/components/app/qrcode-box';
import { useHome } from '../context/main-context';

// qrcode-box deve usar next/dynamic({ ssr:false }) para evitar mismatch na hidratação do SVG. :contentReference[oaicite:2]{index=2}
export default function DemoQr(props: React.ComponentProps<typeof QRCodeBox>) {
  const { solanaPayURL } = useHome();
  return <QRCodeBox value={solanaPayURL} {...props} />;
}
