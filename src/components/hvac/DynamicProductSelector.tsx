import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface DynamicProductSelectorProps {
  table: 'produtos_vrf' | 'produtos_multi' | 'produtos_diarias';
  grupo: string;
  label: string;
  value?: string;
  onValueChange: (value: string, produto?: any) => void;
  filter?: Record<string, any>;
  placeholder?: string;
  disabled?: boolean;
}

export function DynamicProductSelector({
  table,
  grupo,
  label,
  value,
  onValueChange,
  filter = {},
  placeholder = "Selecione...",
  disabled = false
}: DynamicProductSelectorProps) {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOptions();
  }, [table, grupo, JSON.stringify(filter)]);

  const loadOptions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from(table)
        .select('*')
        .eq('grupo', grupo)
        .eq('ativo', true);

      // Apply filters to atributos JSONB field
      Object.entries(filter).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          query = query.contains('atributos', { [key]: val });
        }
      });

      const { data, error } = await query.order('ordem', { ascending: true });
      
      if (error) throw error;
      setOptions(data || []);
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (selectedValue: string) => {
    const selectedProduct = options.find(opt => opt.id === selectedValue || opt.nome === selectedValue);
    onValueChange(selectedValue, selectedProduct);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select 
        value={value} 
        onValueChange={handleValueChange}
        disabled={disabled || loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Carregando..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.nome}>
              {option.nome}
              {option.codigo && ` (${option.codigo})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}