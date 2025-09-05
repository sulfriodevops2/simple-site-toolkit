// Seed Sulfrio Service – VRF, Multi, Diárias
// Requisitos: bun run scripts/seed.ts
import { supabase } from '../src/integrations/supabase/client';

// ---------- 1) Helpers ----------
async function upsert(table: string, {grupo, nome, codigo = null, ordem = 0, atributos = {}}: {
  grupo: string;
  nome: string;
  codigo?: string | null;
  ordem?: number;
  atributos?: any;
}) {
  const { error } = await supabase
    .from(table)
    .upsert({
      grupo,
      nome,
      codigo,
      ordem,
      atributos,
      ativo: true
    }, {
      onConflict: 'grupo,nome,codigo',
      ignoreDuplicates: false
    });
  
  if (error) {
    console.error(`Erro ao inserir ${table}:`, error);
  }
}

// ---------- 2) Dados ----------
// 2.1 VRF
const EVAPS_SAMSUNG = {
  'Hi Wall': [
    { nominal: 5, real: 5118, code: 'VEWS5' },
    { nominal: 7, real: 7507, code: 'VEWS7' },
    { nominal: 9, real: 9554, code: 'VEWS9' },
    { nominal: 12, real: 12284, code: 'VEWS12' },
    { nominal: 15, real: 15355, code: 'VEWS15' },
    { nominal: 18, real: 19108, code: 'VEWS18' },
    { nominal: 24, real: 23203, code: 'VEWS24' },
    { nominal: 28, real: 27980, code: 'VEWS28' },
  ],
  '1 Via': [
    { nominal: 7, real: 7507, code: 'VEC1S7' },
    { nominal: 9, real: 9554, code: 'VEC1S9' },
    { nominal: 12, real: 12284, code: 'VEC1S12' },
    { nominal: 18, real: 18000, code: 'VEC1S18' },
    { nominal: 24, real: 24000, code: 'VEC1S24' },
  ],
  '4 Vias': [
    { nominal: 9, real: 9000, code: 'VEC4S9' },
    { nominal: 12, real: 12000, code: 'VEC4S12' },
    { nominal: 18, real: 18000, code: 'VEC4S18' },
    { nominal: 24, real: 24000, code: 'VEC4S24' },
    { nominal: 30, real: 30000, code: 'VEC4S30' },
    { nominal: 36, real: 36000, code: 'VEC4S36' },
    { nominal: 48, real: 48000, code: 'VEC4S48' },
    { nominal: 58, real: 58006, code: 'VEC4S58' },
  ],
  'Duto': [
    { nominal: 12, real: 12284, code: 'VEDAS12' },
    { nominal: 18, real: 19108, code: 'VEDAS18' },
    { nominal: 24, real: 24226, code: 'VEDAS24' },
    { nominal: 30, real: 30709, code: 'VEDAS30' },
    { nominal: 36, real: 38216, code: 'VEDAS36' },
    { nominal: 42, real: 43675, code: 'VEDAS42' },
    { nominal: 48, real: 47770, code: 'VEDAS48' },
    { nominal: 60, real: 54000, code: 'VEDAS60' },
    { nominal: 76, real: 76800, code: 'VEDAS76' },
    { nominal: 96, real: 96000, code: 'VEDAS96' },
  ],
  'Piso Teto': []
};

const COND_SAMSUNG = {
  'Horizontal': [
    { hp: 4, real: 41287 },
    { hp: 5, real: 47770 },
    { hp: 6, real: 52888 },
    { hp: 7, real: 61760 },
    { hp: 8, real: 76432 },
    { hp: 10, real: 95540 },
    { hp: 12, real: 114648 },
    { hp: 14, real: 136486 },
  ],
  'Vertical': Array.from({length: 46}, (_, i) => ({ 
    hp: 8 + i * 2, 
    real: 76432 + i * 19108 
  }))
};

