import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusChipProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "error" | "info" | "default"
  className?: string
}

export function StatusChip({ children, variant = "default", className }: StatusChipProps) {
  return (
    <Badge 
      className={cn(
        "px-3 py-1 text-xs font-medium rounded-full border",
        {
          "bg-system-green/20 text-system-green border-system-green/30": variant === "success",
          "bg-primary-warm/20 text-primary-warm border-primary-warm/30": variant === "warning",
          "bg-system-red/20 text-system-red border-system-red/30": variant === "error",
          "bg-system-blue/20 text-system-blue border-system-blue/30": variant === "info",
          "bg-muted/20 text-muted-foreground border-border": variant === "default",
        },
        className
      )}
    >
      {children}
    </Badge>
  )
}