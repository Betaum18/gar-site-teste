import { ExternalLink } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const GAR_FORM_URL = "https://docs.google.com/forms/d/1-lsAV9gRsToVE77_cbqp87XZYVRoAfeKj53Nsju7H7s/viewform";
const SUPLENTE_FORM_URL = "https://forms.gle/rqPotugELsMCfUxN7";

const Inscricao = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <SectionTitle
          title="INSCRIÇÃO"
          subtitle="Escolha a modalidade de ingresso no Grupamento de Acompanhamento Rápido e preencha o formulário correspondente."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card GAR */}
          <div className="card-tactical border-glow-blue text-center space-y-6">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-widest text-primary mb-2">MEMBRO G.A.R</h2>
              <p className="text-sm text-muted-foreground">
                Torne-se um membro efetivo do Grupamento de Acompanhamento Rápido. Preencha todas as informações solicitadas com atenção.
              </p>
            </div>

            <a
              href={GAR_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wider transition-all hover:shadow-[0_0_25px_hsl(210,100%,55%,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink size={18} /> PREENCHER FORMULÁRIO
            </a>

            <p className="text-xs text-muted-foreground/60">
              Você será redirecionado para o Google Forms em uma nova aba.
            </p>
          </div>

          {/* Card Suplente */}
          <div className="card-tactical border-glow-blue text-center space-y-6">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-widest text-primary mb-2">SUPLENTE</h2>
              <p className="text-sm text-muted-foreground">
                O suplente é um membro temporário que atua quando nenhum GAR está em serviço. Preencha o formulário para se candidatar.
              </p>
            </div>

            <a
              href={SUPLENTE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wider transition-all hover:shadow-[0_0_25px_hsl(210,100%,55%,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink size={18} /> PREENCHER FORMULÁRIO
            </a>

            <p className="text-xs text-muted-foreground/60">
              Você será redirecionado para o Google Forms em uma nova aba.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inscricao;
