import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const DashboardSettings = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and subscription</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input defaultValue="Max" className="mt-1.5" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input defaultValue="Müller" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue="max@example.com" className="mt-1.5" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-card-foreground">Professional Plan</p>
              <p className="text-sm text-muted-foreground">€49/month · Renews March 15, 2026</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Language Preference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="default" size="sm">Deutsch</Button>
            <Button variant="outline" size="sm">English</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
