import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";

const CandidateSettings = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input defaultValue="Anna" className="mt-1.5" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input defaultValue="Schmidt" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue="anna.schmidt@email.com" className="mt-1.5" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input defaultValue="+49 170 1234567" className="mt-1.5" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Language</Label>
            <Select defaultValue="de">
              <SelectTrigger className="mt-1.5 w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-card-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates about your applications via email</p>
            </div>
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-card-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Get real-time browser notifications</p>
            </div>
            <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-card-foreground">SMS Notifications</p>
              <p className="text-xs text-muted-foreground">Receive text messages for important updates</p>
            </div>
            <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Your data is secure</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                All personal data is encrypted and stored securely. You can request a full data export or account deletion at any time by contacting support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateSettings;
