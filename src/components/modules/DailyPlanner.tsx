import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Bell, Trash2, Edit, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  category: "Work" | "Study" | "Personal" | "Health";
  priority: "low" | "medium" | "high";
  date: string;
  time: string;
  completed: boolean;
  reminder: boolean;
  createdAt: string;
}

const categories = [
  { value: "Work", color: "primary", emoji: "💼" },
  { value: "Study", color: "secondary", emoji: "📚" },
  { value: "Personal", color: "accent", emoji: "🏠" },
  { value: "Health", color: "warning", emoji: "💪" }
];

export function DailyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "Personal" as Task["category"],
    priority: "medium" as Task["priority"],
    date: new Date().toISOString().split('T')[0],
    time: "09:00",
    reminder: false
  });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('daily-planner-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('daily-planner-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        category: newTask.category,
        priority: newTask.priority,
        date: newTask.date,
        time: newTask.time,
        completed: false,
        reminder: newTask.reminder,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        description: "",
        category: "Personal",
        priority: "medium",
        date: new Date().toISOString().split('T')[0],
        time: "09:00",
        reminder: false
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Task Added",
        description: `${task.title} scheduled for ${new Date(task.date).toLocaleDateString()}`
      });
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your planner"
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
    toast({
      title: "Task Updated",
      description: "Your task has been successfully updated"
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesDate = task.date === selectedDate;
    const matchesCategory = filterCategory === "all" || task.category === filterCategory;
    return matchesDate && matchesCategory;
  });

  const todayTasks = tasks.filter(task => task.date === new Date().toISOString().split('T')[0]);
  const completedToday = todayTasks.filter(task => task.completed).length;
  const upcomingTasks = tasks.filter(task => new Date(task.date) > new Date()).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const exportDaily = () => {
    const selectedTasks = tasks.filter(task => task.date === selectedDate);
    const exportText = `Daily Plan - ${new Date(selectedDate).toLocaleDateString()}\n\n${
      selectedTasks.map(task => 
        `${task.completed ? '✓' : '○'} ${task.time} - ${task.title}\n  Category: ${task.category} | Priority: ${task.priority}\n  ${task.description || 'No description'}\n`
      ).join('\n')
    }`;
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-plan-${selectedDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-orbitron font-bold text-glow">Daily Planner</h1>
          <p className="text-foreground-muted">Organize your tasks with smart scheduling</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={exportDaily} className="w-full sm:w-auto text-sm">
            <FileText className="h-4 w-4" />
            Export Plan
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="neon" className="w-full sm:w-auto text-sm">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border border-border/30 z-50">
              <DialogHeader>
                <DialogTitle className="font-orbitron">Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Task Title</Label>
                  <Input
                    placeholder="Enter task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Add task description..."
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="glass"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newTask.category} onValueChange={(value: Task["category"]) => setNewTask(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="glass bg-background border-border/30 z-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border border-border/30 z-50">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.emoji} {cat.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value: Task["priority"]) => setNewTask(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger className="glass bg-background border-border/30 z-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass bg-background border border-border/30 z-50">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newTask.date}
                      onChange={(e) => setNewTask(prev => ({ ...prev, date: e.target.value }))}
                      className="glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                      className="glass"
                    />
                  </div>
                </div>
                <Button onClick={addTask} className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Today's Tasks</p>
                <p className="text-2xl font-bold text-primary">{todayTasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Completed Today</p>
                <p className="text-2xl font-bold text-accent">{completedToday}</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Upcoming</p>
                <p className="text-2xl font-bold text-warning">{upcomingTasks}</p>
              </div>
              <Bell className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date and Filter Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="space-y-2">
          <Label>Select Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="glass"
          />
        </div>
        <div className="space-y-2">
          <Label>Filter Category</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="glass bg-background border-border/30 z-40 w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass bg-background border border-border/30 z-50">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron">
            Tasks for {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
                <p className="text-foreground-muted">No tasks scheduled for this date</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add Your First Task
                </Button>
              </div>
            ) : (
              filteredTasks
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((task) => {
                  const categoryInfo = getCategoryInfo(task.category);
                  return (
                    <div key={task.id} className={`glass-light p-4 rounded-lg border-l-4 ${
                      task.completed ? 'opacity-60' : ''
                    }`} style={{ borderLeftColor: `hsl(var(--${categoryInfo.color}))` }}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="mt-1 w-4 h-4 text-primary bg-transparent border-border rounded focus:ring-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </h3>
                              <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                                {task.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {categoryInfo.emoji} {task.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground-muted mb-2">
                              {task.time} | {task.description || 'No description'}
                            </p>
                            {task.reminder && (
                              <div className="flex items-center gap-1 text-xs text-warning">
                                <Bell className="h-3 w-3" />
                                Reminder set
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTask(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="glass border border-border/30 z-50">
            <DialogHeader>
              <DialogTitle className="font-orbitron">Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="glass"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editingTask.category} onValueChange={(value: Task["category"]) => setEditingTask({ ...editingTask, category: value })}>
                    <SelectTrigger className="glass bg-background border-border/30 z-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass bg-background border border-border/30 z-50">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.emoji} {cat.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={editingTask.priority} onValueChange={(value: Task["priority"]) => setEditingTask({ ...editingTask, priority: value })}>
                    <SelectTrigger className="glass bg-background border-border/30 z-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass bg-background border border-border/30 z-50">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={editingTask.date}
                    onChange={(e) => setEditingTask({ ...editingTask, date: e.target.value })}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={editingTask.time}
                    onChange={(e) => setEditingTask({ ...editingTask, time: e.target.value })}
                    className="glass"
                  />
                </div>
              </div>
              <Button onClick={() => updateTask(editingTask)} className="w-full">
                <Edit className="h-4 w-4" />
                Update Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}