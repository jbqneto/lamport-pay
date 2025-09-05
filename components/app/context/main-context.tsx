'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { generateSolanaPayURL } from '@/lib/solana-utils';

type DemoForm = {
  title: string;
  amount: number;
  receiver: string;
  reference?: string;
};

type Ctx = {
  demoForm: DemoForm;
  setDemoForm: React.Dispatch<React.SetStateAction<DemoForm>>;
  solanaPayURL: string;
  updateForm: (field: keyof DemoForm, value: string | number) => void;
};

const HomeContext = createContext<Ctx | null>(null);

export function HomeProvider({
  initial,
  children,
}: {
  initial: DemoForm;
  children: React.ReactNode;
}) {
  const [demoForm, setDemoForm] = useState<DemoForm>(initial);
  const [solanaPayURL, setSolanaPayUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function createLink(label: string, receiver: string, amount: number, reference?: string) {
    setLoading(true); 
    setErr(null);
    try {
      const res = await fetch('/api/solana-pay', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ receiver, amount, label, reference, message: 'Thanks for support. :)' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { url: string, fields: any } = await res.json();
      setSolanaPayUrl(data.url);
    } catch (e: any) {
      console.error("Error generating Solana Pay URL:", e);
      setErr(e.message ?? 'failed');
    } finally {
      setLoading(false);
    }
  }

  const updateForm = (field: keyof DemoForm, value: string | number) =>
    setDemoForm(prev => ({ ...prev, [field]: value } as DemoForm));

  return (
    <HomeContext.Provider value={{ demoForm, setDemoForm, solanaPayURL, updateForm }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error('useDemo must be used inside <DemoProvider/>');
  return ctx;
}
