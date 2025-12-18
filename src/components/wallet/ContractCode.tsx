import { useState } from "react";
import { Code2, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const contractCode = `contract MiniWallet with Deployable {
    owner: Address;
    balance: Int as coins;
    totalDeposits: Int as coins;
    totalWithdrawals: Int as coins;
    cashbackBalance: Int as coins;
    lastTxTimestamp: Int;
    cashbackRate: Int;

    init(owner: Address) {
        self.owner = owner;
        self.balance = 0;
        self.totalDeposits = 0;
        self.totalWithdrawals = 0;
        self.cashbackBalance = 0;
        self.lastTxTimestamp = 0;
        self.cashbackRate = 200; // 2%
    }

    receive(msg: Deposit) {
        require(sender() == self.owner, "Only owner");
        let cashback = (msg.amount * self.cashbackRate) / 10000;
        self.balance += msg.amount;
        self.cashbackBalance += cashback;
    }

    receive(msg: Withdraw) {
        require(sender() == self.owner, "Only owner");
        require(self.balance >= msg.amount, "Insufficient");
        self.balance -= msg.amount;
        send(SendParameters{
            to: self.owner,
            value: msg.amount,
            mode: SendIgnoreErrors
        });
    }

    get fun getBalance(): Int { return self.balance; }
    get fun getCashbackBalance(): Int { return self.cashbackBalance; }
}`;

export function ContractCode() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contractCode);
    setCopied(true);
    toast.success("Contract code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-ton-blue" />
          <h3 className="text-lg font-semibold text-foreground">Contract Code</h3>
          <span className="px-2 py-0.5 text-xs font-mono bg-secondary rounded text-muted-foreground">
            Tact
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="w-4 h-4 text-accent" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[600px]" : "max-h-[200px]"
        }`}
      >
        <pre className="bg-background/50 rounded-lg p-4 overflow-x-auto text-sm">
          <code className="text-foreground font-mono whitespace-pre">
            {contractCode}
          </code>
        </pre>
      </div>

      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      )}
    </div>
  );
}
