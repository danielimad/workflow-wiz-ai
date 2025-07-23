import { useState, useEffect } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { LandingSections } from "@/components/landing/landing-sections";
import { OnboardingForm, UserData } from "@/components/auth/onboarding-form";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AIManagerChat, BusinessAnalysis } from "@/components/ai-chat/ai-manager-chat";
import { WorkflowVisualization } from "@/components/workflow/workflow-visualization";
import { AIAgentsManager } from "@/components/agents/ai-agents-manager";
import { IntegrationsManager } from "@/components/integrations/integrations-manager";
import { AITestingLab } from "@/components/testing/ai-testing-lab";
import { MindMap } from "@/components/dashboard/mind-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap, MessageSquare, TestTube } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeSection, setActiveSection] = useState("chat");
  const [businessAnalysis, setBusinessAnalysis] = useState<BusinessAnalysis | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setShowOnboarding(false);
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
        return <AIAgentsManager analysis={businessAnalysis} />;

      case "testing":
        return <AITestingLab />;

      case "integrations":
        return <IntegrationsManager />;

      case "mindmap":
        return <MindMap onNavigate={setActiveSection} />;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading AI Manager...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen">
          <Header onGetStarted={handleGetStarted} />
          <HeroSection onGetStarted={handleGetStarted} />
          <LandingSections onGetStarted={handleGetStarted} />
          <Footer />
        </div>
        {showOnboarding && (
          <OnboardingForm onComplete={handleOnboardingComplete} />
        )}
      </>
    );
  }

  if (user && userData) {
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

  return <OnboardingForm onComplete={handleOnboardingComplete} />;
};

export default Index;
