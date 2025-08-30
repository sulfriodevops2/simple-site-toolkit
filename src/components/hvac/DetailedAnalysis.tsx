
import { HVACCard } from "@/components/ui/hvac-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

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
  
  // Split by lines and find model lines
  const lines = details.split(/[\n\\n]/).filter(line => line.trim())
  console.log('Lines found:', lines)
  
  // Extract models from lines that start with ✔ or ✖
  const modelos = lines
    .filter(line => {
      const hasCheckmark = /^[✔✖]/.test(line.trim())
      console.log('Line:', line, 'Has checkmark:', hasCheckmark)
      return hasCheckmark
    })
    .map(line => {
      console.log('Processing line:', line)
      
      const compativel = line.trim().startsWith('✔')
      
      // Extract model name - more flexible regex
      const nomeMatch = line.match(/[✔✖]\s*([A-Za-z]+\s+\d+(?:\s+[A-Za-z]+)?)/i)
      const nome = nomeMatch?.[1] || ''
      
      // Extract nominal value
      const nominalMatch = line.match(/nominal\s+(\d+)/i)
      const nominal = parseInt(nominalMatch?.[1] || '0')
      
      // Extract max value
      const maxMatch = line.match(/máx\s+(\d+)/i)
      const max = parseInt(maxMatch?.[1] || '0')
      
      // Extract limit and mode
      const limiteMatch = line.match(/limite\s*\(([^)]+)\)\s*=\s*([0-9.,]+)/i)
      const modo = limiteMatch?.[1] || ''
      const limite = parseFloat(limiteMatch?.[2]?.replace(',', '.') || '0')
      
      // Extract simultaneity percentage
      const simultaneidadeMatch = line.match(/Simultaneidade:\s*([0-9,]+)%/i)
      const simultaneidade = parseFloat(simultaneidadeMatch?.[1]?.replace(',', '.') || '0')
      
      // Extract status
      let status = 'Incompatível'
      if (line.includes('Compatível')) status = 'Compatível'
      else if (line.includes('Ultrapassa limite')) status = 'Ultrapassa limite'
      else if (line.includes('Combinação não listada')) status = 'Combinação não listada'
      
      const result = { nome, nominal, max, limite, modo, status, simultaneidade, compativel }
      console.log('Parsed model:', result)
      return result
    })
    .filter(modelo => {
      const isValid = modelo.nome && !isNaN(modelo.nominal) && modelo.nominal > 0
      console.log('Model valid:', isValid, modelo)
      return isValid
    })
  
  console.log('Final modelos:', modelos)
  return { entrada, soma, tag7, modelos }
}

export function DetailedAnalysis({ details }: DetailedAnalysisProps) {
  const parsedData = parseDetails(details || '')
  
  console.log('Parsed data:', parsedData)
  
  return (
    <HVACCard title="Detalhes" className="col-span-full">
      <ScrollArea className="h-48">
        {parsedData ? (
          <div className="font-mono text-sm">
            {/* Header Grid */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <strong>Entrada normalizada:</strong> [{parsedData.entrada}]
                {parsedData.tag7 && (
                  <div className="text-muted-foreground mt-1">{parsedData.tag7}</div>
                )}
              </div>
              <div>
                <strong>Soma das evaporadoras:</strong> {parsedData.soma}
              </div>
            </div>
            
            {/* Spacing */}
            <div className="h-2"></div>
            
            {/* Result Lines */}
            {parsedData.modelos.length > 0 ? (
              parsedData.modelos.map((modelo, index) => (
                <div key={index} className="flex justify-between items-baseline py-2.5 border-b border-dashed border-white/[0.08] last:border-b-0">
                  <div>
                    <span className={modelo.compativel ? "text-system-green" : "text-system-red"}>
                      {modelo.compativel ? "✔" : "✖"}
                    </span>
                    {" "}{modelo.nome}
                    <span className="inline-block ml-1.5 px-2 py-1 text-xs bg-white/[0.08] rounded-full text-muted-foreground">
                      nominal {modelo.nominal}
                    </span>
                    <span className="inline-block ml-1.5 px-2 py-1 text-xs bg-white/[0.08] rounded-full text-muted-foreground">
                      máx {modelo.max}
                    </span>
                    <span className="inline-block ml-1.5 px-2 py-1 text-xs bg-white/[0.08] rounded-full text-muted-foreground">
                      limite ({modelo.modo}) = {modelo.limite.toString().replace('.', ',')}
                    </span>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    modelo.compativel 
                      ? "bg-system-green/15 text-system-green border border-system-green/25" 
                      : "bg-system-red/15 text-system-red border border-system-red/25"
                  }`}>
                    {modelo.status} — Simultaneidade: {modelo.simultaneidade.toString().replace('.', ',')}%
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-center py-4">
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
