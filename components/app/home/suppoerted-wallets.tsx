import { cn } from '@/lib/utils';

const wallets = ['Phantom', 'Solflare', 'Glow', 'Decaf', 'Espresso Cash', 'and more...'];

export function SupportedWallets({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 text-xs', className)}>
      <span className="text-muted-foreground">Works with:</span>
      {wallets.map((w) => (
        <span
          key={w}
          className="inline-flex items-center rounded-full border bg-background px-2.5 py-1 text-foreground/80"
        >
          {w}
        </span>
      ))}
    </div>
  );
}
