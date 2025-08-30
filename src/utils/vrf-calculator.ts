import { catalogs } from "./vrf-catalogs"
import { calcCondenser } from "./vrf-engine"
export function calcularVRF({ area, rooms, ceiling, insulation, occupancy, equipment }: any) {
  let baseBtu = area * 600

  if (ceiling > 3) baseBtu *= 1.1
  if (insulation === "poor") baseBtu *= 1.2
  if (insulation === "good") baseBtu *= 0.9

  baseBtu += occupancy * 600
  baseBtu += equipment || 0

  const totalBtu = Math.round(baseBtu)
  const estimatedPower = Math.round(totalBtu * 0.293)

  return {
    totalBtu,
    estimatedPower,
    rooms,
    recommendedCapacity: Math.ceil(totalBtu / 12000) * 12000,
    efficiency: "A+++",
    estimatedConsumption: Math.round((estimatedPower * 0.75) / 1000 * 8),
  }
}

export function calcularCondensadoraVRF(
  entrada: number[],
  simultaneidade: number,
  brand: "samsung" | "daikin",
  orientation: "vertical" | "horizontal" = "vertical"
) {
  // Convert entrada (array of BTU/h values) to a single aggregated evaporator
  const soma = entrada.reduce((a, b) => a + b, 0);
  const percent = simultaneidade > 2 ? Math.round(simultaneidade) : Math.round(simultaneidade * 100);

  const res = calcCondenser({
    brand: brand as any,
    orientation: orientation as any,
    simultPercent: percent,
    evaps: [{ tipo: "Gen", nominal: 0, real: soma, qty: 1 }],
  });

  return {
    condensadoraIdeal: res.ideal ? { ...res.ideal, simultaneidade: `${res.ideal.uso}%` } : null,
    umaAcima: res.oneUp ? { ...res.oneUp, simultaneidade: `${res.oneUp.uso}%` } : null,
    somaEvaporadoras: res.sumBTUh,
    capacidadeMinima: res.minRequiredBTUh,
    marca: brand,
  };
}