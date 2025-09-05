// VRF calculation engine with strict types and correct simultaneity math
export type Brand = "samsung" | "daikin";
export type Orientation = "vertical" | "horizontal";

export interface EvapEntry {
  tipo: string;        // e.g., "Hi Wall"
  nominal: number;     // 5, 7, 9, 12...
  real: number;        // BTU/h real per unit
  qty: number;         // quantity
}

export interface Condenser {
  nome: string;
  nominal: number;     // nominal BTU/h of the condenser
  max: number;         // max supported BTU/h (optional use)
}

export interface CalcInput {
  brand: Brand;
  orientation: Orientation;
  simultPercent: number; // 110, 130, 145...
  evaps: EvapEntry[];
}

// Minimal demo catalog; extend with real data per orientation
export const CATALOG: Record<Brand, Record<Orientation, Condenser[]>> = {
  samsung: {
    vertical: [
      { nome: "Samsung VRF 8HP",  nominal: 76432, max: 85000 },
      { nome: "Samsung VRF 10HP", nominal: 95540, max: 105000 },
      { nome: "Samsung VRF 12HP", nominal: 114648, max: 125000 },
      { nome: "Samsung VRF 14HP", nominal: 133756, max: 145000 },
      { nome: "Samsung VRF 16HP", nominal: 152864, max: 165000 },
      { nome: "Samsung VRF 18HP", nominal: 171972, max: 185000 },
      { nome: "Samsung VRF 20HP", nominal: 191080, max: 205000 },
    ],
    horizontal: [
      { nome: "Samsung VRF H 4HP",  nominal: 41287, max: 45000 },
      { nome: "Samsung VRF H 5HP",  nominal: 47770, max: 52000 },
      { nome: "Samsung VRF H 6HP",  nominal: 52888, max: 58000 },
      { nome: "Samsung VRF H 7HP",  nominal: 61760, max: 68000 },
      { nome: "Samsung VRF H 8HP",  nominal: 76432, max: 85000 },
      { nome: "Samsung VRF H 10HP", nominal: 95540, max: 105000 },
      { nome: "Samsung VRF H 12HP", nominal: 114648, max: 125000 },
      { nome: "Samsung VRF H 14HP", nominal: 136486, max: 150000 },
    ],
  },
  daikin: {
    vertical: [
      { nome: "Daikin VRV IV 8HP",  nominal: 200, max: 220 },
      { nome: "Daikin VRV IV 10HP", nominal: 250, max: 275 },
      { nome: "Daikin VRV IV 12HP", nominal: 300, max: 330 },
      { nome: "Daikin VRV IV 14HP", nominal: 350, max: 385 },
      { nome: "Daikin VRV IV 16HP", nominal: 400, max: 440 },
      { nome: "Daikin VRV IV 18HP", nominal: 450, max: 495 },
      { nome: "Daikin VRV IV 20HP", nominal: 500, max: 550 },
    ],
    horizontal: [
      { nome: "Daikin VRF 3HP",  nominal: 72, max: 80 },
      { nome: "Daikin VRF 4HP",  nominal: 100, max: 110 },
      { nome: "Daikin VRF 5HP",  nominal: 125, max: 138 },
      { nome: "Daikin VRF 6HP",  nominal: 150, max: 165 },
      { nome: "Daikin VRV H 8HP",  nominal: 200, max: 220 },
      { nome: "Daikin VRV H 10HP", nominal: 223, max: 245 },
      { nome: "Daikin VRV H 10HP", nominal: 250, max: 275 },
      { nome: "Daikin VRV H 12HP", nominal: 300, max: 330 },
    ],
  },
};

// Sum of evaporators: real * qty
export function sumEvapsBTUh(evaps: EvapEntry[]): number {
  return evaps.reduce((acc, e) => acc + (e.real || 0) * (e.qty || 1), 0);
}

// Minimum required after simultaneity (DIVISION)
export function minRequiredBTUh(sumBTUh: number, simultPercent: number): number {
  return Math.round(sumBTUh / (simultPercent / 100));
}

export function calcCondenser({ brand, orientation, simultPercent, evaps }: CalcInput) {
  const sum = sumEvapsBTUh(evaps);
  const minRequired = minRequiredBTUh(sum, simultPercent);

  const list = (CATALOG[brand]?.[orientation] || []).slice();

  const withLimits = list.map(c => {
    const limite = Math.round(c.nominal * (simultPercent / 100));
    const uso = Math.round((sum / c.nominal) * 100 * 10) / 10; // % of nominal capacity used (1 decimal)
    const status = sum <= limite ? "ok" : sum <= c.max ? "warn" : "error";
    return { ...c, limite, uso, status } as Condenser & { limite: number; uso: number; status: "ok" | "warn" | "error" };
  });

  // Find condensers that meet the simultaneity limit
  const validCondensers = withLimits.filter(c => (sum / c.nominal) <= (simultPercent / 100));
  
  // Among valid condensers, choose the one with highest usage (closest to limit)
  let ideal = null;
  if (validCondensers.length > 0) {
    ideal = validCondensers.reduce((best, current) => 
      current.uso > best.uso ? current : best
    );
  }
  
  // Find oneUp: next condenser in the original list after the ideal
  const idealIdx = ideal ? withLimits.findIndex(c => c.nome === ideal.nome) : -1;
  const oneUp = idealIdx >= 0 && idealIdx + 1 < withLimits.length ? withLimits[idealIdx + 1] : null;
  
  // Find oneDown: previous condenser in the original list before the ideal
  const oneDown = idealIdx > 0 ? withLimits[idealIdx - 1] : null;

  return {
    sumBTUh: sum,
    minRequiredBTUh: minRequired,
    condensers: withLimits,
    ideal,
    oneUp,
    oneDown,
  } as const;
}
