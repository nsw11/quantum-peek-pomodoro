import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings } from "@/components/Settings";
import { Eye, Play, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SessionType = "work" | "shortBreak" | "longBreak";

interface SettingsType {
  workMinutes: number;
  workSeconds: number;
  shortBreakMinutes: number;
  shortBreakSeconds: number;
  longBreakMinutes: number;
  longBreakSeconds: number;
  peekPenaltyMinutes: number;
  peekPenaltySeconds: number;
}

const Index = () => {
  const [settings, setSettings] = useState<SettingsType>({
    workMinutes: 25,
    workSeconds: 0,
    shortBreakMinutes: 10,
    shortBreakSeconds: 0,
    longBreakMinutes: 30,
    longBreakSeconds: 0,
    peekPenaltyMinutes: 0,
    peekPenaltySeconds: 0,
  });

  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60 + settings.workSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isPeeking, setIsPeeking] = useState(false);
  const [canPeek, setCanPeek] = useState(true);
  const [totalPenalty, setTotalPenalty] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (sessionType === "work") {
            // Work session complete - advance to break
            setIsRunning(false);
            handleAdvanceToBreak();
            return 0;
          } else {
            // Break expired - show alert
            setIsExpired(true);
            if (!isMuted && audioRef.current) {
              audioRef.current.play();
            }
            setIsRunning(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, sessionType, isMuted]);

  // Peek timer (3 seconds)
  useEffect(() => {
    if (!isPeeking) return;

    // Capture timeLeft at the moment of peeking
    const currentTimeLeft = timeLeft;

    const timeout = setTimeout(() => {
      setIsPeeking(false);
      
      // If timer is complete, auto-advance to break
      if (currentTimeLeft === 0) {
        handleAdvanceToBreak();
      } else {
        // Apply penalty if incomplete
        const totalPenaltySeconds = settings.peekPenaltyMinutes * 60 + settings.peekPenaltySeconds;
        if (totalPenaltySeconds > 0) {
          setTimeLeft((prev) => prev + totalPenaltySeconds);
          setTotalPenalty((prev) => prev + totalPenaltySeconds);
          
          const penaltyMins = Math.floor(totalPenaltySeconds / 60);
          const penaltySecs = totalPenaltySeconds % 60;
          let description = "+";
          if (penaltyMins > 0) description += `${penaltyMins} min `;
          if (penaltySecs > 0) description += `${penaltySecs} sec`;
          
          toast({
            title: "Peek Penalty Applied",
            description: description.trim() + " added",
            variant: "destructive",
          });
        }
      }

      // Start cooldown (3 seconds)
      setCanPeek(false);
      setTimeout(() => setCanPeek(true), 3000);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isPeeking, settings.peekPenaltyMinutes, toast]);

  const handlePeek = () => {
    if (canPeek && sessionType === "work" && isRunning) {
      setIsPeeking(true);
    }
  };

  const handleAdvanceToBreak = () => {
    const nextPomodoroCount = pomodoroCount + 1;
    setPomodoroCount(nextPomodoroCount);
    setTotalPenalty(0);

    if (nextPomodoroCount % 4 === 0) {
      setSessionType("longBreak");
      setTimeLeft(settings.longBreakMinutes * 60 + settings.longBreakSeconds);
      setPomodoroCount(0);
    } else {
      setSessionType("shortBreak");
      setTimeLeft(settings.shortBreakMinutes * 60 + settings.shortBreakSeconds);
    }
    
    setIsRunning(false);
    setIsExpired(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPeeking(false);
    setCanPeek(true);
    setIsExpired(false);
    
    if (sessionType === "work") {
      setTimeLeft(settings.workMinutes * 60 + settings.workSeconds);
      setTotalPenalty(0);
    } else if (sessionType === "shortBreak") {
      setTimeLeft(settings.shortBreakMinutes * 60 + settings.shortBreakSeconds);
    } else {
      setTimeLeft(settings.longBreakMinutes * 60 + settings.longBreakSeconds);
    }
  };

  const handleStart = () => {
    if (sessionType !== "work" && isExpired) {
      // Starting new work session after break
      setSessionType("work");
      setTimeLeft(settings.workMinutes * 60 + settings.workSeconds);
      setIsExpired(false);
    }
    setIsRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPeekTime = (seconds: number) => {
    if (seconds > 120) {
      const mins = Math.floor(seconds / 60);
      return `${mins} min`;
    }
    return `${seconds} sec`;
  };

  const getSessionColor = () => {
    if (sessionType === "work") return "secondary";
    if (sessionType === "shortBreak") return "accent";
    return "tertiary";
  };

  const getSessionLabel = () => {
    if (sessionType === "work") return "Work Session";
    if (sessionType === "shortBreak") return "Short Break";
    return "Long Break";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse-glow"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-accent rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-secondary rounded-full animate-pulse-glow"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-tertiary rounded-full animate-pulse-glow"></div>
      </div>

      <Settings settings={settings} onSave={setSettings} />

      {/* Mute toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 left-4"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>

      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRA0OVq7n77BdGAg+ltryxW8gBSuBzvLZizkIGWi77OeeSwwMT6fk786UOAcffM/y3JBBChRbtung7d2iIRUxitXy1YU0Bx1rvu/nn0YND1St5/C3Yx0GO5LZ8stzLAUndsjz45dGDA5WrujwvGQYBjyT2fLKbx8EL4TQ8+GNOwcZaLzs6qNQEgtOqOPxt2EcBjiP1/PQfTEGHGy+7+iYRA0PVazm8LdjGAY8k9nyyG4hBSyBzvLaizoIGGm67OqiUBELTqrk8bhgHAY8ktfw0X4yBhxtu+/plUYND1as5vC6ZBgGPJPa8sptIAUrgM/y24s4CBhpuuzqpFIRDU+q5fC7YxwEOpPX8NF+MgYcbbru6ZVGDQ9WrObwtWYZBj2U2vLKbSAFK4DQ8tyKOAgYaLvs6qVSEQ1Pq+XwvGQcBDuU2PDSfzMGHG277+mWRg0PVazm8LVmGQY9lNryyW4gBSuA0PLciTgIGGi77OqlUhENT6vl8L1kHAQ7ldjw0n8zBhxtu+/pl0YODVS" />

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Schrödinger's Pomodoro
          </h1>
          <p className="text-muted-foreground">
            The timer exists in a superposition until observed
          </p>
        </div>

        {/* Main timer card */}
        <Card className={`p-8 space-y-6 shadow-${getSessionColor() === "secondary" ? "mystery" : getSessionColor() === "accent" ? "break" : "quantum"}`}>
          {/* Session indicator */}
          <div className="flex items-center justify-between">
            <div className={`px-4 py-2 rounded-full bg-${getSessionColor()}/20 text-${getSessionColor()} border border-${getSessionColor()}/50`}>
              {getSessionLabel()}
            </div>
            <div className="text-sm text-muted-foreground">
              Pomodoros: {pomodoroCount}/4
            </div>
          </div>

          {/* Timer display */}
          <div className="text-center space-y-4">
            {sessionType === "work" && isRunning ? (
              // Hidden timer during work
              <div className="space-y-6">
                {!isPeeking ? (
                  <div className="h-32 flex items-center justify-center">
                    <div className="text-6xl font-mono text-muted-foreground/20">
                      ??:??
                    </div>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center animate-reveal">
                    <div className="text-6xl font-mono text-primary shadow-quantum">
                      {formatPeekTime(timeLeft)}
                    </div>
                  </div>
                )}

                {totalPenalty > 0 && (
                  <div className="text-sm text-destructive shadow-penalty">
                    Penalty: +{Math.floor(totalPenalty / 60) > 0 ? `${Math.floor(totalPenalty / 60)} min ` : ""}{totalPenalty % 60 > 0 ? `${totalPenalty % 60} sec` : ""}
                  </div>
                )}
              </div>
            ) : (
              // Visible timer for breaks
              <div className="space-y-4">
                <div className={`text-6xl font-mono ${isExpired ? "animate-blink text-destructive" : `text-${getSessionColor()}`}`}>
                  {formatTime(timeLeft)}
                </div>
                {isExpired && (
                  <div className="text-destructive font-semibold">
                    Break time is over!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {sessionType === "work" && isRunning && (
              <Button
                variant="peek"
                size="lg"
                onClick={handlePeek}
                disabled={!canPeek || isPeeking}
              >
                <Eye className="mr-2 h-5 w-5" />
                {isPeeking ? "Observing..." : !canPeek ? "Cooldown..." : "Peek"}
              </Button>
            )}

            {(!isRunning || sessionType !== "work") && (
              <Button
                variant={sessionType === "work" ? "mystery" : "break"}
                size="lg"
                onClick={handleStart}
              >
                <Play className="mr-2 h-5 w-5" />
                Start {sessionType === "work" ? "Work" : "Break"}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">How it works:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Work timer stays hidden - trust the process</li>
            <li>Peek to observe the timer (3s reveal, then 3s cooldown)</li>
            <li>Peeking before completion adds penalty time (if enabled)</li>
            <li>Break timers are always visible with alerts</li>
            <li>Complete 4 pomodoros to earn a long break</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Index;
