import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BusinessAnalysis } from "@/components/ai-chat/ai-manager-chat";
import { ArrowRight, Bot, Edit, Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface WorkflowVisualizationProps {
  analysis: BusinessAnalysis;
  onCreateAgents?: () => void;
}

const WORKFLOW_STATUS = {
  "Lead Qualification": "active",
  "Customer Onboarding": "pending",
  "Support Ticket Resolution": "draft"
};

export function WorkflowVisualization({ analysis, onCreateAgents }: WorkflowVisualizationProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "draft":
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "draft":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Workflow Analysis</h2>
          <p className="text-muted-foreground mt-1">
            AI-generated workflows based on your business structure
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Workflows
          </Button>
          <Button className="gradient-primary shadow-ai gap-2" onClick={onCreateAgents}>
            <Bot className="w-4 h-4" />
            Generate AI Agents
          </Button>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gradient-ai">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                {analysis.departments.length}
              </div>
              <p className="text-sm text-muted-foreground">Departments</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gradient-ai">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                {analysis.teamSize}
              </div>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gradient-ai">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                {analysis.workflows.length}
              </div>
              <p className="text-sm text-muted-foreground">Workflows</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gradient-ai">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                {analysis.automationOpportunities.length}
              </div>
              <p className="text-sm text-muted-foreground">AI Opportunities</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Identified Workflows</h3>
          {analysis.workflows.map((workflow, index) => {
            const status = WORKFLOW_STATUS[workflow.name as keyof typeof WORKFLOW_STATUS] || "draft";
            
            return (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedWorkflow === workflow.name ? "border-primary shadow-ai" : ""
                }`}
                onClick={() => setSelectedWorkflow(workflow.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(status)}
                        <h4 className="font-semibold">{workflow.name}</h4>
                        <Badge className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Department: {workflow.department}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {workflow.steps.length} steps
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Automation ready
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          <Button variant="outline" className="w-full border-dashed gap-2">
            <Plus className="w-4 h-4" />
            Add Custom Workflow
          </Button>
        </div>

        {/* Workflow Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Workflow Details</h3>
          {selectedWorkflow ? (
            <Card className="shadow-ai">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(WORKFLOW_STATUS[selectedWorkflow as keyof typeof WORKFLOW_STATUS] || "draft")}
                  {selectedWorkflow}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Process Steps:</h5>
                    <div className="space-y-3">
                      {analysis.workflows
                        .find(w => w.name === selectedWorkflow)
                        ?.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h5 className="font-medium mb-2">Automation Potential:</h5>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="gradient-primary h-2 rounded-full" style={{ width: "85%" }} />
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      High automation potential with AI agents
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Select a workflow to view details and automation opportunities
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Automation Opportunities */}
      <Card className="shadow-ai">
        <CardHeader>
          <CardTitle>AI Automation Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.automationOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card-hover">
                <div className="flex items-center gap-3 mb-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <h5 className="font-medium capitalize">{opportunity}</h5>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI agent can automate this process with high accuracy
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}