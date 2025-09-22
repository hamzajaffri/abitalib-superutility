import { useState, useEffect } from "react";
import { Plus, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  subcategory: string;
  description: string;
  date: string;
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "ZAR", symbol: "R", name: "South African Rand" }
];

const categories = {
  "Food & Dining": ["Restaurants", "Groceries", "Fast Food", "Coffee"],
  "Transportation": ["Fuel", "Public Transport", "Taxi/Uber", "Parking"],
  "Entertainment": ["Movies", "Gaming", "Sports", "Hobbies"],
  "Shopping": ["Clothing", "Electronics", "Books", "Health & Beauty"],
  "Bills & Utilities": ["Electricity", "Internet", "Phone", "Water"],
  "Health & Fitness": ["Gym", "Medical", "Pharmacy", "Sports Equipment"]
};

const COLORS = ['hsl(267, 100%, 65%)', 'hsl(199, 89%, 48%)', 'hsl(142, 71%, 45%)', 'hsl(43, 96%, 56%)', 'hsl(0, 84%, 60%)', 'hsl(267, 50%, 55%)'];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    currency: "USD",
    category: "",
    subcategory: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [monthlyBudget, setMonthlyBudget] = useState(2000);

  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (newExpense.amount && newExpense.category && newExpense.description) {
      const expense: Expense = {
        id: Date.now().toString(),
        amount: parseFloat(newExpense.amount),
        currency: newExpense.currency,
        category: newExpense.category,
        subcategory: newExpense.subcategory || newExpense.category,
        description: newExpense.description,
        date: newExpense.date
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({
        amount: "",
        currency: "USD",
        category: "",
        subcategory: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalMonthly = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetProgress = (totalMonthly / monthlyBudget) * 100;

  // Chart data
  const categoryData = Object.entries(
    expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i).toLocaleString('default', { month: 'short' });
    const monthTotal = expenses
      .filter(expense => new Date(expense.date).getMonth() === i)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { month, amount: monthTotal };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-orbitron font-bold text-glow">Expense Tracker</h1>
          <p className="text-foreground-muted">Manage your finances with advanced analytics</p>
        </div>
        <Button variant="neon" size="lg" className="w-full sm:w-auto">
          <Plus className="h-5 w-5" />
          Add Expense
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card className="glass neon-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalMonthly.toFixed(2)}</div>
            <div className="mt-2">
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budgetProgress > 100 ? 'bg-destructive' : 
                      budgetProgress > 80 ? 'bg-warning' : 'bg-accent'
                    }`}
                    style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                  />
                </div>
                <span>{budgetProgress.toFixed(0)}%</span>
              </div>
              <p className="text-xs text-foreground-muted mt-1">
                of ${monthlyBudget} budget
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-foreground-muted">
              {expenses.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{monthlyExpenses.length}</div>
            <p className="text-xs text-foreground-muted">transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-orbitron">Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                className="glass"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={newExpense.currency}
                onValueChange={(value) => setNewExpense(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger className="glass bg-background border-border/30 z-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass bg-background border border-border/30 z-50">
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newExpense.category}
                onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value, subcategory: "" }))}
              >
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="glass">
                  {Object.keys(categories).map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select 
                value={newExpense.subcategory}
                onValueChange={(value) => setNewExpense(prev => ({ ...prev, subcategory: value }))}
                disabled={!newExpense.category}
              >
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent className="glass">
                  {newExpense.category && categories[newExpense.category as keyof typeof categories]?.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                className="glass"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                className="glass"
              />
            </div>
          </div>

          <Button onClick={addExpense} className="mt-4 w-full sm:w-auto" variant="default" size="lg">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-orbitron">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground-muted))" />
                <YAxis stroke="hsl(var(--foreground-muted))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card-glass))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="amount" fill="url(#colorPrimary)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-orbitron">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card-glass))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 glass-light rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{expense.description}</span>
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    {expense.subcategory} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-lg font-bold text-primary">
                  {currencies.find(c => c.code === expense.currency)?.symbol || '$'}{expense.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}