import { HVACCard } from "@/components/ui/hvac-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface DetailedAnalysisProps {
  details: string | null
}

export function DetailedAnalysis({ details }: DetailedAnalysisProps) {
  return (
    <HVACCard title="Análise Detalhada" className="col-span-full">
      <ScrollArea className="h-48">
        {details ? (
          <pre className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">
            {details}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Quando você buscar, os cálculos e limites aparecem aqui.
          </div>
        )}
      </ScrollArea>
    </HVACCard>
  )
}