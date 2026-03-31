export interface Crime {
  nome: string;
  pena: string;
  fianca?: string;
  adicionais?: string;
  observacao?: string;
}

export interface CategoriaCrime {
  categoria: string;
  crimes: Crime[];
}

export const crimes: CategoriaCrime[] = [
  {
    categoria: "Barbearia",
    crimes: [
      {
        nome: "Assalto a barbearia",
        pena: "6 serviços + 2k Multa",
        fianca: "6k + 2k Multa = 8k total",
      },
    ],
  },
  {
    categoria: "Loja de Armas",
    crimes: [
      {
        nome: "Assalto a loja/ammu (1-2 pessoas)",
        pena: "24 serviços + 21k Multa",
        adicionais: "Porte de armas, tentativa de homicídio contra servidor público",
      },
      {
        nome: "Assalto a loja de departamento (3+ pessoas)",
        pena: "29 serviços + 23k Multa",
        adicionais: "Associação, porte de armas, tentativa de homicídio contra servidor público",
      },
    ],
  },
  {
    categoria: "Desmanche / Boosting",
    crimes: [
      {
        nome: "Roubo, desmanche de carros",
        pena: "12 serviços + 8k Multa",
        fianca: "12k + 8k Multa = 20k total",
        adicionais: "Associação, porte de armas, tentativa de homicídio contra servidor público, fuga da polícia",
      },
    ],
  },
  {
    categoria: "Lavagem",
    crimes: [
      {
        nome: "Lavagem de dinheiro",
        pena: "6 serviços + 6,5k Multa",
        adicionais: "Fuga da polícia, equipamento ilegal",
      },
    ],
  },
  {
    categoria: "Roubo a Pertence / Porta-Malas",
    crimes: [
      {
        nome: "Furto",
        pena: "5 serviços + 2k Multa",
        fianca: "5k + 2k Multa = 7k total",
        adicionais: "Fuga da polícia, equipamento ilegal",
      },
    ],
  },
  {
    categoria: "ATM",
    crimes: [
      {
        nome: "Assalto a ATM",
        pena: "6 serviços + 2k Multa",
        fianca: "6k + 2k Multa = 8k total",
        adicionais: "Fuga da polícia, equipamento ilegal",
      },
    ],
  },
  {
    categoria: "Corrida Ilegal",
    crimes: [
      {
        nome: "Corrida ilegal",
        pena: "5 serviços + 4k Multa",
        fianca: "9k",
        adicionais: "Equipamento ilegal, porte de armas (exceto crimes de trânsito)",
        observacao: "Caso se entregue e não tente fuga: multa por direção perigosa + alta velocidade",
      },
    ],
  },
  {
    categoria: "Registradora",
    crimes: [
      {
        nome: "Furto",
        pena: "5 serviços + 2k Multa",
        fianca: "5k + 2k Multa = 7k total",
        adicionais: "Fuga da polícia, equipamento ilegal",
      },
    ],
  },
  {
    categoria: "Porte de Arma de Fogo",
    crimes: [
      {
        nome: "Pistola não utilizada",
        pena: "—",
        fianca: "6k + 13k Multa = 19k total",
        observacao: "Apenas se a arma não tiver sido utilizada",
      },
    ],
  },
  {
    categoria: "Assaltos Médios",
    crimes: [
      {
        nome: "Galinheiro / Madeireira / Açougue / Aeroporto do Norte / Ferro Velho / Assalto ao Zancudo / Assalto à Ilha / Blackout",
        pena: "19 serviços + 26k Multa",
        observacao: "Assalto qualificado mediano + crimes individuais",
      },
    ],
  },
  {
    categoria: "Assaltos Grandes",
    crimes: [
      {
        nome: "Fleecas / Joalheria / Bancos",
        pena: "23 serviços + 39k Multa",
        observacao: "Assalto qualificado + crimes individuais",
      },
    ],
  },
];
