import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpen } from "lucide-react";
import { isLoggedIn } from "@/services/auth";
import { getPenal } from "@/services/api";
import SectionTitle from "@/components/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";

const CodigoPenal = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login", { replace: true });
  }, [navigate]);

  const { data: entradas = [], isLoading, isError } = useQuery({
    queryKey: ["penal"],
    queryFn: getPenal,
  });

  const entradasFiltradas = entradas.filter((e) =>
    e["CONTRAVENÇÃO"].toLowerCase().includes(busca.toLowerCase()) ||
    e.ARTIGO.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          title="Código Penal"
          subtitle="Infrações, penas e fiancas do servidor"
        />

        {/* Campo de busca */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar por artigo ou contravenção..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-md border border-border bg-background/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        )}

        {/* Erro */}
        {isError && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-sm">Erro ao carregar o código penal. Tente novamente.</p>
          </div>
        )}

        {/* Tabela */}
        {!isLoading && !isError && (
          entradasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
              <BookOpen size={40} className="opacity-40" />
              <p className="text-sm">
                {busca
                  ? `Nenhum resultado para "${busca}"`
                  : "Nenhuma entrada encontrada."}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/60">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Artigo
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Contravenção
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Multa
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Pena
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Fiança
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entradasFiltradas.map((e, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-primary font-medium whitespace-nowrap">
                          {e.ARTIGO || "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {e["CONTRAVENÇÃO"] || "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground whitespace-nowrap">
                          {e.MULTA || "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground whitespace-nowrap">
                          {e.PENA || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {e["FIANÇA"] && e["FIANÇA"] !== "N/A" && e["FIANÇA"] !== "" ? (
                            <span className="text-primary font-medium">{e["FIANÇA"]}</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CodigoPenal;
