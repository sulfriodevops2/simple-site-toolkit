-- Criar tabelas para produtos dinâmicos

-- Tabela para produtos Multi Split
CREATE TABLE IF NOT EXISTS produtos_multi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ativo boolean DEFAULT true,
  grupo text NOT NULL,
  nome text NOT NULL,
  codigo text,
  ordem integer DEFAULT 0,
  atributos jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela para produtos VRF
CREATE TABLE IF NOT EXISTS produtos_vrf (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ativo boolean DEFAULT true,
  grupo text NOT NULL,
  nome text NOT NULL,
  codigo text,
  ordem integer DEFAULT 0,
  atributos jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela para produtos Diárias
CREATE TABLE IF NOT EXISTS produtos_diarias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ativo boolean DEFAULT true,
  grupo text NOT NULL,
  nome text NOT NULL,
  codigo text,
  ordem integer DEFAULT 0,
  atributos jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE produtos_multi ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos_vrf ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos_diarias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - permitir leitura para todos usuários autenticados
CREATE POLICY "Anyone can view active products" ON produtos_multi
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admins can manage multi products" ON produtos_multi
  FOR ALL USING (true);

CREATE POLICY "Anyone can view active vrf products" ON produtos_vrf
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admins can manage vrf products" ON produtos_vrf
  FOR ALL USING (true);

CREATE POLICY "Anyone can view active diarias products" ON produtos_diarias
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admins can manage diarias products" ON produtos_diarias
  FOR ALL USING (true);

-- Índices para performance
CREATE INDEX idx_produtos_multi_grupo_ativo ON produtos_multi(grupo, ativo);
CREATE INDEX idx_produtos_vrf_grupo_ativo ON produtos_vrf(grupo, ativo);
CREATE INDEX idx_produtos_diarias_grupo_ativo ON produtos_diarias(grupo, ativo);

-- Triggers para updated_at
CREATE TRIGGER update_produtos_multi_updated_at
  BEFORE UPDATE ON produtos_multi
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produtos_vrf_updated_at
  BEFORE UPDATE ON produtos_vrf
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produtos_diarias_updated_at
  BEFORE UPDATE ON produtos_diarias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed inicial com dados do código atual
-- VRF: Tipos de evaporadora
INSERT INTO produtos_vrf (grupo, nome, ordem, atributos) VALUES
('tipo_evap', 'Hi Wall', 1, '{}'),
('tipo_evap', 'Cassete 1 Via', 2, '{}'),
('tipo_evap', 'Cassete 4 Vias', 3, '{}'),
('tipo_evap', 'Duto', 4, '{}'),
('tipo_evap', 'Piso Teto', 5, '{}');

-- VRF: Marcas
INSERT INTO produtos_vrf (grupo, nome, ordem, atributos) VALUES
('marca', 'Samsung', 1, '{"simul_max": 1.45}'),
('marca', 'Daikin', 2, '{"simul_max": 1.30}');

-- VRF: Orientações
INSERT INTO produtos_vrf (grupo, nome, ordem, atributos) VALUES
('cond_orientacao', 'Vertical', 1, '{}'),
('cond_orientacao', 'Horizontal', 2, '{}');

-- Multi: Marcas
INSERT INTO produtos_multi (grupo, nome, ordem, atributos) VALUES
('marca', 'Samsung', 1, '{}'),
('marca', 'Daikin', 2, '{}'),
('marca', 'LG', 3, '{}');

-- Multi: Evaporadoras nominais
INSERT INTO produtos_multi (grupo, nome, ordem, atributos) VALUES
('evaporadora_nominal', '7', 1, '{"valor": 7}'),
('evaporadora_nominal', '9', 2, '{"valor": 9}'),
('evaporadora_nominal', '12', 3, '{"valor": 12}'),
('evaporadora_nominal', '18', 4, '{"valor": 18}'),
('evaporadora_nominal', '24', 5, '{"valor": 24}');

-- Multi: Modos de simultaneidade
INSERT INTO produtos_multi (grupo, nome, ordem, atributos) VALUES
('modo_simult', 'Residencial', 1, '{"limite": 1.40}'),
('modo_simult', 'Corporativo', 2, '{"limite": 1.10}'),
('modo_simult', 'Capacidade Máxima', 3, '{"usaCapMax": true}');

-- Diárias: Base de cálculo
INSERT INTO produtos_diarias (grupo, nome, ordem, atributos) VALUES
('calc_base', '700', 1, '{"fator_btu_m2": 700}'),
('calc_base', '1000', 2, '{"fator_btu_m2": 1000}');

-- Diárias: Tipos de evaporadora
INSERT INTO produtos_diarias (grupo, nome, ordem, atributos) VALUES
('tipo_evap', 'Dutado', 1, '{}'),
('tipo_evap', 'Hi Wall', 2, '{}'),
('tipo_evap', 'K7 1via', 3, '{}'),
('tipo_evap', 'K7 4vias', 4, '{}'),
('tipo_evap', 'Piso Teto', 5, '{}');

-- Diárias: Fatores
INSERT INTO produtos_diarias (grupo, nome, codigo, ordem, atributos) VALUES
('fator', 'PD Duplo', 'pd_duplo', 1, '{"multiplicador": 1.30}'),
('fator', 'Capital', 'local_capital', 2, '{"multiplicador": 1.00}'),
('fator', 'Interior/Litoral', 'local_interior', 3, '{"multiplicador": 1.15}'),
('fator', 'As Built', 'as_built', 4, '{"multiplicador": 1.30}');

-- Diárias: Coeficientes por tipo de projeto
INSERT INTO produtos_diarias (grupo, nome, ordem, atributos) VALUES
('coef_projeto', 'Residencial', 1, '{"divisores": {"dutado": 10, "aparentes": 16}, "fator_aparentes_extra": 1.4}'),
('coef_projeto', 'Corporativo', 2, '{"divisores": {"dutado": 7, "aparentes": 11}, "fator_aparentes_extra": 1.4}');