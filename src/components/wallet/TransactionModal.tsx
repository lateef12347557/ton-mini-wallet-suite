import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownToLine, ArrowUpFromLine, Loader2 } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "withdraw";
  onConfirm: (amount: number) => void;
  maxAmount?: number;
  isLoading?: boolean;
}

export function TransactionModal({
  isOpen,
  onClose,
  type,
  onConfirm,
  maxAmount,
  isLoading,
}: TransactionModalProps) {
  const [amount, setAmount] = useState("");

  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      onConfirm(value);
      setAmount("");
      onClose();
    }
  };

  const isDeposit = type === "deposit";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {isDeposit ? (
              <>
                <ArrowDownToLine className="w-5 h-5 text-ton-blue" />
                Deposit TON
              </>
            ) : (
              <>
                <ArrowUpFromLine className="w-5 h-5 text-accent" />
                Withdraw TON
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Amount (TON)
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-secondary border-border text-foreground text-lg font-mono"
              step="0.01"
              min="0"
              max={maxAmount}
              disabled={isLoading}
            />
            {maxAmount !== undefined && !isDeposit && (
              <p className="text-xs text-muted-foreground mt-1">
                Available: {maxAmount.toFixed(2)} TON
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {[0.1, 0.5, 1, 5].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset.toString())}
                className="flex-1"
                disabled={isLoading}
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={isDeposit ? "ton" : "default"}
            onClick={handleConfirm}
            className="flex-1"
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming...
              </>
            ) : (
              `Confirm ${isDeposit ? "Deposit" : "Withdrawal"}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
