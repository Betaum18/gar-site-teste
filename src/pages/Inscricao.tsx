import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Inscricao = () => {
  const [submitted, setSubmitted] = useState(false);
  const [experiencia, setExperiencia] = useState("nao");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="card-tactical text-center max-w-md border-glow-blue animate-fade-in-up">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold tracking-wider text-foreground text-glow-blue mb-2">
            INSCRIÇÃO ENVIADA
          </h2>
          <p className="text-muted-foreground">
            Sua inscrição foi recebida com sucesso. Aguarde contato da nossa equipe de recrutamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-lg">
        <SectionTitle
          title="INSCRIÇÃO"
          subtitle="Preencha o formulário abaixo para se candidatar ao Grupamento de Ações Rápidas."
        />

        <form onSubmit={handleSubmit} className="card-tactical space-y-5 border-glow-blue">
          <div>
            <Label htmlFor="nome" className="text-sm font-medium text-foreground">Nome Completo</Label>
            <Input id="nome" required placeholder="Seu nome completo" className="mt-1.5 bg-secondary border-border focus:border-primary" />
          </div>

          <div>
            <Label htmlFor="id" className="text-sm font-medium text-foreground">ID / Identificador</Label>
            <Input id="id" required placeholder="Ex: 12345" className="mt-1.5 bg-secondary border-border focus:border-primary" />
          </div>

          <div>
            <Label htmlFor="idade" className="text-sm font-medium text-foreground">Idade</Label>
            <Input id="idade" type="number" required min={16} max={60} placeholder="Sua idade" className="mt-1.5 bg-secondary border-border focus:border-primary" />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Experiência Prévia</Label>
            <div className="flex gap-4 mt-1.5">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="radio" name="exp" value="sim" onChange={() => setExperiencia("sim")} className="accent-primary" />
                Sim
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="radio" name="exp" value="nao" defaultChecked onChange={() => setExperiencia("nao")} className="accent-primary" />
                Não
              </label>
            </div>
            {experiencia === "sim" && (
              <Input placeholder="Descreva brevemente sua experiência" className="mt-2 bg-secondary border-border focus:border-primary" />
            )}
          </div>

          <div>
            <Label htmlFor="motivo" className="text-sm font-medium text-foreground">Por que deseja entrar no GAR?</Label>
            <Textarea id="motivo" required rows={3} placeholder="Conte sua motivação..." className="mt-1.5 bg-secondary border-border focus:border-primary resize-none" />
          </div>

          <div>
            <Label htmlFor="disponibilidade" className="text-sm font-medium text-foreground">Disponibilidade</Label>
            <Input id="disponibilidade" required placeholder="Ex: Noites e fins de semana" className="mt-1.5 bg-secondary border-border focus:border-primary" />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wider transition-all hover:shadow-[0_0_25px_hsl(210,100%,55%,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send size={16} /> ENVIAR INSCRIÇÃO
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inscricao;
