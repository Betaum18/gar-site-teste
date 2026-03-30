import { ExternalLink } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe_PLACEHOLDER/viewform";

const Inscricao = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-lg">
        <SectionTitle
          title="INSCRIÇÃO"
          subtitle="Deseja fazer parte do Grupamento de Acompanhamento Rápido? Clique no botão abaixo para preencher o formulário oficial."
        />

        <div className="card-tactical border-glow-blue text-center space-y-6">
          <p className="text-sm text-muted-foreground">
            O processo de inscrição é realizado através do formulário oficial do Google Forms. Preencha todas as informações solicitadas com atenção.
          </p>

          <a
            href="https://docs.google.com/forms/d/1-lsAV9gRsToVE77_cbqp87XZYVRoAfeKj53Nsju7H7s/viewform"
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
  );
};

export default Inscricao;
