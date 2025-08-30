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