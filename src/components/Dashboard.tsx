import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Dashboard() {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider 
      defaultOpen={!isMobile}
      style={{ 
        "--sidebar-width": isMobile ? "280px" : "320px",
        "--sidebar-width-mobile": "280px"
      } as React.CSSProperties}
    >
      <div className="flex min-h-screen w-full bg-gradient-bg">
        <AppSidebar />
        
        <SidebarInset className="flex-1 w-0"> {/* w-0 prevents overflow on mobile */}
          {/* Header */}
          <header className="sticky top-0 z-40 glass-light border-b border-border/20 p-2 sm:p-3 lg:p-4 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                <SidebarTrigger className="shrink-0">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </SidebarTrigger>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-lg lg:text-xl font-orbitron font-bold text-glow truncate">
                    ABITALIB Super Utility
                  </h1>
                  <p className="text-xs sm:text-sm text-foreground-muted hidden sm:block truncate">
                    Your all-in-one productivity suite
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 container-responsive">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <footer className="glass-light border-t border-border/20 p-2 sm:p-3 lg:p-4 text-center mt-auto">
            <div className="mx-auto max-w-7xl">
              <p className="text-xs sm:text-sm text-foreground-muted">
                Powered by <span className="text-primary font-semibold">ABITALIB GROUP</span>
                <span className="hidden sm:inline"> | All rights reserved by ABITALIB</span>
                <span className="sm:hidden block">© ABITALIB</span>
              </p>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}