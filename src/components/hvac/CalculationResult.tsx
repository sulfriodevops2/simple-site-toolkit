import { HVACCard } from "@/components/ui/hvac-card"
import { StatusChip } from "@/components/ui/status-chip"
import { Separator } from "@/components/ui/separator"

interface CalculationResultProps {
  results: any[]
  loading?: boolean
}

export function CalculationResult({ results, loading }: CalculationResultProps) {
  if (loading) {
    return (
      <HVACCard title="Resultado" className="min-h-[200px]">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-2 border-primary-cool border-t-transparent rounded-full" />
        </div>
      </HVACCard>
    )
  }

  if (!results || results.length === 0) {
    return (
      <HVACCard title="Resultado" className="min-h-[200px]">
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          — Sem resultados ainda —
        </div>
      </HVACCard>
    )
  }

  return (
    <HVACCard title="Resultado" className="min-h-[200px]">
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{result.nome}</span>
              <StatusChip variant={result.status === "ok" ? "success" : result.status === "warn" ? "warning" : "error"}>
                {result.status === "ok" ? "Compatible" : result.status === "warn" ? "Warning" : "Incompatible"}
              </StatusChip>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Capacidade Nominal:</span>
                <span>{result.capNominal} BTU/h</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Capacidade Efetiva:</span>
                <span className="text-primary-cool">{result.capEfetiva} BTU/h</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxa de Uso:</span>
                <span className={result.uso > 100 ? "text-system-red" : "text-system-green"}>
                  {result.uso}%
                </span>
              </div>
            </div>
            {index < results.length - 1 && <Separator className="opacity-30" />}
          </div>
        ))}
      </div>
    </HVACCard>
  )
}