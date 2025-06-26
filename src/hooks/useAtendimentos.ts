
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Atendimento {
  id: string;
  nome: string;
  telefone: string;
  data: string;
  status: string;
  ultima_interacao: string;
  mensagens_count: number;
  conversa_id?: string;
  created_at: string;
  updated_at: string;
}

export const useAtendimentos = () => {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAtendimentos = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('atendimentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
