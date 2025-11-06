import { Settings as SettingsIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SettingsProps {
  settings: {
    workMinutes: number;
    shortBreakMinutes: number;
    longBreakMinutes: number;
    peekPenaltyMinutes: number;
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
            <Label htmlFor="work">Work Session (minutes)</Label>
            <Input
              id="work"
              type="number"
              min="1"
              max="120"
              value={localSettings.workMinutes}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  workMinutes: parseInt(e.target.value) || 25,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short-break">Short Break (minutes)</Label>
            <Input
              id="short-break"
              type="number"
              min="1"
              max="60"
              value={localSettings.shortBreakMinutes}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  shortBreakMinutes: parseInt(e.target.value) || 10,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="long-break">Long Break (minutes)</Label>
            <Input
              id="long-break"
              type="number"
              min="1"
              max="120"
              value={localSettings.longBreakMinutes}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  longBreakMinutes: parseInt(e.target.value) || 30,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="penalty">Peek Penalty (minutes)</Label>
            <Input
              id="penalty"
              type="number"
              min="0"
              max="30"
              value={localSettings.peekPenaltyMinutes}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  peekPenaltyMinutes: parseInt(e.target.value) || 0,
                })
              }
            />
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
