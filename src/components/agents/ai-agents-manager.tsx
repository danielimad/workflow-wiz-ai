import { useState } from "react";
import { Bot, Plus, Settings, Play, Pause, MoreHorizontal, MessageSquare, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BusinessAnalysis } from "@/components/ai-chat/ai-manager-chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AIAgent {
  id: string;
  name: string;
  type: "WhatsApp" | "Email" | "Voice" | "Web Chat";
  status: "active" | "inactive" | "training";
  department: string;
  description: string;
  performance: {
    conversations: number;
    satisfaction: number;
    responseTime: string;
  };
  icon: any;
  color: string;
}

interface AIAgentsManagerProps {
  analysis?: BusinessAnalysis;
}

export function AIAgentsManager({ analysis }: AIAgentsManagerProps) {
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: "1",
      name: "Sales Assistant",
      type: "WhatsApp",
      status: "active",
      department: "Sales",
      description: "Qualifies leads and schedules appointments automatically",
      performance: {
        conversations: 247,
        satisfaction: 4.8,
        responseTime: "< 30s"
      },
      icon: MessageSquare,
      color: "bg-green-500"
    },
    {
      id: "2", 
      name: "Support Bot",
      type: "Email",
      status: "active",
      department: "Customer Service",
      description: "Handles common support queries and escalates complex issues",
      performance: {
        conversations: 156,
        satisfaction: 4.6,
        responseTime: "< 2m"
      },
      icon: Mail,
      color: "bg-blue-500"
    },
    {
      id: "3",
      name: "HR Helper",
      type: "Web Chat",
      status: "training",
      department: "HR",
      description: "Assists employees with HR policies and procedures",
      performance: {
        conversations: 0,
        satisfaction: 0,
        responseTime: "N/A"
      },
      icon: Bot,
      color: "bg-purple-500"
    }
  ]);

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === "active" ? "inactive" : "active" as const }
        : agent
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-gray-500";
      case "training": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Agents</h2>
          <p className="text-muted-foreground">Manage your automated AI assistants</p>
        </div>
        <Button className="gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create New Agent
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold">{agents.length}</p>
              </div>
              <Bot className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">{agents.filter(a => a.status === "active").length}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Conversations</p>
                <p className="text-2xl font-bold">{agents.reduce((acc, agent) => acc + agent.performance.conversations, 0)}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Satisfaction</p>
                <p className="text-2xl font-bold">4.7</p>
              </div>
              <div className="text-yellow-500 text-lg">★</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card key={agent.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {agent.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <span className="text-xs text-muted-foreground capitalize">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleAgentStatus(agent.id)}>
                        {agent.status === "active" ? (
                          <><Pause className="w-4 h-4 mr-2" />Pause</>
                        ) : (
                          <><Play className="w-4 h-4 mr-2" />Activate</>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{agent.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold">{agent.performance.conversations}</p>
                    <p className="text-xs text-muted-foreground">Conversations</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{agent.performance.satisfaction}</p>
                    <p className="text-xs text-muted-foreground">★ Rating</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{agent.performance.responseTime}</p>
                    <p className="text-xs text-muted-foreground">Response</p>
                  </div>
                </div>
                
                <Badge className={`w-full justify-center ${agent.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : agent.status === "training" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}>
                  {agent.department}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}