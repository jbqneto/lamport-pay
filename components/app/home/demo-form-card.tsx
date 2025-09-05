'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from './copy-button';
import { useHome } from '../context/main-context';

import MainQrCode from '@/components/app/home/main-qrcode';
import { Button } from '@/components/ui/button';
import { createTmpInvoice } from '@/app/actions';

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
      <form action={createTmpInvoice}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">Title</Label>
            <Input name='title' id="title" defaultValue={demoForm.title} />
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">Amount (USDC)</Label>
            <Input id="amount" name='amount' type="number" step="0.01" defaultValue={demoForm.amount}
              className="input-field" />
          </div>

          <div>
            <Label htmlFor="reference" className="text-sm font-medium mb-2 block">Receiver</Label>
            <Input id="reference" name='receiver' defaultValue={demoForm.receiver} className="input-field font-mono text-xs" />
          </div>

        </div>

         <Button type="submit" className="w-full mt-10">Generate demo invoice</Button>

        </form>
      </CardContent>
    </Card>
  );
}
