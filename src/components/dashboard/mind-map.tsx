import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Workflow, 
  MessageSquare, 
  ArrowRight, 
  Settings,
  Play,
  Eye,
  Plus,
  Network
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface MindMapNode {
  id: string;
  type: 'agent' | 'workflow' | 'integration';
  name: string;
  status: string;
  description?: string;
  connections: string[];
  position: { x: number; y: number };
}

interface MindMapProps {
  onNavigate: (section: string, itemId?: string) => void;
}

export function MindMap({ onNavigate }: MindMapProps) {
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadMindMapData();
    }
  }, [user]);

  const loadMindMapData = async () => {
    if (!user) return;

    try {
      // Load agents
      const { data: agents } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', user.id);

      // Load workflows
      const { data: workflows } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', user.id);

      // Load integrations
      const { data: integrations } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id);

      const mindMapNodes: MindMapNode[] = [];

      // Add agents
      agents?.forEach((agent, index) => {
        mindMapNodes.push({
          id: agent.id,
          type: 'agent',
          name: agent.name,
          status: agent.status,
          description: agent.description,
          connections: [], // We'll calculate connections based on workflows
          position: { x: 100, y: 100 + index * 120 }
        });
      });

      // Add workflows
      workflows?.forEach((workflow, index) => {
        mindMapNodes.push({
          id: workflow.id,
          type: 'workflow',
          name: workflow.name,
          status: workflow.status,
          description: workflow.description,
          connections: [],
          position: { x: 400, y: 100 + index * 120 }
        });
      });

      // Add integrations
      integrations?.forEach((integration, index) => {
        mindMapNodes.push({
          id: integration.id,
          type: 'integration',
          name: integration.name,
          status: integration.status,
          connections: [],
          position: { x: 700, y: 100 + index * 120 }
        });
      });

      setNodes(mindMapNodes);
    } catch (error) {
      console.error('Error loading mind map data:', error);
      toast({
        title: "Error",
        description: "Failed to load mind map data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'agent': return Bot;
      case 'workflow': return Workflow;
      case 'integration': return MessageSquare;
      default: return Network;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleNodeClick = (node: MindMapNode) => {
    const sectionMap = {
      agent: 'agents',
      workflow: 'workflows',
      integration: 'integrations'
    };
    onNavigate(sectionMap[node.type], node.id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI System Mind Map</h2>
          <p className="text-muted-foreground mt-1">
            Visual overview of your AI agents, workflows, and integrations
          </p>
        </div>
        <Button 
          onClick={loadMindMapData}
          variant="outline"
        >
          Refresh
        </Button>
      </div>

      {nodes.length === 0 ? (
        <Card className="p-12 text-center">
          <Network className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Items Created Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start building your AI ecosystem by creating agents, workflows, and integrations
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => onNavigate('agents')} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Agent
            </Button>
            <Button onClick={() => onNavigate('workflows')} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Workflow
            </Button>
          </div>
        </Card>
      ) : (
        <div className="relative min-h-[600px] bg-muted/20 rounded-lg p-8 overflow-auto">
          {/* Node Categories */}
          <div className="grid grid-cols-3 gap-8">
            {/* AI Agents Column */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Agents
                </h3>
                <div className="h-px bg-border"></div>
              </div>
              {nodes.filter(n => n.type === 'agent').map(node => {
                const Icon = getNodeIcon(node.type);
                return (
                  <Card 
                    key={node.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border-gradient-ai"
                    onClick={() => handleNodeClick(node)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{node.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {node.description || 'No description'}
                          </p>
                          <Badge 
                            variant={getStatusColor(node.status) as any}
                            className="mt-2"
                          >
                            {node.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Workflows Column */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
                  <Workflow className="w-5 h-5 text-accent" />
                  Workflows
                </h3>
                <div className="h-px bg-border"></div>
              </div>
              {nodes.filter(n => n.type === 'workflow').map(node => {
                const Icon = getNodeIcon(node.type);
                return (
                  <Card 
                    key={node.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => handleNodeClick(node)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{node.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {node.description || 'No description'}
                          </p>
                          <Badge 
                            variant={getStatusColor(node.status) as any}
                            className="mt-2"
                          >
                            {node.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Integrations Column */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5 text-success" />
                  Integrations
                </h3>
                <div className="h-px bg-border"></div>
              </div>
              {nodes.filter(n => n.type === 'integration').map(node => {
                const Icon = getNodeIcon(node.type);
                return (
                  <Card 
                    key={node.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => handleNodeClick(node)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{node.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {node.description || 'No description'}
                          </p>
                          <Badge 
                            variant={getStatusColor(node.status) as any}
                            className="mt-2"
                          >
                            {node.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Connection Lines (visual representation) */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              {/* Example connection lines between nodes */}
              {nodes.filter(n => n.type === 'agent').map((agentNode, index) => {
                const workflowNodes = nodes.filter(n => n.type === 'workflow');
                return workflowNodes.map((workflowNode, wIndex) => (
                  <line
                    key={`${agentNode.id}-${workflowNode.id}`}
                    x1="33%"
                    y1={`${150 + index * 120}px`}
                    x2="66%"
                    y2={`${150 + wIndex * 120}px`}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.3"
                  />
                ));
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('agents')}>
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-medium">Manage Agents</h4>
              <p className="text-sm text-muted-foreground">Create and configure AI agents</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('workflows')}>
          <div className="flex items-center gap-3">
            <Workflow className="w-8 h-8 text-accent" />
            <div>
              <h4 className="font-medium">Design Workflows</h4>
              <p className="text-sm text-muted-foreground">Build automated processes</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('integrations')}>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-success" />
            <div>
              <h4 className="font-medium">Add Integrations</h4>
              <p className="text-sm text-muted-foreground">Connect external services</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}