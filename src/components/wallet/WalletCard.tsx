import { Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useTonBalance } from "@/hooks/useTonBalance";

interface WalletCardProps {
  demoBalance: number;
  cashbackBalance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  onClaimCashback: () => void;
}

export function WalletCard({
  demoBalance,
  cashbackBalance,
  onDeposit,
  onWithdraw,
  onClaimCashback,
}: WalletCardProps) {
  const { connected, friendlyAddress, connect } = useTonConnect();
  const { balance: liveBalance, isLoading, lastUpdated, refetch, error } = useTonBalance(friendlyAddress);

  const displayBalance = connected ? liveBalance : demoBalance;

  const formatLastUpdated = (timestamp: number | null) => {
    if (!timestamp) return "";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div className="glass-card p-6 md:p-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl ton-gradient">
          <Wallet className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">Mini Wallet</h2>
          <p className="text-sm text-muted-foreground">
            {connected ? "Connected" : "Demo Mode"}
          </p>
        </div>
        {connected && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={refetch}
              disabled={isLoading}
              className="h-8 w-8"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-accent/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-accent font-medium">Live</span>
            </div>
          </div>
        )}
      </div>

      {/* Not Connected Alert */}
      {!connected && (
        <div className="bg-secondary/50 rounded-xl p-4 mb-6 border border-border flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-ton-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">Demo Mode</p>
            <p className="text-xs text-muted-foreground mt-1">
              Connect your TON wallet to see your real balance and interact with the blockchain.
            </p>
            <Button variant="ton" size="sm" onClick={connect} className="mt-3">
              Connect Wallet
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {connected && error && (
        <div className="bg-destructive/10 rounded-xl p-3 mb-4 border border-destructive/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-xs text-destructive">Failed to fetch balance. <button onClick={refetch} className="underline">Retry</button></p>
        </div>
      )}

      {/* Balance Display */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm text-muted-foreground">
            {connected ? "Wallet Balance" : "Demo Balance"}
          </p>
          {connected && lastUpdated && (
            <span className="text-xs text-muted-foreground/60">
              • Updated {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          {isLoading && connected ? (
            <div className="flex items-center gap-3">
              <span className="text-4xl md:text-5xl font-bold text-muted-foreground/50">
                --
              </span>
              <Loader2 className="w-6 h-6 animate-spin text-ton-blue" />
            </div>
          ) : (
            <>
              <span className="text-4xl md:text-5xl font-bold gradient-text">
                {displayBalance.toFixed(2)}
              </span>
              <span className="text-xl text-muted-foreground">TON</span>
            </>
          )}
        </div>
        {connected && friendlyAddress && (
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            {friendlyAddress.slice(0, 8)}...{friendlyAddress.slice(-6)}
          </p>
        )}
      </div>

      {/* Cashback Section */}
      <div className="bg-secondary/50 rounded-xl p-4 mb-6 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Cashback Rewards</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-accent">
              {cashbackBalance.toFixed(4)} TON
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClaimCashback}
              disabled={cashbackBalance <= 0 || !connected}
              className="text-accent hover:text-accent/80 hover:bg-accent/10"
            >
              Claim
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="ton" 
          size="lg" 
          onClick={onDeposit} 
          className="w-full"
          disabled={!connected}
        >
          <ArrowDownToLine className="w-5 h-5" />
          Deposit
        </Button>
        <Button 
          variant="glass" 
          size="lg" 
          onClick={onWithdraw} 
          className="w-full"
          disabled={!connected}
        >
          <ArrowUpFromLine className="w-5 h-5" />
          Withdraw
        </Button>
      </div>
    </div>
  );
}
