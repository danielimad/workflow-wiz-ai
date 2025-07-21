import { useState } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { OnboardingForm, UserData } from "@/components/auth/onboarding-form";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AIManagerChat, BusinessAnalysis } from "@/components/ai-chat/ai-manager-chat";
import { WorkflowVisualization } from "@/components/workflow/workflow-visualization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap, MessageSquare, TestTube } from "lucide-react";

type AppState = "landing" | "onboarding" | "dashboard";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeSection, setActiveSection] = useState("chat");
  const [businessAnalysis, setBusinessAnalysis] = useState<BusinessAnalysis | null>(null);

  const handleGetStarted = () => {
    setAppState("onboarding");
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setAppState("dashboard");
  };

  const handleAnalysisComplete = (analysis: BusinessAnalysis) => {
    setBusinessAnalysis(analysis);
    setActiveSection("workflows");
  };

  const handleCreateAgents = () => {
    setActiveSection("agents");
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case "chat":
        return (
          <div className="h-full p-6">
            <Card className="h-full shadow-ai">
              <AIManagerChat 
                userData={userData!} 
                onAnalysisComplete={handleAnalysisComplete}
              />
            </Card>
          </div>
        );

      case "workflows":
        return businessAnalysis ? (
          <WorkflowVisualization 
            analysis={businessAnalysis} 
            onCreateAgents={handleCreateAgents}
          />
        ) : (
          <div className="p-6">
            <Card className="shadow-ai">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Complete AI Analysis First</h3>
                <p className="text-muted-foreground">
                  Please complete the AI Manager interview to generate your workflows
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "agents":
        return (
          <div className="p-6">
            <Card className="shadow-ai">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Agents Coming Soon</h3>
                <p className="text-muted-foreground">
                  Based on your workflow analysis, we'll generate custom AI agents for automation
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "testing":
        return (
          <div className="p-6">
            <Card className="shadow-ai">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Testing Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 mx-auto mb-4 flex items-center justify-center">
                  <TestTube className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Agent Testing Lab</h3>
                <p className="text-muted-foreground">
                  Test your AI agents in realistic scenarios before deployment
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <Card className="shadow-ai">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Feature In Development</h3>
                <p className="text-muted-foreground">This feature is coming soon!</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (appState === "landing") {
    return <HeroSection onGetStarted={handleGetStarted} />;
  }

  if (appState === "onboarding") {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  if (appState === "dashboard" && userData) {
    return (
      <DashboardLayout 
        userData={userData} 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        {renderDashboardContent()}
      </DashboardLayout>
    );
  }

  return null;
};

export default Index;
