import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SectionTitle from "@/components/SectionTitle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Trophy, Car } from "lucide-react";
import { getOcorrencias } from "@/services/api";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const RANK_COLORS = [
  "text-yellow-400 border-yellow-400/40",  // #1
  "text-slate-300 border-slate-300/40",    // #2
  "text-amber-600 border-amber-600/40",    // #3
];

const Dashboard = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear]   = useState(now.getFullYear());

  const isCurrentOrFuture = year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (isCurrentOrFuture) return;
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["ocorrencias", month, year],
    queryFn: () => getOcorrencias(month, year),
  });

  const ranking = data?.ranking ?? [];
  const topCount = ranking[0]?.count ?? 1;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <SectionTitle
          title="DASHBOARD"
          subtitle="Ranking mensal de apreensões do G.A.R."
        />

        {/* Month navigator */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <button
            onClick={prevMonth}
            className="rounded-full p-2 transition-colors hover:bg-secondary text-muted-foreground hover:text-primary"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="font-display text-lg font-bold tracking-widest text-primary min-w-[200px] text-center">
            {MONTHS[month - 1].toUpperCase()} {year}
          </span>
          <button
            onClick={nextMonth}
            disabled={isCurrentOrFuture}
            className="rounded-full p-2 transition-colors hover:bg-secondary text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-tactical animate-pulse h-20" />
            ))}
          </div>
        ) : ranking.length === 0 ? (
          <div className="text-center py-20">
            <Car size={52} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">
              Nenhuma apreensão registrada em {MONTHS[month - 1]} {year}.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ranking.map((entry, index) => {
              const rankColor = RANK_COLORS[index] ?? "text-muted-foreground border-border";
              const pct = Math.round((entry.count / topCount) * 100);

              return (
                <div key={entry.member_id} className="card-tactical border-glow-blue flex items-center gap-4">
                  {/* Position */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center font-display font-bold text-sm ${rankColor}`}>
                    {index === 0 ? <Trophy size={16} /> : `#${index + 1}`}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-12 w-12 border-2 border-primary/30 flex-shrink-0">
                    {entry.photo_url ? (
                      <AvatarImage src={entry.photo_url} alt={entry.member_name} />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary font-display font-bold">
                        {getInitials(entry.member_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Name + bar */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold text-primary tracking-wide truncate">
                      {entry.member_name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Count */}
                  <div className="flex-shrink-0 text-right">
                    <span className="font-display text-xl font-bold text-glow-blue text-primary">{entry.count}</span>
                    <p className="text-xs text-muted-foreground">{entry.count === 1 ? "apreensão" : "apreensões"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
