import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  provider: string;
  helpUrl?: string;
  onSave: (apiKey: string) => Promise<void>;
}

export function ApiKeyDialog({ 
  trigger, 
  title, 
  description, 
  provider, 
  helpUrl,
  onSave 
}: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(apiKey.trim());
      toast({
        title: "Success",
        description: `${provider} API key saved successfully`,
      });
      setOpen(false);
      setApiKey("");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${provider} API key`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
          </div>
          
          {helpUrl && (
            <a
              href={helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Get your {provider} API key
            </a>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save API Key"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}