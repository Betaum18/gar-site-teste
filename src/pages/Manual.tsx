import { AlertTriangle, Users, Car, Radio, Gavel } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    icon: Users,
    id: "postura",
    title: "Postura em Serviço",
    items: [
      "Manter postura profissional e respeitosa em todas as interações.",
      "Usar linguagem adequada no rádio e comunicações internas.",
      "Estar sempre uniformizado e identificado durante o serviço.",
      "Manter o equipamento limpo, funcional e em condições de uso.",
      "Evitar conversas pessoais durante operações ativas.",
    ],
  },
  {
    icon: Users,
    id: "hierarquia",
    title: "Hierarquia e Respeito",
    items: [
      "Respeitar a cadeia de comando em todas as circunstâncias.",
      "Ordens superiores devem ser cumpridas sem questionamento em campo.",
      "Qualquer discordância deve ser levada ao superior via canal adequado.",
      "Tratar todos os colegas com respeito, independente da patente.",
      "Insubordinação será tratada com rigor conforme o código interno.",
    ],
  },
  {
    icon: Radio,
    id: "acompanhamento",
    title: "Regras de Acompanhamento",
    items: [
      "Todo acompanhamento deve ser autorizado pela central.",
      "Manter distância segura do veículo acompanhado.",
      "Reportar posição e direção a cada 30 segundos.",
      "Não iniciar perseguição sem autorização superior.",
      "Priorizar a segurança de civis em todas as situações.",
    ],
  },
  {
    icon: Car,
    id: "viaturas",
    title: "Uso de Viaturas",
    items: [
      "Realizar checklist obrigatório antes de cada turno.",
      "Velocidade máxima permitida: conforme orientação da central.",
      "Uso de sirene e giroflex apenas em código autorizado.",
      "Proibido uso pessoal de viaturas em qualquer circunstância.",
      "Danos à viatura devem ser reportados imediatamente.",
    ],
  },
  {
    icon: Gavel,
    id: "penalidades",
    title: "Penalidades Internas",
    items: [
      "Advertência verbal — primeira infração leve.",
      "Advertência escrita — reincidência ou infração moderada.",
      "Suspensão temporária — infração grave ou acúmulo de advertências.",
      "Desligamento — infração gravíssima ou conduta incompatível.",
      "Todas as penalidades são registradas no prontuário do agente.",
    ],
  },
];

const Manual = () => (
  <div className="min-h-screen pt-24 pb-16 px-4">
    <div className="container mx-auto max-w-3xl">
      <SectionTitle
        title="MANUAL DE CONDUTA"
        subtitle="Diretrizes e regulamentos internos do Grupamento de Ações Rápidas."
      />

      <div className="card-tactical mb-8 flex items-start gap-3 border-accent/30">
        <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="text-accent font-semibold">Atenção:</span> O cumprimento integral deste manual
          é obrigatório para todos os membros do GAR. O desconhecimento das normas não isenta o agente
          de responsabilidade.
        </p>
      </div>

      <Accordion type="multiple" className="space-y-3">
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="card-tactical border-glow-blue border border-border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-0 py-0 hover:no-underline">
              <div className="flex items-center gap-3">
                <section.icon className="h-5 w-5 text-primary" />
                <span className="font-display text-sm font-semibold tracking-wide text-foreground">
                  {section.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 mt-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1 text-xs">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

export default Manual;
