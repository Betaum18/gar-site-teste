import { AlertTriangle, Shield, Users, Car, Radio, Crosshair, Shirt, MessageSquare, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Manual = () => (
  <div className="min-h-screen pt-24 pb-16 px-4">
    <div className="container mx-auto max-w-3xl">
      <SectionTitle
        title="MANUAL DE CONDUTA"
        subtitle="Diretrizes e regulamentos internos do Grupamento de Acompanhamento Rápido."
      />

      <div className="card-tactical mb-8 flex items-start gap-3 border-accent/30">
        <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="text-accent font-semibold">Atenção:</span> Este documento foi criado com o fim de instruir e esclarecer dúvidas quanto ao funcionamento do Grupamento de Acompanhamento Rápido (G.A.R) a todos os oficiais interessados a ingressar, membros do grupamento e demais oficiais que tiverem tal necessidade.
        </p>
      </div>

      <p className="text-sm text-muted-foreground mb-8 card-tactical">
        A G.A.R. é o grupamento responsável por assumir ocorrências que demandem acompanhamento rápido para interceptação de transgressores, utilizando viaturas destinadas a esse fim, denominadas <span className="text-primary font-semibold">SPEEDs</span>.
      </p>

      <Accordion type="multiple" className="space-y-3">

        {/* 1. DISPOSIÇÕES INICIAIS */}
        <AccordionItem value="disposicoes" className="card-tactical border-glow-blue border border-border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-semibold tracking-wide text-foreground">1. Disposições Iniciais</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 mt-2 text-sm text-muted-foreground">
              <p>Este documento foi elaborado com a finalidade de instruir e esclarecer dúvidas quanto ao funcionamento do Grupamento de Acompanhamento Rápido (G.A.R), destinando-se a todos os oficiais interessados em ingressar no grupamento, bem como aos seus membros e demais oficiais que necessitem deste conhecimento.</p>
              <p>A G.A.R. é o grupamento responsável por assumir ocorrências que demandem acompanhamento rápido para interceptação de transgressores, utilizando viaturas destinadas a esse fim, denominadas <span className="text-primary font-semibold">SPEEDs</span>.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. REGRAS GERAIS */}
        <AccordionItem value="regras" className="card-tactical border-glow-blue border border-border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-semibold tracking-wide text-foreground">2. Regras Gerais</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-4 mt-2 text-sm text-muted-foreground">
              <li><span className="text-primary font-semibold">2.1</span> — Todas as SPEEDs que estiverem em QRV e em código 0 deverão prestar apoio e assumir a primária em todas as QRUs que envolvam veículos de alta performance. A prioridade da G.A.R. é assumir acompanhamentos com a finalidade de concluí-los com êxito.</li>
              <li><span className="text-primary font-semibold">2.2</span> — Caso durante uma perseguição a SPEED capote, fure pneu e/ou acabe a gasolina, o piloto deve informar a MARÉ imediatamente. A SPEED deve informar QTA de perseguição e <span className="text-accent font-semibold">NÃO</span> poderá retornar ao acompanhamento (o descumprimento dessa regra acarretará em advertência militar).</li>
              <li><span className="text-primary font-semibold">2.3</span> — Os acompanhamentos existirão, por padrão, no limite máximo de 3 (três) unidades, sendo que a G.A.R. é limitada a 1 (uma) unidade por acompanhamento, ou seja, é permitida apenas <span className="text-accent font-semibold">UMA SPEED</span> por acompanhamento.
                <ul className="ml-4 mt-2">
                  <li><span className="text-primary font-semibold">2.3.1</span> — Se a SPEED primária der QTA, não é permitido que outra unidade da G.A.R. assuma a mesma QRU.</li>
                </ul>
              </li>
              <li><span className="text-primary font-semibold">2.4</span> — É proibido ao piloto realizar manobras de drift ou dar "cavalo de pau" com a viatura em código 0. O uso do freio de mão somente será permitido em perseguições e em curvas que exijam o uso do mesmo para retomada rápida de posição.</li>
              <li><span className="text-primary font-semibold">2.5</span> — É proibido realizar PTR sozinho na viatura. O P1 deve sempre priorizar a presença de um P2 para auxílio.</li>
              <li><span className="text-primary font-semibold">2.6</span> — Pilotos plenos e seniores que estiverem patrulhando com estagiários deverão intercalar o posto de P1 durante as PTR, permitindo que os estagiários pratiquem e participem das perseguições, desde que estejam sendo avaliados.</li>
              <li><span className="text-primary font-semibold">2.7</span> — Estagiários da G.A.R. somente poderão patrulhar junto de piloto pleno ou sênior do grupamento para fins de avaliação. Excepcionalmente, na ausência de pilotos em QRV, o estagiário poderá atuar com as viaturas GT3/Typer-R, apenas com autorização do comando, subcomando ou quando autorizado por piloto oficial.</li>
              <li><span className="text-primary font-semibold">2.8</span> — É proibido realizar transporte de detentos ou civis nas viaturas da G.A.R. Deve-se sempre solicitar apoio de uma viatura quatro portas, com exceção das viaturas quatro portas da própria G.A.R.</li>
              <li><span className="text-primary font-semibold">2.9</span> — Todos os membros da G.A.R. não estão isentos de realizar qualquer tipo de operação. Devem priorizar os acompanhamentos, porém, quando necessário, poderão atender outras QRUs e assumir as mesmas normalmente.</li>
              <li><span className="text-primary font-semibold">2.10</span> — Todas as regras e leis da polícia devem continuar sendo seguidas da mesma maneira. Fazer parte da G.A.R. não isenta o oficial de procedimentos nem lhe concede privilégios.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 3. HIERARQUIA */}
        <AccordionItem value="hierarquia" className="card-tactical border-glow-blue border border-border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-semibold tracking-wide text-foreground">3. Hierarquia</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mt-2 mb-4">A hierarquia interna da G.A.R. define a organização das funções e responsabilidades dentro do grupamento, não se sobrepondo à hierarquia geral da polícia.</p>
            <div className="space-y-4">
              {[
                { rank: "3.1 — Comando", desc: "Responsável geral pelo grupamento. Realiza a tomada de decisões importantes, gerencia os membros, resolve problemas internos, define funções, organiza a divisão das SPEEDs quando necessário, é responsável pela abertura de vagas e por tudo que diz respeito à G.A.R." },
                { rank: "3.2 — Subcomando", desc: "Segundo responsável geral pelo grupamento. Pode autorizar a liberação de viaturas da G.A.R. para estagiários em casos de necessidade, auxilia diretamente o comando e assume a função de comando na ausência deste." },
                { rank: "3.3 — Terceiro Comando", desc: "Auxilia o comando e o subcomando, podendo autorizar a liberação de viaturas para estagiários quando necessário, além de assumir funções de comando ou subcomando na ausência dos mesmos." },
                { rank: "3.4 — Piloto Sênior", desc: "Piloto oficial experiente. Pode autorizar piloto pleno a patrulhar nas viaturas da G.A.R., auxilia os comandos, avalia e treina novatos, estagiários, juniores e pilotos plenos." },
                { rank: "3.5 — Piloto Pleno", desc: "Piloto oficial do grupamento. Não necessita estar constantemente acompanhado de piloto sênior, pois possui conhecimento e experiência suficientes para desempenhar suas atribuições, podendo receber novas responsabilidades dentro do grupamento." },
                { rank: "3.6 — Piloto Júnior", desc: "Piloto oficial iniciante, recém-saído da fase de estágio. Possui liberdade para utilizar viaturas da G.A.R., devendo priorizar patrulhamento acompanhado de piloto mais experiente quando houver contingente suficiente." },
                { rank: "3.7 — Estagiário", desc: "Oficiais aprovados na prova teórica. Devem atuar acompanhados de piloto pleno ou sênior. Podem assumir P1 nas SPEEDs apenas quando acompanhados de piloto oficial, realizando PTRs para fins de avaliação. Na ausência de pilotos oficiais, poderão utilizar viatura específica voltada ao estágio." },
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-4">
                  <h4 className="text-sm font-semibold text-primary">{item.rank}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 4. ACOMPANHAMENTOS */}
        <AccordionItem value="acompanhamentos" className="card-tactical border-glow-blue border border-border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-center gap-3">
              <Crosshair className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-semibold tracking-wide text-foreground">4. Acompanhamentos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mt-2 mb-4">A G.A.R. é uma unidade especializada, preparada para realizar acompanhamentos rápidos com veículos de alta performance, exigindo elevado nível de habilidade prática e domínio das viaturas.</p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><span className="text-primary font-semibold">4.1 — Função do P1:</span> Cabe ao P1 manter contato visual com o veículo acompanhado, conduzir a viatura de forma segura, administrar combustível e zelar pela segurança própria e do P2. Também é responsável pelo uso correto dos sinais luminosos e sonoros do giroflex.</li>
              <li><span className="text-primary font-semibold">4.2</span> — Em caso de colisão, capotamento, pneu furado ou falta de combustível, a viatura deverá informar QTA e outra viatura da G.A.R. não poderá assumir.</li>
              <li>
                <span className="text-primary font-semibold">4.3</span> — Todo acompanhamento terá duração máxima de <span className="text-accent font-semibold">15 minutos</span>. Caso o infrator não se entregue ou não perca a fuga dentro desse período, poderão ser adotadas medidas para interceptação:
                <ul className="ml-4 mt-2 space-y-1">
                  <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" /> QRUs de roubo a ATM, registradora, tráfico de drogas e fuga de abordagem: <span className="text-accent font-semibold">código 5 no pneu</span>.</li>
                  <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" /> QRUs de corrida ilegal: <span className="text-accent font-semibold">manobra PIT</span> (bater na traseira do veículo acompanhado com a intenção de fazê-lo perder o controle e se entregar).</li>
                </ul>
              </li>
              <li><span className="text-primary font-semibold">4.4 — Função do P2:</span> O P2 é responsável pela modulação no rádio e CP, mantendo comunicação constante com a MARÉ, informando ocorrências, ordens de parada e repassando dados necessários aos P1, bem como atualizando o QTH durante o acompanhamento.</li>
              <li><span className="text-primary font-semibold">4.5</span> — Em casos de fuga com motocicleta, a prioridade será da G.T.M.</li>
              <li><span className="text-primary font-semibold">4.6</span> — É obrigação do P2 da primária realizar a modulação. Em caso de impossibilidade, o P1 poderá assumir.</li>
              <li><span className="text-primary font-semibold">4.7</span> — Em caso de colisão envolvendo terceiros, o socorro deverá ser prestado até que todos os oficiais da QSV estejam bem, podendo então retornar.</li>
              <li><span className="text-primary font-semibold">4.8 — Modulação Básica:</span> A modulação deve ser clara, objetiva e sucinta, evitando poluição no rádio. Os oficiais devem conhecer pontos estratégicos e referências da cidade.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 5. ABORDAGENS */}
        <AccordionItem value="abordagens" className="card-tactical border-glow-blue border border-border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-center gap-3">
              <Crosshair className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-semibold tracking-wide text-foreground">5. Abordagens</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-4 mt-2 text-sm text-muted-foreground">
              <li><span className="text-primary font-semibold">5.1</span> — No início de uma abordagem, o P1 deve acionar os sinais luminosos e sonoros, enquanto o P2 dá a ordem de parada por voz. Após a parada, a SPEED deve ser posicionada atrás do veículo abordado, mantendo os procedimentos padrão da polícia.
                <ul className="ml-4 mt-2">
                  <li><span className="text-primary font-semibold">5.1.1</span> — Quando a SPEED atuar como apoio, deverá manter posição segura ao redor da QSV, garantindo controle visual do abordado e atenção constante ao entorno.</li>
                </ul>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 6. MODULAÇÃO */}
        <AccordionItem value="modulacao" className="card-tactical border-glow-blue border border-border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-center gap-3">
              <Radio className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-semibold tracking-wide text-foreground">6. Modulação</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mt-2 mb-4">A modulação deve ser feita de forma clara, objetiva e sucinta, transmitindo apenas informações relevantes.</p>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="bg-secondary/50 rounded-md p-3 border border-border">
                <h4 className="text-primary font-semibold mb-1">6.1 — Início do Código 0 (CP)</h4>
                <p className="italic">QAP MARÉ, SPEED [número da QSV] iniciando código 0 com [quantidade de oficiais].</p>
                <p className="mt-1 text-xs text-muted-foreground/70">Exemplo: "QAP MARÉ, SPEED 005 iniciando código 0 com 1 mike e 1 fox."</p>
              </div>
              <div className="bg-secondary/50 rounded-md p-3 border border-border">
                <h4 className="text-primary font-semibold mb-1">6.2 — Atendimento de QRU (Rádio)</h4>
                <p className="italic">QAP MARÉ, SPEED [número da QSV] QTI da última QRU.</p>
              </div>
              <div className="bg-secondary/50 rounded-md p-3 border border-border">
                <h4 className="text-primary font-semibold mb-1">6.3 — Início do acompanhamento</h4>
                <p className="italic">"QAP MARÉ, SPEED 001 iniciando acompanhamento a um veículo da QRU de ATM. Vaga para mais duas unidades, exceto SPEED."</p>
              </div>
              <div className="bg-secondary/50 rounded-md p-3 border border-border">
                <h4 className="text-primary font-semibold mb-1">6.4 — Durante (CP)</h4>
                <p>Veículo – cor – placa – QRU – horário de início.</p>
              </div>
              <div className="bg-secondary/50 rounded-md p-3 border border-border">
                <h4 className="text-primary font-semibold mb-1">6.5 — Assumindo primária</h4>
                <p>Deve ser solicitada no rádio a esquerda livre para assumir a primária. Após autorização e posicionamento correto, o P1 assume pela esquerda.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 7. VIATURAS */}
        <AccordionItem value="viaturas" className="card-tactical border-glow-blue border border-border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-semibold tracking-wide text-foreground">7. Viaturas da G.A.R.</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 mt-2 text-sm text-muted-foreground">
              <div className="border-l-2 border-primary/30 pl-4">
                <h4 className="text-primary font-semibold">7.1 — Padrão</h4>
                <p>GT3 – Viatura principal, liberada para pilotos oficiais da G.A.R.</p>
              </div>
              <div className="border-l-2 border-primary/30 pl-4">
                <h4 className="text-primary font-semibold">7.2 — Veículo Premium – Gema</h4>
                <p>polf430 – Liberado para todos os pilotos.</p>
              </div>
              <div className="border-l-2 border-primary/30 pl-4">
                <h4 className="text-primary font-semibold">7.3 — Platina</h4>
                <p>Liberados para aquisição por pilotos da G.A.R. conforme critérios estabelecidos:</p>
                <ul className="mt-1 space-y-1">
                  <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-primary" /> Amg GTR</li>
                  <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-primary" /> Silvia 15</li>
                  <li className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-primary" /> Rx7</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 8. FARDAMENTO */}
        <AccordionItem value="fardamento" className="card-tactical border-glow-blue border border-border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-center gap-3">
              <Shirt className="h-5 w-5 text-primary" />
              <span className="font-display text-sm font-semibold tracking-wide text-foreground">8. Fardamento da G.A.R.</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mt-2 mb-4">O fardamento representa organização, disciplina e identificação, contribuindo para o reconhecimento institucional da G.A.R.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-md p-3 border border-border">
                <h4 className="text-primary font-semibold mb-2">8.1 — Roupa Masculina</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Chapéu — 243</li>
                  <li>Máscara — 247</li>
                  <li>Mãos — 5</li>
                  <li>Camiseta — 264</li>
                  <li>Jaqueta — 658</li>
                  <li>Calça — 243</li>
                  <li>Sapato — 25</li>
                  <li>Acessórios — 201</li>
                  <li>Colete — 62 textura 3</li>
                </ul>
              </div>
              <div className="bg-secondary/50 rounded-md p-3 border border-border">
                <h4 className="text-primary font-semibold mb-2">8.2 — Roupa Feminina</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Chapéu — 242</li>
                  <li>Máscara — 246</li>
                  <li>Mãos — 5</li>
                  <li>Camiseta — 264</li>
                  <li>Jaqueta — 658</li>
                  <li>Calça — 243</li>
                  <li>Sapato — 25</li>
                  <li>Acessórios — 171</li>
                  <li>Colete — 4 textura 3</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* Disposições Finais */}
      <div className="card-tactical mt-8 flex items-start gap-3 border-accent/30">
        <MessageSquare className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="text-accent font-semibold">Disposições Finais:</span> O descumprimento das normas previstas neste manual poderá acarretar advertência, suspensão ou desligamento do grupamento, conforme avaliação do comando da G.A.R.
        </p>
      </div>
    </div>
  </div>
);

export default Manual;
