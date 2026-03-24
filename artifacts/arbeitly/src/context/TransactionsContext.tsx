import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type TransactionStatus = "paid" | "pending" | "refunded" | "cancelled";
export type PaymentMethod = "stripe" | "manual";

export type Transaction = {
  id: string;
  candidateId: string;
  candidateName: string;
  planId: string;
  planName: string;
  amount: string;
  date: string;
  method: PaymentMethod;
  status: TransactionStatus;
  notes?: string;
};

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
};

const TransactionsContext = createContext<TransactionsContextType | null>(null);
const STORAGE_KEY = "arbeitly_transactions";

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    candidateId: "seed_cust_001",
    candidateName: "Sarah Müller",
    planId: "basic",
    planName: "Basic",
    amount: "€299.00",
    date: "2026-01-15T10:00:00Z",
    method: "stripe",
    status: "paid",
  },
  {
    id: "txn_002",
    candidateId: "seed_cust_002",
    candidateName: "Ahmed Hassan",
    planId: "standard",
    planName: "Standard",
    amount: "€399.00",
    date: "2026-01-20T14:30:00Z",
    method: "stripe",
    status: "paid",
  },
  {
    id: "txn_003",
    candidateId: "seed_cust_003",
    candidateName: "Priya Sharma",
    planId: "basic",
    planName: "Basic",
    amount: "€299.00",
    date: "2026-02-01T09:15:00Z",
    method: "manual",
    status: "paid",
    notes: "Bank transfer confirmed",
  },
];

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return SEED_TRANSACTIONS;
    } catch {
      return SEED_TRANSACTIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, "id">): Transaction => {
    const newT: Transaction = { ...t, id: `txn_${Date.now()}` };
    setTransactions((prev) => [newT, ...prev]);
    return newT;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
}
