import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Edit, Trash2, Search, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Produto {
  id: string;
  ativo: boolean;
  grupo: string;
  nome: string;
  codigo?: string;
  ordem: number;
  atributos: any;
  created_at: string;
  updated_at: string;
}

const GRUPOS_MULTI = [
  { value: 'marca', label: 'Marca' },
  { value: 'modelo_cond', label: 'Modelo Condensadora' },
  { value: 'evaporadora_nominal', label: 'Evaporadora Nominal' },
  { value: 'modo_simult', label: 'Modo Simultaneidade' },
];

const GRUPOS_VRF = [
  { value: 'marca', label: 'Marca' },
  { value: 'tipo_evap', label: 'Tipo Evaporadora' },
  { value: 'evap_nominal', label: 'Evaporadora Nominal' },
  { value: 'evap_code', label: 'Código Evaporadora' },
  { value: 'cond_orientacao', label: 'Orientação Condensadora' },
  { value: 'cond_hp', label: 'HP Condensadora' },
  { value: 'limite_simult', label: 'Limite Simultaneidade' },
];

const GRUPOS_DIARIAS = [
  { value: 'calc_base', label: 'Base de Cálculo' },
  { value: 'tipo_evap', label: 'Tipo Evaporadora' },
  { value: 'fator', label: 'Fator' },
  { value: 'coef_projeto', label: 'Coeficiente Projeto' },
];

const TabelaProdutos = () => {
  const [activeTab, setActiveTab] = useState('multi');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState('');
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCurrentTable = () => {
    switch (activeTab) {
      case 'multi': return 'produtos_multi';
      case 'vrf': return 'produtos_vrf';
      case 'diarias': return 'produtos_diarias';
      default: return 'produtos_multi';
    }
  };

  const getCurrentGrupos = () => {
    switch (activeTab) {
      case 'multi': return GRUPOS_MULTI;
      case 'vrf': return GRUPOS_VRF;
      case 'diarias': return GRUPOS_DIARIAS;
      default: return GRUPOS_MULTI;
    }
  };

  const loadProdutos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(getCurrentTable())
        .select('*')
        .order('grupo', { ascending: true })
        .order('ordem', { ascending: true });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProdutos = () => {
    let filtered = produtos;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.codigo && p.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedGrupo) {
      filtered = filtered.filter(p => p.grupo === selectedGrupo);
    }
    
    setFilteredProdutos(filtered);
  };

  const handleSave = async (produto: Partial<Produto>) => {
    setLoading(true);
    try {
      const data = {
        grupo: produto.grupo,
        nome: produto.nome,
        codigo: produto.codigo || null,
        ordem: produto.ordem || 0,
        ativo: produto.ativo ?? true,
        atributos: produto.atributos || {},
      };

      if (editingProduct) {
        const { error } = await supabase
          .from(getCurrentTable())
          .update(data)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        toast({
          title: "Produto atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from(getCurrentTable())
          .insert(data);
        
        if (error) throw error;
        toast({
          title: "Produto criado",
          description: "Novo produto adicionado com sucesso.",
        });
      }

      setEditingProduct(null);
      setIsCreating(false);
      await loadProdutos();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o produto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from(getCurrentTable())
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({
        title: "Produto excluído",
        description: "Produto removido com sucesso.",
      });
      await loadProdutos();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProdutos();
  }, [activeTab]);

  useEffect(() => {
    filterProdutos();
  }, [produtos, searchTerm, selectedGrupo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/configuracoes" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Tabelas de Produtos</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="multi">Multi Split</TabsTrigger>
            <TabsTrigger value="vrf">VRF</TabsTrigger>
            <TabsTrigger value="diarias">Diárias</TabsTrigger>
          </TabsList>

          {['multi', 'vrf', 'diarias'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              {/* Filters and Actions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Produtos {tab === 'multi' ? 'Multi Split' : tab === 'vrf' ? 'VRF' : 'Diárias'}</CardTitle>
                      <CardDescription>
                        Gerencie os produtos utilizados nos cálculos
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setIsCreating(true)}
                      className="bg-gradient-primary hover:shadow-glow transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Produto
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Buscar</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Buscar por nome ou código..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="w-48">
                      <Label htmlFor="grupo">Filtrar por Grupo</Label>
                      <Select value={selectedGrupo} onValueChange={setSelectedGrupo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os grupos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos os grupos</SelectItem>
                          {getCurrentGrupos().map((grupo) => (
                            <SelectItem key={grupo.value} value={grupo.value}>
                              {grupo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products List */}
              <div className="grid gap-4">
                {filteredProdutos.map((produto) => (
                  <Card key={produto.id} className={!produto.ativo ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{produto.nome}</h3>
                              {produto.codigo && (
                                <Badge variant="outline">{produto.codigo}</Badge>
                              )}
                              <Badge variant={produto.ativo ? 'default' : 'secondary'}>
                                {produto.ativo ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getCurrentGrupos().find(g => g.value === produto.grupo)?.label} • Ordem: {produto.ordem}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(produto)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(produto.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Create/Edit Modal */}
        {(isCreating || editingProduct) && (
          <ProductForm
            produto={editingProduct}
            grupos={getCurrentGrupos()}
            onSave={handleSave}
            onCancel={() => {
              setIsCreating(false);
              setEditingProduct(null);
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

interface ProductFormProps {
  produto: Produto | null;
  grupos: Array<{ value: string; label: string }>;
  onSave: (produto: Partial<Produto>) => void;
  onCancel: () => void;
  loading: boolean;
}

const ProductForm = ({ produto, grupos, onSave, onCancel, loading }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    grupo: produto?.grupo || '',
    nome: produto?.nome || '',
    codigo: produto?.codigo || '',
    ordem: produto?.ordem || 0,
    ativo: produto?.ativo ?? true,
    atributos: JSON.stringify(produto?.atributos || {}, null, 2),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const atributos = JSON.parse(formData.atributos);
      onSave({
        ...formData,
        atributos,
      });
    } catch (error) {
      alert('JSON inválido nos atributos');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{produto ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grupo">Grupo *</Label>
                <Select 
                  value={formData.grupo} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, grupo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {grupos.map((grupo) => (
                      <SelectItem key={grupo.value} value={grupo.value}>
                        {grupo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="ordem">Ordem</Label>
                <Input
                  id="ordem"
                  type="number"
                  value={formData.ordem}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>

            <div>
              <Label htmlFor="atributos">Atributos (JSON)</Label>
              <Textarea
                id="atributos"
                value={formData.atributos}
                onChange={(e) => setFormData(prev => ({ ...prev, atributos: e.target.value }))}
                rows={8}
                className="font-mono text-sm"
                placeholder='{"exemplo": "valor"}'
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !formData.grupo || !formData.nome}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabelaProdutos;