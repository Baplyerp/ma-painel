"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion } from "framer-motion";

// URL com as coordenadas de todos os Estados do Brasil (GeoJSON)
const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

interface MapaBrasilProps {
  onEstadoClick: (estado: string) => void;
}

export default function MapaBrasil({ onEstadoClick }: MapaBrasilProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-slate-50 rounded-xl">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 600, center: [-54, -15] }} // Centraliza o Brasil
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isMaranhao = geo.properties.sigla === "MA" || geo.properties.name === "Maranhão";
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredState(geo.properties.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => {
                    if (isMaranhao) onEstadoClick("MA");
                  }}
                  style={{
                    default: {
                      fill: isMaranhao ? "#3b82f6" : "#e2e8f0", // Maranhão em destaque azul
                      stroke: "#cbd5e1",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: isMaranhao ? "#2563eb" : "#94a3b8", // Cor ao passar o rato
                      stroke: "#cbd5e1",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: isMaranhao ? "pointer" : "default",
                    },
                    pressed: {
                      fill: "#1d4ed8",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip Dinâmico */}
      {hoveredState && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-100 text-sm font-semibold text-slate-700 pointer-events-none"
        >
          {hoveredState}
          {hoveredState === "Maranhão" && (
            <span className="block text-xs font-normal text-blue-600 mt-1">
              Clique para expandir indicadores estaduais
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}