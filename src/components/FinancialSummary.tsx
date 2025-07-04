import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export const FinancialSummary = ({ transactions }: FinancialSummaryProps) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(thisMonth));
  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const summaryCards = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success-light"
    },
    {
      title: "Total Expenses", 
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "text-expense",
      bgColor: "bg-red-50"
    },
    {
      title: "Net Balance",
      value: formatCurrency(netBalance),
      icon: DollarSign,
      color: netBalance >= 0 ? "text-success" : "text-expense",
      bgColor: netBalance >= 0 ? "bg-success-light" : "bg-red-50"
    },
    {
      title: "This Month",
      value: formatCurrency(thisMonthExpenses),
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-accent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => (
        <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};