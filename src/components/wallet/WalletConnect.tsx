import { useTonConnect } from "@/hooks/useTonConnect";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function WalletConnect() {
  const { connected, friendlyAddress, walletName, connect, disconnect } = useTonConnect();
  const [copied, setCopied] = useState(false);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (friendlyAddress) {
      await navigator.clipboard.writeText(friendlyAddress);
      setCopied(true);
      toast.success("Address copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!connected) {
    return (
      <Button variant="ton" onClick={connect} className="gap-2">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="glass-card px-4 py-2 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <div className="text-sm">
          <p className="text-muted-foreground text-xs">{walletName}</p>
          <p className="font-mono text-foreground">
            {friendlyAddress && truncateAddress(friendlyAddress)}
          </p>
        </div>
        <button
          onClick={copyAddress}
          className="p-1.5 hover:bg-secondary rounded-md transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-accent" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
      <Button variant="ghost" size="icon" onClick={disconnect}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}
