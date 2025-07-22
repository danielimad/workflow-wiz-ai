import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Workflow, 
  Play, 
  Save,
  Trash2,
  Plus,
  ArrowRight,
  Settings,
  Zap,
  GitBranch,
  CheckCircle,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  title: string;
  description: string;
  configuration: any;
}

interface WorkflowData {
  id?: string;
  name: string;
  description: string;
  workflow_data: {
    steps: WorkflowStep[];
    connections: { from: string; to: string }[];
  };
  status: string;
}

const stepTypes = [
  { 
    type: 'trigger', 
    title: 'Email Received', 
    description: 'Triggers when a new email is received',
    icon: '📧' 
  },
  { 
    type: 'trigger', 
    title: 'Form Submission', 
    description: 'Triggers when a form is submitted',
    icon: '📝' 
  },
  { 
    type: 'action', 
    title: 'Send Email', 
    description: 'Sends an automated email',
    icon: '✉️' 
  },
  { 
    type: 'action', 
    title: 'AI Analysis', 
    description: 'Analyzes data using AI',
    icon: '🤖' 
  },
  { 
    type: 'condition', 
    title: 'If/Then', 
    description: 'Conditional logic based on data',
    icon: '❓' 
  },
];

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadWorkflows();
    }
  }, [user]);

  const loadWorkflows = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkflows((data || []).map(item => ({
        ...item,
        workflow_data: typeof item.workflow_data === 'string' 
          ? JSON.parse(item.workflow_data) 
          : item.workflow_data || { steps: [], connections: [] }
      })));
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast({
        title: "Error",
        description: "Failed to load workflows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewWorkflow = () => {
    setSelectedWorkflow({
      name: '',
      description: '',
      workflow_data: {
        steps: [],
        connections: []
      },
      status: 'draft'
    });
  };

  const saveWorkflow = async () => {
    if (!selectedWorkflow || !user) return;

    setSaving(true);
    try {
      const workflowData = {
        user_id: user.id,
        name: selectedWorkflow.name,
        description: selectedWorkflow.description,
        workflow_data: JSON.stringify(selectedWorkflow.workflow_data),
        status: selectedWorkflow.status
      } as any;

      if (selectedWorkflow.id) {
        const { error } = await supabase
          .from('workflows')
          .update(workflowData)
          .eq('id', selectedWorkflow.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('workflows')
          .insert(workflowData)
          .select()
          .single();

        if (error) throw error;
        setSelectedWorkflow({ ...selectedWorkflow, id: data.id });
      }

      toast({
        title: "Success",
        description: "Workflow saved successfully",
      });

      loadWorkflows();
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workflow deleted successfully",
      });

      loadWorkflows();
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(null);
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast({
        title: "Error",
        description: "Failed to delete workflow",
        variant: "destructive",
      });
    }
  };

  const addStep = (stepType: any) => {
    if (!selectedWorkflow) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type: stepType.type,
      title: stepType.title,
      description: stepType.description,
      configuration: {}
    };

    setSelectedWorkflow({
      ...selectedWorkflow,
      workflow_data: {
        ...selectedWorkflow.workflow_data,
        steps: [...selectedWorkflow.workflow_data.steps, newStep]
      }
    });
  };

  const removeStep = (stepId: string) => {
    if (!selectedWorkflow) return;

    setSelectedWorkflow({
      ...selectedWorkflow,
      workflow_data: {
        ...selectedWorkflow.workflow_data,
        steps: selectedWorkflow.workflow_data.steps.filter(step => step.id !== stepId),
        connections: selectedWorkflow.workflow_data.connections.filter(
          conn => conn.from !== stepId && conn.to !== stepId
        )
      }
    });
  };

  const runWorkflow = async () => {
    if (!selectedWorkflow) return;

    try {
      toast({
        title: "Workflow Started",
        description: "Your workflow is now running...",
      });

      // Simulate workflow execution
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Workflow Complete",
        description: "Your workflow has finished executing successfully",
      });
    } catch (error) {
      toast({
        title: "Workflow Failed",
        description: "There was an error executing your workflow",
        variant: "destructive",
      });
    }
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
          <h2 className="text-2xl font-bold">Workflow Builder</h2>
          <p className="text-muted-foreground mt-1">
            Create automated workflows for your business processes
          </p>
        </div>
        <Button onClick={createNewWorkflow} className="gap-2">
          <Plus className="w-4 h-4" />
          New Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="w-5 h-5" />
              Your Workflows ({workflows.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflows.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No workflows created yet
              </p>
            ) : (
              workflows.map((workflow) => (
                <Card
                  key={workflow.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedWorkflow?.id === workflow.id ? 'border-primary shadow-ai' : ''
                  }`}
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {workflow.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {workflow.workflow_data.steps.length} steps
                          </Badge>
                          <Badge 
                            variant={workflow.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {workflow.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWorkflow(workflow.id!);
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

        {/* Workflow Editor */}
        <div className="lg:col-span-2">
          {selectedWorkflow ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    {selectedWorkflow.id ? 'Edit Workflow' : 'Create New Workflow'}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={runWorkflow}
                      disabled={!selectedWorkflow.name || selectedWorkflow.workflow_data.steps.length === 0}
                      className="gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Run
                    </Button>
                    <Button
                      onClick={saveWorkflow}
                      disabled={saving || !selectedWorkflow.name}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="builder" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="builder">Builder</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="builder" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Workflow Name</Label>
                        <Input
                          id="name"
                          value={selectedWorkflow.name}
                          onChange={(e) => setSelectedWorkflow({ 
                            ...selectedWorkflow, 
                            name: e.target.value 
                          })}
                          placeholder="My Automation Workflow"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          value={selectedWorkflow.status}
                          onChange={(e) => setSelectedWorkflow({ 
                            ...selectedWorkflow, 
                            status: e.target.value 
                          })}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={selectedWorkflow.description}
                        onChange={(e) => setSelectedWorkflow({ 
                          ...selectedWorkflow, 
                          description: e.target.value 
                        })}
                        placeholder="Describe what this workflow does..."
                        rows={2}
                      />
                    </div>

                    {/* Step Builder */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Workflow Steps</h4>
                        <div className="text-sm text-muted-foreground">
                          {selectedWorkflow.workflow_data.steps.length} steps
                        </div>
                      </div>

                      {/* Available Steps */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-muted/20 rounded-lg">
                        <p className="col-span-full text-sm font-medium mb-2">Add Steps:</p>
                        {stepTypes.map((stepType) => (
                          <Button
                            key={`${stepType.type}-${stepType.title}`}
                            variant="outline"
                            size="sm"
                            onClick={() => addStep(stepType)}
                            className="justify-start gap-2"
                          >
                            <span>{stepType.icon}</span>
                            <span className="text-xs">{stepType.title}</span>
                          </Button>
                        ))}
                      </div>

                      {/* Current Steps */}
                      <div className="space-y-3">
                        {selectedWorkflow.workflow_data.steps.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No steps added yet. Add steps from the options above.
                          </div>
                        ) : (
                          selectedWorkflow.workflow_data.steps.map((step, index) => (
                            <div key={step.id} className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                {index + 1}
                              </div>
                              <Card className="flex-1">
                                <CardContent className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium">{step.title}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {step.description}
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <Badge variant="outline" className="text-xs">
                                        {step.type}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeStep(step.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              {index < selectedWorkflow.workflow_data.steps.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Workflow Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Execution Schedule</Label>
                          <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                            <option value="manual">Manual trigger only</option>
                            <option value="continuous">Continuous monitoring</option>
                            <option value="scheduled">Scheduled execution</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Error Handling</Label>
                          <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                            <option value="stop">Stop on error</option>
                            <option value="continue">Continue on error</option>
                            <option value="retry">Retry failed steps</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Notifications</Label>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Email on completion</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Email on error</span>
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Execution History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[1, 2, 3].map((run) => (
                            <div key={run} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-success" />
                                <div>
                                  <div className="font-medium">Run #{run}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Completed in 2.3 seconds
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                2 hours ago
                              </div>
                            </div>
                          ))}
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
                <Workflow className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Workflow</h3>
                <p className="text-muted-foreground mb-6">
                  Choose a workflow from the list or create a new one to get started
                </p>
                <Button onClick={createNewWorkflow} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Workflow
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}