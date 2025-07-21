import { useState } from "react";
import { ArrowRight, User, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OnboardingFormProps {
  onComplete: (userData: UserData) => void;
}

export interface UserData {
  name: string;
  email: string;
  company: string;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    company: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(userData);
    setIsLoading(false);
  };

  const isValid = userData.name && userData.email && userData.company;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-subtle">
      <Card className="w-full max-w-md shadow-ai animate-slide-up">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
            <Building className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Welcome to AI Manager</CardTitle>
          <CardDescription>
            Let's get started by setting up your business profile
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Smith"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Name
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Acme Corporation"
                value={userData.company}
                onChange={(e) => setUserData(prev => ({ ...prev, company: e.target.value }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-primary shadow-ai hover:shadow-lg transition-all duration-300"
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Setting up..." : "Continue to AI Manager"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}