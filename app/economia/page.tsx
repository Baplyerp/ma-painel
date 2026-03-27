"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { 
  CircleDollarSign, 
  TrendingUp, 
  Scale, 
  Receipt,
  Filter,
  Download
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { supabase } from "../../lib/supabase";

// Tipagens
type DiDData = {
  ano: number;
  tratamento: number;
  controle: number;
};

type EficienciaData = {
  municipio: string;
  custo_per_capita: number;
  indice_eficiencia: number;
  populacao: number;
};

// Custom Tooltip para o Gráfico de Dispersão
const ScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-sm">
        <p className="font-bold text-slate-800 mb-1">{data.municipio}</p>
        <p className="text-slate-600">Custo: <span className="font-medium text-emerald-600">R$ {data.custo_per_capita}</span></p>
        <p className="text-slate-600">Eficiência: <span className="font-medium text-indigo-600">{data.indice_eficiencia}</span></p>
        <p className="text-slate-500 text-xs mt-1">Pop: {data.populacao.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// Animações
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function EconomiaSaudePage() {
  const [dadosDiD, setDadosDiD] = useState<DiDData[]>([]);
  const [dadosEficiencia, setDadosEficiencia] = useState<EficienciaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEconomiaDados = async () => {
      setLoading(true);
      try {
        // Busca paralela para otimizar o tempo de carregamento
        const [resDiD, resEficiencia] = await Promise.all([
          supabase.from('economia_did').select('*').order('ano', { ascending: true }),
          supabase.from('economia_eficiencia').select('*').order('indice_eficiencia', { ascending: false })
        ]);

        if (resDiD.data) setDadosDiD(resDiD.data);
        if (resEficiencia.data) setDadosEficiencia(resEficiencia.data);

      } catch (error) {
        console.error("Erro ao buscar dados de economia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEconomiaDados();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 overflow-x-hidden relative">
      
      {/* Indicador de Carregamento */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-50/60 backdrop-blur-sm">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      )}

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Economia da Saúde</h1>
          <p className="text-slate-500 mt-1">Análise de Financiamento e Eficiência Alocativa</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
            <Filter size={16} /> Blocos de Financiamento
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-emerald-700 transition-all">
            <Download size={16} /> Relatório de Gestão Fiscal
          </button>
        </div>
      </motion.header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* KPIs Financeiros */}
        <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 text-emerald-600 p-4"><CircleDollarSign size={28} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">Orçamento Executado</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">R$ 1.2B</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 text-blue-600 p-4"><Receipt size={28} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">Custo Médio / Internação</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">R$ 4.350</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-50 text-indigo-600 p-4"><Scale size={28} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">Eficiência Média (Amostra)</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {dadosEficiencia.length > 0 ? (dadosEficiencia.reduce((acc, curr) => acc + curr.indice_eficiencia, 0) / dadosEficiencia.length).toFixed(2) : 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-violet-50 text-violet-600 p-4"><TrendingUp size={28} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">ROI Atenção Básica</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">3.2x</p>
            </div>
          </div>
        </motion.div>

        {/* Modelo DiD */}
        <motion.div variants={itemVariants} className="md:col-span-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 flex flex-col min-h-[420px]">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Causalidade: Modelo Diferenças-em-Diferenças (DiD)</h2>
              <p className="text-sm text-slate-500">Impacto do "Novo Financiamento APS" nas Internações Sensíveis</p>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosDiD} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="ano" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                
                <ReferenceLine x={2024} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Intervenção', fill: '#ef4444', fontSize: 12 }} />
                
                <Line type="monotone" dataKey="controle" name="Grupo Controlo (Sem Política)" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="tratamento" name="Grupo Tratamento (Com Política)" stroke="#10b981" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gráfico de Dispersão Custo-Efetividade */}
        <motion.div variants={itemVariants} className="md:col-span-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 flex flex-col min-h-[420px]">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Fronteira de Eficiência</h2>
            <p className="text-sm text-slate-500">Custo per capita vs. Desfecho</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="custo_per_capita" name="Custo (R$)" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <YAxis type="number" dataKey="indice_eficiencia" name="Eficiência" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} domain={[0.5, 1]} />
                <ZAxis type="number" dataKey="populacao" range={[100, 600]} name="População" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ScatterTooltip />} />
                <Scatter name="Regiões" data={dadosEficiencia} fill="#6366f1" fillOpacity={0.7} />
                
                <ReferenceLine x={500} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Custo Médio', fill: '#94a3b8', fontSize: 10 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}