'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// MDN: navigator.clipboard.writeText retorna uma Promise. :contentReference[oaicite:1]{index=1}
export function CopyButton({
  text,
  children = 'Copy',
  ...btnProps
}: { text: string; children?: React.ReactNode } & React.ComponentProps<typeof Button>) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <Button {...btnProps} onClick={copy}>
      {copied ? 'Copied!' : children}
    </Button>
  );
}
