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
import { Calculator, Settings, Thermometer, Wind, Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VRFCondensadoraCalculator } from '@/components/hvac/VRFCondensadoraCalculator';

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
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">VRF Calculator</h1>
      </div>
      
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

      {/* Seção de Calculadora de Condensadoras */}
      <VRFCondensadoraCalculator />
    </div>
  );
};

export default VRFCalculator;