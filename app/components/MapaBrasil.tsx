"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion } from "framer-motion";

const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

interface MapaBrasilProps {
  onEstadoClick: (estado: string) => void;
}

export default function MapaBrasil({ onEstadoClick }: MapaBrasilProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStateClick = (sigla: string, nome: string) => {
    if (sigla === "MA" || nome === "Maranhão") {
      setIsTransitioning(true);
      setTimeout(() => onEstadoClick("MA"), 800);
    }
  };

  return (
    <motion.div 
      className="relative h-full w-full flex items-center justify-center bg-slate-50/50 rounded-xl overflow-hidden perspective-[1000px]"
      animate={isTransitioning ? { 
        scale: 4, 
        rotateY: 180, 
        opacity: 0, 
        filter: "blur(4px)" 
      } : { 
        scale: 1, rotateY: 0, opacity: 1, filter: "blur(0px)" 
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 650, center: [-54, -15] }}
        style={{ width: "100%", height: "100%", outline: "none" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              <defs>
                {geographies.map((geo) => {
                  const sigla = geo.properties.sigla.toLowerCase();
                  return (
                    <pattern 
                      key={`flag-${sigla}`} 
                      id={`flag-${sigla}`} 
                      patternContentUnits="objectBoundingBox" // CRÍTICO: Faz a imagem esticar no formato do estado
                      width="1" height="1"
                    >
                      <image 
                        // Fonte alternativa mais estável (Static Maps ou repositório de alta disponibilidade)
                        href={`https://raw.githubusercontent.com/lucas-moraes/br-atlas/master/public/flags/${sigla}.png`}
                        x="0" y="0" 
                        width="1" height="1" 
                        preserveAspectRatio="none" // Força o preenchimento total da "forma" do estado
                      />
                    </pattern>
                  );
                })}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#3b82f6" floodOpacity="0.8"/>
                </filter>
              </defs>

              {geographies.map((geo) => {
                const isMaranhao = geo.properties.sigla === "MA" || geo.properties.name === "Maranhão";
                const sigla = geo.properties.sigla.toLowerCase();
                const isHovered = hoveredState === geo.properties.name;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredState(geo.properties.name)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(geo.properties.sigla, geo.properties.name)}
                    style={{
                      default: {
                        fill: isMaranhao ? "#93c5fd" : "#e2e8f0", 
                        stroke: isMaranhao ? "#2563eb" : "#cbd5e1",
                        strokeWidth: isMaranhao ? 1.5 : 0.75,
                        outline: "none",
                        filter: isMaranhao ? "url(#glow)" : "none",
                      },
                      hover: {
                        // Se a imagem falhar, ele mantém uma cor sólida por baixo
                        fill: `url(#flag-${sigla}) #3b82f6`, 
                        stroke: "#2563eb",
                        strokeWidth: 2,
                        outline: "none",
                        cursor: isMaranhao ? "pointer" : "default",
                      },
                      pressed: {
                        fill: `url(#flag-${sigla})`,
                        outline: "none",
                      },
                    }}
                  />
                );
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {hoveredState && !isTransitioning && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-slate-700 pointer-events-none z-50"
        >
          <p className="font-bold text-white mb-0.5">{hoveredState}</p>
          {hoveredState === "Maranhão" ? (
            <span className="block text-xs font-medium text-blue-400 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Clique para acessar indicadores
            </span>
          ) : (
            <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
              Área Restrita
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}