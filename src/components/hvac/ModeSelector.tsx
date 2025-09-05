import { HVACCard } from "@/components/ui/hvac-card"
import { cn } from "@/lib/utils"
import { useProdutosMulti } from "@/hooks/useProdutos"

interface ModeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const { produtos: modos, loading } = useProdutosMulti('modo_simult');

  if (loading) {
    return (
      <HVACCard title="Modo de Simultaneidade" variant="warm">
        <div className="text-center text-muted-foreground">Carregando...</div>
      </HVACCard>
    );
  }

  return (
    <HVACCard title="Modo de Simultaneidade" variant="warm">
      <div className="space-y-3">
        {modos.map((mode) => {
          const modeValue = mode.nome.toLowerCase();
          const description = mode.atributos?.limite 
            ? `até ${(mode.atributos.limite * 100).toFixed(0)}%`
            : mode.atributos?.usaCapMax 
            ? "100%" 
            : "";
          
          return (
            <label
              key={mode.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                "hover:bg-primary-warm/5 hover:border-primary-warm/30",
                value === modeValue
                  ? "bg-primary-warm/10 border-primary-warm/50 text-primary-warm"
                  : "bg-background/30 border-border/50 text-foreground"
              )}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="mode"
                  value={modeValue}
                  checked={value === modeValue}
                  onChange={(e) => onChange(e.target.value)}
                  className="sr-only"
                />
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  value === modeValue
                    ? "border-primary-warm bg-primary-warm"
                    : "border-border"
                )}>
                  {value === modeValue && (
                    <div className="w-2 h-2 rounded-full bg-background" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{mode.nome}</div>
                  {description && (
                    <div className="text-xs text-muted-foreground">({description})</div>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </HVACCard>
  )
}