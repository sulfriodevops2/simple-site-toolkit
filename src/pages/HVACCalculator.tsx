import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeSelector } from "@/components/hvac/ModeSelector"
import { BrandSelector } from "@/components/hvac/BrandSelector"
import { CalculationResult } from "@/components/hvac/CalculationResult"
import { DetailedAnalysis } from "@/components/hvac/DetailedAnalysis"
import { ArrowLeft, Calculator, Snowflake } from "lucide-react"
import { Link } from "react-router-dom"
import { parseEntrada, calcular, type DetailedResult } from "@/utils/hvac-calculator"

export default function HVACCalculator() {
  const [evaporators, setEvaporators] = useState("")
  const [mode, setMode] = useState("residencial")
  const [brand, setBrand] = useState("todas")
  const [results, setResults] = useState<DetailedResult[]>([])
  const [details, setDetails] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    
    try {
      const entradaOriginal = parseEntrada(evaporators)
      
      if (entradaOriginal.length === 0) {
        setResults([])
        setDetails("Informe ao menos uma evaporadora (7, 9, 12, 18, 24).")
        setLoading(false)
        return
      }

      const calculation = calcular(entradaOriginal, mode, brand)
      setResults(calculation.results)
      setDetails(calculation.details)
      setLoading(false)
    } catch (error) {
      console.error("Error calculating:", error)
      setResults([])
      setDetails("Erro no cálculo. Verifique os dados informados.")
      setLoading(false)
    }
  }

  const handleClear = () => {
    setEvaporators("")
    setMode("residencial")
    setBrand("todas")
    setResults([])
    setDetails(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-cool rounded-lg flex items-center justify-center">
                  <Snowflake className="w-4 h-4 text-background" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Calculadora Multi Split</h1>
                  <p className="text-sm text-muted-foreground">Sistema de Ar Condicionado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evaporadoras</CardTitle>
                <CardDescription>
                  Digite as capacidades das evaporadoras separadas por vírgula (ex: 7, 9, 12, 18, 24)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="evaporators">Capacidades (BTU/h)</Label>
                  <Input
                    id="evaporators"
                    value={evaporators}
                    onChange={(e) => setEvaporators(e.target.value)}
                    placeholder="Ex: 7, 9, 12, 18, 24"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Modo de Simultaneidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Modo</Label>
                    <select 
                      value={mode} 
                      onChange={(e) => setMode(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="residencial">Residencial</option>
                      <option value="corporativo">Corporativo</option>
                      <option value="capacidade-maxima">Capacidade Máxima</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Marca</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <select 
                      value={brand} 
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="todas">Todas</option>
                      <option value="lg">LG</option>
                      <option value="samsung">Samsung</option>
                      <option value="daikin">Daikin</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleCalculate}
                className="bg-gradient-cool hover:shadow-glow-cool transition-all duration-300 flex items-center space-x-2"
                disabled={loading || !evaporators.trim()}
              >
                <Calculator className="w-4 h-4" />
                <span>Calcular</span>
              </Button>
              <Button 
                onClick={handleClear}
                variant="outline"
                className="border-border/50 hover:bg-muted/10"
              >
                Limpar
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <CalculationResult results={results} loading={loading} />
          </div>

          {/* Detailed Analysis */}
          <DetailedAnalysis details={details} />
        </div>
      </div>
    </div>
  )
}