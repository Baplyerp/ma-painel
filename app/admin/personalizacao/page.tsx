"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, UploadCloud, PaintBucket, LayoutTemplate, CheckCircle2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function PersonalizacaoAdminPage() {
  const [nomeSistema, setNomeSistema] = useState("");
  const [corPrimaria, setCorPrimaria] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Carregar configurações do Supabase ao iniciar
  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase.from('configuracoes_sistema').select('*').eq('id', 1).single();
      if (data) {
        setNomeSistema(data.nome_sistema);
        setCorPrimaria(data.cor_primaria);
      }
    };
    fetchConfig();
  }, []);

  // Salvar alterações no Supabase
  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('configuracoes_sistema')
      .update({ nome_sistema: nomeSistema, cor_primaria: corPrimaria })
      .eq('id', 1);

    setIsSaving(false);
    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Força recarregamento suave para aplicar as cores globalmente
      window.location.reload(); 
    }
  };

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
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ backgroundColor: corPrimaria || '#2563eb' }}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-md hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {isSaving ? "Salvando..." : saveSuccess ? "Salvo com Sucesso!" : "Salvar Configurações"}
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
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><LayoutTemplate size={20} /></div>
            <h2 className="text-lg font-semibold text-slate-800">Informações Básicas</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Oficial do Sistema</label>
              <input 
                type="text" 
                value={nomeSistema}
                onChange={(e) => setNomeSistema(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cor Primária (Padrão Global)</label>
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
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none uppercase"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Esta será a cor de base, mas os utilizadores podem alternar para as cores do manual através do perfil.</p>
            </div>
          </div>
        </div>

        {/* Bloco de Upload de Logotipos (Estrutura de UI mantida para futura integração com Storage) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><PaintBucket size={20} /></div>
            <h2 className="text-lg font-semibold text-slate-800">Identidade Governamental</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo Principal (Menu Expandido)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <UploadCloud size={28} className="text-slate-400 mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-600">Clique para atualizar a imagem</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Brasão Institucional (Menu Reduzido)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <UploadCloud size={28} className="text-slate-400 mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-600">Clique para atualizar a imagem</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}