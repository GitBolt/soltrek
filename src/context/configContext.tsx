import { createContext, useState, useContext } from 'react';
import { ReactNode } from 'react';

interface NetworkContextValue {
  selectedNetwork: string | null;
  updateNetwork: (network: string) => void;
}

const NetworkContext = createContext<NetworkContextValue>({
  selectedNetwork: null,
  updateNetwork: () => { },
});

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>(process.env.NEXT_PUBLIC_DEFAULT_RPC || "");


  const updateNetwork = (network: string) => {
    setSelectedNetwork(network);
  };

  return (
    <NetworkContext.Provider
      value={{
        selectedNetwork,
        updateNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetworkContext = () => {
  return useContext(NetworkContext);
};
