import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { Home } from "./components/Home";
import { ExpenseTracker } from "./components/modules/ExpenseTracker";
import { UnitConverter } from "./components/modules/UnitConverter";
import { ShoppingList } from "./components/modules/ShoppingList";
import { QRTools } from "./components/modules/QRTools";
import { DailyPlanner } from "./components/modules/DailyPlanner";
import { PasswordManager } from "./components/modules/PasswordManager";
import { DailyJournal } from "./components/modules/DailyJournal";
import { ChecklistMaker } from "./components/modules/ChecklistMaker";
import { Settings } from "./components/modules/Settings";
import NotFound from "./pages/NotFound";
import { applySettings, SettingsState } from "./hooks/use-settings";

const queryClient = new QueryClient();

const SettingsInitializer = () => {
  useEffect(() => {
    // Initialize settings on app start
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const parsedSettings: SettingsState = JSON.parse(savedSettings);
        applySettings(parsedSettings);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SettingsInitializer />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="expenses" element={<ExpenseTracker />} />
            <Route path="converter" element={<UnitConverter />} />
            <Route path="shopping" element={<ShoppingList />} />
            <Route path="qr" element={<QRTools />} />
            <Route path="planner" element={<DailyPlanner />} />
            <Route path="passwords" element={<PasswordManager />} />
            <Route path="journal" element={<DailyJournal />} />
            <Route path="checklists" element={<ChecklistMaker />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
