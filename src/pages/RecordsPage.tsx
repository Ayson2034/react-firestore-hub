import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCareLogs, calculateChallengeStats } from "@/services/firestore";
import { CareLog } from "@/types";
import { ChevronLeft, ChevronRight, Flame, Trophy } from "lucide-react";

export default function RecordsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<CareLog[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ streak: 0, totalDays: 0, remainingDays: 90 });

  useEffect(() => {
    if (!user) return;
    getCareLogs(user.id).then((data) => {
      setLogs(data);
      setCompletedDates(new Set(data.map((l) => l.completionDate)));
      setStats(calculateChallengeStats(data));
    });
  }, [user]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // RF days in this month
  const rfDaysSet = new Set<number>();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if ([1, 3, 5, 6].includes(date.getDay())) rfDaysSet.add(d);
  }

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="px-5 pt-8 pb-4 animate-fade-in">
      <h1 className="text-xl font-bold text-foreground mb-6">케어 기록</h1>

      {/* Calendar */}
      <div className="rounded-2xl border border-border p-4 bg-card mb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="font-bold text-foreground">
            {year}년 {month + 1}월
          </h2>
          <button onClick={nextMonth} className="p-1">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day, i) => {
            if (day === null) return <div key={i} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isCompleted = completedDates.has(dateStr);
            const isToday = dateStr === today;
            const isRf = rfDaysSet.has(day);

            return (
              <div
                key={i}
                className={`relative py-2 text-sm rounded-full ${
                  isToday ? "ring-2 ring-primary" : ""
                } ${isCompleted ? "bg-challenge-gold/20" : ""}`}
              >
                <span className={`${isCompleted ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                  {day}
                </span>
                {isCompleted && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-challenge-gold" />
                )}
                {isRf && isCompleted && (
                  <Flame className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-3 text-destructive" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge Card */}
      <div className="rounded-2xl border border-border p-5 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-challenge-gold" />
          <h2 className="font-bold text-foreground">90일 챌린지</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">연속일</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.totalDays}</p>
            <p className="text-xs text-muted-foreground">누적일</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-muted-foreground">{stats.remainingDays}</p>
            <p className="text-xs text-muted-foreground">남은일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
