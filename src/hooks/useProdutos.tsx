import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProdutoData {
  id: string;
  ativo: boolean;
  grupo: string;
  nome: string;
  codigo?: string;
  ordem: number;
  atributos: any;
}

type TableType = 'produtos_multi' | 'produtos_vrf' | 'produtos_diarias';

export function useProdutos(table: TableType, grupo?: string) {
  const [produtos, setProdutos] = useState<ProdutoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProdutos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from(table)
        .select('*')
        .eq('ativo', true);
      
      if (grupo) {
        query = query.eq('grupo', grupo);
      }
      
      const { data, error: supabaseError } = await query.order('ordem', { ascending: true });
      
      if (supabaseError) throw supabaseError;
      
      setProdutos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProdutos();
  }, [table, grupo]);

  const refresh = () => {
    loadProdutos();
  };

  return {
    produtos,
    loading,
    error,
    refresh
  };
}

// Hook específico para carregar produtos por grupo
export function useProdutosPorGrupo(table: TableType, grupo: string) {
  return useProdutos(table, grupo);
}

// Hooks específicos para cada tipo de produto
export function useProdutosMulti(grupo?: string) {
  return useProdutos('produtos_multi', grupo);
}

export function useProdutosVRF(grupo?: string) {
  return useProdutos('produtos_vrf', grupo);
}

export function useProdutosDiarias(grupo?: string) {
  return useProdutos('produtos_diarias', grupo);
}