import { useState, useEffect } from "react";
import { Plus, Trash2, Check, ShoppingBag, Share, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  dateAdded: string;
  price?: number;
  currency?: string;
}

const categories = [
  "Groceries", "Dairy", "Meat", "Vegetables", "Fruits", "Pantry", 
  "Household", "Personal Care", "Electronics", "Clothing", "Other"
];

const commonItems = [
  "Milk", "Bread", "Eggs", "Butter", "Cheese", "Chicken", "Beef", "Potatoes", 
  "Tomatoes", "Onions", "Apples", "Bananas", "Rice", "Pasta", "Olive Oil",
  "Shampoo", "Toothpaste", "Detergent", "Paper Towels"
];

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

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    category: "Groceries",
    priority: "medium" as const,
    price: "",
    currency: "USD"
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('shopping-list');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shopping-list', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (newItem.name.length > 0) {
      const filtered = commonItems.filter(item => 
        item.toLowerCase().includes(newItem.name.toLowerCase()) &&
        !items.some(existing => existing.name.toLowerCase() === item.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [newItem.name, items]);

  const addItem = () => {
    if (newItem.name.trim()) {
      const item: ShoppingItem = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        quantity: newItem.quantity,
        category: newItem.category,
        priority: newItem.priority,
        completed: false,
        dateAdded: new Date().toISOString(),
        price: newItem.price ? parseFloat(newItem.price) : undefined,
        currency: newItem.currency
      };
      setItems([...items, item]);
      setNewItem({
        name: "",
        quantity: 1,
        category: "Groceries",
        priority: "medium",
        price: "",
        currency: "USD"
      });
      setSuggestions([]);
      toast({
        title: "Item Added",
        description: `${item.name} added to your shopping list`
      });
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setItems(items.filter(item => !item.completed));
    toast({
      title: "List Cleaned",
      description: "Completed items have been removed"
    });
  };

  const exportList = () => {
    const listText = items
      .map(item => {
        const priceText = item.price ? ` - ${formatPrice(item.price * item.quantity, item.currency || 'USD')}` : '';
        return `${item.completed ? '✓' : '○'} ${item.quantity}x ${item.name} (${item.category})${priceText}`;
      })
      .join('\n');
    
    // Add totals
    const totalText = Object.entries(allTotals)
      .map(([currency, total]) => `Total: ${formatPrice(total, currency)}`)
      .join('\n');
    
    const fullText = listText + (totalText ? '\n\n' + totalText : '');
    
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareList = async () => {
    const listText = items
      .filter(item => !item.completed)
      .map(item => {
        const priceText = item.price ? ` - ${formatPrice(item.price * item.quantity, item.currency || 'USD')}` : '';
        return `${item.quantity}x ${item.name}${priceText}`;
      })
      .join('\n');
    
    // Add totals for active items
    const totalText = Object.entries(activeTotals)
      .map(([currency, total]) => `Total: ${formatPrice(total, currency)}`)
      .join('\n');
    
    const fullText = listText + (totalText ? '\n\n' + totalText : '');
    
    if (navigator.share) {
      await navigator.share({
        title: 'Shopping List',
        text: fullText
      });
    } else {
      navigator.clipboard.writeText(fullText);
      toast({
        title: "Copied!",
        description: "Shopping list copied to clipboard"
      });
    }
  };

  const activeItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);
  const progress = items.length > 0 ? (completedItems.length / items.length) * 100 : 0;

  // Calculate totals
  const calculateTotal = (itemList: ShoppingItem[]) => {
    const totals: { [key: string]: number } = {};
    itemList.forEach(item => {
      if (item.price && item.currency) {
        if (!totals[item.currency]) totals[item.currency] = 0;
        totals[item.currency] += item.price * item.quantity;
      }
    });
    return totals;
  };

  const activeTotals = calculateTotal(activeItems);
  const allTotals = calculateTotal(items);

  const formatPrice = (price: number, currency: string) => {
    const currencyData = currencies.find(c => c.code === currency);
    return `${currencyData?.symbol || currency} ${price.toFixed(2)}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-orbitron font-bold text-glow">Shopping List</h1>
          <p className="text-foreground-muted">Smart shopping with auto-suggestions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={shareList} className="w-full sm:w-auto text-sm">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={exportList} className="w-full sm:w-auto text-sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Progress</p>
                <p className="text-2xl font-bold text-primary">{progress.toFixed(0)}%</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Remaining</p>
                <p className="text-2xl font-bold text-secondary">{activeItems.length}</p>
              </div>
              <div className="text-secondary">
                <Check className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Total Items</p>
                <p className="text-2xl font-bold text-accent">{items.length}</p>
              </div>
              <div className="text-accent">
                <Plus className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Cost Display */}
      {Object.keys(activeTotals).length > 0 && (
        <Card className="glass neon-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Estimated Total Cost</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.entries(activeTotals).map(([currency, total]) => (
                    <span key={currency} className="text-lg font-bold text-primary">
                      {formatPrice(total, currency)}
                     </span>
                   ))}
                 </div>
               </div>
               <ShoppingBag className="h-8 w-8 text-primary" />
             </div>
           </CardContent>
         </Card>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Add Item Form */}
        <Card className="glass neon-glow">
          <CardHeader>
            <CardTitle className="text-lg font-orbitron">Add New Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <div className="relative">
                <Input
                  placeholder="Enter item name..."
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  className="glass"
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 glass border border-border rounded-lg shadow-glass">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        className="w-full text-left px-3 py-2 hover:bg-card-glass/60 first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => setNewItem(prev => ({ ...prev, name: suggestion }))}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select 
                  value={newItem.priority}
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="col-span-2 sm:col-span-2 space-y-2">
                <Label>Price (Optional)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select 
                  value={newItem.currency}
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={newItem.category}
                onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addItem} className="w-full mt-4" size="lg">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Shopping List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Items */}
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-orbitron">Shopping List ({activeItems.length})</CardTitle>
              {completedItems.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompleted}>
                  <Trash2 className="h-4 w-4" />
                  Clear Completed
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeItems.length === 0 ? (
                  <p className="text-center py-8 text-foreground-muted">
                    Your shopping list is empty. Add some items to get started!
                  </p>
                ) : (
                  activeItems
                    .sort((a, b) => {
                      const priorityOrder = { high: 3, medium: 2, low: 1 };
                      return priorityOrder[b.priority] - priorityOrder[a.priority];
                    })
                    .map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 glass-light rounded-lg">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleItem(item.id)}
                        />
                         <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <span className="font-medium">{item.quantity}x {item.name}</span>
                             <Badge variant={getPriorityColor(item.priority) as any} className="text-xs">
                               {item.priority}
                             </Badge>
                           </div>
                           <div className="flex items-center justify-between">
                             <p className="text-sm text-foreground-muted">{item.category}</p>
                             {item.price && (
                               <p className="text-sm font-semibold text-primary">
                                 {formatPrice(item.price * item.quantity, item.currency || 'USD')}
                               </p>
                             )}
                           </div>
                         </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Items */}
          {completedItems.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron text-accent">
                  Completed ({completedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {completedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 glass-light rounded-lg opacity-60">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                       <div className="flex-1">
                         <div className="flex items-center justify-between">
                           <span className="line-through text-foreground-muted">
                             {item.quantity}x {item.name}
                           </span>
                           {item.price && (
                             <span className="text-sm line-through text-foreground-muted">
                               {formatPrice(item.price * item.quantity, item.currency || 'USD')}
                             </span>
                           )}
                         </div>
                       </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}