// components/landing/HowItWorks.tsx
import { NotebookPen, QrCode, DollarSign } from "lucide-react";

const steps = [
  { icon: NotebookPen, title: "Create invoice", desc: "Fill out the invoice details in seconds." },
  { icon: QrCode,      title: "Share QR or link", desc: "Customer scans or taps to pay with USDC." },
  { icon: DollarSign,  title: "Get paid", desc: "Funds arrive directly in your wallet." },
];

export function HowItWorks() {
  return (
    <section className="container mb-24">
      <h2 className="text-3xl font-bold text-center mb-10">How it works</h2>
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <li key={title} className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {i + 1}
              </span>
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
