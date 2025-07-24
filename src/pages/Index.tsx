import { useState, useEffect } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { LandingSections } from "@/components/landing/landing-sections";
import { AuthModal, UserData } from "@/components/auth/auth-modal";
import { toast } from "sonner";
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
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeSection, setActiveSection] = useState("chat");
  const [businessAnalysis, setBusinessAnalysis] = useState<BusinessAnalysis | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signup" | "signin">("signup");

  // Handle email confirmation and password reset redirects
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('confirmed') === 'true') {
      // Handle email confirmation - user will be auto-signed in via auth state change
      toast.success("Email confirmed! Welcome to AI Manager!");
      // Clean up URL
      window.history.replaceState({}, document.title, '/');
    }
    
    if (urlParams.get('reset') === 'true') {
      toast.info("Please check your email for password reset instructions");
      // Clean up URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  // Load user profile when user exists but userData doesn't
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && !userData) {
        try {
          const { data: profile, error } = await supabase.auth.getUser();
          if (profile.user && !error) {
            // Try to get profile from database
            const { data: dbProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', profile.user.id)
              .single();
            
            if (dbProfile) {
              setUserData({
                name: dbProfile.name,
                email: dbProfile.email,
                company: dbProfile.company
              });
            }
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    loadUserProfile();
  }, [user, userData]);

  const handleGetStarted = () => {
    setAuthModalTab("signup");
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthModalTab("signin");
    setShowAuthModal(true);
  };

  const handleAuthComplete = (data: UserData) => {
    setUserData(data);
    setShowAuthModal(false);
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
          <Header onGetStarted={handleGetStarted} onSignIn={handleSignIn} />
          <HeroSection onGetStarted={handleGetStarted} />
          <LandingSections onGetStarted={handleGetStarted} />
          <Footer />
        </div>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onComplete={handleAuthComplete}
          defaultTab={authModalTab}
        />
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

  return (
    <AuthModal 
      isOpen={true}
      onClose={() => {}}
      onComplete={handleAuthComplete}
      defaultTab="signup"
    />
  );
};

export default Index;
