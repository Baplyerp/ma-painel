import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIISP - Estado do Maranhão",
  description: "Sistema Integrado de Inteligência em Saúde Pública",
  manifest: "/manifest.json",
  themeColor: "#0f172a", // Cor alinhada com a sidebar escura
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-gray-50`}>
        {/* Sidebar Fixa na Esquerda */}
        <Sidebar />
        
        {/* Área Principal de Conteúdo (onde as páginas renderizam) */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}