'use client';

import { Button } from '@/components/ui/button';
import {
  useWeb3AuthConnect,
  useWeb3Auth,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from '@web3auth/modal/react';

export function SignInButton() {
  const { connect, loading } = useWeb3AuthConnect();   // abre o modal
  const { isConnected, provider } = useWeb3Auth();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();

  const signIn = (evt: any) => {
    evt.preventDefault();

    connect().then((provider) => {
      console.log('Connected', provider);
    }).catch((err) => {
      console.error('Connection error', err);
    });
  }

  if (isConnected) {

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {userInfo?.name ?? 'Connected'}
        </span>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={signIn} disabled={loading}>
      {loading ? 'Connecting…' : 'Sign in'}
    </Button>
  );
}
