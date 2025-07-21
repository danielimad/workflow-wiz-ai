import { useState } from "react";
import { MessageSquare, Mail, Phone, Globe, Zap, Settings, Plus, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: "communication" | "automation" | "crm" | "analytics";
  status: "connected" | "disconnected" | "pending";
  icon: any;
  color: string;
  features: string[];
  setupUrl?: string;
}

const integrations: Integration[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect WhatsApp to enable AI agents for customer communication",
    category: "communication",
    status: "connected",
    icon: MessageSquare,
    color: "bg-green-600",
    features: ["Two-way messaging", "Media support", "Business profiles"],
    setupUrl: "https://business.whatsapp.com"
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "SMS and voice communication platform for your AI agents",
    category: "communication", 
    status: "connected",
    icon: Phone,
    color: "bg-red-600",
    features: ["SMS messaging", "Voice calls", "Programmable communications"],
    setupUrl: "https://twilio.com"
  },
  {
    id: "smtp",
    name: "Email (SMTP)",
    description: "Connect your email system for automated responses",
    category: "communication",
    status: "disconnected",
    icon: Mail,
    color: "bg-blue-600",
    features: ["Automated emails", "Template system", "Email tracking"]
  },
  {
    id: "n8n",
    name: "n8n Automation",
    description: "Workflow automation platform for AI agent deployment",
    category: "automation",
    status: "pending",
    icon: Zap,
    color: "bg-purple-600",
    features: ["Workflow automation", "Custom integrations", "Trigger management"],
    setupUrl: "https://n8n.io"
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 5000+ apps for seamless automation",
    category: "automation",
    status: "disconnected",
    icon: Globe,
    color: "bg-orange-600",
    features: ["5000+ app integrations", "Multi-step workflows", "Real-time triggers"],
    setupUrl: "https://zapier.com"
  },
  {
    id: "webhook",
    name: "Custom Webhooks",
    description: "Connect any service using custom webhooks",
    category: "automation",
    status: "connected",
    icon: Globe,
    color: "bg-gray-600",
    features: ["Custom endpoints", "Real-time data sync", "Flexible integration"]
  }
];

export function IntegrationsManager() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [integrationsState, setIntegrationsState] = useState(integrations);

  const toggleIntegration = (id: string) => {
    setIntegrationsState(prev => prev.map(integration =>
      integration.id === id 
        ? { ...integration, status: integration.status === "connected" ? "disconnected" : "connected" as const }
        : integration
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "disconnected": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <Check className="w-3 h-3" />;
      case "pending": return <Settings className="w-3 h-3 animate-spin" />;
      case "disconnected": return <Plus className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredIntegrations = integrationsState.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || integration.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integrations</h2>
          <p className="text-muted-foreground">Connect external services to power your AI agents</p>
        </div>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Request Integration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrationsState.filter(i => i.status === "connected").length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{integrationsState.length}</p>
              </div>
              <Globe className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Setup</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {integrationsState.filter(i => i.status === "pending").length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${integration.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge className={`${getStatusColor(integration.status)} text-xs`}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-1 capitalize">{integration.status}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <Switch
                    checked={integration.status === "connected"}
                    onCheckedChange={() => toggleIntegration(integration.id)}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {integration.setupUrl && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={integration.setupUrl} target="_blank" rel="noopener noreferrer">
                      Setup Guide
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Setup Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup</CardTitle>
          <p className="text-sm text-muted-foreground">
            Get started with the most popular integrations for AI agents
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">WhatsApp Business API</h4>
              <p className="text-sm text-muted-foreground mb-3">Enable WhatsApp messaging for your AI agents</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="whatsapp-token" className="text-xs">Access Token</Label>
                </div>
                <Input id="whatsapp-token" placeholder="Enter your WhatsApp Business API token" />
                <Button size="sm" className="w-full">Connect WhatsApp</Button>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Email SMTP</h4>
              <p className="text-sm text-muted-foreground mb-3">Configure email automation</p>
              <div className="space-y-2">
                <Input placeholder="SMTP Server (e.g., smtp.gmail.com)" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Username" />
                  <Input placeholder="Password" type="password" />
                </div>
                <Button size="sm" className="w-full">Connect Email</Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}