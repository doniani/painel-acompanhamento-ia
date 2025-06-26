
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Atendimento {
  id: string;
  nome: string;
  telefone: string;
  data: string;
  status: string;
  ultima_interacao: string | null;
  mensagens_count: number | null;
  conversa_id?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useAtendimentos = () => {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAtendimentos = async () => {
    try {
      setLoading(true);
      console.log('Fetching atendimentos...');
      
      const { data, error } = await supabase
        .from('atendimentos')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Atendimentos response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched atendimentos:', data?.length || 0);
      setAtendimentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar atendimentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os atendimentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAtendimento = async (id: string, updates: Partial<Atendimento>) => {
    try {
      const { error } = await supabase
        .from('atendimentos')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Atualizar lista local
      setAtendimentos(prev => prev.map(atendimento => 
        atendimento.id === id 
          ? { ...atendimento, ...updates }
          : atendimento
      ));

      toast({
        title: "Sucesso",
        description: "Atendimento atualizado com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar atendimento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o atendimento.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAtendimentos();
  }, []);

  return {
    atendimentos,
    loading,
    refetch: fetchAtendimentos,
    updateAtendimento
  };
};
