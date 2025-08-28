'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from './copy-button';
import { useHome } from '../context/main-context';

import MainQrCode from '@/components/app/home/main-qrcode';

export default function DemoFormCard() {
  const { demoForm, updateForm, solanaPayURL } = useHome();

  return (
    <Card className="demo-card">
      <CardHeader>
        <CardTitle>Interactive demo</CardTitle>
        <CardDescription>
          This is a Transfer Request example (USDC SPL token + reference for reconciliation)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">Title</Label>
            <Input id="title" value={demoForm.title}
              onChange={(e) => updateForm('title', e.target.value)} className="input-field" />
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">Amount (USDC)</Label>
            <Input id="amount" type="number" step="0.01" value={demoForm.amount}
              onChange={(e) => updateForm('amount', parseFloat(e.target.value) || 0)}
              className="input-field" />
          </div>

          <div>
            <Label htmlFor="reference" className="text-sm font-medium mb-2 block">Receiver</Label>
            <Input id="reference"
              value={demoForm.receiver}
              onChange={(e) => updateForm('receiver', e.target.value)} 
              className="input-field font-mono text-xs" />
          </div>

          <div>
            <Label htmlFor="reference" className="text-sm font-medium mb-2 block">Reference</Label>
            <Input id="reference" disabled
              value={demoForm.reference ?? ''} 
              className="input-field font-mono text-xs" />
          </div>
        </div>

          <aside className="flex flex-col items-center gap-2">
            <div className="rounded-xl border bg-white p-3 shadow-sm">
              <MainQrCode className="h-[200px] w-[200px]" />
            </div>
            <p className="text-xs text-muted-foreground">Scan to pay</p>
            <CopyButton text={solanaPayURL} size="sm" variant="outline" className="btn-secondary px-3">
                Copy link
            </CopyButton>
        </aside>
      </CardContent>
    </Card>
  );
}
