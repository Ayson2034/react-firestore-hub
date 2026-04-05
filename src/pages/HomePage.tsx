import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { hasCompletedToday, getCareLogs, calculateChallengeStats } from "@/services/firestore";
import { isRfDay } from "@/data/carePrograms";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Flame, Zap, Trophy, Shield, Sparkles } from "lucide-react";
import { format } from "date-fns";
import logo from "@/assets/logo.png";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completedToday, setCompletedToday] = useState(false);
  const [stats, setStats] = useState({ streak: 0, totalDays: 0, remainingDays: 90 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([hasCompletedToday(user.id), getCareLogs(user.id)]).then(
      ([done, logs]) => {
        setCompletedToday(done);
        setStats(calculateChallengeStats(logs));
        setLoading(false);
      }
    );
  }, [user]);

  if (!user) return null;

  const rfToday = isRfDay();
  const warrantyValid = new Date(user.warrantyExpiresAt) > new Date();

  return (
    <div className="px-5 pt-6 pb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <img src={logo} alt="조선힐러" className="h-10 object-contain" />
        <Sparkles className="w-5 h-5 text-primary-light" />
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground text-sm mt-1">
          비싼 시술보다 중요한 건<br />매일 5분입니다.
        </p>
      </div>

      {/* Care Start Button */}
      <button
        onClick={() => navigate("/care-select")}
        className={`w-full rounded-3xl p-6 text-center transition-all active:scale-[0.98] shadow-lg ${
          completedToday
            ? "bg-success text-success-foreground"
            : "bg-gradient-to-r from-primary to-primary-light text-primary-foreground"
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          {completedToday ? (
            <CheckCircle className="w-7 h-7" />
          ) : (
            <Zap className="w-7 h-7" />
          )}
        </div>
        <p className="text-lg font-bold">
          {completedToday ? "오늘 케어 완료" : "케어 시작하기"}
        </p>
        <p className="text-sm opacity-80 mt-1">
          {completedToday
            ? "내일도 함께해요"
            : rfToday
            ? "오늘은 RF 케어일"
            : "오늘은 회복일"}
        </p>
      </button>

      {/* 90-day Challenge */}
      <div className="mt-5 rounded-3xl glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-challenge-gold" />
          <h2 className="font-bold text-foreground text-sm">90일 챌린지</h2>
        </div>
        <Progress
          value={(stats.streak / 90) * 100}
          className="h-2.5 mb-3 rounded-full [&>div]:bg-challenge-gold [&>div]:rounded-full"
        />
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-bold">{stats.streak}일</span> / 90일
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-3xl glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-primary-light" />
            <span className="text-xs text-muted-foreground">연속 사용일</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{loading ? "-" : stats.streak}일</p>
        </div>
        <div className="rounded-3xl glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-primary-light" />
            <span className="text-xs text-muted-foreground">누적 사용일</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{loading ? "-" : stats.totalDays}일</p>
        </div>
      </div>

      {/* Warranty Info */}
      <div className="mt-4 rounded-3xl glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">정품 보증</span>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              warrantyValid
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {warrantyValid ? "유효" : "만료"}
          </span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground space-y-1">
          <p>정품번호: {user.serialNo}</p>
          <p>만료일: {format(new Date(user.warrantyExpiresAt), "yyyy.MM.dd")}</p>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
