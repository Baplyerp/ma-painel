import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    // Fazendo a consulta real ao banco de dados do Supabase
    const { data, error } = await supabase
      .from('indicadores_saude')
      .select('*')
      .order('ano', { ascending: true });

    // Tratamento de erro caso o banco esteja fora do ar ou a tabela não exista
    if (error) {
      console.error("Erro na consulta ao Supabase:", error.message);
      return NextResponse.json(
        { status: 'error', mensagem: 'Falha ao buscar indicadores de saúde.' },
        { status: 500 }
      );
    }

    // Retornando os dados no mesmo formato que o nosso front-end (Recharts) já espera
    return NextResponse.json({
      status: 'success',
      mensagem: 'Dados econométricos recuperados do Supabase com sucesso.',
      dados: data,
    });
    
  } catch (err) {
    console.error("Erro interno na API:", err);
    return NextResponse.json(
      { status: 'error', mensagem: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}