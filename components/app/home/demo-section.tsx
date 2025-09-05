// components/app/demo-section.tsx
"use client";

import { useContext, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSolanaPayURL } from "@/lib/solana-utils"; // sua função gera URL (Transfer Request)
import { QRCodeBox } from "@/components/app/qrcode-box"; // client-only
import { QrCode, DollarSign, CheckCircle } from "lucide-react";
import { useHome } from "../context/main-context";

type Props = {
  initial: {
    title: string;
    amount: number;
    recipient: string;
    reference: string;
  };
};

export default function DemoSection({ initial }: Props) {
  const [copied, setCopied] = useState(false);
  const { solanaPayURL, demoForm, setDemoForm } = useHome();

  // UMA fonte de verdade para o link — reaproveitada em todos os lugares
  const copyToClipboard = () => {
    navigator.clipboard.writeText(solanaPayURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-start mb-24" id="demo">
      {/* Coluna direita — card interativo */}
      <Card className="demo-card">
        <CardHeader>
          <CardTitle>Interactive demo</CardTitle>
          <CardDescription>
            This is a Transfer Request example (USDC SPL token + reference for reconciliation)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Inputs controlados */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Title</Label>
              <Input
                value={demoForm.title}
                onChange={(e) => setDemoForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Amount (USDC)</Label>
              <Input
                inputMode="decimal"
                value={demoForm.amount}
                onChange={(e) =>
                  setDemoForm((p) => ({ ...p, amount: Number(e.target.value || 0) }))
                }
              />
            </div>
            <div>
              <Label>Recipient (merchant pubkey)</Label>
              <Input
                disabled
                value={demoForm.receiver}
                onChange={(e) => setDemoForm((p) => ({ ...p, recipient: e.target.value }))}
              />
            </div>
            <div className="col-span-2">
              <Label>Reference (unique pubkey)</Label>
              <Input
                disabled
                value={demoForm.reference}
                onChange={(e) => setDemoForm((p) => ({ ...p, reference: e.target.value }))}
              />
            </div>
          </div>

          {/* Saída: URL + copiar */}
          <div className="pt-4 border-t space-y-2">
            <Label>Solana Pay URL</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value={solanaPayURL} className="font-mono text-xs bg-muted" />
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coluna esquerda — textos/CTAs do hero/“pills” podem ficar fora daqui se preferir */}
      {/* Seção "QR-first UX" reaproveitando o mesmo solanaPayURL */}
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <QRCodeBox value={solanaPayURL} className="h-auto max-w-full" />
        </div>
      </div>

      {/* Pills de features */}
      <div className="flex flex-wrap gap-4 pt-4 col-span-2">
        <span className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
          <DollarSign className="h-4 w-4" /> Low fees
        </span>
        <span className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
          <CheckCircle className="h-4 w-4" /> Seedless wallet
        </span>
        <span className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
          <QrCode className="h-4 w-4" /> Solana Pay QR
        </span>
      </div>
    </div>
  );
}
