import { Link } from "react-router-dom";
import { 
  DollarSign, 
  Calculator, 
  ShoppingCart, 
  QrCode, 
  CheckSquare, 
  BookOpen, 
  Calendar, 
  Shield,
  TrendingUp,
  Users,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const modules = [
  { 
    title: "Expense Tracker", 
    url: "/expenses", 
    icon: DollarSign, 
    description: "Track daily expenses with advanced analytics",
    color: "primary"
  },
  { 
    title: "Unit Converter", 
    url: "/converter", 
    icon: Calculator, 
    description: "Convert between different units instantly",
    color: "secondary"
  },
  { 
    title: "Shopping List", 
    url: "/shopping", 
    icon: ShoppingCart, 
    description: "Smart shopping lists with auto-suggestions",
    color: "accent"
  },
  { 
    title: "Daily Planner", 
    url: "/planner", 
    icon: Calendar, 
    description: "Organize tasks with drag-and-drop calendar",
    color: "warning"
  },
  { 
    title: "Password Manager", 
    url: "/passwords", 
    icon: Shield, 
    description: "Secure password storage with encryption",
    color: "destructive"
  },
  { 
    title: "Daily Journal", 
    url: "/journal", 
    icon: BookOpen, 
    description: "Rich text journaling with mood tracking",
    color: "primary"
  },
  { 
    title: "QR Tools", 
    url: "/qr", 
    icon: QrCode, 
    description: "Generate and scan QR codes easily",
    color: "secondary"
  },
  { 
    title: "Checklists", 
    url: "/checklists", 
    icon: CheckSquare, 
    description: "Reusable checklists with templates",
    color: "accent"
  },
];

const stats = [
  { label: "Total Users", value: "10,000+", icon: Users, color: "primary" },
  { label: "Tools Available", value: "8", icon: Zap, color: "secondary" },
  { label: "Time Saved", value: "500hrs", icon: Clock, color: "accent" },
  { label: "Productivity Boost", value: "85%", icon: TrendingUp, color: "warning" },
];

export function Home() {
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 py-4 sm:py-6 md:py-8">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Zap className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-responsive-xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold text-glow bg-gradient-primary bg-clip-text text-transparent">
          ABITALIB
        </h1>
        <h2 className="text-responsive-lg sm:text-xl md:text-2xl lg:text-3xl font-orbitron font-semibold text-foreground">
          Super Utility App
        </h2>
        <p className="text-responsive-sm sm:text-base md:text-lg text-foreground-muted max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed px-4">
          Your ultimate productivity suite combining 8 powerful tools in one futuristic, 
          secure, and open-source platform. Built for efficiency, designed for the future.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass hover:glass-light transition-all duration-300">
            <CardContent className="p-3 sm:p-4 text-center">
              <stat.icon className={cn(
                "h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2",
                stat.color === "primary" && "text-primary",
                stat.color === "secondary" && "text-secondary", 
                stat.color === "accent" && "text-accent",
                stat.color === "warning" && "text-warning"
              )} />
              <div className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold",
                stat.color === "primary" && "text-primary",
                stat.color === "secondary" && "text-secondary",
                stat.color === "accent" && "text-accent", 
                stat.color === "warning" && "text-warning"
              )}>
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm text-foreground-muted">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h3 className="text-responsive-lg sm:text-xl md:text-2xl font-orbitron font-bold text-foreground mb-2">
            Powerful Tools at Your Fingertips
          </h3>
          <p className="text-responsive-sm sm:text-base text-foreground-muted max-w-lg mx-auto">
            Discover our comprehensive suite of productivity tools
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {modules.map((module) => (
            <Link key={module.title} to={module.url} className="group">
              <Card className="glass hover:glass-light transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:neon-glow group h-full touch-target">
                <CardHeader className="text-center pb-2 p-3 sm:p-4">
                  <div className="flex justify-center mb-3">
                    <div className={cn(
                      "p-2 sm:p-3 rounded-xl shadow-glow-sm group-hover:shadow-glow transition-all duration-300",
                      module.color === "primary" && "bg-gradient-primary",
                      module.color === "secondary" && "bg-gradient-secondary",
                      module.color === "accent" && "bg-gradient-accent",
                      module.color === "warning" && "bg-gradient-to-r from-warning to-warning-glow",
                      module.color === "destructive" && "bg-gradient-to-r from-destructive to-destructive-glow"
                    )}>
                      <module.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-responsive-sm sm:text-base md:text-lg font-orbitron group-hover:text-glow transition-colors">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-foreground-muted group-hover:text-foreground transition-colors">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="glass neon-glow hover:glass-light transition-all duration-300">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-responsive-sm sm:text-base md:text-lg font-orbitron text-primary">
              🔒 Secure & Private
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-foreground-muted">
              End-to-end encryption, zero-knowledge architecture, and open-source transparency 
              ensure your data remains completely private.
            </p>
          </CardContent>
        </Card>

        <Card className="glass hover:glass-light transition-all duration-300">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-responsive-sm sm:text-base md:text-lg font-orbitron text-secondary">
              ⚡ Lightning Fast
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-foreground-muted">
              Built with modern technologies and optimized for performance. 
              Experience instant loading and smooth interactions.
            </p>
          </CardContent>
        </Card>

        <Card className="glass hover:glass-light transition-all duration-300">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-responsive-sm sm:text-base md:text-lg font-orbitron text-accent">
              🌟 Open Source
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-foreground-muted">
              Fully open-source for complete transparency and community trust. 
              Contribute, customize, and make it your own.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="glass-light border-primary/30 text-center">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <h3 className="text-responsive-lg sm:text-xl md:text-2xl font-orbitron font-bold text-glow mb-3 sm:mb-4">
            Ready to Boost Your Productivity?
          </h3>
          <p className="text-foreground-muted mb-4 sm:mb-6 text-responsive-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Join thousands of users who have transformed their daily workflow with ABITALIB Super Utility.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}