const EVAPS_DAIKIN = {
  'Hi Wall': [
    { nominal: 7, real: 20, codes: ['FXAQ20','VEWD7'] },
    { nominal: 9, real: 25, codes: ['FXAQ25','VEWD9'] },
    { nominal: 12, real: 32, codes: ['FXAQ32','VEWD12'] },
    { nominal: 15, real: 40, codes: ['FXAQ40','VEWD15'] },
    { nominal: 18, real: 50, codes: ['FXAQ50','VEWD18'] },
    { nominal: 24, real: 63, codes: ['FXAQ63','VEWD24'] },
  ],
  '1 Via': [
    { nominal: 7, real: 20, codes: ['FXEQ20','VEC1D7'] },
    { nominal: 9, real: 25, codes: ['FXEQ25','VEC1D9'] },
    { nominal: 12, real: 32, codes: ['FXEQ32','VEC1D12'] },
    { nominal: 15, real: 40, codes: ['FXEQ40','VEC1D15'] },
    { nominal: 18, real: 50, codes: ['FXEQ50','VEC1D18'] },
    { nominal: 24, real: 63, codes: ['FXEQ63','VEC1D24'] },
  ],
  '4 Vias': [
    { nominal: 7, real: 20, codes: ['FXFQ20','VEC4D7'] },
    { nominal: 9, real: 25, codes: ['FXFQ25','VEC4D9'] },
    { nominal: 12, real: 32, codes: ['FXFQ32','VEC4D12'] },
    { nominal: 15, real: 40, codes: ['FXFQ40','VEC4D15'] },
    { nominal: 18, real: 50, codes: ['FXFQ50','VEC4D18'] },
    { nominal: 24, real: 63, codes: ['FXFQ63','VEC4D24'] },
    { nominal: 30, real: 80, codes: ['FXFQ80','VEC4D30'] },
    { nominal: 36, real: 100, codes: ['FXFQ100','VEC4D36'] },
    { nominal: 47, real: 125, codes: ['FXFQ125','VEC4D47'] },
    { nominal: 54, real: 140, codes: ['FXFQ140','VEC4D54'] },
  ],
  'Duto': [
    { nominal: 7, real: 20, codes: ['FXSQ20','VEDAD7'] },
    { nominal: 9, real: 25, codes: ['FXSQ25','VEDAD9'] },
    { nominal: 12, real: 32, codes: ['FXSQ32','VEDAD12'] },
    { nominal: 15, real: 40, codes: ['FXSQ40','VEDAD15'] },
    { nominal: 18, real: 50, codes: ['FXSQ50','VEDAD50'] },
    { nominal: 24, real: 63, codes: ['FXSQ63','VEDAD63'] },
    { nominal: 30, real: 80, codes: ['FXSQ80','VEDAD80'] },
    { nominal: 36, real: 100, codes: ['FXSQ100','VEDAD100'] },
    { nominal: 48, real: 125, codes: ['FXSQ125','VEDAD125'] },
    { nominal: 54, real: 140, codes: ['FXSQ140','VEDAD140'] },
  ],
  'Piso Teto': [
    { nominal: 12, real: 32, codes: ['FXHQ32','VEPTD12'] },
    { nominal: 24, real: 63, codes: ['FXHQ63','VEPTD24'] },
    { nominal: 36, real: 100, codes: ['FXHQ100','VEPTD36'] },
    { nominal: 48, real: 125, codes: ['FXHQ125','VEPTD48'] },
    { nominal: 54, real: 140, codes: ['FXHQ140','VEPTD54'] },
  ],
};

const COND_DAIKIN = {
  'Vertical': Array.from({length: 36}, (_,i) => ({ hp: 8 + i*2, real: 200 + i*50 })),
  'Horizontal': [
    { hp: 3, real: 72 },
    { hp: 4, real: 100 },
    { hp: 5, real: 125 },
    { hp: 6, real: 150 },
    { hp: 8, real: 200 },
    { hp: 10, real: 223, volt: 220 },
    { hp: 10, real: 250, volt: 380 },
    { hp: 12, real: 300, volt: 380 },
  ]
};

