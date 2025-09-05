export type FieldSpec =
  | { key: string; label: string; type: 'text'; required?: boolean; width?: 'half'|'full' }
  | { key: string; label: string; type: 'number'; step?: number; required?: boolean; width?: 'half'|'full' }
  | { key: string; label: string; type: 'select'; options: {value:string,label:string}[]; required?: boolean; width?: 'half'|'full' }
  | { key: string; label: string; type: 'checkbox'; required?: boolean; width?: 'half'|'full' };

export type GroupFields = Record<string, FieldSpec[]>;

export const FIELDS: GroupFields = {
  // VRF
  'marca_vrf': [{ key: 'marca', label: 'Marca', type: 'text', required: true }],
  'tipo_evap': [{ key: 'tipo', label: 'Tipo', type: 'text', required: true }],
  'evap_nominal': [
    { key: 'marca', label: 'Marca', type: 'select',
      options: [{value:'Samsung',label:'Samsung'}, {value:'Daikin',label:'Daikin'}], required:true, width:'half' },
    { key: 'tipo', label: 'Tipo Evap.', type: 'text', required:true, width:'half' },
    { key: 'nominal', label: 'Cap. nominal', type: 'number', step:1, required:true, width:'half' },
    { key: 'cap_real', label: 'Cap. real', type: 'number', step:1, required:true, width:'half' },
    { key: 'code', label: 'Código (opcional)', type: 'text', width:'half' },
  ],
  'evap_code': [
    { key: 'marca', label:'Marca', type:'select',
      options:[{value:'Samsung',label:'Samsung'},{value:'Daikin',label:'Daikin'}], required:true, width:'half' },
    { key: 'tipo', label:'Tipo Evap.', type:'text', required:true, width:'half' },
    { key: 'nominal', label:'Nominal', type:'number', step:1, required:true, width:'half' },
    { key: 'code', label:'Código', type:'text', required:true, width:'half' },
  ],
  'cond_orientacao': [],
  'cond_hp': [
    { key:'marca', label:'Marca', type:'select',
      options:[{value:'Samsung',label:'Samsung'},{value:'Daikin',label:'Daikin'}], required:true, width:'half' },
    { key:'orientacao', label:'Orientação', type:'select',
      options:[{value:'Vertical',label:'Vertical'},{value:'Horizontal',label:'Horizontal'}], required:true, width:'half' },
    { key:'hp', label:'HP', type:'number', step:1, required:true, width:'half' },
    { key:'cap_real', label:'Cap. real', type:'number', step:1, required:true, width:'half' },
    { key:'volt', label:'Tensão (opcional)', type:'number', step:1, width:'half' },
  ],
  'limite_simult': [
    { key:'marca', label:'Marca', type:'select',
      options:[{value:'Samsung',label:'Samsung'},{value:'Daikin',label:'Daikin'}], required:true, width:'half' },
    { key:'simul_max', label:'Fator Máximo', type:'number', step:0.01, required:true, width:'half' },
  ],

  // MULTI
  'marca_multi': [{ key:'marca', label:'Marca', type:'text', required:true }],
  'modelo_cond': [
    { key:'marca', label:'Marca', type:'select',
      options:[{value:'LG',label:'LG'},{value:'Daikin',label:'Daikin'},{value:'Samsung',label:'Samsung'}], required:true, width:'half' },
    { key:'capNominal', label:'Cap. nominal', type:'number', required:true, width:'half' },
    { key:'capMax', label:'Cap. máxima', type:'number', required:true, width:'half' },
    { key:'maxEvaps', label:'Máx. evaporadoras', type:'number', width:'half' },
  ],
  'evaporadora_nominal': [{ key:'nominal', label:'Nominal', type:'number', required:true }],
  'modo_simult': [
    { key:'nome', label:'Nome', type:'text', required:true, width:'half' },
    { key:'limite', label:'Fator Limite', type:'number', step:0.01, width:'half' },
    { key:'usaCapMax', label:'Usa Cap. Máx?', type:'checkbox', width:'half' },
  ],

  // DIÁRIAS
  'calc_base': [{ key:'fator_btu_m2', label:'BTU por m²', type:'number', required:true }],
  'tipo_evap_diarias': [{ key:'tipo', label:'Tipo', type:'text', required:true }],
  'fator': [
    { key:'codigo', label:'Código', type:'text', required:true, width:'half' },
    { key:'multiplicador', label:'Multiplicador', type:'number', step:0.01, required:true, width:'half' }
  ],
  'coef_projeto': [
    { key:'tipo', label:'Projeto', type:'select',
      options:[{value:'Residencial',label:'Residencial'},{value:'Corporativo',label:'Corporativo'}], required:true, width:'half' },
    { key:'div_dutado', label:'Divisor Dutado', type:'number', step:1, required:true, width:'half' },
    { key:'div_aparente', label:'Divisor Ap. (HiWall/K7/Piso)', type:'number', step:1, required:true, width:'half' },
    { key:'fator_aparentes_extra', label:'Fator extra (aparentes)', type:'number', step:0.1, required:true, width:'half' },
  ],
};