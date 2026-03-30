import { Link } from "react-router-dom";
import { BookOpen, UserPlus, Crosshair, Radio, Car } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import garLogo from "@/assets/gar-logo.png";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroBanner}
          alt="GAR em ação tática noturna"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="animate-fade-in-up">
            <img src={garLogo} alt="GAR Logo" className="h-28 w-28 mx-auto mb-6 rounded-full drop-shadow-[0_0_20px_hsl(210,100%,55%,0.5)]" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-[0.2em] text-foreground text-glow-blue animate-fade-in-up animation-delay-100">
            GAR
          </h1>
          <p className="font-display text-lg md:text-xl tracking-[0.3em] text-primary mt-4 animate-fade-in-up animation-delay-200">
            AGILIDADE • DISCIPLINA • HONRA
          </p>
          <p className="text-muted-foreground mt-6 max-w-xl mx-auto text-base md:text-lg animate-fade-in-up animation-delay-300">
            O Grupamento de Acompanhamento Rápido é uma unidade de elite dedicada à manutenção da ordem
            pública através de operações táticas de alta precisão.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-in-up animation-delay-400">
            <Link
              to="/sobre"
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-secondary text-secondary-foreground font-medium text-sm transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(210,100%,55%,0.3)]"
            >
              <img src={garLogo} alt="GAR" className="h-4 w-4 rounded-full" /> Sobre
            </Link>
            <Link
              to="/manual"
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-secondary text-secondary-foreground font-medium text-sm transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(210,100%,55%,0.3)]"
            >
              <BookOpen size={16} /> Manual
            </Link>
            <Link
              to="/inscricao"
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-all hover:shadow-[0_0_20px_hsl(210,100%,55%,0.4)] hover:scale-105"
            >
              <UserPlus size={16} /> Inscrição
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Crosshair, title: "Ações Especiais", desc: "Operações táticas coordenadas com precisão e eficiência máxima." },
              { icon: Car, title: "Patrulhamento Tático", desc: "Presença estratégica nas ruas com viaturas equipadas e equipes treinadas." },
              { icon: Radio, title: "Comunicação Integrada", desc: "Sistema de rádio avançado para coordenação em tempo real entre unidades." },
            ].map((item, i) => (
              <div
                key={i}
                className="card-tactical border-glow-blue group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                <item.icon className="h-10 w-10 text-primary mb-4 transition-transform group-hover:scale-110" />
                <h3 className="font-display text-lg font-semibold tracking-wide text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