// limite simult
const LIMITE_SIMULT = [
  { marca: 'Samsung', simul_max: 1.45 },
  { marca: 'Daikin',  simul_max: 1.30 }
];

// 2.2 MULTI
const MULTI_MARCAS = ['LG','Daikin','Samsung'];
const MULTI_EVAPS = [7,9,12,18,24];

const LG_MODELOS_INFO = [
  { nome: 'LG 18', capNominal: 18, capMax: 24, maxEvaps: 2 },
  { nome: 'LG 21', capNominal: 21, capMax: 30, maxEvaps: 3 },
  { nome: 'LG 24', capNominal: 24, capMax: 36, maxEvaps: 3 },
  { nome: 'LG 30', capNominal: 30, capMax: 51, maxEvaps: 4 },
  { nome: 'LG 36', capNominal: 36, capMax: 54, maxEvaps: 5 },
  { nome: 'LG 48', capNominal: 48, capMax: 72, maxEvaps: 5 },
];

// helpers p/ gerar combinações LG
const norm = (arr: number[]) => [...arr].sort((a,b)=>a-b).join(',');
const soma = (arr: number[]) => arr.reduce((t,n)=>t+n,0);
function gerarCombinacoesLG(capMax: number, maxEvaps: number) {
  let res = new Set<string>();
  (function comb(atual: number[]){
    const s = soma(atual);
    if (atual.length>0 && s<=capMax && atual.length<=maxEvaps) res.add(norm(atual));
    if (atual.length>=maxEvaps) return;
    for (let cap of MULTI_EVAPS) if (s+cap<=capMax) comb([...atual, cap].sort((a,b)=>a-b));
  })([]);
  return [...res];
}

// Modelos Samsung
const SAMSUNG_MODELOS = [
  { nome:'Samsung 18', capNominal:18, capMax:30,
    combinacoes: [
      [7,7],[7,9],[7,12],[7,18],[9,9],[9,12],[9,18],[12,12],[12,18]
    ].map(norm)
  },
  { nome:'Samsung 24', capNominal:24, capMax:39,
    combinacoes: [
      [7,7],[7,9],[7,12],[7,18],[9,9],[9,12],[9,18],[12,12],[12,18],[18,18],
      [7,7,7],[7,7,9],[7,7,12],[7,7,18],[7,9,9],[7,9,12],[7,9,18],[7,12,12],[7,12,18],
      [9,9,9],[9,9,12],[9,9,18],[9,12,12],[9,12,18],[12,12,12]
    ].map(norm)
  },
  { nome:'Samsung 28', capNominal:28, capMax:48,
    combinacoes: [
      [7,7],[7,9],[7,12],[7,18],[7,24],[9,9],[9,12],[9,18],[9,24],
      [12,12],[12,18],[12,24],[18,18],[18,24],
      [7,7,7],[7,7,9],[7,7,12],[7,7,18],[7,7,24],
      [7,9,9],[7,9,12],[7,9,18],[7,9,24],
      [7,12,12],[7,12,18],[7,18,18],
      [9,9,9],[9,9,12],[9,9,18],[9,9,24],
      [9,12,12],[9,12,18],
      [12,12,12],[12,12,18],
      [7,7,7,7],[7,7,7,9],[7,7,7,12],[7,7,7,18],
      [7,7,9,9],[7,7,9,12],[7,7,9,18],[7,7,12,12],
      [7,9,9,9],[7,9,9,12],[7,9,9,18],[7,9,12,12],
      [9,9,9,9],[9,9,9,12],[9,9,12,12],
      [12,12,12,12],[9,9,12,18]
    ].map(norm)
  },
];

// Daikin Multi
function criarModeloDaikin(nome: string, capNominal: number, capMax: number, listas: number[][]) { 
  return { nome, capNominal, capMax, combinacoes: listas.map(norm) };
}
const DAIKIN_MODELOS = [
  criarModeloDaikin('Daikin 18 Bi',18,24, [[9,9],[9,12],[12,12]]),
  criarModeloDaikin('Daikin 18 Tri',18,30, [[9,9],[9,12],[9,18],[12,12],[12,18],[9,9,9],[9,9,12]]),
];

