import { catalogs } from "./vrf-catalogs"

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

export function calcularCondensadoraVRF(entrada: number[], simultaneidade: number, brand: "samsung" | "daikin") {
  const soma = entrada.reduce((a, b) => a + b, 0)
  const capacidadeMinima = soma * simultaneidade

  const condensadoras = catalogs[brand]
  
  // Encontra a condensadora ideal (primeira que atende a capacidade mínima)
  const condensadoraIdeal = condensadoras.find(c => c.nominal >= capacidadeMinima)
  
  // Encontra uma acima (próxima maior)
  const indexIdeal = condensadoras.findIndex(c => c.nominal >= capacidadeMinima)
  const umaAcima = indexIdeal >= 0 && indexIdeal < condensadoras.length - 1 
    ? condensadoras[indexIdeal + 1] 
    : condensadoras[condensadoras.length - 1]

  const calcularSimultaneidade = (condensadora: any) => {
    if (!condensadora) return "0%"
    return ((soma / condensadora.nominal) * 100).toFixed(1) + "%"
  }

  return {
    condensadoraIdeal: condensadoraIdeal ? {
      ...condensadoraIdeal,
      simultaneidade: calcularSimultaneidade(condensadoraIdeal)
    } : null,
    umaAcima: umaAcima ? {
      ...umaAcima,
      simultaneidade: calcularSimultaneidade(umaAcima)
    } : null,
    somaEvaporadoras: soma,
    capacidadeMinima: Math.round(capacidadeMinima),
    marca: brand
  }
}