import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Mail, Lock, User, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserData {
  name: string;
  email: string;
  company: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (userData: UserData) => void;
  defaultTab?: "signup" | "signin";
}

export function AuthModal({ isOpen, onClose, onComplete, defaultTab = "signup" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sign up form data
  const [signupData, setSignupData] = useState<UserData>({
    name: "",
    email: "",
    company: ""
  });
  
  // Sign in form data
  const [signinData, setSigninData] = useState({
    email: "",
    password: ""
  });
  
  const [signupPassword, setSignupPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.company || !signupPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/?confirmed=true`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: signupData.name,
            company: signupData.company
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user && !data.session) {
        // User created but needs email confirmation
        toast.success("Please check your email to confirm your account");
        onClose();
      } else if (data.user && data.session) {
        // User created and auto-confirmed
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name: signupData.name,
            email: signupData.email,
            company: signupData.company
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        toast.success("Account created successfully!");
        onComplete(signupData);
        onClose();
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signinData.email || !signinData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signinData.email,
        password: signinData.password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user && data.session) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError || !profile) {
          toast.error("Failed to load profile");
          return;
        }

        toast.success("Signed in successfully!");
        onComplete({
          name: profile.name,
          email: profile.email,
          company: profile.company
        });
        onClose();
      }
    } catch (error) {
      console.error('Signin error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!signinData.email) {
      toast.error("Please enter your email address first");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(signinData.email, {
        redirectTo: `${window.location.origin}/?reset=true`
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password reset email sent!");
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-12 h-12 rounded-xl gradient-primary mx-auto mb-4 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold">Welcome to AI Manager</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signup" | "signin")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Enter your company"
                    className="pl-10"
                    value={signupData.company}
                    onChange={(e) => setSignupData(prev => ({ ...prev, company: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary shadow-ai"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={signinData.email}
                    onChange={(e) => setSigninData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={signinData.password}
                    onChange={(e) => setSigninData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary shadow-ai"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline"
                  disabled={isLoading}
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}