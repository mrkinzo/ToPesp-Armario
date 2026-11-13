export type Categoria = 'rocha' | 'mineral';

export type TipoRocha =
  | 'Ígnea'
  | 'Sedimentar'
  | 'Metamórfica'
  | 'Outro'
  | string;

export type TipoMineral =
  | 'Silicato'
  | 'Óxido'
  | 'Sulfeto'
  | 'Carbonato'
  | 'Haleto'
  | 'Sulfato'
  | 'Fosfato'
  | 'Elemento Nativo'
  | 'Outro'
  | string;

export interface AmostraInput {
  nome: string;
  categoria: Categoria;
  tipo: string;
  dureza?: number | null;
  descricao?: string;
  localizacao?: string;
  dataAquisicao?: string;
}

export interface Amostra extends AmostraInput {
  id: string;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  criadoEm?: any;
}

// Compatibilidade com modelos prévios
export interface Rocha {
  id: string;
  nome: string;
  tipo: string;
  descricao?: string;
  descrição?: string;
  dureza: number;
}

export interface Minerais {
  id: string;
  nome: string;
  tipo: string;
  dureza: number;
  descricao: string;
  usuarioId?: string;
}

export type Mineral = Minerais;

// Parâmetros de Navegação entre Telas
export type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Inicio: undefined;
  Formulario: { id?: string; amostra?: Amostra; categoriaInicial?: Categoria } | undefined;
  Detalhes: { id: string };
  Perfil: undefined;
  Sobre: undefined;
};
