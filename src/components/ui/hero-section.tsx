import { ArrowRight, Bot, Sparkles, Zap } from "lucide-react";
import { Button } from "./button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-subtle opacity-60" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating elements with enhanced animations */}
      <div className="absolute top-32 left-10 animate-float hover:scale-110 transition-transform cursor-pointer">
        <div className="w-16 h-16 rounded-full gradient-primary shadow-glow flex items-center justify-center">
          <Bot className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>
      <div className="absolute top-44 right-20 animate-float hover:scale-110 transition-transform cursor-pointer" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 rounded-full bg-accent/20 shadow-elegant flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-accent animate-pulse" />
        </div>
      </div>
      <div className="absolute bottom-32 left-20 animate-float hover:scale-110 transition-transform cursor-pointer" style={{ animationDelay: '2s' }}>
        <div className="w-14 h-14 rounded-full bg-success/20 shadow-elegant flex items-center justify-center">
          <Zap className="w-7 h-7 text-success" />
        </div>
      </div>
      
      {/* Additional floating elements for richness */}
      <div className="absolute top-1/4 right-1/4 animate-float" style={{ animationDelay: '3s' }}>
        <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
      </div>
      <div className="absolute bottom-1/4 right-1/3 animate-float" style={{ animationDelay: '4s' }}>
        <div className="w-6 h-6 rounded-full bg-accent/10 animate-bounce" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="animate-fade-in">
          {/* Futuristic badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse-ai">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-sm font-medium text-primary">Next-Gen Business Automation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-primary">
            Meet Your
            <span className="text-gradient-ai block mt-2 animate-shimmer">AI Manager</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your business with <span className="text-primary font-semibold">intelligent automation</span>. 
            Our AI Manager conducts deep business analysis and creates <span className="text-accent font-semibold">custom AI agents</span> 
            tailored to your specific workflows and industry needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="gradient-primary shadow-glow px-8 py-6 text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover-scale"
              onClick={onGetStarted}
            >
              Start Your AI Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/30 px-8 py-6 text-lg font-semibold hover:bg-primary/5 transition-all duration-300 hover:border-primary/50"
            >
              Watch Demo
              <div className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>No coding required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>5-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group cursor-pointer hover-scale">
              <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
                <Bot className="w-10 h-10 text-primary-foreground group-hover:animate-pulse" />
              </div>
              <h3 className="font-semibold mb-2 text-lg">Intelligent Analysis</h3>
              <p className="text-muted-foreground">Advanced AI conducts deep business interviews to understand your unique operations and challenges</p>
            </div>
            
            <div className="text-center group cursor-pointer hover-scale">
              <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
                <Zap className="w-10 h-10 text-primary-foreground group-hover:animate-bounce" />
              </div>
              <h3 className="font-semibold mb-2 text-lg">Auto-Generated Agents</h3>
              <p className="text-muted-foreground">Custom AI agents automatically created and optimized for your specific business workflows and industry</p>
            </div>
            
            <div className="text-center group cursor-pointer hover-scale">
              <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-10 h-10 text-primary-foreground group-hover:animate-spin" />
              </div>
              <h3 className="font-semibold mb-2 text-lg">Omnichannel Deployment</h3>
              <p className="text-muted-foreground">Deploy across WhatsApp, Email, Voice, Web Chat, and integrate with your existing business tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}