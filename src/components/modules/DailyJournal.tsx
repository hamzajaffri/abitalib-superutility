import { useState, useEffect } from "react";
import { Plus, BookOpen, Search, Heart, Smile, Frown, Meh, Calendar, Download, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: "happy" | "neutral" | "sad" | "excited" | "anxious";
  tags: string[];
  date: string;
  createdAt: string;
  lastModified: string;
}

const moods = [
  { value: "happy", label: "Happy", emoji: "😊", color: "accent" },
  { value: "excited", label: "Excited", emoji: "🎉", color: "warning" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "secondary" },
  { value: "anxious", label: "Anxious", emoji: "😰", color: "primary" },
  { value: "sad", label: "Sad", emoji: "😢", color: "destructive" }
];

export function DailyJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "neutral" as JournalEntry["mood"],
    tags: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('journal-entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('journal-entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title.trim(),
        content: newEntry.content.trim(),
        mood: newEntry.mood,
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        date: newEntry.date,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setEntries([entry, ...entries]);
      setNewEntry({
        title: "",
        content: "",
        mood: "neutral",
        tags: "",
        date: new Date().toISOString().split('T')[0]
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Entry Added",
        description: "Your journal entry has been saved"
      });
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Journal entry has been removed"
    });
  };

  const exportEntries = () => {
    const exportText = entries
      .map(entry => 
        `${entry.title}\nDate: ${new Date(entry.date).toLocaleDateString()}\nMood: ${entry.mood}\nTags: ${entry.tags.join(', ')}\n\n${entry.content}\n\n---\n`
      )
      .join('\n');
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-entries-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Your journal entries have been downloaded"
    });
  };

  const allTags = [...new Set(entries.flatMap(entry => entry.tags))];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || entry.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const getMoodInfo = (mood: string) => {
    return moods.find(m => m.value === mood) || moods[2];
  };

  const moodStats = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-glow">Daily Journal</h1>
          <p className="text-foreground-muted">Capture your thoughts with mood tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportEntries}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="neon">
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border border-border/30 z-50 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-orbitron">New Journal Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Entry Title</Label>
                  <Input
                    placeholder="What happened today?"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="glass"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Write your thoughts, experiences, and reflections..."
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="glass min-h-32"
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                      className="glass"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      placeholder="work, personal, travel"
                      value={newEntry.tags}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                      className="glass"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>How are you feeling?</Label>
                  <div className="flex gap-2 flex-wrap">
                    {moods.map((mood) => (
                      <Button
                        key={mood.value}
                        variant={newEntry.mood === mood.value ? "default" : "outline"}
                        onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value as JournalEntry["mood"] }))}
                        className="flex items-center gap-2"
                      >
                        <span className="text-lg">{mood.emoji}</span>
                        {mood.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={addEntry} className="w-full" size="lg">
                  <BookOpen className="h-4 w-4" />
                  Save Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Total Entries</p>
                <p className="text-2xl font-bold text-primary">{entries.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">This Month</p>
                <p className="text-2xl font-bold text-secondary">
                  {entries.filter(entry => 
                    new Date(entry.date).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Tags Used</p>
                <p className="text-2xl font-bold text-accent">{allTags.length}</p>
              </div>
              <Tag className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-muted">Mood Today</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodInfo(entries.filter(e => e.date === new Date().toISOString().split('T')[0])[0]?.mood || "neutral").emoji}</span>
                </div>
              </div>
              <Heart className="h-8 w-8 text-warning" />
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
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={!selectedTag ? "default" : "outline"}
            onClick={() => setSelectedTag("")}
            size="sm"
          >
            All
          </Button>
          {allTags.slice(0, 5).map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
              size="sm"
            >
              #{tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Mood Tracker */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron">Mood Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moods.map((mood) => (
              <div key={mood.value} className="glass-light p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-sm text-foreground-muted">{mood.label}</div>
                <div className="text-lg font-bold text-primary">
                  {moodStats[mood.value] || 0}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron">Your Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
                <p className="text-foreground-muted mb-4">
                  {entries.length === 0 ? "No journal entries yet" : "No entries match your search"}
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Write Your First Entry
                </Button>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const moodInfo = getMoodInfo(entry.mood);
                return (
                  <div key={entry.id} className="glass-light p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-lg">{entry.title}</h3>
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{moodInfo.emoji}</span>
                            <Badge variant={moodInfo.color as any} className="text-xs">
                              {moodInfo.label}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-foreground-muted mb-3">
                          {new Date(entry.date).toLocaleDateString()} • 
                          {entry.content.length} characters
                        </p>
                        
                        <div className="prose prose-sm max-w-none">
                          <p className="text-foreground leading-relaxed mb-3">
                            {entry.content.substring(0, 300)}
                            {entry.content.length > 300 && "..."}
                          </p>
                        </div>

                        {entry.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {entry.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}