// Modos
const MULTI_MODOS = [
  { nome:'Residencial', limite:1.40 },
  { nome:'Corporativo', limite:1.10 },
  { nome:'Capacidade Máxima', usaCapMax:true },
];

// 2.3 DIÁRIAS
const DIARIAS = {
  calc_base: [700,1000],
  tipo_evap: ['Dutado','Hi Wall','K7 1via','K7 4vias','Piso Teto'],
  fatores: [
    { nome:'PD Duplo', codigo:'pd_duplo', multiplicador:1.30 },
    { nome:'Capital',  codigo:'local_capital', multiplicador:1.00 },
    { nome:'Interior/Litoral', codigo:'local_interior', multiplicador:1.15 },
    { nome:'As Built', codigo:'as_built', multiplicador:1.30 },
  ],
  coef_projeto: [
    { tipo:'Residencial', div_dutado:10, div_aparente:16, fator_aparentes_extra:1.4 },
    { tipo:'Corporativo', div_dutado:7,  div_aparente:11, fator_aparentes_extra:1.4 },
  ]
};

// ---------- 3) Execução ----------
(async () => {
  try {
    console.log("Iniciando seed...");

    // VRF: tipos
    const tiposEvap = new Set([
      ...Object.keys(EVAPS_SAMSUNG),
      ...Object.keys(EVAPS_DAIKIN)
    ]);
    let ordem = 1;
    for (const t of tiposEvap) {
      if (!t) continue;
      await upsert('produtos_vrf', { grupo:'tipo_evap', nome:t, ordem:ordem++ });
    }

    // VRF: limite simult por marca
    for (const l of LIMITE_SIMULT) {
      await upsert('produtos_vrf', {
        grupo:'limite_simult',
        nome:l.marca,
        atributos:{ marca: l.marca, simul_max: l.simul_max }
      });
    }

    // VRF: orientações
    await upsert('produtos_vrf', { grupo:'cond_orientacao', nome:'Vertical', ordem:1 });
    await upsert('produtos_vrf', { grupo:'cond_orientacao', nome:'Horizontal', ordem:2 });

    // VRF: evaporadoras Samsung
    for (const [tipo, arr] of Object.entries(EVAPS_SAMSUNG)) {
      for (const e of arr) {
        await upsert('produtos_vrf', {
          grupo:'evap_nominal',
          nome:`${tipo} ${e.nominal} (Samsung)`,
          codigo:e.code || null,
          atributos:{ marca:'Samsung', tipo, nominal:e.nominal, cap_real:e.real, code: e.code }
        });
        if (e.code) {
          await upsert('produtos_vrf', {
            grupo:'evap_code', nome:e.code, codigo:e.code,
            atributos:{ marca:'Samsung', tipo, nominal:e.nominal, code: e.code }
          });
        }
      }
    }

    // VRF: evaporadoras Daikin + códigos
    for (const [tipo, arr] of Object.entries(EVAPS_DAIKIN)) {
      for (const e of arr) {
        await upsert('produtos_vrf', {
          grupo:'evap_nominal',
          nome:`${tipo} ${e.nominal} (Daikin)`,
          atributos:{ marca:'Daikin', tipo, nominal:e.nominal, cap_real:e.real }
        });
        (e.codes||[]).forEach(async code => {
          await upsert('produtos_vrf', {
            grupo:'evap_code', nome:code, codigo:code,
            atributos:{ marca:'Daikin', tipo, nominal:e.nominal, code }
          });
        });
      }
    }

    // VRF: condensadoras Samsung
    for (const [orient, arr] of Object.entries(COND_SAMSUNG)) {
      for (const c of arr) {
        await upsert('produtos_vrf', {
          grupo:'cond_hp',
          nome:`Samsung VRF ${c.hp}HP (${orient})`,
          atributos:{ marca:'Samsung', orientacao:orient, hp:c.hp, cap_real:c.real }
        });
      }
    }

    // VRF: condensadoras Daikin
    for (const [orient, arr] of Object.entries(COND_DAIKIN)) {
      for (const c of arr) {
        await upsert('produtos_vrf', {
          grupo:'cond_hp',
          nome:`Daikin VRF ${c.hp}HP (${orient}${(c as any).volt?` ${(c as any).volt}v`:''})`,
          atributos:{ marca:'Daikin', orientacao:orient, hp:c.hp, cap_real:c.real, ...((c as any).volt?{volt:(c as any).volt}:{}) }
        });
      }
    }

    // MULTI: marcas
    let i=1;
    for (const m of MULTI_MARCAS) await upsert('produtos_multi',{grupo:'marca', nome:m, ordem:i++});

    // MULTI: evaporadoras nominais
    i=1;
    for (const n of MULTI_EVAPS) await upsert('produtos_multi',{grupo:'evaporadora_nominal', nome:String(n), ordem:i++, atributos: { nominal: n }});

    // MULTI: modos
    i=1;
    for (const m of MULTI_MODOS)
      await upsert('produtos_multi',{grupo:'modo_simult', nome:m.nome, ordem:i++, atributos:m});

    // MULTI: modelos LG (combinacoes geradas)
    for (const info of LG_MODELOS_INFO) {
      const combinacoes = gerarCombinacoesLG(info.capMax, info.maxEvaps);
      await upsert('produtos_multi',{
        grupo:'modelo_cond',
        nome:info.nome,
        atributos:{ marca:'LG', capNominal:info.capNominal, capMax:info.capMax, maxEvaps:info.maxEvaps, combinacoes }
      });
    }

    // MULTI: modelos Samsung
    for (const m of SAMSUNG_MODELOS) {
      await upsert('produtos_multi',{
        grupo:'modelo_cond',
        nome:m.nome,
        atributos:{ marca:'Samsung', capNominal:m.capNominal, capMax:m.capMax, combinacoes:m.combinacoes }
      });
    }

    // MULTI: modelos Daikin
    for (const m of DAIKIN_MODELOS) {
      await upsert('produtos_multi',{
        grupo:'modelo_cond',
        nome:m.nome,
        atributos:{ marca:'Daikin', capNominal:m.capNominal, capMax:m.capMax, combinacoes:m.combinacoes }
      });
    }

    // DIÁRIAS: calc_base
    await upsert('produtos_diarias',{ grupo:'calc_base', nome:'700', ordem:1, atributos:{ fator_btu_m2:700 }});
    await upsert('produtos_diarias',{ grupo:'calc_base', nome:'1000', ordem:2, atributos:{ fator_btu_m2:1000 }});

    // DIÁRIAS: tipos de evaporadora
    i=1; for (const t of DIARIAS.tipo_evap)
      await upsert('produtos_diarias',{ grupo:'tipo_evap', nome:t, ordem:i++, atributos: { tipo: t } });

    // DIÁRIAS: fatores
    i=1; for (const f of DIARIAS.fatores)
      await upsert('produtos_diarias',{ grupo:'fator', nome:f.nome, codigo:f.codigo, ordem:i++, atributos:{ codigo: f.codigo, multiplicador:f.multiplicador }});

    // DIÁRIAS: coeficientes por tipo de projeto
    i=1; for (const c of DIARIAS.coef_projeto)
      await upsert('produtos_diarias',{
        grupo:'coef_projeto', nome:c.tipo, ordem:i++,
        atributos:{ tipo: c.tipo, div_dutado: c.div_dutado, div_aparente: c.div_aparente, fator_aparentes_extra: c.fator_aparentes_extra }
      });

    console.log("✅ Seed concluído.");
  } catch (e) {
    console.error("❌ Erro no seed:", e);
  }
})();