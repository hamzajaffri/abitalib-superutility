import { useState, useEffect } from "react";
import { Plus, CheckSquare, Trash2, Copy, ArrowUp, ArrowDown, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

interface Checklist {
  id: string;
  title: string;
  category: string;
  items: ChecklistItem[];
  template: boolean;
  createdAt: string;
  lastModified: string;
}

const categories = [
  "Travel", "Shopping", "Work", "Health", "Home", "Events", "Projects", "Daily", "Other"
];

const templates = {
  "Travel": [
    "Pack passport and ID",
    "Book accommodation", 
    "Check weather forecast",
    "Pack appropriate clothes",
    "Charge electronic devices",
    "Print boarding passes",
    "Pack medications",
    "Notify bank of travel",
    "Purchase travel insurance",
    "Make copies of documents"
  ],
  "Shopping": [
    "Check current inventory",
    "Make shopping list",
    "Compare prices online",
    "Check for coupons/deals",
    "Bring reusable bags",
    "Set budget limit",
    "Check expiry dates",
    "Compare brands",
    "Calculate total cost",
    "Keep receipts"
  ],
  "Work": [
    "Check calendar for meetings",
    "Review project deadlines",
    "Respond to emails",
    "Update task progress",
    "Prepare meeting materials",
    "Review daily goals",
    "Check team updates",
    "Complete priority tasks",
    "Plan tomorrow's work",
    "Clean workspace"
  ]
};

export function ChecklistMaker() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [newChecklist, setNewChecklist] = useState({
    title: "",
    category: "Work",
    items: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('checklists');
    if (saved) {
      setChecklists(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('checklists', JSON.stringify(checklists));
  }, [checklists]);

  const createChecklist = () => {
    if (newChecklist.title.trim() && newChecklist.items.trim()) {
      const items = newChecklist.items
        .split('\n')
        .map((text, index) => ({
          id: `${Date.now()}-${index}`,
          text: text.trim(),
          completed: false,
          order: index
        }))
        .filter(item => item.text);

      const checklist: Checklist = {
        id: Date.now().toString(),
        title: newChecklist.title.trim(),
        category: newChecklist.category,
        items,
        template: false,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      setChecklists([checklist, ...checklists]);
      setNewChecklist({ title: "", category: "Work", items: "" });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Checklist Created",
        description: `${checklist.title} with ${items.length} items`
      });
    }
  };

  const createFromTemplate = (templateCategory: string) => {
    const items = templates[templateCategory as keyof typeof templates].map((text, index) => ({
      id: `${Date.now()}-${index}`,
      text,
      completed: false,
      order: index
    }));

    const checklist: Checklist = {
      id: Date.now().toString(),
      title: `${templateCategory} Checklist`,
      category: templateCategory,
      items,
      template: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setChecklists([checklist, ...checklists]);
    setIsTemplateDialogOpen(false);
    
    toast({
      title: "Template Created",
      description: `${templateCategory} checklist with ${items.length} items`
    });
  };

  const toggleItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(checklist => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: checklist.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
          lastModified: new Date().toISOString()
        };
      }
      return checklist;
    }));
  };

  const addItemToChecklist = (checklistId: string, text: string) => {
    if (!text.trim()) return;

    setChecklists(checklists.map(checklist => {
      if (checklist.id === checklistId) {
        const newItem: ChecklistItem = {
          id: `${Date.now()}-new`,
          text: text.trim(),
          completed: false,
          order: checklist.items.length
        };
        return {
          ...checklist,
          items: [...checklist.items, newItem],
          lastModified: new Date().toISOString()
        };
      }
      return checklist;
    }));
  };

  const deleteItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(checklist => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: checklist.items.filter(item => item.id !== itemId),
          lastModified: new Date().toISOString()
        };
      }
      return checklist;
    }));
  };

  const moveItem = (checklistId: string, itemId: string, direction: "up" | "down") => {
    setChecklists(checklists.map(checklist => {
      if (checklist.id === checklistId) {
        const items = [...checklist.items];
        const currentIndex = items.findIndex(item => item.id === itemId);
        
        if (direction === "up" && currentIndex > 0) {
          [items[currentIndex], items[currentIndex - 1]] = [items[currentIndex - 1], items[currentIndex]];
        } else if (direction === "down" && currentIndex < items.length - 1) {
          [items[currentIndex], items[currentIndex + 1]] = [items[currentIndex + 1], items[currentIndex]];
        }
        
        return {
          ...checklist,
          items: items.map((item, index) => ({ ...item, order: index })),
          lastModified: new Date().toISOString()
        };
      }
      return checklist;
    }));
  };

  const duplicateChecklist = (checklistId: string) => {
    const original = checklists.find(c => c.id === checklistId);
    if (!original) return;

    const duplicate: Checklist = {
      ...original,
      id: Date.now().toString(),
      title: `${original.title} (Copy)`,
      items: original.items.map((item, index) => ({
        ...item,
        id: `${Date.now()}-copy-${index}`,
        completed: false
      })),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setChecklists([duplicate, ...checklists]);
    toast({
      title: "Checklist Duplicated",
      description: `Created a copy of ${original.title}`
    });
  };

  const deleteChecklist = (id: string) => {
    setChecklists(checklists.filter(checklist => checklist.id !== id));
    toast({
      title: "Checklist Deleted",
      description: "Checklist has been removed"
    });
  };

  const exportChecklist = (checklist: Checklist) => {
    const exportText = `${checklist.title}\n${'='.repeat(checklist.title.length)}\n\n${
      checklist.items.map(item => 
        `${item.completed ? '✓' : '○'} ${item.text}`
      ).join('\n')
    }\n\nProgress: ${checklist.items.filter(i => i.completed).length}/${checklist.items.length} completed`;
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${checklist.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getProgress = (checklist: Checklist) => {
    const completed = checklist.items.filter(item => item.completed).length;
    const total = checklist.items.length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const filteredChecklists = checklists.filter(checklist => 
    selectedCategory === "all" || checklist.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-glow">Checklist Maker</h1>
          <p className="text-foreground-muted">Create and manage reusable checklists</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Star className="h-4 w-4" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border border-border/30 z-50">
              <DialogHeader>
                <DialogTitle className="font-orbitron">Choose Template</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                {Object.keys(templates).map((template) => (
                  <Card key={template} className="glass-light cursor-pointer hover:bg-card-glass/60" onClick={() => createFromTemplate(template)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{template} Checklist</h3>
                          <p className="text-sm text-foreground-muted">
                            {templates[template as keyof typeof templates].length} items
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Create
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="neon">
                <Plus className="h-4 w-4" />
                New Checklist
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border border-border/30 z-50 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-orbitron">Create New Checklist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Checklist Title</Label>
                  <Input
                    placeholder="Enter checklist title..."
                    value={newChecklist.title}
                    onChange={(e) => setNewChecklist(prev => ({ ...prev, title: e.target.value }))}
                    className="glass"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newChecklist.category} onValueChange={(value) => setNewChecklist(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="glass bg-background border-border/30 z-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass bg-background border border-border/30 z-50">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Items (one per line)</Label>
                  <textarea
                    placeholder="Enter checklist items, one per line..."
                    value={newChecklist.items}
                    onChange={(e) => setNewChecklist(prev => ({ ...prev, items: e.target.value }))}
                    className="w-full min-h-32 p-3 glass rounded-lg resize-none"
                    rows={8}
                  />
                </div>

                <Button onClick={createChecklist} className="w-full" size="lg">
                  <CheckSquare className="h-4 w-4" />
                  Create Checklist
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Total Checklists</p>
                <p className="text-2xl font-bold text-primary">{checklists.length}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Total Items</p>
                <p className="text-2xl font-bold text-secondary">
                  {checklists.reduce((sum, checklist) => sum + checklist.items.length, 0)}
                </p>
              </div>
              <Plus className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Categories</p>
                <p className="text-2xl font-bold text-accent">
                  {new Set(checklists.map(c => c.category)).size}
                </p>
              </div>
              <Star className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label>Filter by Category:</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="glass bg-background border-border/30 z-40 w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass bg-background border border-border/30 z-50">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Checklists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChecklists.length === 0 ? (
          <div className="col-span-full">
            <Card className="glass">
              <CardContent className="text-center py-12">
                <CheckSquare className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
                <p className="text-foreground-muted mb-4">
                  {checklists.length === 0 ? "No checklists created yet" : "No checklists in this category"}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Create New Checklist
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsTemplateDialogOpen(true)}
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredChecklists.map((checklist) => (
            <Card key={checklist.id} className="glass">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-orbitron mb-2">{checklist.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{checklist.category}</Badge>
                      <span className="text-sm text-foreground-muted">
                        {checklist.items.filter(i => i.completed).length}/{checklist.items.length} completed
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="h-2 bg-gradient-primary rounded-full transition-all duration-300"
                        style={{ width: `${getProgress(checklist)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => exportChecklist(checklist)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateChecklist(checklist.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteChecklist(checklist.id)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {checklist.items.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(checklist.id, item.id)}
                      />
                      <span className={`flex-1 ${item.completed ? 'line-through text-foreground-muted' : ''}`}>
                        {item.text}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveItem(checklist.id, item.id, "up")}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveItem(checklist.id, item.id, "down")}
                          disabled={index === checklist.items.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(checklist.id, item.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new item..."
                      className="glass"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          addItemToChecklist(checklist.id, input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                        if (input?.value) {
                          addItemToChecklist(checklist.id, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}