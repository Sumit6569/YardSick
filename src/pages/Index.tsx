import { useState, useEffect } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { FinancialSummary } from "@/components/FinancialSummary";
import { Transaction } from "@/types/transaction";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance-transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    toast({
      title: "Transaction added",
      description: `${transactionData.type === 'income' ? 'Income' : 'Expense'} of $${transactionData.amount} has been recorded.`,
    });
  };

  const handleEditTransaction = (updatedData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTransaction) return;

    const updatedTransaction: Transaction = {
      ...editingTransaction,
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    setTransactions(prev => 
      prev.map(t => t.id === editingTransaction.id ? updatedTransaction : t)
    );

    setEditingTransaction(null);
    
    toast({
      title: "Transaction updated",
      description: "Your transaction has been successfully updated.",
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed.",
      variant: "destructive"
    });
  };

  const startEditingTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const cancelEditing = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Personal Finance Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Take control of your finances with smart tracking and insights
          </p>
        </div>

        {/* Financial Summary Cards */}
        <div className="mb-8">
          <FinancialSummary transactions={transactions} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form and Chart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Transaction Form */}
            <TransactionForm
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              transaction={editingTransaction || undefined}
              onCancel={editingTransaction ? cancelEditing : undefined}
              isEditing={!!editingTransaction}
            />

            {/* Monthly Expenses Chart */}
            <MonthlyExpensesChart transactions={transactions} />
          </div>

          {/* Right Column - Transaction List */}
          <div className="lg:col-span-1">
            <TransactionList
              transactions={transactions}
              onEdit={startEditingTransaction}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-muted-foreground">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
