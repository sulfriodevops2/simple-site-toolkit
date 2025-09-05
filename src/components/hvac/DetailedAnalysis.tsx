import { HVACCard } from "@/components/ui/hvac-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { StatusChip } from "@/components/ui/status-chip"

interface DetailedAnalysisProps {
  details: string | null
}

interface DetailedData {
  entrada: string
  soma: number
  tag7?: string
  modelos: Array<{
    nome: string
    nominal: number
    max: number
    limite: number
    modo: string
    status: string
    simultaneidade: number
    compativel: boolean
  }>
}

function parseDetails(details: string): DetailedData | null {
  if (!details) return null
  
  console.log('Parsing details:', details)
  
  // Extract entrada normalizada
  const entradaMatch = details.match(/Entrada normalizada: \[(.*?)\]/)
  const entrada = entradaMatch?.[1] || ''
  
  // Extract soma
  const somaMatch = details.match(/Soma das evaporadoras: (\d+)/)
  const soma = parseInt(somaMatch?.[1] || '0')
  
  // Extract tag7 if exists
  const tag7Match = details.match(/(7 tratado como 9[^\n]*)/i)
  const tag7 = tag7Match?.[1] || undefined
  
  // Clean and split the details properly - remove extra whitespace and empty lines
  const cleanedDetails = details.replace(/\s+/g, ' ').trim()
  
  // Split by lines that start with ✔ or ✖
  const modelLines = cleanedDetails.split(/(?=[✔✖])/).filter(line => line.trim().match(/^[✔✖]/))
  
  console.log('Model lines found:', modelLines)
  
  const modelos = modelLines.map(line => {
    console.log('Processing line:', line)
    
    const compativel = line.trim().startsWith('✔')
    
    // Enhanced regex to match various formats:
    // ✔ LG 18 - nominal 18 - máx 24 - limite (residencial) = 24 - Compatível - Simultaneidade: 38,9%
    // ✖ Samsung 18 - nominal 18 - máx 30 - limite (residencial) = 25.2 - Combinação não listada - Simultaneidade: 38,9%
    const match = line.match(/^[✔✖]\s*([^-]+?)\s*-\s*nominal\s+(\d+)\s*-\s*máx\s+(\d+)\s*-\s*limite\s*\(([^)]+)\)\s*=\s*([0-9.,]+)\s*-\s*([^-]+?)\s*-\s*Simultaneidade:\s*([0-9,]+)%/i)
    
    if (match) {
      const [, nome, nominalStr, maxStr, modo, limiteStr, status, simultaneidadeStr] = match
      
      const nominal = parseInt(nominalStr)
      const max = parseInt(maxStr)
      const limite = parseFloat(limiteStr.replace(',', '.'))
      const simultaneidade = parseFloat(simultaneidadeStr.replace(',', '.'))
      
      const result = { 
        nome: nome.trim(), 
        nominal, 
        max, 
        limite, 
        modo: modo.trim(), 
        status: status.trim(), 
        simultaneidade, 
        compativel 
      }
      console.log('Parsed model:', result)
      return result
    } else {
      console.log('No match for line:', line)
      return null
    }
  }).filter(modelo => modelo !== null && modelo.nome && !isNaN(modelo.nominal) && modelo.nominal > 0)
  
  console.log('Final modelos:', modelos)
  return { entrada, soma, tag7, modelos }
}

export function DetailedAnalysis({ details }: DetailedAnalysisProps) {
  const parsedData = parseDetails(details || '')
  
  console.log('Parsed data:', parsedData)
  
  return (
    <HVACCard title="Detalhes" className="col-span-full">
      <ScrollArea className="h-96">
        {parsedData ? (
          <div className="space-y-4">
            {/* Models Results */}
            {parsedData.modelos.length > 0 ? (
              <div className="space-y-2">
                {parsedData.modelos.map((modelo, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${modelo.compativel ? 'text-system-green' : 'text-system-red'}`}>
                        {modelo.compativel ? '✔' : '✖'}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{modelo.nome}</span>
                        <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                          nominal {modelo.nominal}
                        </span>
                        <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                          máx {modelo.max}
                        </span>
                        <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                          limite ({modelo.modo}) = {modelo.limite.toString().replace('.', ',')}
                        </span>
                      </div>
                    </div>
                    <StatusChip variant={modelo.compativel ? "success" : "error"}>
                      {modelo.status} — Simultaneidade: {modelo.simultaneidade.toString().replace('.', ',')}%
                    </StatusChip>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                Nenhum modelo encontrado nos detalhes.
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Quando você buscar, os cálculos e limites aparecem aqui.
          </div>
        )}
      </ScrollArea>
    </HVACCard>
  )
}
