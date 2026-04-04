import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { addCareLog } from "@/services/firestore";
import { CareProgram, CareStep } from "@/types";
import { defaultCarePrograms } from "@/data/carePrograms";
import { Pause, Play, X, ChevronRight, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function CareTimerPage() {
  const { programId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const program: CareProgram =
    location.state?.program ||
    defaultCarePrograms.find((p) => p.id === programId) ||
    defaultCarePrograms[0];

  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startedAt] = useState(new Date().toISOString());
  const endTimeRef = useRef<number>(0);

  const currentStep = program.steps[stepIndex];
  const isPrep = currentStep?.isPrep;
  const totalTimerSteps = program.steps.filter((s) => !s.isPrep);
  const completedTimerSteps = program.steps.slice(0, stepIndex).filter((s) => !s.isPrep).length;

  // Total elapsed time for progress
  const totalDuration = program.steps.reduce((sum, s) => sum + s.durationSec, 0);
  const elapsedDuration = program.steps
    .slice(0, stepIndex)
    .reduce((sum, s) => sum + s.durationSec, 0) + (currentStep ? currentStep.durationSec - timeLeft : 0);
  const overallProgress = totalDuration > 0 ? (elapsedDuration / totalDuration) * 100 : 0;

  const goNextStep = useCallback(() => {
    // Notification + vibration
    try {
      if ("vibrate" in navigator) navigator.vibrate(200);
      if (Notification.permission === "granted") {
        new Notification("조선힐러", { body: `${currentStep?.name} 완료!` });
      }
    } catch {}

    if (stepIndex + 1 >= program.steps.length) {
      setIsComplete(true);
      // Save log
      if (user) {
        const now = new Date();
        addCareLog({
          userId: user.id,
          programId: program.id,
          startedAt,
          endedAt: now.toISOString(),
          completed: true,
          completionDate: now.toISOString().split("T")[0],
        });
      }
      return;
    }
    setStepIndex((prev) => prev + 1);
  }, [stepIndex, program, currentStep, user, startedAt]);

  // Initialize step timer
  useEffect(() => {
    if (isComplete) return;
    if (isPrep) return;
    const dur = currentStep?.durationSec || 0;
    if (dur === 0) return;
    setTimeLeft(dur);
    setIsPaused(false);
    endTimeRef.current = Date.now() + dur * 1000;
  }, [stepIndex, isComplete]);

  // Countdown timer
  useEffect(() => {
    if (isComplete || isPrep || isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        goNextStep();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, isPrep, isComplete, stepIndex, goNextStep]);

  const handlePause = () => {
    if (isPaused) {
      endTimeRef.current = Date.now() + timeLeft * 1000;
    }
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    navigate(-1);
  };

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Auto-navigate to home when complete
  useEffect(() => {
    if (isComplete) {
      navigate("/");
    }
  }, [isComplete, navigate]);

  if (isComplete) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen flex flex-col bg-timer-bg text-timer-foreground">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6">
        <button onClick={handleStop}>
          <X className="w-6 h-6 text-timer-foreground/60" />
        </button>
        <span className="text-sm text-timer-foreground/60">
          {program.name}
        </span>
        <div className="w-6" />
      </div>

      {/* Overall progress */}
      <div className="px-5 mt-4">
        <Progress
          value={overallProgress}
          className="h-1.5 bg-timer-foreground/10 [&>div]:bg-challenge-gold"
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Step name */}
        <div className="mb-2 text-sm text-timer-foreground/60">
          단계 {stepIndex + 1} / {program.steps.length}
        </div>
        <h2 className="text-xl font-bold mb-8">{currentStep.name}</h2>

        {isPrep ? (
          /* Prep step - no timer, just guide + next button */
          <div className="text-center">
            <p className="text-timer-foreground/80 text-base leading-relaxed mb-10 max-w-xs">
              {currentStep.guideText}
            </p>
            <Button
              onClick={goNextStep}
              className="h-14 px-10 rounded-2xl text-base font-medium"
            >
              {stepIndex === 0 ? "시작하기" : "다음 단계"}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        ) : (
          /* Timer step */
          <>
            <div className="text-[80px] font-bold leading-none tabular-nums mb-4">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <p className="text-timer-foreground/60 text-sm text-center max-w-xs mb-2">
              {currentStep.guideText}
            </p>
            {currentStep.direction && (
              <p className="text-primary text-sm font-medium text-center max-w-xs mb-10 flex items-center gap-1.5">
                {currentStep.direction}
              </p>
            )}
            {!currentStep.direction && <div className="mb-10" />}
            <div className="flex items-center gap-6">
              <button
                onClick={handleStop}
                className="w-14 h-14 rounded-full border border-timer-foreground/20 flex items-center justify-center"
              >
                <X className="w-6 h-6 text-timer-foreground/60" />
              </button>
              <button
                onClick={handlePause}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center"
              >
                {isPaused ? (
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                ) : (
                  <Pause className="w-8 h-8 text-primary-foreground" />
                )}
              </button>
              <div className="w-14 h-14" /> {/* Spacer */}
            </div>
          </>
        )}
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 pb-8">
        {program.steps.map((step, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === stepIndex
                ? "w-6 bg-challenge-gold"
                : i < stepIndex
                ? "bg-timer-foreground/40"
                : "bg-timer-foreground/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
