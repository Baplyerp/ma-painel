"use client";

import { motion, Variants } from "framer-motion";
import { 
  CircleDollarSign, 
  TrendingUp, 
  Scale, 
  Receipt,
  Filter,
  Download
} from "lucide-react";

// Reaproveitamos as animações fluidas para manter a consistência do sistema
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

export default function EconomiaSaudePage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Cabeçalho da Página */}
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

      {/* Grade Principal (Bento Grid) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Bloco 1: KPIs Financeiros (4 colunas cada) */}
        <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 text-emerald-600 p-4">
              <CircleDollarSign size={28} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Orçamento Executado</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">R$ 1.2B</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 text-blue-600 p-4">
              <Receipt size={28} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Custo Médio / Internação</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">R$ 4.350</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-50 text-indigo-600 p-4">
              <Scale size={28} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Índice de Eficiência</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">0.84</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-violet-50 text-violet-600 p-4">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">ROI Atenção Básica</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">3.2x</p>
            </div>
          </div>
        </motion.div>

        {/* Bloco 2: Placeholder para o Modelo de Causalidade (Ocupa a largura total ou 8 colunas) */}
        <motion.div variants={itemVariants} className="md:col-span-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Avaliação de Impacto: Modelo Diferenças-em-Diferenças (DiD)</h2>
            <p className="text-sm text-slate-500">Impacto do novo programa de financiamento nas taxas de internamento regional</p>
          </div>
          <div className="flex-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
             <p className="text-slate-400 font-medium">Espaço reservado para o Gráfico de Linhas (Recharts)</p>
          </div>
        </motion.div>

        {/* Bloco 3: Placeholder para Custo-Efetividade (4 colunas) */}
        <motion.div variants={itemVariants} className="md:col-span-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Fronteira de Eficiência</h2>
            <p className="text-sm text-slate-500">Custo per capita vs. Desfecho Clínico</p>
          </div>
          <div className="flex-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-center p-4">
             <p className="text-slate-400 font-medium">Espaço reservado para o Gráfico de Dispersão (Scatter Plot)</p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}