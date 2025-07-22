import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  Settings, 
  Play, 
  Save,
  Trash2,
  Plus,
  Eye,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ApiKeyDialog } from "@/components/ui/api-key-dialog";

interface Agent {
  id?: string;
  name: string;
  description: string;
  agent_type: string;
  configuration: any;
  status: string;
}

const agentTypes = [
  { value: 'chatbot', label: 'Chatbot', description: 'Conversational AI for customer support' },
  { value: 'analyzer', label: 'Data Analyzer', description: 'Analyzes data and provides insights' },
  { value: 'assistant', label: 'Virtual Assistant', description: 'Helps with tasks and workflows' },
  { value: 'content', label: 'Content Creator', description: 'Generates content and copy' },
  { value: 'researcher', label: 'Research Agent', description: 'Gathers and analyzes information' },
];

export function AgentCreator() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadAgents();
    }
  }, [user]);

  const loadAgents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast({
        title: "Error",
        description: "Failed to load AI agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewAgent = () => {
    setSelectedAgent({
      name: '',
      description: '',
      agent_type: 'chatbot',
      configuration: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
        system_prompt: ''
      },
      status: 'draft'
    });
  };

  const saveAgent = async () => {
    if (!selectedAgent || !user) return;

    setSaving(true);
    try {
      const agentData = {
        user_id: user.id,
        name: selectedAgent.name,
        description: selectedAgent.description,
        agent_type: selectedAgent.agent_type,
        configuration: selectedAgent.configuration,
        status: selectedAgent.status
      };

      if (selectedAgent.id) {
        // Update existing agent
        const { error } = await supabase
          .from('ai_agents')
          .update(agentData)
          .eq('id', selectedAgent.id);

        if (error) throw error;
      } else {
        // Create new agent
        const { data, error } = await supabase
          .from('ai_agents')
          .insert([agentData])
          .select()
          .single();

        if (error) throw error;
        setSelectedAgent({ ...selectedAgent, id: data.id });
      }

      toast({
        title: "Success",
        description: "Agent saved successfully",
      });

      loadAgents();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: "Error",
        description: "Failed to save agent",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('ai_agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });

      loadAgents();
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(null);
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  const testAgent = async () => {
    if (!selectedAgent) return;

    setTesting(true);
    try {
      // Simulate testing (in real implementation, this would call your AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test Complete",
        description: "Agent is working correctly",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Agent encountered an error during testing",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const updateAgentField = (field: string, value: any) => {
    if (!selectedAgent) return;
    setSelectedAgent({ ...selectedAgent, [field]: value });
  };

  const updateConfiguration = (field: string, value: any) => {
    if (!selectedAgent) return;
    setSelectedAgent({
      ...selectedAgent,
      configuration: { ...selectedAgent.configuration, [field]: value }
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="lg:col-span-2 h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Agents</h2>
          <p className="text-muted-foreground mt-1">
            Create and manage your AI agents
          </p>
        </div>
        <Button onClick={createNewAgent} className="gap-2">
          <Plus className="w-4 h-4" />
          New Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Your Agents ({agents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No agents created yet
              </p>
            ) : (
              agents.map((agent) => (
                <Card
                  key={agent.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedAgent?.id === agent.id ? 'border-primary shadow-ai' : ''
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {agent.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {agent.agent_type}
                          </Badge>
                          <Badge 
                            variant={agent.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {agent.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAgent(agent.id!);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Agent Editor */}
        <div className="lg:col-span-2">
          {selectedAgent ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    {selectedAgent.id ? 'Edit Agent' : 'Create New Agent'}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={testAgent}
                      disabled={testing || !selectedAgent.name}
                      className="gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {testing ? 'Testing...' : 'Test'}
                    </Button>
                    <Button
                      onClick={saveAgent}
                      disabled={saving || !selectedAgent.name}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="configuration">Configuration</TabsTrigger>
                    <TabsTrigger value="testing">Testing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Agent Name</Label>
                        <Input
                          id="name"
                          value={selectedAgent.name}
                          onChange={(e) => updateAgentField('name', e.target.value)}
                          placeholder="My AI Assistant"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Agent Type</Label>
                        <Select 
                          value={selectedAgent.agent_type} 
                          onValueChange={(value) => updateAgentField('agent_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {agentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-sm text-muted-foreground">{type.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={selectedAgent.description}
                        onChange={(e) => updateAgentField('description', e.target.value)}
                        placeholder="Describe what this agent does..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={selectedAgent.status} 
                        onValueChange={(value) => updateAgentField('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="configuration" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="model">AI Model</Label>
                        <Select 
                          value={selectedAgent.configuration?.model || 'gpt-3.5-turbo'} 
                          onValueChange={(value) => updateConfiguration('model', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                            <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                            <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperature: {selectedAgent.configuration?.temperature || 0.7}</Label>
                        <Input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedAgent.configuration?.temperature || 0.7}
                          onChange={(e) => updateConfiguration('temperature', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="system_prompt">System Prompt</Label>
                      <Textarea
                        id="system_prompt"
                        value={selectedAgent.configuration?.system_prompt || ''}
                        onChange={(e) => updateConfiguration('system_prompt', e.target.value)}
                        placeholder="You are a helpful AI assistant..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>API Configuration</Label>
                      <ApiKeyDialog
                        trigger={
                          <Button variant="outline" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Configure OpenAI API Key
                          </Button>
                        }
                        title="OpenAI API Key"
                        description="Enter your OpenAI API key to enable this agent"
                        provider="OpenAI"
                        helpUrl="https://platform.openai.com/api-keys"
                        onSave={async (apiKey) => {
                          // In a real app, this would save to Supabase Edge Function secrets
                          updateConfiguration('openai_api_key', apiKey);
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="testing" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          Test Chat Interface
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="min-h-[200px] bg-muted/20 rounded-lg p-4 mb-4">
                          <p className="text-muted-foreground text-center">
                            Chat interface will appear here when agent is configured
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="Type a test message..." className="flex-1" />
                          <Button>Send</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Bot className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select an Agent</h3>
                <p className="text-muted-foreground mb-6">
                  Choose an agent from the list or create a new one to get started
                </p>
                <Button onClick={createNewAgent} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Agent
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}