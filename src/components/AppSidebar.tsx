import { NavLink, useLocation } from "react-router-dom";
import {
  Calculator,
  DollarSign,
  ShoppingCart,
  QrCode,
  CheckSquare,
  BookOpen,
  Calendar,
  Shield,
  Settings,
  Zap,
  Home
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const modules = [
  { title: "Home", url: "/", icon: Home },
  { title: "Expense Tracker", url: "/expenses", icon: DollarSign },
  { title: "Unit Converter", url: "/converter", icon: Calculator },
  { title: "Shopping List", url: "/shopping", icon: ShoppingCart },
  { title: "Daily Planner", url: "/planner", icon: Calendar },
  { title: "Password Manager", url: "/passwords", icon: Shield },
  { title: "Daily Journal", url: "/journal", icon: BookOpen },
  { title: "QR Tools", url: "/qr", icon: QrCode },
  { title: "Checklists", url: "/checklists", icon: CheckSquare },
];

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar 
      className={cn(
        "glass border-r border-border/30 transition-all duration-300 z-50",
        isMobile && "fixed inset-y-0 left-0",
        isCollapsed ? "w-14 md:w-16" : "w-64 md:w-80"
      )}
      collapsible="icon"
    >
      <SidebarContent className="p-2 sm:p-3 md:p-4 flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3 min-h-[44px] touch-target">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow-sm shrink-0">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in min-w-0 flex-1">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-glow bg-gradient-primary bg-clip-text text-transparent truncate">
                ABITALIB
              </h1>
              <p className="text-xs text-foreground-muted truncate">Super Utility</p>
            </div>
          )}
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-foreground-muted font-orbitron text-xs uppercase tracking-wider px-2 pb-2">
            {!isCollapsed ? "Navigation" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {modules.map((module) => (
                <SidebarMenuItem key={module.title}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      "rounded-lg transition-all duration-300 hover:bg-card-glass/60 touch-target min-h-[44px]",
                      isActive(module.url) && "bg-gradient-primary/20 border-l-2 border-primary shadow-glow-sm"
                    )}
                  >
                    <NavLink 
                      to={module.url} 
                      className={cn(
                        "flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 w-full text-left",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <module.icon className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5 transition-colors shrink-0",
                        isActive(module.url) ? "text-primary" : "text-foreground-muted"
                      )} />
                      <span className={cn(
                        "text-xs sm:text-sm font-medium transition-colors truncate",
                        isActive(module.url) ? "text-primary" : "text-foreground",
                        isCollapsed && "sr-only"
                      )}>
                        {module.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom */}
        <div className="mt-auto pt-4 border-t border-border/20">
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className={cn(
                "rounded-lg hover:bg-card-glass/60 touch-target min-h-[44px]",
                isActive("/settings") && "bg-gradient-primary/20 border-l-2 border-primary shadow-glow-sm"
              )}
            >
              <NavLink 
                to="/settings" 
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 w-full text-left",
                  isCollapsed && "justify-center"
                )}
              >
                <Settings className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 shrink-0",
                  isActive("/settings") ? "text-primary" : "text-foreground-muted"
                )} />
                <span className={cn(
                  "text-xs sm:text-sm font-medium truncate",
                  isActive("/settings") ? "text-primary" : "text-foreground",
                  isCollapsed && "sr-only"
                )}>
                  Settings
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}