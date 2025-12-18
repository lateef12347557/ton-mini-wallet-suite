import { ArrowDownToLine, ArrowUpFromLine, Clock, Percent } from "lucide-react";

interface StatsPanelProps {
  totalDeposits: number;
  totalWithdrawals: number;
  lastTxTimestamp: number;
  cashbackRate: number;
}

export function StatsPanel({
  totalDeposits,
  totalWithdrawals,
  lastTxTimestamp,
  cashbackRate,
}: StatsPanelProps) {
  const formatTimestamp = (ts: number) => {
    if (ts === 0) return "No transactions";
    return new Date(ts * 1000).toLocaleString();
  };

  const stats = [
    {
      label: "Total Deposits",
      value: `${totalDeposits.toFixed(2)} TON`,
      icon: ArrowDownToLine,
      color: "text-ton-blue",
    },
    {
      label: "Total Withdrawals",
      value: `${totalWithdrawals.toFixed(2)} TON`,
      icon: ArrowUpFromLine,
      color: "text-accent",
    },
    {
      label: "Cashback Rate",
      value: `${(cashbackRate / 100).toFixed(1)}%`,
      icon: Percent,
      color: "text-ton-cyan",
    },
    {
      label: "Last Transaction",
      value: formatTimestamp(lastTxTimestamp),
      icon: Clock,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-lg font-semibold text-foreground mb-6">Wallet Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-secondary/30 rounded-xl p-4 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
