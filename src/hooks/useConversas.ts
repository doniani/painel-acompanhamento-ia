
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Conversa {
  id: string;
  cliente_nome: string;
  cliente_telefone: string;
  status: 'aprovada' | 'reprovada' | 'pendente' | null;
  created_at: string | null;
  updated_at: string | null;
  motivo_reprovacao?: string | null;
  ultimaMensagem?: string;
  naoLidas?: number;
  avatar?: string;
}

export const useConversas = () => {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConversas = async () => {
    try {
      setLoading(true);
      
      // Buscar conversas com a última mensagem
      const { data: conversasData, error: conversasError } = await supabase
        .from('conversas')
        .select('*')
        .order('updated_at', { ascending: false });

      if (conversasError) throw conversasError;

      // Para cada conversa, buscar a última mensagem e contar não lidas
      const conversasComMensagens = await Promise.all(
        (conversasData || []).map(async (conversa) => {
          // Buscar última mensagem
          const { data: ultimaMensagem } = await supabase
            .from('mensagens')
            .select('texto, is_ai')
            .eq('conversa_id', conversa.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Contar mensagens não lidas (assumindo que mensagens do cliente são não lidas)
          const { count: naoLidas } = await supabase
            .from('mensagens')
            .select('*', { count: 'exact', head: true })
            .eq('conversa_id', conversa.id)
            .eq('is_ai', false);

          const nomePartes = conversa.cliente_nome.split(' ');
          const avatar = nomePartes.length > 1 
            ? `${nomePartes[0][0]}${nomePartes[1][0]}`.toUpperCase()
            : conversa.cliente_nome.substring(0, 2).toUpperCase();

          return {
            ...conversa,
            status: conversa.status as 'aprovada' | 'reprovada' | 'pendente' | null,
            ultimaMensagem: ultimaMensagem?.texto || 'Sem mensagens',
            naoLidas: naoLidas || 0,
            avatar
          };
        })
      );

      setConversas(conversasComMensagens);
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConversaStatus = async (conversaId: string, status: 'aprovada' | 'reprovada', motivoReprovacao?: string) => {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'reprovada' && motivoReprovacao) {
        updateData.motivo_reprovacao = motivoReprovacao;
      }

      const { error } = await supabase
        .from('conversas')
        .update(updateData)
        .eq('id', conversaId);

      if (error) throw error;

      // Atualizar lista local
      setConversas(prev => prev.map(conversa => 
        conversa.id === conversaId 
          ? { ...conversa, status, motivo_reprovacao: motivoReprovacao }
          : conversa
      ));

      toast({
        title: "Sucesso",
        description: `Conversa ${status} com sucesso.`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar status da conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da conversa.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchConversas();
  }, []);

  return {
    conversas,
    loading,
    refetch: fetchConversas,
    updateConversaStatus
  };
};
