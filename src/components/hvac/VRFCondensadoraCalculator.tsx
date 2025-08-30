import { useState, useEffect } from 'react';
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

// Mapa correto das evaporadoras (conforme versão antiga)
const EVAPORADORAS_MAP = {
  "hi-wall": {
    7: 7507,   // Nominal 7 → Real 7.507 BTU/h
    9: 9000,   
    12: 12000,
    18: 18000,
    24: 24000
  },
  "cassete": {
    7: 7507,
    9: 9000,
    12: 12000,
    18: 18000,
    24: 24000
  },
  "piso-teto": {
    7: 7507,
    9: 9000,
    12: 12000,
    18: 18000,
    24: 24000
  }
};

export function VRFCondensadoraCalculator() {
  const [params, setParams] = useState({
    simultaneidade: 'corporativo',
    tipoCondensadora: 'vertical',
    evaporadora: 'hi-wall',
    quantidade: '1',
    nominal: '7'  // Adicionado nominal
  });

  const [results, setResults] = useState<{ samsung: any; daikin: any } | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<"samsung" | "daikin">("samsung");

  const handleCalculate = () => {
    const simultaneidadeValues = {
      corporativo: 110,
      padrao: 130,
      residencial: 145
    };

    const qty = parseInt(params.quantidade) || 1;
    const nominal = parseInt(params.nominal) || 7;
    
    // Busca valor real correto do mapa
    const evapMap = EVAPORADORAS_MAP[params.evaporadora as keyof typeof EVAPORADORAS_MAP];
    const realBTU = evapMap?.[nominal as keyof typeof evapMap] || 7507;
    const totalCapacity = qty * realBTU;
    
    const entrada = [totalCapacity];
    const simultaneidade = simultaneidadeValues[params.simultaneidade as keyof typeof simultaneidadeValues];
    
    // Calcula para ambas as marcas considerando a orientação
    const samsungResult = calcularCondensadoraVRF(entrada, simultaneidade, "samsung", params.tipoCondensadora as any);
    const daikinResult = calcularCondensadoraVRF(entrada, simultaneidade, "daikin", params.tipoCondensadora as any);

    setResults({
      samsung: { ...samsungResult, orientacao: params.tipoCondensadora },
      daikin: { ...daikinResult, orientacao: params.tipoCondensadora }
    });
  };

  // Recalcula automaticamente quando params mudam
  useEffect(() => {
    handleCalculate();
  }, [params]);

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
              <div className="grid grid-cols-3 gap-2">
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
                <Select value={params.nominal} onValueChange={(value) => setParams(prev => ({ ...prev, nominal: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 (real {(7507).toLocaleString()})</SelectItem>
                    <SelectItem value="9">9 (real {(9000).toLocaleString()})</SelectItem>
                    <SelectItem value="12">12 (real {(12000).toLocaleString()})</SelectItem>
                    <SelectItem value="18">18 (real {(18000).toLocaleString()})</SelectItem>
                    <SelectItem value="24">24 (real {(24000).toLocaleString()})</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={params.quantidade} onValueChange={(value) => setParams(prev => ({ ...prev, quantidade: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <SelectItem key={num} value={num.toString()}>Qtd: {num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setParams({ simultaneidade: 'corporativo', tipoCondensadora: 'vertical', evaporadora: 'hi-wall', quantidade: '1', nominal: '7' })}>
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
                  <td className="p-2">{params.evaporadora === 'hi-wall' ? 'Hi Wall' : params.evaporadora === 'cassete' ? 'Cassete' : 'Piso Teto'}</td>
                  <td className="p-2">{params.nominal}</td>
                  <td className="p-2">{(() => {
                    const evapMap = EVAPORADORAS_MAP[params.evaporadora as keyof typeof EVAPORADORAS_MAP];
                    return (evapMap?.[parseInt(params.nominal) as keyof typeof evapMap] || 7507).toLocaleString();
                  })()}</td>
                  <td className="p-2">
                    <Input 
                      type="number" 
                      min="1"
                      value={params.quantidade} 
                      onChange={(e) => setParams(prev => ({ ...prev, quantidade: e.target.value }))} 
                      className="w-16 h-8" 
                    />
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