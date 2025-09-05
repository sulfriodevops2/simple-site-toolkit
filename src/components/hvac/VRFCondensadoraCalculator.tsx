import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import { DynamicProductSelector } from './DynamicProductSelector';
import { CalculationResult } from './CalculationResult';
import { DetailedAnalysis } from './DetailedAnalysis';
import { calcularCondensadoraVRF } from '@/utils/vrf-calculator';

export function VRFCondensadoraCalculator() {
  const [marca, setMarca] = useState('');
  const [orientation, setOrientation] = useState('');
  const [simultaneidade, setSimultaneidade] = useState(130);
  const [evaporadoras, setEvaporadoras] = useState([
    { tipo: '', nominal: 0, real: 0, codigo: '' }
  ]);
  const [resultado, setResultado] = useState(null);

  const handleCalculate = () => {
    if (!marca || !orientation || evaporadoras.some(e => !e.real)) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    const entradas = evaporadoras.map(e => e.real);
    const res = calcularCondensadoraVRF(entradas, simultaneidade, marca as 'samsung' | 'daikin', orientation as 'vertical' | 'horizontal');
    setResultado(res);
  };

  const addEvaporadora = () => {
    setEvaporadoras([...evaporadoras, { tipo: '', nominal: 0, real: 0, codigo: '' }]);
  };

  const removeEvaporadora = (index: number) => {
    if (evaporadoras.length > 1) {
      setEvaporadoras(evaporadoras.filter((_, i) => i !== index));
    }
  };

  const updateEvaporadora = (index: number, updatedEvap: any) => {
    const newEvaps = [...evaporadoras];
    newEvaps[index] = updatedEvap;
    setEvaporadoras(newEvaps);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculadora VRF - Condensadoras
          </CardTitle>
          <CardDescription>
            Dimensionamento de condensadoras VRF baseado em evaporadoras e simultaneidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configurações Gerais */}
          <div className="space-y-4">
            <h3 className="font-semibold">Configurações Gerais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DynamicProductSelector
                table="produtos_vrf"
                grupo="marca"
                label="Marca"
                value={marca}
                onValueChange={(value) => setMarca(value)}
                placeholder="Selecione a marca"
              />
              
              <DynamicProductSelector
                table="produtos_vrf"
                grupo="cond_orientacao"
                label="Orientação da Condensadora"
                value={orientation}
                onValueChange={(value) => setOrientation(value)}
                placeholder="Selecione a orientação"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="simultaneidade">Simultaneidade (%)</Label>
                <Input
                  id="simultaneidade"
                  type="number"
                  value={simultaneidade}
                  onChange={(e) => setSimultaneidade(parseInt(e.target.value) || 130)}
                  min="100"
                  max="200"
                />
              </div>
            </div>
          </div>

          {/* Lista de Evaporadoras */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Evaporadoras</h3>
              <Button onClick={addEvaporadora} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Evaporadora
              </Button>
            </div>

            {evaporadoras.map((evap, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Evaporadora {index + 1}</h4>
                    {evaporadoras.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEvaporadora(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DynamicProductSelector
                      table="produtos_vrf"
                      grupo="tipo_evap"
                      label="Tipo de Evaporadora"
                      value={evap.tipo}
                      onValueChange={(value) => updateEvaporadora(index, { ...evap, tipo: value })}
                      placeholder="Selecione o tipo"
                    />
                    
                    <DynamicProductSelector
                      table="produtos_vrf"
                      grupo="evap_nominal"
                      label="Capacidade Nominal"
                      value=""
                      onValueChange={(value, produto) => {
                        if (produto) {
                          updateEvaporadora(index, {
                            ...evap,
                            nominal: produto.atributos?.nominal || 0,
                            real: produto.atributos?.cap_real || 0,
                            codigo: produto.atributos?.code || produto.codigo || ''
                          });
                        }
                      }}
                      filter={{ marca, tipo: evap.tipo }}
                      disabled={!marca || !evap.tipo}
                      placeholder="Selecione a capacidade"
                    />
                    
                    <div className="space-y-2">
                      <Label>Código da Evaporadora</Label>
                      <Input
                        value={evap.codigo}
                        onChange={(e) => {
                          const codigo = e.target.value.toUpperCase();
                          updateEvaporadora(index, { ...evap, codigo });
                          // TODO: Buscar produto por código e atualizar nominal/real
                        }}
                        placeholder="Digite o código"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Capacidade Real (BTU/h)</Label>
                      <Input
                        type="number"
                        value={evap.real || ''}
                        onChange={(e) => updateEvaporadora(index, { ...evap, real: parseInt(e.target.value) || 0 })}
                        placeholder="Capacidade real"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Botão Calcular */}
          <Button 
            onClick={handleCalculate} 
            className="w-full bg-gradient-primary hover:shadow-glow transition-all"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calcular Condensadora
          </Button>

          {/* Resultados */}
          {resultado && (
            <div className="space-y-4">
              <h3 className="font-semibold">Resultados</h3>
              <div className="grid gap-4">
                {resultado.condensadoraIdeal && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800">Condensadora Ideal</h4>
                    <p className="text-green-700">{resultado.condensadoraIdeal.nome}</p>
                    <p className="text-sm text-green-600">
                      Simultaneidade: {resultado.condensadoraIdeal.simultaneidade}
                    </p>
                  </div>
                )}
                {resultado.umaAcima && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800">Uma Acima</h4>
                    <p className="text-blue-700">{resultado.umaAcima.nome}</p>
                  </div>
                )}
                {resultado.umaAbaixo && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Uma Abaixo</h4>
                    <p className="text-yellow-700">{resultado.umaAbaixo.nome}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}