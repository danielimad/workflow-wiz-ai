import { useState } from "react";
import { ArrowRight, CheckCircle, Star, Users, Zap, Bot, MessageSquare, BarChart3, Shield, Globe, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LandingSectionsProps {
  onGetStarted: () => void;
}

export function LandingSections({ onGetStarted }: LandingSectionsProps) {
  const [activeUseCase, setActiveUseCase] = useState(0);

  const useCases = [
    {
      title: "E-commerce Business",
      description: "Automate customer support, order processing, and inventory management",
      benefits: ["24/7 customer support", "Order tracking automation", "Inventory alerts"],
      industry: "Retail"
    },
    {
      title: "Service-Based Company", 
      description: "Streamline appointment booking, client communication, and follow-ups",
      benefits: ["Automated scheduling", "Client reminders", "Service feedback collection"],
      industry: "Professional Services"
    },
    {
      title: "Healthcare Practice",
      description: "Manage patient communications, appointment reminders, and basic inquiries",
      benefits: ["Appointment confirmations", "Prescription reminders", "FAQ automation"],
      industry: "Healthcare"
    },
    {
      title: "Real Estate Agency",
      description: "Qualify leads, schedule viewings, and nurture client relationships",
      benefits: ["Lead qualification", "Viewing scheduling", "Property updates"],
      industry: "Real Estate"
    }
  ];

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Analysis",
      description: "Our AI Manager conducts intelligent interviews to understand your business structure, processes, and pain points in detail."
    },
    {
      icon: Zap,
      title: "Automated Agent Creation",
      description: "Based on your business analysis, we automatically generate custom AI agents tailored to your specific workflows and needs."
    },
    {
      icon: MessageSquare,
      title: "Multi-Channel Integration",
      description: "Deploy your AI agents across WhatsApp, Email, Voice calls, and web chat for seamless customer communication."
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track agent performance, conversation metrics, and business impact with comprehensive dashboards and reports."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Built with enterprise-grade security, data encryption, and compliance standards to protect your business data."
    },
    {
      icon: Globe,
      title: "Scalable Architecture",
      description: "Grow from small business to enterprise with our scalable infrastructure that adapts to your expanding needs."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechFlow Solutions",
      role: "CEO",
      content: "The AI Manager completely transformed how we handle customer inquiries. Our response time improved by 90% and customer satisfaction is at an all-time high.",
      rating: 5,
      industry: "Technology"
    },
    {
      name: "Michael Chen",
      company: "GreenLeaf Consulting",
      role: "Operations Director", 
      content: "Setting up AI agents was so simple. The system understood our business immediately and created perfect automation workflows. It's like having a tech team without the overhead.",
      rating: 5,
      industry: "Consulting"
    },
    {
      name: "Lisa Rodriguez",
      company: "Urban Dental Care",
      role: "Practice Manager",
      content: "Our appointment booking is now completely automated. Patients love the instant responses, and we've reduced no-shows by 60%. This technology is a game-changer.",
      rating: 5,
      industry: "Healthcare"
    }
  ];

  const stats = [
    { label: "Average Response Time Reduction", value: "85%", icon: Clock },
    { label: "Customer Satisfaction Increase", value: "92%", icon: TrendingUp },
    { label: "Operational Cost Savings", value: "67%", icon: BarChart3 },
    { label: "Businesses Automated", value: "1,200+", icon: Users }
  ];

  return (
    <div className="space-y-20 py-20">
      {/* Problem & Solution Section */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">The Challenge</Badge>
          <h2 className="text-4xl font-bold mb-6">
            Most Businesses Struggle with <span className="text-gradient-ai">Manual Processes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Customer inquiries pile up, leads go unqualified, and your team spends hours on repetitive tasks instead of growing the business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Common Business Pain Points</h3>
            <div className="space-y-4">
              {[
                "Delayed response to customer inquiries",
                "Manual lead qualification and follow-up",
                "Repetitive administrative tasks",
                "Limited availability outside business hours", 
                "Difficulty scaling customer support",
                "Inconsistent communication quality"
              ].map((pain, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  <span className="text-muted-foreground">{pain}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gradient-ai">Our AI Solution</h3>
            <div className="space-y-4">
              {[
                "Instant 24/7 customer response automation",
                "AI-powered lead qualification and nurturing",
                "Automated workflow execution",
                "Round-the-clock business availability",
                "Unlimited scaling without additional staff",
                "Consistent, professional communication"
              ].map((solution, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="font-medium">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">Use Cases</Badge>
          <h2 className="text-4xl font-bold mb-6">
            Perfect for <span className="text-gradient-ai">Any Industry</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See how businesses like yours are transforming with AI automation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {useCases.map((useCase, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-200 ${
                activeUseCase === index ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setActiveUseCase(index)}
            >
              <CardContent className="p-4 text-center">
                <Badge variant="outline" className="mb-2">{useCase.industry}</Badge>
                <h4 className="font-semibold">{useCase.title}</h4>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4">{useCases[activeUseCase].industry}</Badge>
              <h3 className="text-2xl font-bold mb-4">{useCases[activeUseCase].title}</h3>
              <p className="text-muted-foreground mb-6">{useCases[activeUseCase].description}</p>
              <div className="space-y-3">
                {useCases[activeUseCase].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-subtle rounded-xl p-6 text-center">
              <Bot className="w-16 h-16 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Your AI Agent</h4>
              <p className="text-sm text-muted-foreground">
                Custom-built for {useCases[activeUseCase].industry.toLowerCase()} workflows
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">Features</Badge>
          <h2 className="text-4xl font-bold mb-6">
            Everything You Need to <span className="text-gradient-ai">Automate Your Business</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-subtle py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Proven Results</h2>
            <p className="text-xl text-muted-foreground">Real impact for businesses using AI automation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-gradient-ai mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">Testimonials</Badge>
          <h2 className="text-4xl font-bold mb-6">
            Loved by <span className="text-gradient-ai">Business Owners</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                <Badge variant="outline" className="mt-2">{testimonial.industry}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-subtle rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business with <span className="text-gradient-ai">AI?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using AI agents to automate workflows, improve customer satisfaction, and scale operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="gradient-primary shadow-ai px-8 py-6 text-lg font-semibold"
              onClick={onGetStarted}
            >
              Start Your AI Transformation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg font-semibold"
            >
              Schedule a Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            Free setup • No technical knowledge required • 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
}