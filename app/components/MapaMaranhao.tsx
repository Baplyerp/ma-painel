"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Tipagem alinhada com os dados que vêm do Supabase
type IndicadorSaude = {
  municipio: string;
  taxa_internacao_por_mil: number;
  lat: number;
  lng: number;
};

export default function MapaMaranhao() {
  const [dadosGeo, setDadosGeo] = useState<IndicadorSaude[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDadosGeograficos = async () => {
      try {
        const response = await fetch("/api/dados-econometricos");
        const json = await response.json();
        
        // Filtramos para garantir que o mapa só tenta renderizar municípios que possuam coordenadas válidas
        const dadosComCoordenadas = json.dados.filter(
          (d: any) => d.lat != null && d.lng != null
        );
        
        setDadosGeo(dadosComCoordenadas);
      } catch (error) {
        console.error("Erro ao buscar dados geográficos do Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDadosGeograficos();
  }, []);

  // Coordenadas centrais do Maranhão
  const posicaoCentral: [number, number] = [-4.9609, -45.2744];

  if (loading) {
    return (
      <div className="h-96 w-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <div className="animate-pulse text-gray-500 font-medium">
          A carregar dados espaciais da base de dados...
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 z-0 relative">
      <MapContainer 
        center={posicaoCentral} 
        zoom={6} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {dadosGeo.map((dado, index) => (
          <CircleMarker
            key={index}
            center={[dado.lat, dado.lng]}
            pathOptions={{ 
              color: dado.taxa_internacao_por_mil > 15 ? '#ef4444' : '#f59e0b',
              fillColor: dado.taxa_internacao_por_mil > 15 ? '#ef4444' : '#f59e0b',
              fillOpacity: 0.7 
            }}
            // O raio da bolha cresce dinamicamente com base nos dados reais
            radius={dado.taxa_internacao_por_mil * 1.5}
          >
            <Popup>
              <div className="font-semibold text-gray-800">{dado.municipio}</div>
              <div className="text-sm text-gray-600">
                Internações: <span className="font-bold">{dado.taxa_internacao_por_mil}</span> por mil/hab.
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}