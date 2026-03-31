import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";
import { isLoggedIn } from "@/services/auth";
import SectionTitle from "@/components/SectionTitle";
import { crimes, CategoriaCrime } from "@/data/crimes";

const Crimes = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login", { replace: true });
  }, [navigate]);

  const categoriasFiltradas: CategoriaCrime[] = crimes
    .map((cat) => ({
      ...cat,
      crimes: cat.crimes.filter((crime) =>
        crime.nome.toLowerCase().includes(busca.toLowerCase())
      ),
    }))
    .filter((cat) => cat.crimes.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          title="Crimes & Penas"
          subtitle="Tabela de infrações e penalidades padrão do servidor"
        />

        {/* Campo de busca */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar crime..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-md border border-border bg-background/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Lista de categorias */}
        {categoriasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
            <AlertCircle size={40} className="opacity-40" />
            <p className="text-sm">Nenhum crime encontrado para "{busca}"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {categoriasFiltradas.map((cat) => (
              <div key={cat.categoria} className="rounded-lg border border-border overflow-hidden">
                {/* Header da categoria */}
                <div className="bg-secondary/60 px-4 py-3 border-b border-border">
                  <h2 className="font-display font-bold text-sm tracking-widest text-primary uppercase">
                    {cat.categoria}
                  </h2>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-background/40">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Crime
                        </th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Pena
                        </th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Fiança
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.crimes.map((crime, i) => (
                        <tr
                          key={i}
                          className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                        >
                          <td className="px-4 py-3 text-foreground align-top">
                            <p>{crime.nome}</p>
                            {crime.adicionais && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                <span className="font-medium">Adicionais: </span>
                                {crime.adicionais}
                              </p>
                            )}
                            {crime.observacao && (
                              <p className="mt-1 text-xs text-yellow-500/80 italic">
                                {crime.observacao}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-foreground align-top whitespace-nowrap">
                            {crime.pena}
                          </td>
                          <td className="px-4 py-3 align-top whitespace-nowrap">
                            {crime.fianca ? (
                              <span className="text-primary font-medium">{crime.fianca}</span>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Crimes;
