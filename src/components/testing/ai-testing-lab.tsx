import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TestTube, 
  Play, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Target,
  BarChart3,
  MessageSquare,
  Bot
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface TestCase {
  id: string;
  name: string;
  description: string;
  input: string;
  expectedOutput: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  actualOutput?: string;
  executionTime?: number;
}

interface TestSuite {
  id: string;
  name: string;
  agentId: string;
  agentName: string;
  testCases: TestCase[];
  lastRun?: Date;
  passRate: number;
}

export function AITestingLab() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      // Load agents
      const { data: agentsData } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', user.id);

      setAgents(agentsData || []);

      // Generate mock test suites for demo
      const mockTestSuites: TestSuite[] = (agentsData || []).map(agent => ({
        id: `suite-${agent.id}`,
        name: `${agent.name} Test Suite`,
        agentId: agent.id,
        agentName: agent.name,
        testCases: [
          {
            id: `test-1-${agent.id}`,
            name: "Basic Response Test",
            description: "Tests if agent responds appropriately to basic queries",
            input: "Hello, how can you help me?",
            expectedOutput: "I'm here to help! What would you like assistance with?",
            status: 'pending'
          },
          {
            id: `test-2-${agent.id}`,
            name: "Complex Query Test",
            description: "Tests agent's ability to handle complex requests",
            input: "Can you analyze this data and provide insights?",
            expectedOutput: "I'd be happy to analyze data for you. Please share the data you'd like me to review.",
            status: 'pending'
          },
          {
            id: `test-3-${agent.id}`,
            name: "Error Handling Test",
            description: "Tests how agent handles unclear or invalid input",
            input: "asdkjfhaslkjdfh",
            expectedOutput: "I'm not sure I understand. Could you please rephrase your question?",
            status: 'pending'
          }
        ],
        passRate: 0
      }));

      setTestSuites(mockTestSuites);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load testing data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runTestSuite = async (suite: TestSuite) => {
    setRunning(true);
    let passedTests = 0;

    try {
      for (const testCase of suite.testCases) {
        // Update test status to running
        testCase.status = 'running';
        setSelectedSuite({ ...suite });

        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate test results (in real implementation, this would call your AI agent)
        const passed = Math.random() > 0.3; // 70% pass rate for demo
        testCase.status = passed ? 'passed' : 'failed';
        testCase.actualOutput = passed 
          ? testCase.expectedOutput 
          : "Unexpected response from agent";
        testCase.executionTime = Math.floor(Math.random() * 2000) + 500;

        if (passed) passedTests++;

        // Update UI
        setSelectedSuite({ ...suite });
      }

      // Update pass rate
      suite.passRate = (passedTests / suite.testCases.length) * 100;
      suite.lastRun = new Date();

      toast({
        title: "Test Suite Complete",
        description: `${passedTests}/${suite.testCases.length} tests passed (${Math.round(suite.passRate)}%)`,
      });

    } catch (error) {
      toast({
        title: "Test Failed",
        description: "An error occurred while running the test suite",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const runSingleTest = async (testCase: TestCase) => {
    testCase.status = 'running';
    setSelectedSuite({ ...selectedSuite! });

    try {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1500));

      const passed = Math.random() > 0.4;
      testCase.status = passed ? 'passed' : 'failed';
      testCase.actualOutput = passed 
        ? testCase.expectedOutput 
        : "Unexpected response from agent";
      testCase.executionTime = Math.floor(Math.random() * 2000) + 500;

      setSelectedSuite({ ...selectedSuite! });

      toast({
        title: testCase.status === 'passed' ? "Test Passed" : "Test Failed",
        description: `${testCase.name} completed in ${testCase.executionTime}ms`,
        variant: testCase.status === 'passed' ? 'default' : 'destructive'
      });

    } catch (error) {
      testCase.status = 'failed';
      toast({
        title: "Test Error",
        description: "An error occurred while running the test",
        variant: "destructive",
      });
    }
  };

  const addTestCase = () => {
    if (!selectedSuite) return;

    const newTest: TestCase = {
      id: `test-${Date.now()}`,
      name: "New Test Case",
      description: "Description for new test case",
      input: "",
      expectedOutput: "",
      status: 'pending'
    };

    selectedSuite.testCases.push(newTest);
    setSelectedSuite({ ...selectedSuite });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running': return <Clock className="w-4 h-4 text-warning animate-spin" />;
      default: return <TestTube className="w-4 h-4 text-muted-foreground" />;
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
          <h2 className="text-2xl font-bold">AI Testing Lab</h2>
          <p className="text-muted-foreground mt-1">
            Test and validate your AI agents' performance
          </p>
        </div>
        {selectedSuite && (
          <Button 
            onClick={() => runTestSuite(selectedSuite)} 
            disabled={running}
            className="gap-2"
          >
            {running ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? 'Running...' : 'Run All Tests'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Suites List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Test Suites ({testSuites.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {testSuites.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">
                  No agents available for testing. Create an AI agent first.
                </p>
              </div>
            ) : (
              testSuites.map((suite) => (
                <Card
                  key={suite.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedSuite?.id === suite.id ? 'border-primary shadow-ai' : ''
                  }`}
                  onClick={() => setSelectedSuite(suite)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">{suite.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Agent: {suite.agentName}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pass Rate</span>
                          <span>{Math.round(suite.passRate)}%</span>
                        </div>
                        <Progress value={suite.passRate} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {suite.testCases.length} tests
                        </Badge>
                        {suite.lastRun && (
                          <span className="text-xs text-muted-foreground">
                            Last run: {suite.lastRun.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Test Details */}
        <div className="lg:col-span-2">
          {selectedSuite ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {selectedSuite.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={addTestCase} className="gap-2">
                      <TestTube className="w-4 h-4" />
                      Add Test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tests" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tests">Test Cases</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tests" className="space-y-4">
                    <div className="space-y-4">
                      {selectedSuite.testCases.map((testCase) => (
                        <Card key={testCase.id} className="border-gradient-ai">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getStatusIcon(testCase.status)}
                                    <h4 className="font-medium">{testCase.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {testCase.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {testCase.description}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => runSingleTest(testCase)}
                                  disabled={testCase.status === 'running'}
                                  className="gap-2"
                                >
                                  {testCase.status === 'running' ? (
                                    <Clock className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Play className="w-3 h-3" />
                                  )}
                                  Run
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label className="text-xs">Input:</Label>
                                  <div className="bg-muted/50 p-2 rounded text-xs">
                                    {testCase.input}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-xs">Expected Output:</Label>
                                  <div className="bg-muted/50 p-2 rounded text-xs">
                                    {testCase.expectedOutput}
                                  </div>
                                </div>
                              </div>

                              {testCase.actualOutput && (
                                <div>
                                  <Label className="text-xs">Actual Output:</Label>
                                  <div className={`p-2 rounded text-xs ${
                                    testCase.status === 'passed' 
                                      ? 'bg-success/10 text-success' 
                                      : 'bg-destructive/10 text-destructive'
                                  }`}>
                                    {testCase.actualOutput}
                                  </div>
                                </div>
                              )}

                              {testCase.executionTime && (
                                <div className="text-xs text-muted-foreground">
                                  Execution time: {testCase.executionTime}ms
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="results" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <div>
                              <div className="font-semibold">
                                {selectedSuite.testCases.filter(t => t.status === 'passed').length}
                              </div>
                              <div className="text-sm text-muted-foreground">Passed</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-destructive" />
                            <div>
                              <div className="font-semibold">
                                {selectedSuite.testCases.filter(t => t.status === 'failed').length}
                              </div>
                              <div className="text-sm text-muted-foreground">Failed</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TestTube className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="font-semibold">{selectedSuite.testCases.length}</div>
                              <div className="text-sm text-muted-foreground">Total</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Test Results Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Overall Pass Rate</span>
                            <span className="font-semibold">{Math.round(selectedSuite.passRate)}%</span>
                          </div>
                          <Progress value={selectedSuite.passRate} className="h-3" />
                          <div className="text-sm text-muted-foreground">
                            {selectedSuite.testCases.filter(t => t.status === 'passed').length} of {selectedSuite.testCases.length} tests passed
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Performance Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Average Response Time</h4>
                            <div className="text-2xl font-bold">
                              {selectedSuite.testCases
                                .filter(t => t.executionTime)
                                .reduce((avg, t) => avg + (t.executionTime! / selectedSuite.testCases.filter(t => t.executionTime).length), 0)
                                .toFixed(0) || 0}ms
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Success Rate Trend</h4>
                            <div className="text-2xl font-bold text-success">
                              {selectedSuite.passRate > 80 ? '↗️' : selectedSuite.passRate > 60 ? '→' : '↘️'} 
                              {Math.round(selectedSuite.passRate)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          This agent shows {selectedSuite.passRate > 80 ? 'excellent' : selectedSuite.passRate > 60 ? 'good' : 'poor'} performance across test cases.
                          {selectedSuite.passRate < 80 && ' Consider reviewing failed tests and improving the agent configuration.'}
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
                <TestTube className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Test Suite</h3>
                <p className="text-muted-foreground mb-6">
                  Choose a test suite from the list to view and run tests
                </p>
                {testSuites.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Create an AI agent first to generate test suites
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}