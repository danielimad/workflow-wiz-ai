import { ReactNode, useState } from "react";
import { Bot, Menu, Settings, LogOut, Brain, Workflow, MessageSquare, TestTube, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserData } from "@/components/auth/onboarding-form";

interface DashboardLayoutProps {
  children: ReactNode;
  userData: UserData;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const navigationItems = [
  { id: "chat", label: "AI Manager", icon: Brain, description: "Talk to your AI Manager" },
  { id: "workflows", label: "Workflows", icon: Workflow, description: "View and edit your business workflows" },
  { id: "agents", label: "AI Agents", icon: Bot, description: "Manage your AI agents" },
  { id: "testing", label: "Testing", icon: TestTube, description: "Test your AI agents" },
  { id: "integrations", label: "Integrations", icon: MessageSquare, description: "Connect external services" },
  { id: "mindmap", label: "Mind Map", icon: Network, description: "Visual overview of your AI ecosystem" },
];

export function DashboardLayout({ children, userData, activeSection = "chat", onSectionChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">AI Manager</h1>
                <p className="text-sm text-muted-foreground">{userData.company}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-medium">{userData.name}</p>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} lg:w-80 transition-all duration-300 overflow-hidden border-r bg-card/50 backdrop-blur-sm`}>
          <div className="p-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Card 
                  key={item.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:bg-card-hover border-gradient-ai ${
                    isActive ? 'bg-primary/10 border-primary shadow-ai' : 'hover:shadow-md'
                  }`}
                  onClick={() => onSectionChange?.(item.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'gradient-primary' : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {item.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}