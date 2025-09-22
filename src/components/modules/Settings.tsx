import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Type, 
  Layout, 
  Database,
  Info,
  Download,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Github
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";

export function Settings() {
  const { toast } = useToast();
  const { settings, setSettings } = useSettings();

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const exportData = () => {
    const allData = {
      expenses: JSON.parse(localStorage.getItem('expenses') || '[]'),
      shoppingLists: JSON.parse(localStorage.getItem('shopping-lists') || '[]'),
      plannerTasks: JSON.parse(localStorage.getItem('planner-tasks') || '[]'),
      journalEntries: JSON.parse(localStorage.getItem('journal-entries') || '[]'),
      checklists: JSON.parse(localStorage.getItem('checklists') || '[]'),
      conversions: JSON.parse(localStorage.getItem('conversion-history') || '[]'),
      settings: settings,
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `abitalib-utility-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported",
      description: "Your data has been exported successfully.",
    });
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      const defaultSettings = {
        theme: 'system' as const,
        fontSize: 16,
        fontFamily: 'inter',
        layout: 'expanded' as const,
        animations: true,
        autoSave: true,
      };
      setSettings(defaultSettings);
      toast({
        title: "Data cleared",
        description: "All data has been cleared successfully.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-glow">Settings</h1>
          <p className="text-foreground-muted">Customize your experience</p>
        </div>
      </div>

      {/* Theme Settings */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron flex items-center gap-2">
            <Palette className="h-5 w-5 text-secondary" />
            Theme & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Theme Mode</Label>
            <div className="flex gap-2">
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSettingsChange({ ...settings, theme: 'light' })}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSettingsChange({ ...settings, theme: 'dark' })}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={settings.theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSettingsChange({ ...settings, theme: 'system' })}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                System
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Animations</Label>
            <Switch
              checked={settings.animations}
              onCheckedChange={(checked) => handleSettingsChange({ ...settings, animations: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Typography Settings */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron flex items-center gap-2">
            <Type className="h-5 w-5 text-secondary" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Font Family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => handleSettingsChange({ ...settings, fontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter (Sans Serif)</SelectItem>
                <SelectItem value="orbitron">Orbitron (Monospace)</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => handleSettingsChange({ ...settings, fontSize: value })}
              min={12}
              max={20}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout Settings */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron flex items-center gap-2">
            <Layout className="h-5 w-5 text-secondary" />
            Layout & Behavior
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Layout Style</Label>
            <div className="flex gap-2">
              <Button
                variant={settings.layout === 'compact' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSettingsChange({ ...settings, layout: 'compact' })}
              >
                Compact
              </Button>
              <Button
                variant={settings.layout === 'expanded' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSettingsChange({ ...settings, layout: 'expanded' })}
              >
                Expanded
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Auto-save</Label>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingsChange({ ...settings, autoSave: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron flex items-center gap-2">
            <Database className="h-5 w-5 text-secondary" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={exportData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button
              variant="destructive"
              onClick={clearAllData}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
          <p className="text-sm text-foreground-muted">
            Export your data as JSON backup or clear all stored data.
          </p>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="glass neon-glow">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron flex items-center gap-2">
            <Info className="h-5 w-5 text-secondary" />
            About ABITALIB Super Utility App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-foreground-muted">
              A comprehensive multi-tool dashboard application with advanced modules for daily productivity.
            </p>
            <p className="text-sm text-foreground-muted">
              Version 1.0.0 • Built with React, TypeScript, and Tailwind CSS
            </p>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <Github className="h-4 w-4" />
              <span>This project is fully open-source for trust and transparency.</span>
            </div>
          </div>
          <Separator />
          <div className="text-center py-2">
            <p className="text-sm text-foreground-muted">
              Powered by <span className="text-secondary font-semibold">ABITALIB GROUP</span> | All rights reserved by ABITALIB
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}