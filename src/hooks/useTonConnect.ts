import { useTonConnectUI, useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import { useCallback } from "react";

export interface WalletState {
  connected: boolean;
  address: string | null;
  friendlyAddress: string | null;
  walletName: string | null;
}

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const address = useTonAddress();
  const friendlyAddress = useTonAddress(true);

  const connect = useCallback(() => {
    tonConnectUI.openModal();
  }, [tonConnectUI]);

  const disconnect = useCallback(() => {
    tonConnectUI.disconnect();
  }, [tonConnectUI]);

  const sendTransaction = useCallback(
    async (to: string, amount: string, payload?: string) => {
      const validUntil = Math.floor(Date.now() / 1000) + 600; // 10 minutes

      return tonConnectUI.sendTransaction({
        validUntil,
        messages: [
          {
            address: to,
            amount,
            payload,
          },
        ],
      });
    },
    [tonConnectUI]
  );

  const walletState: WalletState = {
    connected: !!wallet,
    address: address || null,
    friendlyAddress: friendlyAddress || null,
    walletName: wallet?.device?.appName || null,
  };

  return {
    ...walletState,
    connect,
    disconnect,
    sendTransaction,
    tonConnectUI,
    wallet,
  };
}
