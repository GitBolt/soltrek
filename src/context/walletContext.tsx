
import React, { FC, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  GlowWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Cluster, clusterApiUrl } from '@solana/web3.js';
import { useNetworkContext } from './configContext';


type Props = {
  children?: React.ReactNode;
};

export const Wallet: FC<Props> = ({ children }: Props) => {
  const { selectedNetwork: network } = useNetworkContext()

  const endpoint = useMemo(() => clusterApiUrl(network as Cluster), [network]);

  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: network as WalletAdapterNetwork }),
      new GlowWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network: network as WalletAdapterNetwork }),
      new SlopeWalletAdapter(),
      new SolletExtensionWalletAdapter({ network: network as WalletAdapterNetwork }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};