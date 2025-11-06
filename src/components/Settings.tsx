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

export function Settings({ settings, onSave }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
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
              <div className="flex-1">
                <Input
                  id="work-minutes"
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Minutes"
                  value={localSettings.workMinutes}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      workMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <Input
                  id="work-seconds"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Seconds"
                  value={localSettings.workSeconds}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      workSeconds: Math.min(parseInt(e.target.value) || 0, 59),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Short Break</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="short-break-minutes"
                  type="number"
                  min="0"
                  max="60"
                  placeholder="Minutes"
                  value={localSettings.shortBreakMinutes}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      shortBreakMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <Input
                  id="short-break-seconds"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Seconds"
                  value={localSettings.shortBreakSeconds}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      shortBreakSeconds: Math.min(parseInt(e.target.value) || 0, 59),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Long Break</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="long-break-minutes"
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Minutes"
                  value={localSettings.longBreakMinutes}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <Input
                  id="long-break-seconds"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Seconds"
                  value={localSettings.longBreakSeconds}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakSeconds: Math.min(parseInt(e.target.value) || 0, 59),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Peek Penalty</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="penalty-minutes"
                  type="number"
                  min="0"
                  max="30"
                  placeholder="Minutes"
                  value={localSettings.peekPenaltyMinutes}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      peekPenaltyMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <Input
                  id="penalty-seconds"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Seconds"
                  value={localSettings.peekPenaltySeconds}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      peekPenaltySeconds: Math.min(parseInt(e.target.value) || 0, 59),
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
