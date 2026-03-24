import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Save, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "arbeitly_superadmin_profile";

type AdminProfile = {
  name: string;
  email: string;
};

function loadProfile(): AdminProfile {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : { name: "Super Admin", email: "admin@arbeitly.com" };
  } catch { return { name: "Super Admin", email: "admin@arbeitly.com" }; }
}

export default function SuperAdminProfile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<AdminProfile>(loadProfile);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const saveProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    toast({ title: "Profile saved" });
  };

  const savePassword = () => {
    if (!currentPassword) { toast({ title: "Enter current password", variant: "destructive" }); return; }
    if (newPassword.length < 8) { toast({ title: "Password must be at least 8 characters", variant: "destructive" }); return; }
    if (newPassword !== confirmPassword) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
    // In a real app: validate + hash
    toast({ title: "Password updated" });
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Profile</h1>
        <p className="text-muted-foreground">Manage your Super Admin account</p>
      </div>

      {/* Avatar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-display text-xl font-bold text-card-foreground">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-medium">Super Admin</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile details */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <User className="h-4 w-4" /> Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Display Name</Label>
            <Input className="mt-1.5" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <Label>Email</Label>
            <Input className="mt-1.5" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <Button onClick={saveProfile} className="gap-2">
            <Save className="h-4 w-4" /> Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Lock className="h-4 w-4" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input className="mt-1.5" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <Label>New Password</Label>
            <Input className="mt-1.5" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input className="mt-1.5" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <Button variant="outline" onClick={savePassword} disabled={!currentPassword || !newPassword || !confirmPassword}>
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
