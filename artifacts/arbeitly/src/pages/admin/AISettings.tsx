import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AISettings = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">AI Settings</h1>
        <p className="text-muted-foreground">Configure AI model and generation settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Model Configuration</CardTitle>
          <CardDescription>Select and configure the AI model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>AI Model</Label>
            <Input defaultValue="gpt-4o" className="mt-1.5" />
          </div>
          <div>
            <Label>API Endpoint</Label>
            <Input defaultValue="https://api.openai.com/v1" className="mt-1.5" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-card-foreground text-sm">Enable Fallback Model</p>
              <p className="text-xs text-muted-foreground">Use GPT-3.5-turbo as fallback when primary model is unavailable</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Rate Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Max requests/user/day</Label>
              <Input type="number" defaultValue="50" className="mt-1.5" />
            </div>
            <div>
              <Label>Max requests/system/hour</Label>
              <Input type="number" defaultValue="500" className="mt-1.5" />
            </div>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Limits
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettings;
