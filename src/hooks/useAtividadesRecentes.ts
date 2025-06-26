
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface AtividadeRecente {
  id: string;
  tipo: string;
  titulo: string;
  descricao?: string;
  status?: string;
  avatar?: string;
  created_at: string;
  time?: string;
}

export const useAtividadesRecentes = () => {
  const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAtividades = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('atividades_recentes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Formatar atividades para compatibilidade com a interface
      const atividadesFormatadas = (data || []).map(atividade => ({
        ...atividade,
        time: new Date(atividade.created_at).toLocaleString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit'
        })
      }));

      setAtividades(atividadesFormatadas);
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as atividades recentes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarAtividade = async (novaAtividade: Omit<AtividadeRecente, 'id' | 'created_at' | 'time'>) => {
    try {
      const { data, error } = await supabase
        .from('atividades_recentes')
        .insert([novaAtividade])
        .select()
        .single();

      if (error) throw error;

      // Adicionar à lista local
      const atividadeFormatada = {
        ...data,
        time: new Date().toLocaleString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit'
        })
      };

      setAtividades(prev => [atividadeFormatada, ...prev].slice(0, 10));

      return data;
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a atividade.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchAtividades();
  }, []);

  return {
    atividades,
    loading,
    refetch: fetchAtividades,
    adicionarAtividade
  };
};
