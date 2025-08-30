import { useState } from 'react';
import { HVACCard } from '@/components/ui/hvac-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusChip } from '@/components/ui/status-chip';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Settings } from 'lucide-react';
import { calcularCondensadoraVRF } from '@/utils/vrf-calculator';

export function VRFCondensadoraCalculator() {
  const [params, setParams] = useState({
    simultaneidade: 'corporativo',
    tipoCondensadora: 'vertical',
    evaporadora: 'hi-wall',
    quantidade: '5'
  });

  const [results, setResults] = useState<{ samsung: any; daikin: any } | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<"samsung" | "daikin">("samsung");

  const handleCalculate = () => {
    const simultaneidadeValues = {
      corporativo: 1.10,
      padrao: 1.30,
      residencial: 1.45
    };

    const baseCapacity = parseInt(params.quantidade) * 5118; // Valor base do Hi Wall
    const entrada = [baseCapacity];
    const simultaneidade = simultaneidadeValues[params.simultaneidade as keyof typeof simultaneidadeValues];
    
    // Calcula para ambas as marcas
    const samsungResult = calcularCondensadoraVRF(entrada, simultaneidade, "samsung");
    const daikinResult = calcularCondensadoraVRF(entrada, simultaneidade, "daikin");

    setResults({
      samsung: { ...samsungResult, orientacao: params.tipoCondensadora },
      daikin: { ...daikinResult, orientacao: params.tipoCondensadora }
    });
  };

  return (
    <HVACCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Calculadora de Condensadoras VRF
        </CardTitle>
        <CardDescription>
          Sistema de cálculo para seleção de condensadoras baseado em simultaneidade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simultaneidade */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Simultaneidade</h3>
            <div className="space-y-2">
              {[
                { value: 'corporativo', label: 'Corporativo (110%)', selected: params.simultaneidade === 'corporativo' },
                { value: 'padrao', label: 'Limite Padrão (130%)', selected: params.simultaneidade === 'padrao' },
                { value: 'residencial', label: 'Limite Residencial (145%)', selected: params.simultaneidade === 'residencial' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={option.selected ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setParams(prev => ({ ...prev, simultaneidade: option.value }))}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tipo de Condensadora e Modo */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Tipo de Condensadora</h3>
              <div className="flex gap-2">
                <Button
                  variant={params.tipoCondensadora === 'vertical' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setParams(prev => ({ ...prev, tipoCondensadora: 'vertical' }))}
                >
                  Vertical
                </Button>
                <Button
                  variant={params.tipoCondensadora === 'horizontal' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setParams(prev => ({ ...prev, tipoCondensadora: 'horizontal' }))}
                >
                  Horizontal
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Selecionar Evaporadora</h3>
              <div className="grid grid-cols-2 gap-2">
                <Select value={params.evaporadora} onValueChange={(value) => setParams(prev => ({ ...prev, evaporadora: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hi-wall">Hi Wall</SelectItem>
                    <SelectItem value="cassete">Cassete</SelectItem>
                    <SelectItem value="piso-teto">Piso Teto</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={params.quantidade} onValueChange={(value) => setParams(prev => ({ ...prev, quantidade: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} (real {(num * 5.118).toFixed(0)})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCalculate}>
                  Adicionar
                </Button>
                <Button variant="outline" size="sm">
                  Limpar
                </Button>
              </div>
            </div>
          </div>

            {/* Resultado */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Resultado</h3>
            <div className="flex gap-2 mb-4">
              <Button 
                variant={selectedBrand === "samsung" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedBrand("samsung")}
              >
                Samsung
              </Button>
              <Button 
                variant={selectedBrand === "daikin" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedBrand("daikin")}
              >
                Daikin
              </Button>
            </div>
            
            {results && results[selectedBrand] ? (
              <div className="space-y-3 text-sm">
                {results[selectedBrand].condensadoraIdeal && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Condensadora ideal: {results[selectedBrand].condensadoraIdeal.nome}</p>
                    <p className="text-muted-foreground">{results[selectedBrand].orientacao} - Cap. real: {results[selectedBrand].condensadoraIdeal.nominal.toLocaleString()} BTU/h</p>
                    <StatusChip className="bg-green-100 text-green-800 mt-1">
                      Simultaneidade: {results[selectedBrand].condensadoraIdeal.simultaneidade}
                    </StatusChip>
                  </div>
                )}
                
                {results[selectedBrand].umaAcima && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Uma acima: {results[selectedBrand].umaAcima.nome}</p>
                    <p className="text-muted-foreground">{results[selectedBrand].orientacao} - Cap. real: {results[selectedBrand].umaAcima.nominal.toLocaleString()} BTU/h</p>
                    <StatusChip className="bg-green-100 text-green-800 mt-1">
                      Simultaneidade: {results[selectedBrand].umaAcima.simultaneidade}
                    </StatusChip>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Configure os parâmetros e clique em "Adicionar" para ver os resultados
              </p>
            )}
          </div>
        </div>

        {/* Detalhes */}
        {results && (
          <div className="border-t pt-6">
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm">Por unidade</Button>
              <Button variant="default" size="sm">Agrupado</Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p><strong>Marca:</strong> {results[selectedBrand].marca}</p>
                <p><strong>Simultaneidade (selecionada):</strong> {params.simultaneidade === 'corporativo' ? '110%' : params.simultaneidade === 'padrao' ? '130%' : '145%'}</p>
                <p><strong>Capacidade mínima requerida (após simult.):</strong> {results[selectedBrand].capacidadeMinima.toLocaleString()} BTU/h</p>
              </div>
              <div>
                <p><strong>Orientação:</strong> {results[selectedBrand].orientacao}</p>
                <p><strong>Soma das evaporadoras (válidas):</strong> {results[selectedBrand].somaEvaporadoras.toLocaleString()} BTU/h</p>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Nominal</th>
                  <th className="text-left p-2">Real (BTU/h)</th>
                  <th className="text-left p-2">Qtd</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">1</td>
                  <td className="p-2">Hi Wall</td>
                  <td className="p-2">5</td>
                  <td className="p-2">5.118</td>
                  <td className="p-2">
                    <Input type="number" value={params.quantidade} onChange={(e) => setParams(prev => ({ ...prev, quantidade: e.target.value }))} className="w-16 h-8" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </HVACCard>
  );
}