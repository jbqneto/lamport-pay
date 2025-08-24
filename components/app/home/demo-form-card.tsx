'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from './copy-button';
import { useHome } from '../context/main-context';

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
            <Label htmlFor="reference" className="text-sm font-medium mb-2 block">Reference</Label>
            <Input id="reference" value={demoForm.reference}
              onChange={(e) => updateForm('reference', e.target.value)}
              className="input-field font-mono text-xs" />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <Label className="text-sm font-medium mb-2 block">Solana Pay URL</Label>
          <div className="flex items-center gap-2">
            <Input readOnly value={solanaPayURL} className="input-field font-mono text-xs bg-muted" />
            <CopyButton text={solanaPayURL} size="sm" variant="outline" className="btn-secondary px-3">
              Copy link
            </CopyButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
