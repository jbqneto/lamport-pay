// components/landing/Benefits.tsx
import { ShieldCheck, Zap, QrCode, Receipt } from "lucide-react";

const items = [
  { icon: Zap,    title: "Fast settlement", desc: "USDC on Solana with near-instant confirmations." },
  { icon: ShieldCheck, title: "No intermediaries", desc: "Lower fees and direct, non-custodial payments." },
  { icon: Receipt, title: "Smart reconciliation", desc: "Track each payment via unique references." },
  { icon: QrCode, title: "Portable links & QR", desc: "Use on your website, emails, or in-store." },
];

export function Benefits() {
  return (
    <section className="container mb-24">
      <h2 className="text-3xl font-bold text-center mb-10">Why LamportPay</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
