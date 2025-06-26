
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Mensagem {
  id: string;
  texto: string;
  is_ai: boolean;
  timestamp: string;
  created_at: string;
  conversa_id: string;
}

export const useMensagens = (conversaId?: string) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMensagens = async () => {
    if (!conversaId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversaId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Formatar mensagens para compatibilidade com a interface
      const mensagensFormatadas = (data || []).map(mensagem => ({
        ...mensagem,
        timestamp: new Date(mensagem.timestamp || mensagem.created_at).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      setMensagens(mensagensFormatadas);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarMensagem = async (texto: string, isAI: boolean = false) => {
    if (!conversaId) return;

    try {
      const { data, error } = await supabase
        .from('mensagens')
        .insert([{
          conversa_id: conversaId,
          texto,
          is_ai: isAI,
          timestamp: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Adicionar à lista local
      const novaMensagem = {
        ...data,
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMensagens(prev => [...prev, novaMensagem]);

      // Atualizar timestamp da conversa
      await supabase
        .from('conversas')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversaId);

      return data;
    } catch (error) {
      console.error('Erro ao adicionar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchMensagens();
  }, [conversaId]);

  return {
    mensagens,
    loading,
    refetch: fetchMensagens,
    adicionarMensagem
  };
};
