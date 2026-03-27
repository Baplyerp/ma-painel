import { NextResponse } from 'next/server';

// Definindo a tipagem dos nossos dados econométricos
type IndicadorSaude = {
  id: string;
  municipio: string;
  ano: number;
  investimento_ab_per_capita: number; // Em Reais (R$)
  taxa_internacao_por_mil: number;    // Internações por Condições Sensíveis à Atenção Primária
  cobertura_esf: number;              // % de cobertura da Estratégia Saúde da Família
};

export async function GET() {
  // Simulação de "Dados em Painel" para municípios chave do Maranhão (2023 a 2025)
  const dadosSimulados: IndicadorSaude[] = [
    // São Luís
    { id: 'slz-23', municipio: 'São Luís', ano: 2023, investimento_ab_per_capita: 350, taxa_internacao_por_mil: 15.2, cobertura_esf: 45 },
    { id: 'slz-24', municipio: 'São Luís', ano: 2024, investimento_ab_per_capita: 390, taxa_internacao_por_mil: 14.1, cobertura_esf: 52 },
    { id: 'slz-25', municipio: 'São Luís', ano: 2025, investimento_ab_per_capita: 420, taxa_internacao_por_mil: 12.8, cobertura_esf: 60 },
    
    // Imperatriz
    { id: 'imp-23', municipio: 'Imperatriz', ano: 2023, investimento_ab_per_capita: 280, taxa_internacao_por_mil: 18.5, cobertura_esf: 38 },
    { id: 'imp-24', municipio: 'Imperatriz', ano: 2024, investimento_ab_per_capita: 310, taxa_internacao_por_mil: 17.0, cobertura_esf: 44 },
    { id: 'imp-25', municipio: 'Imperatriz', ano: 2025, investimento_ab_per_capita: 360, taxa_internacao_por_mil: 15.1, cobertura_esf: 51 },

    // Caxias
    { id: 'cax-23', municipio: 'Caxias', ano: 2023, investimento_ab_per_capita: 210, taxa_internacao_por_mil: 22.1, cobertura_esf: 30 },
    { id: 'cax-24', municipio: 'Caxias', ano: 2024, investimento_ab_per_capita: 250, taxa_internacao_por_mil: 20.3, cobertura_esf: 35 },
    { id: 'cax-25', municipio: 'Caxias', ano: 2025, investimento_ab_per_capita: 290, taxa_internacao_por_mil: 18.4, cobertura_esf: 42 },
  ];

  // Simulando um pequeno delay de rede para testarmos os "Loading States" do Next.js depois
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    status: 'success',
    mensagem: 'Dados econométricos recuperados com sucesso.',
    dados: dadosSimulados,
  });
}