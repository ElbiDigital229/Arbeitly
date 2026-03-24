import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Globe, Bell, Shield, Palette, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "arbeitly_system_settings";

type SystemSettings = {
  platformName: string;
  supportEmail: string;
  defaultLanguage: string;
  emailNotificationsEnabled: boolean;
  maintenanceMode: boolean;
  allowFreeSignups: boolean;
  maxCvExportsFree: number;
  defaultTimezone: string;
};

const defaultSettings: SystemSettings = {
  platformName: "Arbeitly",
  supportEmail: "support@arbeitly.com",
  defaultLanguage: "en",
  emailNotificationsEnabled: true,
  maintenanceMode: false,
  allowFreeSignups: true,
  maxCvExportsFree: 3,
  defaultTimezone: "Europe/Berlin",
};

function loadSettings(): SystemSettings {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? { ...defaultSettings, ...JSON.parse(s) } : defaultSettings;
  } catch { return defaultSettings; }
}

export default function SuperAdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>(loadSettings);
  const [dirty, setDirty] = useState(false);

  const set = <K extends keyof SystemSettings>(k: K, v: SystemSettings[K]) => {
    setSettings((prev) => ({ ...prev, [k]: v }));
    setDirty(true);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setDirty(false);
    toast({ title: "Settings saved" });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Global platform configuration</p>
        </div>
        <Button onClick={save} disabled={!dirty} className="gap-2 rounded-full">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Globe className="h-4 w-4" /> General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Platform Name</Label>
              <Input className="mt-1.5" value={settings.platformName} onChange={(e) => set("platformName", e.target.value)} />
            </div>
            <div>
              <Label>Support Email</Label>
              <Input className="mt-1.5" type="email" value={settings.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Default Language</Label>
              <Select value={settings.defaultLanguage} onValueChange={(v) => set("defaultLanguage", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Default Timezone</Label>
              <Select value={settings.defaultTimezone} onValueChange={(v) => set("defaultTimezone", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Berlin">Europe/Berlin (CET)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-card-foreground">Email notifications</p>
              <p className="text-xs text-muted-foreground">Send email alerts for new applications, status changes, and system events</p>
            </div>
            <Switch checked={settings.emailNotificationsEnabled} onCheckedChange={(v) => set("emailNotificationsEnabled", v)} />
          </div>
        </CardContent>
      </Card>

      {/* Access control */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Shield className="h-4 w-4" /> Access & Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-card-foreground">Allow free signups</p>
              <p className="text-xs text-muted-foreground">Let candidates register with the free plan</p>
            </div>
            <Switch checked={settings.allowFreeSignups} onCheckedChange={(v) => set("allowFreeSignups", v)} />
          </div>
          <Separator />
          <div>
            <Label>Max CV exports (free candidates)</Label>
            <Input
              className="mt-1.5 max-w-xs"
              type="number"
              min={0}
              value={settings.maxCvExportsFree}
              onChange={(e) => set("maxCvExportsFree", parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground mt-1">Set to 0 for unlimited</p>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card className={settings.maintenanceMode ? "border-destructive/40" : ""}>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Palette className="h-4 w-4" /> Maintenance Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-card-foreground">Enable maintenance mode</p>
              <p className="text-xs text-muted-foreground">Displays a maintenance page to all users except Super Admin</p>
            </div>
            <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => set("maintenanceMode", v)} />
          </div>
          {settings.maintenanceMode && (
            <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-xs text-destructive font-medium">⚠ Maintenance mode is ON — users will see a maintenance page</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
