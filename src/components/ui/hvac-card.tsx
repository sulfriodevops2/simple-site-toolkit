import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface HVACCardProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  variant?: "default" | "cool" | "warm"
}

export function HVACCard({ 
  children, 
  title, 
  description, 
  className,
  variant = "default" 
}: HVACCardProps) {
  return (
    <Card className={cn(
      "bg-gradient-card border-border/50 backdrop-blur-sm shadow-elevation",
      "hover:shadow-glow-cool transition-all duration-300",
      variant === "cool" && "border-primary-cool/30 shadow-glow-cool",
      variant === "warm" && "border-primary-warm/30 shadow-glow-warm",
      className
    )}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className={cn(
            "text-foreground font-semibold",
            variant === "cool" && "text-primary-cool",
            variant === "warm" && "text-primary-warm"
          )}>
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={title ? "pt-0" : ""}>
        {children}
      </CardContent>
    </Card>
  )
}