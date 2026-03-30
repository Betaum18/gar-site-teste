import { Target, Eye, Heart, Crosshair, Car, Shield } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const values = [
  { icon: Target, title: "Missão", text: "Garantir a segurança pública através de operações táticas de alta performance, atuando com rapidez e precisão em situações de risco elevado." },
  { icon: Eye, title: "Visão", text: "Ser reconhecido como o grupamento de referência em ações rápidas, inovação tática e excelência operacional." },
  { icon: Heart, title: "Valores", text: "Disciplina, Honra, Lealdade, Respeito à hierarquia, Compromisso com a justiça e Coragem inabalável." },
];

const areas = [
  { icon: Crosshair, title: "Ações Especiais", desc: "Intervenções em situações de alto risco com equipes especializadas e equipamentos de ponta." },
  { icon: Car, title: "Acompanhamento Tático", desc: "Perseguições e acompanhamentos veiculares com técnicas avançadas de condução defensiva e ofensiva." },
  { icon: Shield, title: "Patrulhamento Estratégico", desc: "Presença ostensiva em pontos críticos da cidade, com rotinas de patrulha inteligente e análise de dados." },
];

const Sobre = () => (
  <div className="min-h-screen pt-24 pb-16 px-4">
    <div className="container mx-auto max-w-4xl">
      <SectionTitle
        title="SOBRE O GAR"
        subtitle="Conheça o Grupamento de Ações Rápidas — uma unidade fictícia criada para representar o mais alto padrão de operações táticas."
      />

      <div className="card-tactical mb-12">
        <p className="text-muted-foreground leading-relaxed">
          O <span className="text-primary font-semibold">GAR — Grupamento de Ações Rápidas</span> é uma
          unidade de elite especializada em resposta rápida a ocorrências de alta complexidade.
          Com treinamento rigoroso e equipamentos de última geração, nossos agentes estão preparados
          para atuar em qualquer cenário, desde patrulhamento tático até operações especiais de grande escala.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Fundado com o propósito de elevar o padrão das forças policiais, o GAR opera sob princípios
          de disciplina militar, respeito à cadeia de comando e compromisso inabalável com a segurança
          da população.
        </p>
      </div>

      {/* Missão, Visão, Valores */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {values.map((v, i) => (
          <div key={i} className="card-tactical border-glow-blue text-center group hover:border-primary/40 transition-all">
            <v.icon className="h-10 w-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-display text-base font-semibold tracking-wide text-foreground mb-2">{v.title}</h3>
            <p className="text-sm text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>

      {/* Áreas de atuação */}
      <SectionTitle title="ÁREAS DE ATUAÇÃO" />
      <div className="space-y-4">
        {areas.map((a, i) => (
          <div key={i} className="card-tactical flex items-start gap-4 group hover:border-primary/40 transition-all">
            <a.icon className="h-8 w-8 text-primary mt-1 shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-display text-sm font-semibold tracking-wide text-foreground mb-1">{a.title}</h4>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Sobre;
