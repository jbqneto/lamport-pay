'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockInvoices, mockWalletData, Invoice } from '@/lib/mock-data';
import { generateMockReference, generateSolanaPayURL } from '@/lib/solana-pay';
import { Copy, QrCode, Eye, Plus, CheckCircle, DollarSign, Coins, User, FileText, Settings, Search } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [expandedQR, setExpandedQR] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [newInvoice, setNewInvoice] = useState({ title: '', amount: '' });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const createInvoice = () => {
    if (!newInvoice.title || !newInvoice.amount) return;

    const invoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      title: newInvoice.title,
      amount: parseFloat(newInvoice.amount),
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
      reference: generateMockReference()
    };

    setInvoices([invoice, ...invoices]);
    setNewInvoice({ title: '', amount: '' });
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="badge-pending">PENDING</Badge>;
      case 'PAID':
        return <Badge className="badge-paid">PAID</Badge>;
      case 'CANCELED':
        return <Badge className="badge-canceled">CANCELED</Badge>;
      case 'EXPIRED':
        return <Badge className="badge-expired">EXPIRED</Badge>;
      default:
        return <Badge>UNKNOWN</Badge>;
    }
  };

  const getSolanaPayURL = (invoice: Invoice) => {
    return generateMockReference();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-card border-r border-border p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 text-primary">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span className="font-medium">Dashboard</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>Invoices</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <User className="w-4 h-4" />
                <span>Customers</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Header */}
          <div className="bg-white dark:bg-card border-b border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Invoices</span>
                  <span className="text-sm text-muted-foreground">Customers</span>
                  <span className="text-sm text-muted-foreground">Settings</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search" 
                    className="pl-10 w-64 input-field"
                  />
                </div>
                <Button variant="outline" size="icon" className="btn-secondary">
                  <Settings className="h-4 w-4" />
                </Button>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Wallet Balance Section */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Wallet balance</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-card rounded-2xl p-6 border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{mockWalletData.solBalance}</div>
                        <div className="text-sm text-muted-foreground">SOL</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-card rounded-2xl p-6 border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        $
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{mockWalletData.usdcBalance}</div>
                        <div className="text-sm text-muted-foreground">USDC</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Quick actions</h3>
                  
                  {/* Quick Create Form */}
                  <div className="bg-white dark:bg-card rounded-2xl p-6 border mb-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Input
                        placeholder="Invoice title"
                        value={newInvoice.title}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, title: e.target.value }))}
                        className="input-field"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Amount (USDC)"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                        className="input-field"
                      />
                      <Button 
                        onClick={createInvoice}
                        disabled={!newInvoice.title || !newInvoice.amount}
                        className="btn-primary"
                      >
                        Create
                      </Button>
                    </div>
                  </div>

                  {/* Invoices Table */}
                  <div className="bg-white dark:bg-card rounded-2xl border overflow-hidden">
                    <div className="p-6 border-b">
                      <h3 className="font-semibold">Recent invoices</h3>
                    </div>
                    
                    {invoices.length === 0 ? (
                      <div className="text-center py-12">
                        <QrCode className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Create your first invoice</h3>
                        <p className="text-muted-foreground">Get started by creating a new payment request above.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">Amount (USDC)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created at</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.slice(0, 5).map((invoice) => (
                            <TableRow key={invoice.id}>
                              <TableCell className="font-mono text-sm">{invoice.id.replace('INV-', '')}</TableCell>
                              <TableCell className={invoice.status === 'CANCELED' ? 'line-through text-muted-foreground' : ''}>
                                {invoice.title}
                              </TableCell>
                              <TableCell className="text-right font-mono">${invoice.amount}</TableCell>
                              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                              <TableCell className="text-muted-foreground">{invoice.createdAt}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="ghost" className="btn-ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => copyToClipboard(getSolanaPayURL(invoice), invoice.id)}
                                    className="btn-ghost"
                                  >
                                    {copied === invoice.id ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Invoice Details */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-card rounded-2xl p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Invoice details</h3>
                    <Button variant="ghost" size="icon" className="btn-ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border flex justify-center">
                      <QRCode 
                        value={getSolanaPayURL(invoices[0] || { 
                          id: 'demo', 
                          title: 'Demo Invoice', 
                          amount: 100, 
                          status: 'PENDING', 
                          createdAt: '2024-01-01',
                          reference: 'demo-ref'
                        })} 
                        size={120}
                        className="h-auto max-w-full"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span>Polling...</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Status. Waiting for payment.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-card rounded-2xl p-6 border">
                  <h3 className="font-semibold mb-4">Recent activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">+$6.24 USDC</div>
                        <div className="text-xs text-muted-foreground">CONFIRMED</div>
                      </div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">+$12.12 USDC</div>
                        <div className="text-xs text-muted-foreground">CONFIRMED</div>
                      </div>
                      <div className="text-xs text-muted-foreground">18 hours ago</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">+$6.22 USDC</div>
                        <div className="text-xs text-muted-foreground">CONFIRMED</div>
                      </div>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">+$26.40 USDC</div>
                        <div className="text-xs text-muted-foreground">CONFIRMED</div>
                      </div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}