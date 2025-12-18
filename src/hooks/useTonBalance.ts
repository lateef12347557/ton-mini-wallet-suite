import { useState, useEffect, useCallback } from "react";

const TON_API_ENDPOINT = "https://toncenter.com/api/v2";

interface BalanceData {
  balance: number; // in TON
  balanceNano: string; // in nanoTON
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

interface AddressInfo {
  balance: string;
  state: string;
  last_transaction_id?: {
    lt: string;
    hash: string;
  };
}

export function useTonBalance(address: string | null) {
  const [data, setData] = useState<BalanceData>({
    balance: 0,
    balanceNano: "0",
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchBalance = useCallback(async () => {
    if (!address) {
      setData((prev) => ({ ...prev, balance: 0, balanceNano: "0", isLoading: false }));
      return;
    }

    setData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `${TON_API_ENDPOINT}/getAddressBalance?address=${encodeURIComponent(address)}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.ok && result.result) {
        const balanceNano = result.result;
        const balance = parseInt(balanceNano, 10) / 1e9; // Convert nanoTON to TON

        setData({
          balance,
          balanceNano,
          isLoading: false,
          error: null,
          lastUpdated: Date.now(),
        });
      } else {
        throw new Error(result.error || "Failed to fetch balance");
      }
    } catch (error) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }, [address]);

  // Fetch on mount and when address changes
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Auto-refresh every 30 seconds when address is connected
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [address, fetchBalance]);

  return {
    ...data,
    refetch: fetchBalance,
  };
}

// Fetch detailed address info
export function useTonAddressInfo(address: string | null) {
  const [info, setInfo] = useState<AddressInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInfo = useCallback(async () => {
    if (!address) {
      setInfo(null);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${TON_API_ENDPOINT}/getAddressInformation?address=${encodeURIComponent(address)}`
      );

      if (!response.ok) throw new Error("API error");

      const result = await response.json();

      if (result.ok && result.result) {
        setInfo(result.result);
      }
    } catch (error) {
      console.error("Failed to fetch address info:", error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  return { info, isLoading, refetch: fetchInfo };
}
