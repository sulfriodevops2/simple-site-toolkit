import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HVACCard } from '@/components/ui/hvac-card';
import { StatusChip } from '@/components/ui/status-chip';
import { Calculator, Settings, Thermometer, Wind, Zap } from 'lucide-react';

const VRFCalculator = () => {
  const [calculation, setCalculation] = useState({
    area: '',
    rooms: '',
    ceiling: '',
    insulation: 'medium',
    occupancy: '',
    equipment: '',
    selectedBrand: ''
  });

  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const area = parseFloat(calculation.area) || 0;
    const rooms = parseInt(calculation.rooms) || 1;
    const ceiling = parseFloat(calculation.ceiling) || 2.8;
    const occupancy = parseInt(calculation.occupancy) || 2;
    
    // VRF calculation logic (simplified)
    let baseBtu = area * 600; // Base BTU per m²
    
    // Adjustments
    if (ceiling > 3) baseBtu *= 1.1;
    if (calculation.insulation === 'poor') baseBtu *= 1.2;
    if (calculation.insulation === 'good') baseBtu *= 0.9;
    
    baseBtu += (occupancy * 600); // BTU per person
    
    const totalBtu = Math.round(baseBtu);
    const estimatedPower = Math.round(totalBtu * 0.293); // Convert BTU to watts
    
    setResult({
      totalBtu,
      estimatedPower,
      rooms,
      recommendedCapacity: Math.ceil(totalBtu / 12000) * 12000,
      efficiency: 'A+++',
      estimatedConsumption: Math.round(estimatedPower * 0.75 / 1000 * 8), // kWh per day
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Wind className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Calculadora VRF System
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sistema avançado de cálculo para equipamentos VRF (Variable Refrigerant Flow) 
          com análise detalhada de eficiência energética
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2">
          <HVACCard className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Parâmetros do Sistema VRF
              </CardTitle>
              <CardDescription>
                Configure os dados do ambiente para cálculo preciso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="advanced">Avançado</TabsTrigger>
                  <TabsTrigger value="zones">Zonas</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">Área Total (m²)</Label>
                      <Input
                        id="area"
                        placeholder="Ex: 150"
                        value={calculation.area}
                        onChange={(e) => setCalculation(prev => ({ ...prev, area: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Quantidade de Ambientes</Label>
                      <Input
                        id="rooms"
                        placeholder="Ex: 8"
                        value={calculation.rooms}
                        onChange={(e) => setCalculation(prev => ({ ...prev, rooms: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ceiling">Pé Direito (m)</Label>
                      <Input
                        id="ceiling"
                        placeholder="Ex: 2.8"
                        value={calculation.ceiling}
                        onChange={(e) => setCalculation(prev => ({ ...prev, ceiling: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupancy">Ocupação (pessoas)</Label>
                      <Input
                        id="occupancy"
                        placeholder="Ex: 12"
                        value={calculation.occupancy}
                        onChange={(e) => setCalculation(prev => ({ ...prev, occupancy: e.target.value }))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Isolamento Térmico</Label>
                      <Select value={calculation.insulation} onValueChange={(value) => 
                        setCalculation(prev => ({ ...prev, insulation: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poor">Ruim</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="good">Bom</SelectItem>
                          <SelectItem value="excellent">Excelente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equipment">Equipamentos Internos (W)</Label>
                      <Input
                        id="equipment"
                        placeholder="Ex: 2000"
                        value={calculation.equipment}
                        onChange={(e) => setCalculation(prev => ({ ...prev, equipment: e.target.value }))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="zones" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Wind className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configuração de zonas em desenvolvimento</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4 mt-6">
                <Button onClick={handleCalculate} className="flex-1">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular VRF
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </HVACCard>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {result ? (
            <>
              <HVACCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Resultado VRF
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">BTU/h Total</p>
                      <p className="font-mono text-lg font-semibold">
                        {result.totalBtu.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Potência (W)</p>
                      <p className="font-mono text-lg font-semibold">
                        {result.estimatedPower.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Ambientes</p>
                      <p className="font-mono text-lg font-semibold">
                        {result.rooms}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Capacidade</p>
                      <p className="font-mono text-lg font-semibold">
                        {(result.recommendedCapacity / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Eficiência:</span>
                      <StatusChip className="bg-green-100 text-green-800">{result.efficiency}</StatusChip>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Consumo/dia:</span>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {result.estimatedConsumption} kWh
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </HVACCard>

              <HVACCard>
                <CardHeader>
                  <CardTitle className="text-lg">Recomendações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    • Sistema VRF ideal para múltiplos ambientes
                  </p>
                  <p className="text-muted-foreground">
                    • Controle individual por zona
                  </p>
                  <p className="text-muted-foreground">
                    • Economia de até 40% vs sistemas convencionais
                  </p>
                  <p className="text-muted-foreground">
                    • Instalação com tubulação única
                  </p>
                </CardContent>
              </HVACCard>
            </>
          ) : (
            <HVACCard>
              <CardContent className="text-center py-12">
                <Wind className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Preencha os dados e clique em "Calcular VRF" para ver os resultados
                </p>
              </CardContent>
            </HVACCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default VRFCalculator;