import { HVACCard } from "@/components/ui/hvac-card"
import { cn } from "@/lib/utils"
import { useProdutosMulti } from "@/hooks/useProdutos"

interface BrandSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function BrandSelector({ value, onChange }: BrandSelectorProps) {
  const { produtos: marcas, loading } = useProdutosMulti('marca');

  const brands = [
    { value: "todas", label: "Todas as marcas" },
    ...marcas.map(marca => ({
      value: marca.nome.toLowerCase(),
      label: marca.nome
    }))
  ];

  return (
    <HVACCard title="Marca do Equipamento" variant="cool">
      <div className="grid grid-cols-2 gap-2">
        {loading ? (
          <div className="col-span-2 text-center text-muted-foreground">Carregando...</div>
        ) : (
          brands.map((brand) => (
            <label
              key={brand.value}
              className={cn(
                "flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all text-sm font-medium",
                "hover:bg-primary-cool/5 hover:border-primary-cool/30",
                value === brand.value
                  ? "bg-primary-cool/10 border-primary-cool/50 text-primary-cool"
                  : "bg-background/30 border-border/50 text-foreground"
              )}
            >
              <input
                type="radio"
                name="brand"
                value={brand.value}
                checked={value === brand.value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              {brand.label}
            </label>
          ))
        )}
      </div>
    </HVACCard>
  )
}