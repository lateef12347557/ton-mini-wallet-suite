import { Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletCardProps {
  balance: number;
  cashbackBalance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  onClaimCashback: () => void;
}

export function WalletCard({
  balance,
  cashbackBalance,
  onDeposit,
  onWithdraw,
  onClaimCashback,
}: WalletCardProps) {
  return (
    <div className="glass-card p-6 md:p-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl ton-gradient">
          <Wallet className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Mini Wallet</h2>
          <p className="text-sm text-muted-foreground">TON Balance</p>
        </div>
      </div>

      {/* Balance Display */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-bold gradient-text">
            {balance.toFixed(2)}
          </span>
          <span className="text-xl text-muted-foreground">TON</span>
        </div>
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
              disabled={cashbackBalance <= 0}
              className="text-accent hover:text-accent/80 hover:bg-accent/10"
            >
              Claim
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="ton" size="lg" onClick={onDeposit} className="w-full">
          <ArrowDownToLine className="w-5 h-5" />
          Deposit
        </Button>
        <Button variant="glass" size="lg" onClick={onWithdraw} className="w-full">
          <ArrowUpFromLine className="w-5 h-5" />
          Withdraw
        </Button>
      </div>
    </div>
  );
}
