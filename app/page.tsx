'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSolanaPayURL, generateReference, generateMerchantKey } from '@/lib/solana-pay';
import QRCode from 'react-qr-code';
import { Zap, Shield, QrCode, ArrowRight, Copy, CheckCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [demoForm, setDemoForm] = useState({
    title: 'Web Development Services',
    amount: 150,
    recipient: generateMerchantKey(),
    reference: generateReference()
  });

  const [copied, setCopied] = useState(false);

  const solanaPayURL = generateSolanaPayURL({
    recipient: demoForm.recipient,
    amount: demoForm.amount,
    label: demoForm.title,
    reference: demoForm.reference
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateForm = (field: string, value: string | number) => {
    setDemoForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container py-16">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-foreground">
                Seedless USDC invoices on Solana
              </h1>
              <p className="text-xl text-gray-600 dark:text-muted-foreground leading-relaxed">
                Generate invoices seamlessly and receive USDC payments directly in your wallet—no seed phrase required
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="btn-primary text-base px-8 py-3">
                  Create Invoice
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="btn-secondary text-base px-8 py-3"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Try interactive demo
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                Low fees
              </div>
              <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Seedless wallet
              </div>
              <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <QrCode className="h-4 w-4" />
                Solana Pay QR
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Demo */}
          <div className="demo-card" id="demo">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Interactive demo</h3>
              <p className="text-sm text-muted-foreground">
                This is a Transfer Request example (USDC SPL token + reference for reconciliation)
              </p>
            </div>

            <div className="space-y-4">
              {/* Form Inputs */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium mb-2 block">Title</Label>
                  <Input 
                    id="title"
                    value={demoForm.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className="input-field"
                    placeholder="Invoice title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium mb-2 block">Amount (USDC)</Label>
                  <Input 
                    id="amount"
                    type="number" 
                    step="0.01"
                    value={demoForm.amount}
                    onChange={(e) => updateForm('amount', parseFloat(e.target.value) || 0)}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="reference" className="text-sm font-medium mb-2 block">Reference</Label>
                  <Input 
                    id="reference"
                    value={demoForm.reference}
                    onChange={(e) => updateForm('reference', e.target.value)}
                    className="input-field font-mono text-xs"
                    placeholder="pubkey"
                  />
                </div>
              </div>

              {/* Output */}
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Solana Pay URL</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={solanaPayURL}
                      readOnly
                      className="input-field font-mono text-xs bg-muted"
                    />
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(solanaPayURL)}
                      className="btn-secondary px-3"
                    >
                      {copied ? 'Copied!' : 'Copy link'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR-first UX Section */}
        <div className="mb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">QR-first UX</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Generate invoices with QR codes for a streamlined, user-friendly payment experience
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <QRCode 
                  value={solanaPayURL} 
                  size={160}
                  className="h-auto max-w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="feature-card">
            <div className="icon-circle icon-circle-primary mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fast settlement</h3>
            <p className="text-muted-foreground">
              Receive USDC payments in seconds with Solana's high-performance network
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-circle icon-circle-accent mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure by design</h3>
            <p className="text-muted-foreground">
              Leverages Solana for robust security and encrypted transaction handling.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="icon-circle icon-circle-primary mx-auto mb-4">
                
              </div>
              <h3 className="text-lg font-semibold mb-2">Sign up</h3>
              <p className="text-muted-foreground text-sm">Create your account easily</p>
            </div>
            <div className="text-center">
              <div className="icon-circle icon-circle-primary mx-auto mb-4">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create invoice</h3>
              <p className="text-muted-foreground text-sm">Fill out the invoice details</p>
            </div>
            <div className="text-center">
              <div className="icon-circle icon-circle-accent mx-auto mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get paid</h3>
              <p className="text-muted-foreground text-sm">Receive USDC payments</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card text-center">
              <div className="icon-circle icon-circle-primary mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Seedless onboarding</h3>
              <p className="text-muted-foreground text-sm">Authenticate without life hask phrases</p>
            </div>
            <div className="feature-card text-center">
              <div className="icon-circle icon-circle-primary mx-auto mb-4">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Invoice Via QR/link</h3>
              <p className="text-muted-foreground text-sm">Generate QR codes or payment lnks for Invoices</p>
            </div>
            <div className="feature-card text-center">
              <div className="icon-circle icon-circle-accent mx-auto mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email invoices</h3>
              <p className="text-muted-foreground text-sm">Send invoices Directly to your customers' meaox</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground border-t pt-8">
          <p>&copy; 2024 LamportPay</p>
        </footer>
      </div>
    </div>
  );
}