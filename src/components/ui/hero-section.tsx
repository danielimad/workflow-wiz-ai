import { ArrowRight, Bot, Sparkles, Zap } from "lucide-react";
import { Button } from "./button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-subtle opacity-50" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="absolute top-32 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
      </div>
      <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
          <Zap className="w-7 h-7 text-success" />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Meet Your
            <span className="text-gradient-ai block mt-2">AI Manager</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your business with intelligent automation. Our AI Manager analyzes your operations and creates custom AI agents to streamline your workflows.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="gradient-primary shadow-ai px-8 py-6 text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={onGetStarted}
            >
              Start Your AI Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-gradient-ai px-8 py-6 text-lg font-semibold hover:bg-card-hover transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Intelligent Analysis</h3>
              <p className="text-sm text-muted-foreground">AI understands your business structure through conversation</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Auto-Generated Agents</h3>
              <p className="text-sm text-muted-foreground">Custom AI agents built for your specific workflows</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Seamless Integration</h3>
              <p className="text-sm text-muted-foreground">Works with WhatsApp, Email, and your existing tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}