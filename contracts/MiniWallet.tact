/*
 * MiniWallet Smart Contract
 * A production-ready TON wallet contract for Telegram MiniApp integration
 * 
 * Features:
 * - Secure owner-only operations
 * - Deposit/Withdraw functionality
 * - Cashback reward system
 * - Transaction statistics tracking
 * - Extensible for e-commerce integration
 */

import "@stdlib/deploy";

// ============================================
// MESSAGE DEFINITIONS
// ============================================

message Deposit {
    amount: Int as coins;
}

message Withdraw {
    amount: Int as coins;
}

message ClaimCashback {}

message UpdateCashbackRate {
    newRate: Int; // Basis points (100 = 1%)
}

// ============================================
// WALLET STATISTICS STRUCT
// ============================================

struct WalletStats {
    totalDeposits: Int;
    totalWithdrawals: Int;
    lastTxTimestamp: Int;
    cashbackRate: Int;
}

// ============================================
// MAIN CONTRACT
// ============================================

contract MiniWallet with Deployable {
    // Contract state
    owner: Address;
    balance: Int as coins;
    totalDeposits: Int as coins;
    totalWithdrawals: Int as coins;
    cashbackBalance: Int as coins;
    lastTxTimestamp: Int;
    cashbackRate: Int; // Basis points (200 = 2%)

    // ========================================
    // INITIALIZATION
    // ========================================
    
    init(owner: Address) {
        self.owner = owner;
        self.balance = 0;
        self.totalDeposits = 0;
        self.totalWithdrawals = 0;
        self.cashbackBalance = 0;
        self.lastTxTimestamp = 0;
        self.cashbackRate = 200; // Default 2% cashback
    }

    // ========================================
    // MESSAGE HANDLERS
    // ========================================

    /*
     * Deposit Handler
     * - Owner-only operation
     * - Updates balance and total deposits
     * - Calculates and adds cashback reward
     */
    receive(msg: Deposit) {
        // Validate sender is owner
        require(sender() == self.owner, "Only owner can deposit");
        
        // Validate amount
        require(msg.amount > 0, "Deposit amount must be positive");
        
        // Calculate cashback (rate is in basis points)
        let cashback: Int = (msg.amount * self.cashbackRate) / 10000;
        
        // Update state
        self.balance = self.balance + msg.amount;
        self.totalDeposits = self.totalDeposits + msg.amount;
        self.cashbackBalance = self.cashbackBalance + cashback;
        self.lastTxTimestamp = now();
        
        // Reply to confirm transaction
        self.reply("Deposit successful".asComment());
    }

    /*
     * Withdraw Handler
     * - Owner-only operation
     * - Enforces sufficient balance
     * - Updates withdrawal statistics
     */
    receive(msg: Withdraw) {
        // Validate sender is owner
        require(sender() == self.owner, "Only owner can withdraw");
        
        // Validate amount
        require(msg.amount > 0, "Withdrawal amount must be positive");
        require(self.balance >= msg.amount, "Insufficient balance");
        
        // Update state
        self.balance = self.balance - msg.amount;
        self.totalWithdrawals = self.totalWithdrawals + msg.amount;
        self.lastTxTimestamp = now();
        
        // Send TON to owner
        send(SendParameters{
            to: self.owner,
            value: msg.amount,
            mode: SendIgnoreErrors,
            body: "Withdrawal successful".asComment()
        });
    }

    /*
     * Claim Cashback Handler
     * - Owner-only operation
     * - Moves accumulated cashback to main balance
     */
    receive(msg: ClaimCashback) {
        // Validate sender is owner
        require(sender() == self.owner, "Only owner can claim cashback");
        require(self.cashbackBalance > 0, "No cashback to claim");
        
        // Move cashback to balance
        let claimed: Int = self.cashbackBalance;
        self.balance = self.balance + claimed;
        self.cashbackBalance = 0;
        self.lastTxTimestamp = now();
        
        // Reply to confirm
        self.reply("Cashback claimed successfully".asComment());
    }

    /*
     * Update Cashback Rate (Admin)
     * - Owner-only operation
     * - Rate in basis points (100 = 1%, max 1000 = 10%)
     */
    receive(msg: UpdateCashbackRate) {
        // Validate sender is owner
        require(sender() == self.owner, "Only owner can update rate");
        
        // Validate rate bounds
        require(msg.newRate >= 0, "Rate cannot be negative");
        require(msg.newRate <= 1000, "Rate cannot exceed 10%");
        
        self.cashbackRate = msg.newRate;
        
        self.reply("Cashback rate updated".asComment());
    }

    // ========================================
    // GETTER FUNCTIONS (READ-ONLY)
    // ========================================

    /*
     * Get current wallet balance
     */
    get fun getBalance(): Int {
        return self.balance;
    }

    /*
     * Get accumulated cashback balance
     */
    get fun getCashbackBalance(): Int {
        return self.cashbackBalance;
    }

    /*
     * Get wallet statistics
     */
    get fun getStats(): WalletStats {
        return WalletStats{
            totalDeposits: self.totalDeposits,
            totalWithdrawals: self.totalWithdrawals,
            lastTxTimestamp: self.lastTxTimestamp,
            cashbackRate: self.cashbackRate
        };
    }

    /*
     * Get owner address
     */
    get fun getOwner(): Address {
        return self.owner;
    }

    /*
     * Get current cashback rate
     */
    get fun getCashbackRate(): Int {
        return self.cashbackRate;
    }
}
