import { useState } from "react";
import { WalletCard } from "@/components/wallet/WalletCard";
import { StatsPanel } from "@/components/wallet/StatsPanel";
import { ContractCode } from "@/components/wallet/ContractCode";
import { ArchitectureDocs } from "@/components/wallet/ArchitectureDocs";
import { TransactionModal } from "@/components/wallet/TransactionModal";
import { toast } from "sonner";
import { Hexagon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Simulated wallet state
  const [balance, setBalance] = useState(12.5);
  const [cashbackBalance, setCashbackBalance] = useState(0.25);
  const [totalDeposits, setTotalDeposits] = useState(50.0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(37.5);
  const [lastTxTimestamp, setLastTxTimestamp] = useState(
    Math.floor(Date.now() / 1000) - 3600
  );
  const [cashbackRate] = useState(200);

  // Modal state
  const [modalType, setModalType] = useState<"deposit" | "withdraw" | null>(null);

  const handleDeposit = (amount: number) => {
    const cashback = (amount * cashbackRate) / 10000;
    setBalance((prev) => prev + amount);
    setTotalDeposits((prev) => prev + amount);
    setCashbackBalance((prev) => prev + cashback);
    setLastTxTimestamp(Math.floor(Date.now() / 1000));
    toast.success(`Deposited ${amount} TON`, {
      description: `+${cashback.toFixed(4)} TON cashback earned`,
    });
  };

  const handleWithdraw = (amount: number) => {
    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setBalance((prev) => prev - amount);
    setTotalWithdrawals((prev) => prev + amount);
    setLastTxTimestamp(Math.floor(Date.now() / 1000));
    toast.success(`Withdrawn ${amount} TON`);
  };

  const handleClaimCashback = () => {
    if (cashbackBalance <= 0) {
      toast.error("No cashback to claim");
      return;
    }
    setBalance((prev) => prev + cashbackBalance);
    setCashbackBalance(0);
    setLastTxTimestamp(Math.floor(Date.now() / 1000));
    toast.success(`Claimed ${cashbackBalance.toFixed(4)} TON cashback`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-ton-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ton-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl ton-gradient glow-effect">
              <Hexagon className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">TON MiniWallet</h1>
              <p className="text-sm text-muted-foreground">
                Production-Ready Smart Contract
              </p>
            </div>
          </div>
          <Button variant="glass" size="sm" asChild>
            <a
              href="https://docs.ton.org/develop/smart-contracts/tact-language"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              Tact Docs
            </a>
          </Button>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <WalletCard
              balance={balance}
              cashbackBalance={cashbackBalance}
              onDeposit={() => setModalType("deposit")}
              onWithdraw={() => setModalType("withdraw")}
              onClaimCashback={handleClaimCashback}
            />
            <StatsPanel
              totalDeposits={totalDeposits}
              totalWithdrawals={totalWithdrawals}
              lastTxTimestamp={lastTxTimestamp}
              cashbackRate={cashbackRate}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ContractCode />
            <ArchitectureDocs />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
          <p>
            Built for Telegram MiniApp integration • Tact Smart Contract •{" "}
            <span className="text-ton-blue">TON Blockchain</span>
          </p>
        </footer>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || "deposit"}
        onConfirm={modalType === "deposit" ? handleDeposit : handleWithdraw}
        maxAmount={modalType === "withdraw" ? balance : undefined}
      />
    </div>
  );
};

export default Index;
