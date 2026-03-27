"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion } from "framer-motion";
import { useMapStore } from "../store/useMapStore";

// Malha oficial dos municípios do Maranhão (Código IBGE 21)
const geoUrl = "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-21-mun.json";

// Matriz de Cores Bivariada (3x3) - Padrão Teukka
// Combina Intensidade de X (Custo) com Intensidade de Y (Eficiência)
const paletaBivariada: Record<string, string> = {
  "1-1": "#e8e8e8", "2-1": "#ace4e4", "3-1": "#5ac8c8", // Baixo Y
  "1-2": "#dfb0d6", "2-2": "#a5add3", "3-2": "#5698b9", // Médio Y
  "1-3": "#be64ac", "2-3": "#8b62aa", "3-3": "#3b4994"  // Alto Y (O 3-3 é Alto X e Alto Y)
};

export default function MapaOmnisciente() {
  const [tooltip, setTooltip] = useState<{ nome: string; x: number; y: number } | null>(null);
  const { varX, varY } = useMapStore();

  // Função simuladora para gerar os decis/quantis (1, 2 ou 3) de cada município
  // No mundo real, aqui leríamos os dados do Supabase cruzados com o ID do município
  const getQuantilMock = (munId: string, variavel: string | null) => {
    if (!variavel) return 0;
    // Simulação determinística baseada no nome para o teste visual
    const num = munId.charCodeAt(0) + munId.charCodeAt(munId.length - 1);
    return (num % 3) + 1; // Retorna 1 (Baixo), 2 (Médio) ou 3 (Alto)
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden">
      
      {/* Legenda Dinâmica Bivariada */}
      {varY && (
        <div className="absolute top-4 right-4 z-10 bg-white/90 p-3 rounded-lg shadow-sm border border-slate-200 text-[10px] font-medium text-slate-500 flex flex-col items-center">
          <span className="mb-1">{varY.replace('_', ' ').toUpperCase()} &rarr;</span>
          <div className="grid grid-cols-3 gap-0.5 transform -rotate-90 origin-center">
            {["1-3","2-3","3-3", "1-2","2-2","3-2", "1-1","2-1","3-1"].map(key => (
              <div key={key} className="w-4 h-4" style={{ backgroundColor: paletaBivariada[key] }} title={key} />
            ))}
          </div>
          <span className="mt-1">&larr; {varX?.replace('_', ' ').toUpperCase()}</span>
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 3800, center: [-45.2, -5.0] }} // Centralizado perfeitamente no MA
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // Calculamos o cruzamento de dados para o município atual
              const quantilX = getQuantilMock(geo.properties.name, varX);
              const quantilY = getQuantilMock(geo.properties.name, varY);
              
              // Define a cor. Se tiver X e Y, usa matriz. Se só X, usa azul simples.
              const chaveCor = `${quantilX}-${quantilY}`;
              const corPreenchimento = varY ? paletaBivariada[chaveCor] : `rgba(37, 99, 235, ${quantilX * 0.3})`;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setTooltip({ nome: geo.properties.name, x: quantilX, y: quantilY })}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: { fill: corPreenchimento, stroke: "#ffffff", strokeWidth: 0.5, outline: "none" },
                    hover: { fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 1, outline: "none", cursor: "pointer" },
                    pressed: { fill: "#d97706", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip Dinâmico */}
      {tooltip && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-slate-700 pointer-events-none"
        >
          <p className="font-bold text-white mb-1">{tooltip.nome}</p>
          <div className="text-xs text-slate-300 space-y-0.5">
            <p><span className="text-slate-400">Nível {varX?.split('_')[0]}:</span> {['Baixo', 'Médio', 'Alto'][tooltip.x - 1]}</p>
            {varY && <p><span className="text-slate-400">Nível {varY?.split('_')[0]}:</span> {['Baixo', 'Médio', 'Alto'][tooltip.y - 1]}</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}