"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  BedDouble, 
  Stethoscope, 
  TrendingUp, 
  Database, 
  ChevronLeft, 
  ChevronRight,
  UserCircle,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

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
      className={`relative flex flex-col bg-[#0b1120] text-slate-300 transition-all duration-500 ease-in-out border-r border-slate-800/50 shadow-2xl ${
        isExpanded ? "w-[280px]" : "w-20"
      }`}
    >
      {/* Botão Flutuante Elegante com efeito Glow */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-4 top-12 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:scale-110 transition-all duration-300 z-50"
      >
        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Cabeçalho / Logo (Área ampliada para a logo horizontal) */}
      <div className={`flex items-center justify-center border-b border-slate-800/50 transition-all duration-500 ${isExpanded ? 'h-32 p-6' : 'h-24 p-4'}`}>
        {isExpanded ? (
          <div className="relative w-full h-full flex items-center justify-center group">
             {/* Efeito de brilho subtil por trás da logo ao passar o rato */}
             <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <Image 
               src="/logo-gov-horizontal.png" 
               alt="Governo do Maranhão" 
               fill
               className="object-contain drop-shadow-md transform transition-transform duration-500 group-hover:scale-105"
               priority
             />
          </div>
        ) : (
          <div className="relative w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform duration-300">
             <Image 
               src="/logo-gov-vertical.png" 
               alt="Brasão Maranhão" 
               fill
               className="object-contain drop-shadow-md"
               priority
             />
          </div>
        )}
      </div>

      {/* Navegação Principal com Efeitos Avançados */}
      <nav className="flex-1 space-y-2 px-4 py-8 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`group flex items-center gap-4 rounded-xl px-3 py-3.5 transition-all duration-300 relative overflow-hidden ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600/20 to-transparent text-white font-medium" 
                  : "hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              {/* Linha indicadora luminosa para o item ativo */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              )}
              
              {/* Ícone com micro-interação */}
              <div className={`relative transition-transform duration-300 ${!isActive && 'group-hover:scale-110 group-hover:rotate-3'}`}>
                <item.icon size={22} className={isActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-300"} />
              </div>

              {/* Texto com deslizamento lateral suave */}
              {isExpanded && (
                <span className={`whitespace-nowrap transition-transform duration-300 ${!isActive && 'group-hover:translate-x-1'}`}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Zona de Perfil e Configurações Refinada */}
      <div className="border-t border-slate-800/50 p-4 bg-slate-900/30">
        <div className={`flex items-center gap-3 rounded-xl bg-slate-800/40 p-3 border border-slate-700/30 transition-all duration-300 hover:bg-slate-800/60 hover:border-slate-600/50 ${!isExpanded && "justify-center"}`}>
          <UserCircle size={36} className="text-slate-400" />
          {isExpanded && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">Administrador</p>
              <p className="truncate text-xs text-blue-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                Acesso Gov.br
              </p>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <Link href="/admin/personalizacao" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-800/80 py-2.5 text-sm text-slate-300 hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-blue-500/25 group">
            <Settings size={16} className="transition-transform duration-500 group-hover:rotate-90" />
            <span className="font-medium">Configurações do Sistema</span>
          </Link>
        )}
      </div>
    </div>
  );
}