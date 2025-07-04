import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, MonthlyExpense } from "@/types/transaction";
import { TrendingDown } from "lucide-react";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export const MonthlyExpensesChart = ({ transactions }: MonthlyExpensesChartProps) => {
  const getMonthlyExpenses = (): MonthlyExpense[] => {
    const monthlyData: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + transaction.amount;
      });

    // Get last 6 months
    const months: MonthlyExpense[] = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      months.push({
        month: monthKey,
        amount: monthlyData[monthKey] || 0
      });
    }
    
    return months;
  };

  const monthlyExpenses = getMonthlyExpenses();
  const totalExpenses = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
  const averageExpenses = totalExpenses / monthlyExpenses.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium">{label}</p>
          <p className="text-expense font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Monthly Expenses
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Average: {formatCurrency(averageExpenses)} per month
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyExpenses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};