"use client";

import { useEffect, useState } from "react";
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
import { 
  Activity, 
  TrendingDown, 
  Stethoscope, 
  Filter, 
  Download,
  Globe, 
  Maximize2, 
  Minimize2 
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useMapStore } from "./store/useMapStore";
import MapaBrasil from "./components/MapaBrasil";
import MapaOmnisciente from "./components/MapaOmnisciente";

type IndicadorSaude = {
  id: string;
  municipio: string;
  ano: number;
  investimento_ab_per_capita: number;
  taxa_internacao_por_mil: number;
  cobertura_esf: number;
};

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
  
  // Estado Global do Zustand (Cérebro do Mapa Omnisciente)
  const { indicadoresDisponiveis, varX, varY, setVarX, setVarY } = useMapStore();
  
  const [filtroAno, setFiltroAno] = useState<string>("Todos");
  const [filtroMunicipio, setFiltroMunicipio] = useState<string>("Todos");

  // Estados para o Mapa Interativo
  const [visaoNacional, setVisaoNacional] = useState(true);
  const [mapaExpandido, setMapaExpandido] = useState(false);

  useEffect(() => {
    const fetchDadosFiltrados = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('indicadores_saude')
          .select('*')
          .order('ano', { ascending: true });

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
            <option value="2026">2026</option>
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

      {/* Grade Principal (Bento Grid) */}
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

        {/* Bloco 3: Mapa Cartográfico Interativo (Drill-Down e Fullscreen) */}
        <motion.div 
          variants={itemVariants} 
          className={`bg-white p-1 shadow-sm border border-slate-200 transition-all duration-500 flex flex-col ${
            mapaExpandido 
              ? "fixed inset-4 z-[100] rounded-2xl shadow-2xl" // Estilo Ecrã Inteiro
              : "md:col-span-4 rounded-2xl hover:shadow-md h-[420px]" // Estilo Grid Normal
          }`}
        >
          {/* Cabeçalho do Mapa */}
          <div className="p-4 pb-2 flex justify-between items-center z-10 bg-white rounded-t-xl">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {visaoNacional ? "Visão Nacional" : "Inteligência Geográfica - MA"}
              </h2>
              <p className="text-xs text-slate-500">
                {visaoNacional ? "Selecione o Estado para aprofundar" : "Distribuição de calor por município"}
              </p>
            </div>
            
            <div className="flex gap-2">
              {!visaoNacional && (
                <button 
                  onClick={() => setVisaoNacional(true)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Voltar ao Mapa do Brasil"
                >
                  <Globe size={18} />
                </button>
              )}
              <button 
                onClick={() => setMapaExpandido(!mapaExpandido)}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                title={mapaExpandido ? "Reduzir" : "Expandir Mapa"}
              >
                {mapaExpandido ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>

          {/* Filtros Dinâmicos Bivariados (Só aparecem quando a visão é estadual) */}
          {!visaoNacional && (
            <div className="px-4 py-2 border-b border-slate-100 flex gap-4 bg-slate-50/50">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Variável 1 (Cor Base)</label>
                <select 
                  value={varX || ''} 
                  onChange={(e) => setVarX(e.target.value)}
                  className="text-sm bg-white border border-slate-200 rounded-md px-2 py-1 outline-none text-blue-600 font-medium"
                >
                  {indicadoresDisponiveis.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.nome} ({ind.modulo})</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Variável 2 (Cruzamento)</label>
                <select 
                  value={varY || ''} 
                  onChange={(e) => setVarY(e.target.value || null)}
                  className="text-sm bg-white border border-slate-200 rounded-md px-2 py-1 outline-none text-emerald-600 font-medium"
                >
                  <option value="">Nenhuma (Choropleth Simples)</option>
                  {indicadoresDisponiveis.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.nome} ({ind.modulo})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Área Dinâmica de Renderização dos Mapas */}
          <div className="flex-1 rounded-b-xl overflow-hidden z-0 relative bg-slate-50">
            {visaoNacional ? (
              <MapaBrasil onEstadoClick={() => setVisaoNacional(false)} />
            ) : (
              <MapaOmnisciente />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}