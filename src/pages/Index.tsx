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
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-cool/20 rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-primary-cool" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Sistemas Multi</div>
                    <div className="text-xs text-muted-foreground">LG • Daikin • Samsung</div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary-cool/10 rounded-full flex items-center justify-center group-hover:bg-primary-cool/20 transition-colors">
                  <Wind className="w-4 h-4 text-primary-cool" />
                </div>
              </div>
            </HVACCard>
          </Link>

          <Link to="/vrf" className="group">
            <HVACCard 
              title="VRF System" 
              description="Calculadora para sistemas VRF"
              variant="warm"
              className="h-full group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-warm/20 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-primary-warm" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Sistemas VRF</div>
                    <div className="text-xs text-muted-foreground">Variable Refrigerant Flow</div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary-warm/10 rounded-full flex items-center justify-center group-hover:bg-primary-warm/20 transition-colors">
                  <Wind className="w-4 h-4 text-primary-warm" />
                </div>
              </div>
            </HVACCard>
          </Link>

          <Link to="/diarias" className="group">
            <HVACCard 
              title="Diárias Projetos" 
              description="Cálculo de Diárias"
              variant="green"
              className="h-full group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-green/20 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-primary-green" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Calculadora de Diárias</div>
                    <div className="text-xs text-muted-foreground">Estimativa de Projetos</div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary-green/10 rounded-full flex items-center justify-center group-hover:bg-primary-green/20 transition-colors">
                  <ClipboardList className="w-4 h-4 text-primary-green" />
                </div>
              </div>
            </HVACCard>
          </Link>

          {isAdmin() && (
            <Link to="/configuracoes/usuarios" className="group">
              <HVACCard 
                title="Configurações" 
                description="Gerenciamento de usuários e sistema"
                variant="default"
                className="h-full group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Admin Panel</div>
                      <div className="text-xs text-muted-foreground">Usuários • Perfis • Sistema</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-muted-foreground/10 rounded-full flex items-center justify-center group-hover:bg-muted-foreground/20 transition-colors">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </HVACCard>
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