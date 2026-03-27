"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ShieldAlert, BedDouble, Stethoscope, 
  TrendingUp, Database, ChevronLeft, ChevronRight,
  Settings, Palette
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [corPrimaria, setCorPrimaria] = useState("#005baa");
  const [mostrarTemas, setMostrarTemas] = useState(false);
  const pathname = usePathname();

  // Cores oficiais do Manual de Marca Gov MA
  const coresOficiais = [
    { nome: 'Azul', hex: '#005baa' },
    { nome: 'Vermelho', hex: '#e0202e' },
    { nome: 'Verde', hex: '#009b3a' },
    { nome: 'Amarelo', hex: '#f9e053' },
  ];

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('configuracoes_sistema').select('cor_primaria').eq('id', 1).single();
      if (data) setCorPrimaria(data.cor_primaria);
    };
    fetchConfig();
  }, []);

  const menuItems = [
    { name: "Visão Central", icon: LayoutDashboard, path: "/" },
    { name: "Vigilância Epidemiológica", icon: ShieldAlert, path: "/vigilancia" },
    { name: "Regulação e Leitos", icon: BedDouble, path: "/regulacao" },
    { name: "Atenção Primária", icon: Stethoscope, path: "/atencao-primaria" },
    { name: "Economia da Saúde", icon: TrendingUp, path: "/economia" },
    { name: "Integração DATASUS", icon: Database, path: "/integracoes" },
  ];

  return (
    <div 
      className={`relative flex flex-col bg-white text-slate-700 transition-all duration-500 ease-in-out border-r border-slate-200 shadow-lg ${
        isExpanded ? "w-[280px]" : "w-20"
      }`}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ backgroundColor: corPrimaria }}
        className="absolute -right-4 top-12 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md hover:scale-110 transition-all duration-300 z-50"
      >
        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Cabeçalho / Logo (Área ampliada consideravelmente) */}
      <div className={`flex items-center justify-center border-b border-slate-100 transition-all duration-500 ${isExpanded ? 'h-32 p-4' : 'h-24 p-2'}`}>
        {isExpanded ? (
          <div className="relative w-56 h-20 flex items-center justify-center group">
             <Image 
               src="/logo-gov-horizontal.png" 
               alt="Governo do Maranhão" 
               fill
               className="object-contain transition-transform duration-500 group-hover:scale-105"
               priority
             />
          </div>
        ) : (
          <div className="relative w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform duration-300">
             <Image 
               src="/logo-gov-vertical.png" 
               alt="Brasão Maranhão" 
               fill
               className="object-contain"
               priority
             />
          </div>
        )}
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 space-y-2 px-4 py-8 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`group flex items-center gap-4 rounded-xl px-3 py-3.5 transition-all duration-300 relative overflow-hidden ${
                isActive ? "font-medium shadow-sm" : "hover:bg-slate-50"
              }`}
              style={{
                backgroundColor: isActive ? `${corPrimaria}15` : 'transparent',
                color: isActive ? corPrimaria : '#475569'
              }}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-md" style={{ backgroundColor: corPrimaria }}></div>
              )}
              <div className={`relative transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`}>
                <item.icon size={22} color={isActive ? corPrimaria : '#94a3b8'} />
              </div>
              {isExpanded && (
                <span className={`whitespace-nowrap transition-transform duration-300 ${!isActive && 'group-hover:translate-x-1'}`}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Zona de Perfil e Alternância de Cores */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        
        {/* Seletor de Temas (Expansível) */}
        {isExpanded && mostrarTemas && (
          <div className="mb-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between">
            {coresOficiais.map((cor) => (
              <button
                key={cor.nome}
                onClick={() => setCorPrimaria(cor.hex)}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: cor.hex }}
                title={cor.nome}
              />
            ))}
          </div>
        )}

        <div className={`flex items-center gap-3 rounded-xl bg-white p-3 border border-slate-200 shadow-sm ${!isExpanded && "justify-center"}`}>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: corPrimaria }}
            onClick={() => setMostrarTemas(!mostrarTemas)}
            title="Mudar Tema"
          >
            JB
          </div>
          {isExpanded && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-slate-800">Jean Batista</p>
              <p className="truncate text-xs text-slate-500 font-medium">Analista de Políticas Públicas</p>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <Link href="/admin/personalizacao" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-200 py-2.5 text-sm text-slate-600 hover:bg-slate-200 transition-all duration-300 shadow-sm group">
            <Settings size={16} className="transition-transform duration-500 group-hover:rotate-90" />
            <span className="font-medium">Painel Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
}