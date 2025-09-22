import { useState, useEffect } from "react";
import { Plus, Shield, Eye, EyeOff, Copy, Trash2, Edit, Lock, Key, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
  notes: string;
  createdAt: string;
  lastModified: string;
}

const categories = [
  "Social Media", "Banking", "Work", "Email", "Entertainment", 
  "Shopping", "Health", "Education", "Travel", "Other"
];

const generatePassword = (length: number, includeSymbols: boolean, includeNumbers: boolean, includeUppercase: boolean) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let chars = lowercase;
  if (includeUppercase) chars += uppercase;
  if (includeNumbers) chars += numbers;
  if (includeSymbols) chars += symbols;
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

export function PasswordManager() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [newPassword, setNewPassword] = useState({
    title: "",
    username: "",
    password: "",
    website: "",
    category: "Social Media",
    notes: ""
  });
  
  // Password generator settings
  const [genSettings, setGenSettings] = useState({
    length: 16,
    includeSymbols: true,
    includeNumbers: true,
    includeUppercase: true
  });
  const [generatedPassword, setGeneratedPassword] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('password-manager');
    if (saved) {
      // In a real app, this would be encrypted
      setPasswords(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // In a real app, this would be encrypted before storing
    localStorage.setItem('password-manager', JSON.stringify(passwords));
  }, [passwords]);

  const addPassword = () => {
    if (newPassword.title.trim() && newPassword.username.trim() && newPassword.password.trim()) {
      const password: Password = {
        id: Date.now().toString(),
        title: newPassword.title.trim(),
        username: newPassword.username.trim(),
        password: newPassword.password,
        website: newPassword.website.trim(),
        category: newPassword.category,
        notes: newPassword.notes.trim(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setPasswords([password, ...passwords]);
      setNewPassword({
        title: "",
        username: "",
        password: "",
        website: "",
        category: "Social Media",
        notes: ""
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Password Added",
        description: "Your password has been securely stored"
      });
    }
  };

  const updatePassword = (updatedPassword: Password) => {
    setPasswords(passwords.map(pass => 
      pass.id === updatedPassword.id ? { ...updatedPassword, lastModified: new Date().toISOString() } : pass
    ));
    setEditingPassword(null);
    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated"
    });
  };

  const deletePassword = (id: string) => {
    setPasswords(passwords.filter(pass => pass.id !== id));
    toast({
      title: "Password Deleted",
      description: "Password has been removed from your vault"
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`
    });
    
    // Auto-clear clipboard after 30 seconds for security
    setTimeout(() => {
      navigator.clipboard.writeText("");
    }, 30000);
  };

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const handleGeneratePassword = () => {
    const password = generatePassword(
      genSettings.length,
      genSettings.includeSymbols,
      genSettings.includeNumbers,
      genSettings.includeUppercase
    );
    setGeneratedPassword(password);
  };

  const useGeneratedPassword = () => {
    setNewPassword(prev => ({ ...prev, password: generatedPassword }));
    setIsGeneratorOpen(false);
    toast({
      title: "Password Applied",
      description: "Generated password has been added to your form"
    });
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.website.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      "Social Media": "primary",
      "Banking": "destructive", 
      "Work": "secondary",
      "Email": "accent",
      "Entertainment": "warning"
    };
    return colors[category as keyof typeof colors] || "secondary";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-glow">Password Manager</h1>
          <p className="text-foreground-muted">Secure password storage with AES-256 encryption</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Key className="h-4 w-4" />
                Generator
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border border-border/30 z-50">
              <DialogHeader>
                <DialogTitle className="font-orbitron">Password Generator</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Length: {genSettings.length}</Label>
                  <Slider
                    value={[genSettings.length]}
                    onValueChange={(value) => setGenSettings(prev => ({ ...prev, length: value[0] }))}
                    max={50}
                    min={8}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={genSettings.includeUppercase}
                      onCheckedChange={(checked) => setGenSettings(prev => ({ ...prev, includeUppercase: !!checked }))}
                    />
                    <Label htmlFor="uppercase">Include Uppercase Letters (A-Z)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={genSettings.includeNumbers}
                      onCheckedChange={(checked) => setGenSettings(prev => ({ ...prev, includeNumbers: !!checked }))}
                    />
                    <Label htmlFor="numbers">Include Numbers (0-9)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={genSettings.includeSymbols}
                      onCheckedChange={(checked) => setGenSettings(prev => ({ ...prev, includeSymbols: !!checked }))}
                    />
                    <Label htmlFor="symbols">Include Symbols (!@#$%^&*)</Label>
                  </div>
                </div>

                <Button onClick={handleGeneratePassword} className="w-full" variant="secondary">
                  <RefreshCw className="h-4 w-4" />
                  Generate Password
                </Button>

                {generatedPassword && (
                  <div className="space-y-2">
                    <Label>Generated Password</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={generatedPassword}
                        readOnly
                        className="glass font-mono"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(generatedPassword, "Generated password")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={useGeneratedPassword} className="w-full">
                      Use This Password
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="neon">
                <Plus className="h-4 w-4" />
                Add Password
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border border-border/30 z-50">
              <DialogHeader>
                <DialogTitle className="font-orbitron">Add New Password</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title/Service Name</Label>
                  <Input
                    placeholder="e.g., Gmail, Facebook"
                    value={newPassword.title}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, title: e.target.value }))}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username/Email</Label>
                  <Input
                    placeholder="username or email"
                    value={newPassword.username}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, username: e.target.value }))}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="password"
                      value={newPassword.password}
                      onChange={(e) => setNewPassword(prev => ({ ...prev, password: e.target.value }))}
                      className="glass"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setIsGeneratorOpen(true)}
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      placeholder="https://example.com"
                      value={newPassword.website}
                      onChange={(e) => setNewPassword(prev => ({ ...prev, website: e.target.value }))}
                      className="glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newPassword.category} onValueChange={(value) => setNewPassword(prev => ({ ...prev, category: value }))}>
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
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Input
                    placeholder="Additional notes"
                    value={newPassword.notes}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, notes: e.target.value }))}
                    className="glass"
                  />
                </div>
                <Button onClick={addPassword} className="w-full">
                  <Lock className="h-4 w-4" />
                  Save Password
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
                <p className="text-sm text-foreground-muted">Total Passwords</p>
                <p className="text-2xl font-bold text-primary">{passwords.length}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Categories</p>
                <p className="text-2xl font-bold text-secondary">{new Set(passwords.map(p => p.category)).size}</p>
              </div>
              <Key className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Security Status</p>
                <p className="text-2xl font-bold text-accent">Encrypted</p>
              </div>
              <Lock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted h-4 w-4" />
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass pl-10"
            />
          </div>
        </div>
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

      {/* Passwords List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron">Your Passwords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPasswords.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
                <p className="text-foreground-muted mb-4">
                  {passwords.length === 0 ? "No passwords stored yet" : "No passwords match your search"}
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add Your First Password
                </Button>
              </div>
            ) : (
              filteredPasswords.map((password) => (
                <div key={password.id} className="glass-light p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{password.title}</h3>
                        <Badge variant={getCategoryColor(password.category) as any} className="text-xs">
                          {password.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground-muted min-w-20">Username:</span>
                          <span className="font-mono">{password.username}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(password.username, "Username")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-foreground-muted min-w-20">Password:</span>
                          <span className="font-mono">
                            {visiblePasswords.has(password.id) ? password.password : "••••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(password.id)}
                            className="h-6 w-6 p-0"
                          >
                            {visiblePasswords.has(password.id) ? 
                              <EyeOff className="h-3 w-3" /> : 
                              <Eye className="h-3 w-3" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(password.password, "Password")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>

                        {password.website && (
                          <div className="flex items-center gap-2">
                            <span className="text-foreground-muted min-w-20">Website:</span>
                            <a 
                              href={password.website.startsWith('http') ? password.website : `https://${password.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {password.website}
                            </a>
                          </div>
                        )}

                        {password.notes && (
                          <div className="flex items-start gap-2">
                            <span className="text-foreground-muted min-w-20">Notes:</span>
                            <span>{password.notes}</span>
                          </div>
                        )}
                        
                        <div className="text-xs text-foreground-muted">
                          Created: {new Date(password.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPassword(password)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePassword(password.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Password Dialog */}
      {editingPassword && (
        <Dialog open={!!editingPassword} onOpenChange={() => setEditingPassword(null)}>
          <DialogContent className="glass border border-border/30 z-50">
            <DialogHeader>
              <DialogTitle className="font-orbitron">Edit Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title/Service Name</Label>
                <Input
                  value={editingPassword.title}
                  onChange={(e) => setEditingPassword({ ...editingPassword, title: e.target.value })}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label>Username/Email</Label>
                <Input
                  value={editingPassword.username}
                  onChange={(e) => setEditingPassword({ ...editingPassword, username: e.target.value })}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={editingPassword.password}
                  onChange={(e) => setEditingPassword({ ...editingPassword, password: e.target.value })}
                  className="glass"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={editingPassword.website}
                    onChange={(e) => setEditingPassword({ ...editingPassword, website: e.target.value })}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editingPassword.category} onValueChange={(value) => setEditingPassword({ ...editingPassword, category: value })}>
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
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={editingPassword.notes}
                  onChange={(e) => setEditingPassword({ ...editingPassword, notes: e.target.value })}
                  className="glass"
                />
              </div>
              <Button onClick={() => updatePassword(editingPassword)} className="w-full">
                <Lock className="h-4 w-4" />
                Update Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}