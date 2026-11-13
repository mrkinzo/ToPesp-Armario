import { Platform } from 'react-native';

export const CORES = {
  // Conforme interface.md: fundo preto e fonte branca para Header e Footer
  headerFundo: '#000000',
  headerTexto: '#ffffff',
  footerFundo: '#000000',
  footerTexto: '#ffffff',

  // Conforme interface.md: fundo branco e corpo/conteúdo em preto
  fundo: '#ffffff',
  fundoCard: '#fafafa',
  fundoDestaque: '#f0f0f0',

  texto: '#000000',
  textoSecundario: '#444444',
  textoClaro: '#ffffff',
  textoMutado: '#777777',

  borda: '#000000',
  bordaSuave: '#cccccc',

  // Estados
  perigo: '#8b0000', // Vermelho sóbrio / escuro
  perigoFundo: '#ffebee',
  sucesso: '#1b5e20',
  sucessoFundo: '#e8f5e9',
};

// Conforme interface.md: fonte Times New Roman para o corpo e conteúdo
export const FONTE_SERIF = Platform.select({
  ios: 'Times New Roman',
  android: 'serif',
  default: 'Times New Roman, serif',
});

export const CATEGORIAS = [
  { label: 'Rocha', value: 'rocha' as const },
  { label: 'Mineral', value: 'mineral' as const },
];

export const TIPOS_ROCHA = [
  'Ígnea / Magmática',
  'Sedimentar',
  'Metamórfica',
  'Outro',
] as const;

export const TIPOS_MINERAL = [
  'Silicato',
  'Óxido',
  'Sulfeto',
  'Carbonato',
  'Haleto',
  'Sulfato',
  'Fosfato',
  'Elemento Nativo',
  'Outro',
] as const;

export const ESCALA_MOHS = [
  { valor: 1, mineral: 'Talco' },
  { valor: 2, mineral: 'Gipsita' },
  { valor: 3, mineral: 'Calcita' },
  { valor: 4, mineral: 'Fluorita' },
  { valor: 5, mineral: 'Apatita' },
  { valor: 6, mineral: 'Ortoclásio' },
  { valor: 7, mineral: 'Quartzo' },
  { valor: 8, mineral: 'Topázio' },
  { valor: 9, mineral: 'Coríndon' },
  { valor: 10, mineral: 'Diamante' },
] as const;

export const COLECOES = {
  AMOSTRAS: 'amostras',
  USUARIOS: 'usuarios',
};
