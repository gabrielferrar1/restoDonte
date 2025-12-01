import { Platform } from 'react-native';

// Paleta de cores do RestôDonte
export const CORES = {
  // Cores principais
  primaria: '#E65100',        // Laranja escuro (principal)
  primariaClara: '#FF6F00',   // Laranja médio
  primariaEscura: '#BF360C',  // Laranja muito escuro

  // Cores de fundo
  fundoClaro: '#FFF3E0',      // Bege claro
  fundoBranco: '#FFFFFF',     // Branco
  fundoCard: '#FFFFFF',       // Branco para cards

  // Cores de texto
  textoEscuro: '#4E342E',     // Marrom escuro
  textoMedio: '#6D4C41',      // Marrom médio
  textoClaro: '#8D6E63',      // Marrom claro
  textoBranco: '#FFFFFF',     // Branco

  // Cores de borda
  bordaClara: '#FFCC80',      // Laranja claro
  bordaMedia: '#FFB74D',      // Laranja médio

  // Cores de status
  sucesso: '#4CAF50',         // Verde
  erro: '#F44336',            // Vermelho
  alerta: '#FF9800',          // Laranja
  info: '#2196F3',            // Azul

  // Cores de status de produção
  pendente: '#FF9800',        // Laranja
  emProducao: '#2196F3',      // Azul
  pronto: '#4CAF50',          // Verde
  entregue: '#9E9E9E',        // Cinza

  // Cores para tipos de item
  prato: '#E65100',           // Laranja (Cozinha)
  bebida: '#2196F3',          // Azul (Copa)

  // Sombras e sobreposições
  sombra: 'rgba(0, 0, 0, 0.1)',
  sobreposicao: 'rgba(0, 0, 0, 0.5)',
};

// Espaçamentos padronizados
export const ESPACAMENTOS = {
  minimo: 4,
  pequeno: 8,
  medio: 16,
  grande: 24,
  extraGrande: 32,
};

// Tamanhos de fonte
export const FONTES = {
  miniatura: 10,
  pequena: 12,
  media: 14,
  normal: 16,
  grande: 18,
  titulo: 20,
  tituloGrande: 24,
  destaque: 28,
  hero: 32,
};

// Raios de borda
export const BORDAS = {
  pequeno: 4,
  medio: 8,
  grande: 12,
  circular: 999,
};

// Sombras (compatível com Web e Native)
const sombraBase = Platform.select({
  web: { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' },
  default: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export const SOMBRAS = {
  pequena: {
    ...sombraBase,
    ...(Platform.OS !== 'web' && {
      shadowOpacity: 0.1,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    }),
  },
  media: {
    ...sombraBase,
    ...(Platform.OS !== 'web' && { elevation: 4 }),
  },
  grande: {
    ...sombraBase,
    ...(Platform.OS !== 'web' && {
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    }),
  },
};

// Status de produção com labels
export const STATUS_PRODUCAO = {
  PENDENTE: { label: 'Pendente', cor: CORES.pendente },
  EM_PRODUCAO: { label: 'Em Produção', cor: CORES.emProducao },
  PRONTO: { label: 'Pronto', cor: CORES.pronto },
  ENTREGUE: { label: 'Entregue', cor: CORES.entregue },
};

// Status de comanda
export const STATUS_COMANDA = {
  ABERTA: { label: 'Aberta', cor: CORES.sucesso },
  FECHADA: { label: 'Fechada', cor: CORES.alerta },
  PAGA: { label: 'Paga', cor: CORES.info },
};

// Tipos de item do cardápio
export const TIPOS_ITEM = {
  PRATO: { label: 'Prato', cor: CORES.prato, icone: 'restaurant' },
  BEBIDA: { label: 'Bebida', cor: CORES.bebida, icone: 'local-cafe' },
};
