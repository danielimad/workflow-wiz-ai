import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserData } from "@/components/auth/onboarding-form";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIManagerChatProps {
  userData: UserData;
  onAnalysisComplete?: (analysis: BusinessAnalysis) => void;
}

export interface BusinessAnalysis {
  departments: string[];
  services: string[];
  teamSize: number;
  workflows: Array<{
    name: string;
    steps: string[];
    department: string;
  }>;
  goals: string[];
  automationOpportunities: string[];
}

const INITIAL_QUESTIONS = [
  "What industry is your business in?",
  "How many employees do you have?",
  "What are your main services or products?",
  "What departments exist in your company?",
  "What are your biggest operational challenges?"
];

export function AIManagerChat({ userData, onAnalysisComplete }: AIManagerChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello ${userData.name}! I'm your AI Manager, and I'm here to understand ${userData.company} inside and out. I'll ask you a series of questions to map your business structure, identify your workflows, and find the best opportunities for AI automation.\n\nLet's start with the basics - what industry is your business in?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response with intelligent follow-up questions
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content, messages.length);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      setAnalysisProgress(Math.min(100, (messages.length / 10) * 100));
    }, 1500);
  };

  const generateAIResponse = (userInput: string, messageCount: number): string => {
    // This would integrate with OpenAI GPT-4 in a real implementation
    const responses = [
      "Excellent! Now tell me about your team structure - how many employees do you have and how are they organized into departments?",
      "That's very helpful! What are the main services or products that your company offers to customers?",
      "Great insights! Can you walk me through your typical customer journey - from first contact to completion?",
      "Perfect! What are the most time-consuming manual tasks that your team handles daily?",
      "Wonderful! Based on what you've shared, I can see several automation opportunities. What are your main business goals for the next 6-12 months?",
      `Thank you for all that information! I now have a comprehensive understanding of ${userData.company}. Let me analyze this and create your custom workflow dashboard and AI agents. This analysis will help me generate the perfect automation strategy for your business.`
    ];

    if (messageCount >= 12) {
      // Trigger analysis completion
      setTimeout(() => {
        const mockAnalysis: BusinessAnalysis = {
          departments: ["Sales", "Marketing", "Customer Service", "Operations"],
          services: ["Consulting", "Software Development", "Support"],
          teamSize: 15,
          workflows: [
            {
              name: "Lead Qualification",
              steps: ["Initial Contact", "Needs Assessment", "Proposal", "Follow-up"],
              department: "Sales"
            },
            {
              name: "Customer Onboarding",
              steps: ["Welcome Email", "Account Setup", "Training", "First Check-in"],
              department: "Customer Service"
            }
          ],
          goals: ["Increase efficiency", "Improve customer satisfaction", "Scale operations"],
          automationOpportunities: ["Lead qualification", "Customer support", "Email marketing"]
        };
        onAnalysisComplete?.(mockAnalysis);
      }, 2000);
    }

    return responses[Math.min(messageCount / 2, responses.length - 1)];
  };

  const handleQuickResponse = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-ai flex items-center justify-center animate-pulse-ai">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Manager Interview
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Understanding {userData.company}'s structure and needs
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              Analysis: {Math.round(analysisProgress)}%
            </Badge>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full gradient-ai flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 animate-fade-in ${
                    message.role === "user"
                      ? "gradient-primary text-primary-foreground ml-auto"
                      : "bg-card border shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 opacity-70 ${
                    message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full gradient-ai flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-card border rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          {messages.length < 6 && (
            <div className="px-6 py-3 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick responses:</p>
              <div className="flex flex-wrap gap-2">
                {INITIAL_QUESTIONS.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => handleQuickResponse(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t">
            <div className="flex gap-3">
              <Input
                placeholder="Type your response..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="gradient-primary shadow-ai"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
}