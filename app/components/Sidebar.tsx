"use client";

import { useState } from "react";
import Link from "next/link";
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
      className={`relative flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      {/* Botão de Expandir/Retrair */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-4 top-8 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition-colors z-50"
      >
        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Cabeçalho da Sidebar */}
      <div className="flex h-20 items-center justify-center border-b border-slate-800 px-4">
        {isExpanded ? (
          <h1 className="text-xl font-bold text-white tracking-wider">
            SIISP <span className="text-blue-500">MA</span>
          </h1>
        ) : (
          <h1 className="text-xl font-bold text-blue-500">MA</h1>
        )}
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 space-y-2 px-3 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-4 rounded-lg px-3 py-3 transition-colors ${
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-medium" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={22} className={isActive ? "text-blue-500" : "text-slate-400"} />
              {isExpanded && <span className="whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Zona de Perfil e Integração Gov.br */}
      <div className="border-t border-slate-800 p-4">
        <div className={`flex items-center gap-3 rounded-xl bg-slate-800/50 p-3 ${!isExpanded && "justify-center"}`}>
          <UserCircle size={36} className="text-slate-400" />
          {isExpanded && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">Jean Batista</p>
              <p className="truncate text-xs text-blue-400">Analista de Políticas Públicas</p>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
            <Settings size={16} />
            <span>Preferências</span>
          </button>
        )}
      </div>
    </div>
  );
}