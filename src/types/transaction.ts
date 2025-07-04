export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
}