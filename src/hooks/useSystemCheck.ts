
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SystemStatus {
  database: boolean;
  conversas: boolean;
  mensagens: boolean;
  atendimentos: boolean;
  atividades: boolean;
  users: boolean;
}

export const useSystemCheck = () => {
  const [status, setStatus] = useState<SystemStatus>({
    database: false,
    conversas: false,
    mensagens: false,
    atendimentos: false,
    atividades: false,
    users: false
  });
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { toast } = useToast();

  const checkSystem = async () => {
    setLoading(true);
    const newStatus: SystemStatus = {
      database: false,
      conversas: false,
      mensagens: false,
      atendimentos: false,
      atividades: false,
      users: false
    };

    try {
      // Testar conexão básica com o banco
      const { error: dbError } = await supabase.from('conversas').select('count').limit(1);
      newStatus.database = !dbError;

      // Testar cada tabela
      const { error: conversasError } = await supabase.from('conversas').select('*').limit(1);
      newStatus.conversas = !conversasError;

      const { error: mensagensError } = await supabase.from('mensagens').select('*').limit(1);
      newStatus.mensagens = !mensagensError;

      const { error: atendimentosError } = await supabase.from('atendimentos').select('*').limit(1);
      newStatus.atendimentos = !atendimentosError;

      const { error: atividadesError } = await supabase.from('atividades_recentes').select('*').limit(1);
      newStatus.atividades = !atividadesError;

      const { error: usersError } = await supabase.from('users').select('*').limit(1);
      newStatus.users = !usersError;

      setStatus(newStatus);
      setLastCheck(new Date());

      const allWorking = Object.values(newStatus).every(Boolean);
      
      if (allWorking) {
        toast({
          title: "Sistema Funcionando",
          description: "Todas as conexões com o banco de dados estão funcionando corretamente.",
        });
      } else {
        const failures = Object.entries(newStatus)
          .filter(([_, working]) => !working)
          .map(([table]) => table);
        
        toast({
          title: "Problemas Detectados",
          description: `Problemas encontrados em: ${failures.join(', ')}`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Erro na verificação do sistema:', error);
      toast({
        title: "Erro na Verificação",
        description: "Não foi possível verificar o status do sistema.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    loading,
    lastCheck,
    checkSystem
  };
};
