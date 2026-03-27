import { create } from 'zustand';

// Tipagem do que é um "Indicador" no nosso sistema
export type Indicador = {
  id: string;
  nome: string;
  modulo: string;
};

interface MapStore {
  indicadoresDisponiveis: Indicador[];
  registrarIndicador: (indicador: Indicador) => void;
  // Variáveis ativas no mapa (Eixo X e Eixo Y para Bivariado)
  varX: string | null;
  varY: string | null;
  setVarX: (id: string) => void;
  setVarY: (id: string | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  // Já deixamos alguns pré-registados para o teste imediato
  indicadoresDisponiveis: [
    { id: 'taxa_ocupacao', nome: 'Taxa de Ocupação', modulo: 'Regulação' },
    { id: 'custo_per_capita', nome: 'Custo per Capita', modulo: 'Economia' },
    { id: 'eficiencia', nome: 'Índice de Eficiência', modulo: 'Economia' },
    { id: 'casos_dengue', nome: 'Incidência de Dengue', modulo: 'Vigilância' },
  ],
  registrarIndicador: (novoInd) => set((state) => ({
    // Evita duplicatas se o indicador já estiver registado
    indicadoresDisponiveis: state.indicadoresDisponiveis.some(i => i.id === novoInd.id) 
      ? state.indicadoresDisponiveis 
      : [...state.indicadoresDisponiveis, novoInd]
  })),
  varX: 'custo_per_capita',
  varY: 'eficiencia', // Se houver varY, o mapa vira Bivariado automaticamente!
  setVarX: (id) => set({ varX: id }),
  setVarY: (id) => set({ varY: id }),
}));