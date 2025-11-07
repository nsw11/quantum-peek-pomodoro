import { Settings as SettingsIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SettingsProps {
  settings: {
    workMinutes: number;
    workSeconds: number;
    shortBreakMinutes: number;
    shortBreakSeconds: number;
    longBreakMinutes: number;
    longBreakSeconds: number;
    peekPenaltyMinutes: number;
    peekPenaltySeconds: number;
  };
  onSave: (settings: SettingsProps["settings"]) => void;
}

type LocalSettingsType = {
  [K in keyof SettingsProps["settings"]]: string | number;
};

export function Settings({ settings, onSave }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<LocalSettingsType>(settings);

  const handleSave = () => {
    // Convert empty strings to 0
    const sanitizedSettings = {
      workMinutes: localSettings.workMinutes === "" ? 0 : Number(localSettings.workMinutes),
      workSeconds: localSettings.workSeconds === "" ? 0 : Number(localSettings.workSeconds),
      shortBreakMinutes: localSettings.shortBreakMinutes === "" ? 0 : Number(localSettings.shortBreakMinutes),
      shortBreakSeconds: localSettings.shortBreakSeconds === "" ? 0 : Number(localSettings.shortBreakSeconds),
      longBreakMinutes: localSettings.longBreakMinutes === "" ? 0 : Number(localSettings.longBreakMinutes),
      longBreakSeconds: localSettings.longBreakSeconds === "" ? 0 : Number(localSettings.longBreakSeconds),
      peekPenaltyMinutes: localSettings.peekPenaltyMinutes === "" ? 0 : Number(localSettings.peekPenaltyMinutes),
      peekPenaltySeconds: localSettings.peekPenaltySeconds === "" ? 0 : Number(localSettings.peekPenaltySeconds),
    };
    onSave(sanitizedSettings);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4"
      >
        <SettingsIcon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-quantum">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Work Session</Label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="work-minutes" className="text-xs text-muted-foreground">
                  Minutes
                </Label>
                <Input
                  id="work-minutes"
                  type="number"
                  min="0"
                  max="120"
                  value={localSettings.workMinutes}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      workMinutes: e.target.value === "" ? "" : parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="work-seconds" className="text-xs text-muted-foreground">
                  Seconds
                </Label>
                <Input
                  id="work-seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={localSettings.workSeconds}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      workSeconds: e.target.value === "" ? "" : Math.min(parseInt(e.target.value) || 0, 59),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Short Break</Label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="short-break-minutes" className="text-xs text-muted-foreground">
                  Minutes
                </Label>
                <Input
                  id="short-break-minutes"
                  type="number"
                  min="0"
                  max="60"
                  value={localSettings.shortBreakMinutes}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      shortBreakMinutes: e.target.value === "" ? "" : parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="short-break-seconds" className="text-xs text-muted-foreground">
                  Seconds
                </Label>
                <Input
                  id="short-break-seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={localSettings.shortBreakSeconds}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      shortBreakSeconds: e.target.value === "" ? "" : Math.min(parseInt(e.target.value) || 0, 59),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Long Break</Label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="long-break-minutes" className="text-xs text-muted-foreground">
                  Minutes
                </Label>
                <Input
                  id="long-break-minutes"
                  type="number"
                  min="0"
                  max="120"
                  value={localSettings.longBreakMinutes}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakMinutes: e.target.value === "" ? "" : parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="long-break-seconds" className="text-xs text-muted-foreground">
                  Seconds
                </Label>
                <Input
                  id="long-break-seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={localSettings.longBreakSeconds}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakSeconds: e.target.value === "" ? "" : Math.min(parseInt(e.target.value) || 0, 59),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Peek Penalty</Label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="penalty-minutes" className="text-xs text-muted-foreground">
                  Minutes
                </Label>
                <Input
                  id="penalty-minutes"
                  type="number"
                  min="0"
                  max="30"
                  value={localSettings.peekPenaltyMinutes}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      peekPenaltyMinutes: e.target.value === "" ? "" : parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="penalty-seconds" className="text-xs text-muted-foreground">
                  Seconds
                </Label>
                <Input
                  id="penalty-seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={localSettings.peekPenaltySeconds}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      peekPenaltySeconds: e.target.value === "" ? "" : Math.min(parseInt(e.target.value) || 0, 59),
                    })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Additional time added when peeking during work session
            </p>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </Card>
    </div>
  );
}
