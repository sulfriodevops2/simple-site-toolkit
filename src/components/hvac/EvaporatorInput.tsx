import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HVACCard } from "@/components/ui/hvac-card"

interface EvaporatorInputProps {
  value: string
  onChange: (value: string) => void
}

export function EvaporatorInput({ value, onChange }: EvaporatorInputProps) {
  return (
    <HVACCard title="Evaporadoras" variant="cool">
      <div className="space-y-2">
        <Label htmlFor="evaporators" className="text-sm font-medium">
          Capacidades das Evaporadoras
        </Label>
        <Input
          id="evaporators"
          type="text"
          placeholder="Ex.: 7,9,12,24"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary-cool/50 transition-colors"
        />
        <p className="text-xs text-muted-foreground">
          Aceita 1 a 5 itens. Valores válidos: 7, 9, 12, 18, 24.
        </p>
      </div>
    </HVACCard>
  )
}