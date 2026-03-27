"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Activity, TrendingDown, Stethoscope } from "lucide-react";

// Tipagem baseada na nossa API
type IndicadorSaude = {
  id: string;
  municipio: string;
  ano: number;
  investimento_ab_per_capita: number;
  taxa_internacao_por_mil: number;
  cobertura_esf: number;
};

// Importação dinâmica para evitar o erro 'window is not defined' no SSR
const MapaEpiDinamico = dynamic(() => import("./components/MapaMaranhao"), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-gray-200 rounded-xl flex items-center justify-center">Carregando mapa cartográfico...</div>
});

export default function DashboardPage() {
  const [dados, setDados] = useState<IndicadorSaude[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscando os dados da nossa API simulada
    const fetchDados = async () => {
      try {
        const response = await fetch("/api/dados-econometricos");
        const json = await response.json();
        setDados(json.dados);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl font-semibold text-blue-600">
          Sincronizando dados epidemiológicos...
        </div>
      </div>
    );
  }

  // Filtrando apenas dados de São Luís para a demonstração do gráfico
  const dadosSaoLuis = dados.filter((d) => d.municipio === "São Luís");

  return (
    // ESTA É A DIV PAI PRINCIPAL
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SIISP - Visão Geral</h1>
        <p className="text-gray-500">Monitoramento de Inteligência em Saúde Pública</p>
      </header>

      {/* Cards de Resumo Rápido */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Municípios Monitorados</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <Stethoscope size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cobertura Média ESF (2025)</p>
              <p className="text-2xl font-bold text-gray-900">51%</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tendência de Internações</p>
              <p className="text-2xl font-bold text-gray-900">Em queda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Área do Gráfico */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Correlação: Investimento x Internações (São Luís)
        </h2>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosSaoLuis} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="ano" />
              <YAxis yAxisId="left" orientation="left" stroke="#005baa" />
              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="investimento_ab_per_capita"
                name="Investimento Per Capita (R$)"
                stroke="#005baa"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="taxa_internacao_por_mil"
                name="Internações (por mil hab.)"
                stroke="#ef4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Área do Mapa Cartográfico MOVIDA PARA DENTRO DA DIV PAI */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Distribuição Espacial de Internações Sensíveis à AP
        </h2>
        <MapaEpiDinamico />
      </div>

    </div> // FIM DA DIV PAI PRINCIPAL
  );
}