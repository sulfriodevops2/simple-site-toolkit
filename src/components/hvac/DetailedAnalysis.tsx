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
  
  const lines = details.split('\n').filter(line => line.trim())
  
  // Parse entrada normalizada
  const entradaLine = lines.find(line => line.includes('Entrada normalizada:'))
  const entrada = entradaLine?.match(/\[(.*?)\]/)?.[1] || ''
  
  // Parse soma
  const somaLine = lines.find(line => line.includes('Soma das evaporadoras:'))
  const soma = parseInt(somaLine?.split(':')[1]?.trim() || '0')
  
  // Parse tag7
  const tag7Line = lines.find(line => line.includes('7 tratado como 9'))
  
  // Parse modelos - procurar linhas que começam com ✔ ou ✖
  const modelos = lines
    .filter(line => line.startsWith('✔') || line.startsWith('✖'))
    .map(line => {
      const compativel = line.startsWith('✔')
      
      // Parse nome (LG 18, Daikin 24, etc)
      const nomeMatch = line.match(/[✔✖]\s+([A-Za-z]+\s+\d+)/)
      const nome = nomeMatch?.[1] || ''
      
      // Parse nominal
      const nominalMatch = line.match(/nominal\s+(\d+)/)
      const nominal = parseInt(nominalMatch?.[1] || '0')
      
      // Parse máx
      const maxMatch = line.match(/máx\s+(\d+)/)
      const max = parseInt(maxMatch?.[1] || '0')
      
      // Parse limite
      const limiteMatch = line.match(/limite\s+\((\w+)\)\s+=\s+([\d.,]+)/)
      const modo = limiteMatch?.[1] || ''
      const limite = parseFloat(limiteMatch?.[2]?.replace(',', '.') || '0')
      
      // Parse simultaneidade
      const simultMatch = line.match(/Simultaneidade:\s+([\d,]+)%/)
      const simultaneidade = parseFloat(simultMatch?.[1]?.replace(',', '.') || '0')
      
      // Parse status
      const statusMatch = line.match(/(Compatível|Ultrapassa limite|Combinação não listada)/)
      const status = statusMatch?.[1] || ''
      
      return { nome, nominal, max, limite, modo, status, simultaneidade, compativel }
    })
    .filter(modelo => modelo.nome)
  
  return {
    entrada,
    soma,
    tag7: tag7Line?.replace(/.*7 tratado como 9/, '7 tratado como 9'),
    modelos
  }
}

export function DetailedAnalysis({ details }: DetailedAnalysisProps) {
  const parsedData = parseDetails(details || '')
  
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
            {parsedData.modelos.map((modelo, index) => (
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
            ))}
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