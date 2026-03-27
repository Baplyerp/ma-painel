"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, TrendingDown, Stethoscope, Filter, Download } from "lucide-react";
import { supabase } from "../lib/supabase";

type IndicadorSaude = {
  id: string;
  municipio: string;
  ano: number;
  investimento_ab_per_capita: number;
  taxa_internacao_por_mil: number;
  cobertura_esf: number;
};

// Importação dinâmica do mapa cartográfico
const MapaEpiDinamico = dynamic(() => import("./components/MapaMaranhao"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
      <div className="text-slate-400 font-medium tracking-wide">A renderizar malha cartográfica...</div>
    </div>
  ),
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function DashboardPage() {
  const [dados, setDados] = useState<IndicadorSaude[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para os nossos Filtros Avançados
  const [filtroAno, setFiltroAno] = useState<string>("Todos");
  const [filtroMunicipio, setFiltroMunicipio] = useState<string>("Todos");

  useEffect(() => {
    const fetchDadosFiltrados = async () => {
      setLoading(true);
      try {
        // Começamos a construir a consulta (query) base
        let query = supabase
          .from('indicadores_saude')
          .select('*')
          .order('ano', { ascending: true });

        // Aplicamos os filtros dinamicamente se não estiverem em "Todos"
        if (filtroAno !== "Todos") {
          query = query.eq('ano', parseInt(filtroAno));
        }
        if (filtroMunicipio !== "Todos") {
          query = query.eq('municipio', filtroMunicipio);
        }

        const { data, error } = await query;

        if (!error && data) setDados(data);
      } catch (error) {
        console.error("Erro na consulta filtrada:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // O useEffect será disparado novamente sempre que um destes filtros mudar
    fetchDadosFiltrados();
  }, [filtroAno, filtroMunicipio]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Cabeçalho e Controlos de Filtro */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-slate-500 mt-1">Sala de Situação da Saúde Estadual</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 pl-2 border-r border-slate-100 pr-3">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Filtros:</span>
          </div>
          
          <select 
            value={filtroAno}
            onChange={(e) => setFiltroAno(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer hover:text-blue-600 transition-colors"
          >
            <option value="Todos">Todos os Anos</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>

          <select 
            value={filtroMunicipio}
            onChange={(e) => setFiltroMunicipio(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer hover:text-blue-600 transition-colors"
          >
            <option value="Todos">Todo o Estado</option>
            <option value="São Luís">São Luís</option>
            <option value="Imperatriz">Imperatriz</option>
            <option value="Caxias">Caxias</option>
          </select>

          <button className="ml-2 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all">
            <Download size={16} /> Exportar
          </button>
        </div>
      </motion.header>

      {/* Indicador de Carregamento com overlay suave */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      )}

      {/* Grade Principal (Bento Grid) - Mantida idêntica para preservar a animação */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-6 relative"
      >
        {/* Bloco 1: KPIs Rápidos */}
        <motion.div variants={itemVariants} className="md:col-span-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 text-blue-600 p-4">
              <Activity size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Registos Encontrados</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{dados.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 text-emerald-600 p-4">
              <Stethoscope size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Cobertura ESF Média</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {dados.length > 0 ? (dados.reduce((acc, curr) => acc + curr.cobertura_esf, 0) / dados.length).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 text-amber-600 p-4">
              <TrendingDown size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Média de Internações</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {dados.length > 0 ? (dados.reduce((acc, curr) => acc + curr.taxa_internacao_por_mil, 0) / dados.length).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bloco 2: Gráfico Principal de Área */}
        <motion.div variants={itemVariants} className="md:col-span-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Investimento vs. Internações Sensíveis</h2>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">Atualizado em tempo real</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dados} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInvestimento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="municipio" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area 
                  type="monotone" 
                  dataKey="investimento_ab_per_capita" 
                  name="Investimento (R$)"
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorInvestimento)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bloco 3: Mapa Cartográfico */}
        <motion.div variants={itemVariants} className="md:col-span-4 rounded-2xl bg-white p-1 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
          <div className="p-5 pb-2">
            <h2 className="text-lg font-semibold text-slate-800">Distribuição Espacial</h2>
            <p className="text-xs text-slate-500">Impacto cartográfico dinâmico</p>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden m-2 z-0 relative">
            <MapaEpiDinamico />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}