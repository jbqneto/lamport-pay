// components/providers/web3auth-provider.tsx
'use client';

import { Web3AuthProvider, type Web3AuthContextConfig } from '@web3auth/modal/react';
import { WALLET_CONNECTORS, WEB3AUTH_NETWORK } from '@web3auth/modal';

type Props = { children: React.ReactNode };

const env = process.env.NEXT_PUBLIC_ENV || 'prod';

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    uiConfig: {
      logoDark: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
      logoLight: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
    },
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
    web3AuthNetwork: env === 'dev' ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    modalConfig: { 
      hideWalletDiscovery: true,
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: 'auth',
          showOnModal: true,
          loginMethods: {
            email_passwordless: {showOnModal: true},
            google: {showOnModal: true},
            facebook: {showOnModal: true},
            twitter: {showOnModal: true},
            discord: {showOnModal: true},
            github: {showOnModal: true},
          }
        }
      }
    }
  },
};

export default web3AuthContextConfig

export function W3AProvider({ children }: Props) {
  return <Web3AuthProvider config={web3AuthContextConfig}>{children}</Web3AuthProvider>;
}
