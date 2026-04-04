import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCarePrograms } from "@/services/firestore";
import { CareProgram } from "@/types";
import { isRfDay } from "@/data/carePrograms";
import { ArrowLeft, Clock, Flame, Zap } from "lucide-react";

export default function CareSelectPage() {
  const [programs, setPrograms] = useState<CareProgram[]>([]);
  const navigate = useNavigate();
  const rfToday = isRfDay();

  useEffect(() => {
    getCarePrograms().then((data) => {
      setPrograms(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background px-5 pt-6 pb-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">돌아가기</span>
      </button>

      <h1 className="text-xl font-bold text-foreground mb-2">케어 모드 선택</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {rfToday ? (
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-destructive" />
            오늘은 RF 케어일입니다
          </span>
        ) : (
          "오늘은 회복일입니다"
        )}
      </p>

      <div className="space-y-4">
        {programs.map((program) => (
          <button
            key={program.id}
            onClick={() => navigate(`/care-timer/${program.id}`, { state: { program } })}
            className="w-full text-left rounded-2xl border border-border p-5 bg-card hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground text-lg">{program.name}</h3>
                <p className="text-sm text-primary-light font-medium">{program.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{Math.floor(program.totalSec / 60)}분</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{program.description}</p>
            <div className="flex items-center gap-2 mt-3">
              {program.rfRequired && (
                <span className="flex items-center gap-1 text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                  <Flame className="w-3 h-3" /> RF 포함
                </span>
              )}
              <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                <Zap className="w-3 h-3" /> {program.steps.filter((s) => !s.isPrep).length}단계
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
