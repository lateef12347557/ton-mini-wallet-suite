import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ReactNode } from "react";

// TON Connect manifest for the MiniWallet dApp
const manifestUrl = "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

interface TonConnectProviderProps {
  children: ReactNode;
}

export function TonConnectProvider({ children }: TonConnectProviderProps) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
