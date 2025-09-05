import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { HVACCard } from "@/components/ui/hvac-card"
import { Calculator, Snowflake, Wind, Thermometer, Settings, ClipboardList } from "lucide-react"
import { useAuth } from '@/hooks/useAuth'

export default function Index() {
  const { isAdmin } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-cool rounded-2xl flex items-center justify-center shadow-glow-cool">
              <img 
                src="/lovable-uploads/62ef3cac-2a46-4916-8f53-2ff94d9ca0e4.png" 
                alt="Sulfrio Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary-cool via-foreground to-primary-cool bg-clip-text text-transparent mb-4">
            Sulfrio Service
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sistema Avançado de Cálculo HVAC
          </p>
        </div>

        {/* Navigation Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin() ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 w-full max-w-6xl`}>
          <Link to="/multi" className="group">
            <HVACCard 
              title="Multi Split" 
              description="Calculadora para sistemas Multi Split"
              variant="cool"
              className="h-full group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </Link>

          <Link to="/vrf" className="group">
            <HVACCard 
              title="VRF System" 
              description="Calculadora para sistemas VRF"
              variant="warm"
              className="h-full group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </Link>

          <Link to="/diarias" className="group">
            <HVACCard 
              title="Diárias Projetos" 
              description="Cálculo de Diárias"
              variant="green"
              className="h-full group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </Link>

          {isAdmin() && (
            <Link to="/configuracoes/usuarios" className="group">
              <HVACCard 
                title="Configurações" 
                description="Gerenciamento de usuários e sistema"
                variant="default"
                className="h-full group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Sistema desenvolvido para cálculos precisos de equipamentos HVAC • ©2025 Sulfrioservice.com.br, ltda
          </p>
        </div>
      </div>
    </div>
  )
}