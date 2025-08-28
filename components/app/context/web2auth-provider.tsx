// components/providers/web3auth-provider.tsx
'use client';

import { Web3AuthProvider, type Web3AuthContextConfig } from '@web3auth/modal/react';
import { WEB3AUTH_NETWORK } from '@web3auth/modal';

type Props = { children: React.ReactNode };

const web3AuthConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    uiConfig: {
      logoDark: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
      logoLight: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
    },
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  },
};

export function W3AProvider({ children }: Props) {
  return <Web3AuthProvider config={web3AuthConfig}>{children}</Web3AuthProvider>;
}
