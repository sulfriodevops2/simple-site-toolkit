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
      { nome: "Samsung VRF H 8HP",  nominal: 41287, max: 45000 },
      { nome: "Samsung VRF H 10HP", nominal: 47738, max: 52000 },
      { nome: "Samsung VRF H 12HP", nominal: 57286, max: 62000 },
      { nome: "Samsung VRF H 14HP", nominal: 66834, max: 72000 },
      { nome: "Samsung VRF H 16HP", nominal: 76432, max: 85000 },
      { nome: "Samsung VRF H 18HP", nominal: 85980, max: 95000 },
      { nome: "Samsung VRF H 20HP", nominal: 95540, max: 105000 },
    ],
  },
  daikin: {
    vertical: [
      { nome: "Daikin VRV IV 8HP",  nominal: 76800, max: 85000 },
      { nome: "Daikin VRV IV 10HP", nominal: 96000, max: 106000 },
      { nome: "Daikin VRV IV 12HP", nominal: 115200, max: 127000 },
      { nome: "Daikin VRV IV 14HP", nominal: 134400, max: 148000 },
      { nome: "Daikin VRV IV 16HP", nominal: 153600, max: 169000 },
      { nome: "Daikin VRV IV 18HP", nominal: 172800, max: 190000 },
      { nome: "Daikin VRV IV 20HP", nominal: 192000, max: 211000 },
    ],
    horizontal: [
      { nome: "Daikin VRV H 8HP",  nominal: 76800, max: 85000 },
      { nome: "Daikin VRV H 10HP", nominal: 96000, max: 106000 },
      { nome: "Daikin VRV H 12HP", nominal: 115200, max: 127000 },
      { nome: "Daikin VRV H 14HP", nominal: 134400, max: 148000 },
      { nome: "Daikin VRV H 16HP", nominal: 153600, max: 169000 },
      { nome: "Daikin VRV H 18HP", nominal: 172800, max: 190000 },
      { nome: "Daikin VRV H 20HP", nominal: 192000, max: 211000 },
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

  const idealIdx = withLimits.findIndex(c => sum <= c.limite);
  const ideal = idealIdx >= 0 ? withLimits[idealIdx] : null;
  const oneUp = idealIdx >= 0 && idealIdx + 1 < withLimits.length ? withLimits[idealIdx + 1] : null;

  return {
    sumBTUh: sum,
    minRequiredBTUh: minRequired,
    condensers: withLimits,
    ideal,
    oneUp,
  } as const;
}
