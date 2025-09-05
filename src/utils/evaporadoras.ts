export const evaporadoras = {
  samsung: [
    {
      tipo: "Hi Wall",
      modelos: [
        { nominal: 5, real: 5118 },
        { nominal: 7, real: 7507 },
        { nominal: 9, real: 9554 },
        { nominal: 12, real: 12284 },
        { nominal: 15, real: 15355 },
        { nominal: 18, real: 19108 },
        { nominal: 24, real: 23203 },
        { nominal: 28, real: 27980 },
      ],
    },
    {
      tipo: "Cassete 1 Via",
      modelos: [
        { nominal: 7, real: 7507 },
        { nominal: 9, real: 9554 },
        { nominal: 12, real: 12284 },
        { nominal: 18, real: 18000 },
        { nominal: 24, real: 24000 },
      ],
    },
    {
      tipo: "Cassete 4 Vias",
      modelos: [
        { nominal: 9, real: 9000 },
        { nominal: 12, real: 12000 },
        { nominal: 18, real: 18000 },
        { nominal: 24, real: 24000 },
        { nominal: 30, real: 30000 },
        { nominal: 36, real: 36000 },
        { nominal: 48, real: 48000 },
        { nominal: 58, real: 58006 },
      ],
    },
    {
      tipo: "Duto",
      modelos: [
        { nominal: 12, real: 12284 },
        { nominal: 18, real: 19108 },
        { nominal: 24, real: 24226 },
        { nominal: 30, real: 30709 },
        { nominal: 36, real: 38216 },
        { nominal: 42, real: 43675 },
        { nominal: 48, real: 47770 },
        { nominal: 60, real: 54000 },
        { nominal: 76, real: 76800 },
        { nominal: 96, real: 96000 },
      ],
    },
    {
      tipo: "Piso Teto",
      modelos: [],
    },
  ],

  daikin: [
    {
      tipo: "Hi Wall",
      modelos: [
        { nominal: 7, real: 20 },
        { nominal: 9, real: 25 },
        { nominal: 12, real: 32 },
        { nominal: 15, real: 40 },
        { nominal: 18, real: 50 },
        { nominal: 24, real: 63 },
      ],
    },
    {
      tipo: "Cassete 1 Via",
      modelos: [
        { nominal: 7, real: 20 },
        { nominal: 9, real: 25 },
        { nominal: 12, real: 32 },
        { nominal: 15, real: 40 },
        { nominal: 18, real: 50 },
        { nominal: 24, real: 63 },
      ],
    },
    {
      tipo: "Cassete 4 Vias",
      modelos: [
        { nominal: 7, real: 20 },
        { nominal: 9, real: 25 },
        { nominal: 12, real: 32 },
        { nominal: 15, real: 40 },
        { nominal: 18, real: 50 },
        { nominal: 24, real: 63 },
        { nominal: 30, real: 80 },
        { nominal: 36, real: 100 },
        { nominal: 47, real: 125 },
        { nominal: 54, real: 140 },
      ],
    },
    {
      tipo: "Duto",
      modelos: [
        { nominal: 7, real: 20 },
        { nominal: 9, real: 25 },
        { nominal: 12, real: 32 },
        { nominal: 15, real: 40 },
        { nominal: 18, real: 50 },
        { nominal: 24, real: 63 },
        { nominal: 30, real: 80 },
        { nominal: 36, real: 100 },
        { nominal: 48, real: 125 },
        { nominal: 54, real: 140 },
      ],
    },
    {
      tipo: "Piso Teto",
      modelos: [
        { nominal: 12, real: 32 },
        { nominal: 24, real: 63 },
        { nominal: 36, real: 90 },
        { nominal: 48, real: 125 },
        { nominal: 54, real: 140 },
      ],
    },
  ],
} as const;
