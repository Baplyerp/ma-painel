"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, UploadCloud, PaintBucket, LayoutTemplate } from "lucide-react";

export default function PersonalizacaoAdminPage() {
  const [nomeSistema, setNomeSistema] = useState("SIISP - Maranhão");
  const [corPrimaria, setCorPrimaria] = useState("#2563eb"); // Azul Padrão

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Personalização White-Label</h1>
          <p className="text-slate-500 mt-1">Gestão de Identidade Visual e Nomenclatura do Sistema</p>
        </div>
        
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all">
          <Save size={18} /> Salvar Configurações
        </button>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Bloco de Nomenclatura e Cores */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><LayoutTemplate size={20} /></div>
            <h2 className="text-lg font-semibold text-slate-800">Informações Básicas</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Oficial do Sistema</label>
              <input 
                type="text" 
                value={nomeSistema}
                onChange={(e) => setNomeSistema(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cor Primária (HEX)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={corPrimaria}
                  onChange={(e) => setCorPrimaria(e.target.value)}
                  className="h-10 w-10 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text" 
                  value={corPrimaria}
                  onChange={(e) => setCorPrimaria(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bloco de Upload de Logotipos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><PaintBucket size={20} /></div>
            <h2 className="text-lg font-semibold text-slate-800">Identidade Governamental</h2>
          </div>

          <div className="space-y-6">
            {/* Logo Horizontal */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo Principal (Menu Expandido)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer group">
                <UploadCloud size={28} className="text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-600">Clique para fazer upload (PNG ou SVG)</p>
                <p className="text-xs text-slate-400 mt-1">Recomendado: 400x120px transparente</p>
              </div>
            </div>

            {/* Brasão / Logo Vertical */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Brasão Institucional (Menu Reduzido)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer group">
                <UploadCloud size={28} className="text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-600">Clique para fazer upload (PNG ou SVG)</p>
                <p className="text-xs text-slate-400 mt-1">Recomendado: Formato Quadrado (1:1)</p>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}