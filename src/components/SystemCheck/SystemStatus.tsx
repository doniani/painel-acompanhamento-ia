
import React from 'react';
import { CheckCircle, XCircle, RefreshCw, Database, MessageSquare, Users, Activity, FileText, Clock } from 'lucide-react';
import { useSystemCheck } from '@/hooks/useSystemCheck';
import { Button } from '@/components/ui/button';

const SystemStatus: React.FC = () => {
  const { status, loading, lastCheck, checkSystem } = useSystemCheck();

  const statusItems = [
    { key: 'database', label: 'Conexão com Banco', icon: Database },
    { key: 'conversas', label: 'Tabela Conversas', icon: MessageSquare },
    { key: 'mensagens', label: 'Tabela Mensagens', icon: MessageSquare },
    { key: 'atendimentos', label: 'Tabela Atendimentos', icon: FileText },
    { key: 'atividades', label: 'Atividades Recentes', icon: Activity },
    { key: 'users', label: 'Tabela Usuários', icon: Users },
  ];

  const allWorking = Object.values(status).every(Boolean);
  const someWorking = Object.values(status).some(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Status do Sistema</h3>
          {lastCheck && (
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              Última verificação: {lastCheck.toLocaleString('pt-BR')}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            allWorking 
              ? 'bg-green-100 text-green-800' 
              : someWorking 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {allWorking ? 'Tudo Funcionando' : someWorking ? 'Funcionamento Parcial' : 'Sistema Offline'}
          </div>
          
          <Button 
            onClick={checkSystem} 
            disabled={loading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Verificando...' : 'Verificar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statusItems.map(({ key, label, icon: Icon }) => {
          const isWorking = status[key as keyof typeof status];
          
          return (
            <div
              key={key}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                isWorking 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                isWorking ? 'text-green-600' : 'text-red-600'
              }`} />
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isWorking ? 'text-green-900' : 'text-red-900'
                }`}>
                  {label}
                </p>
              </div>
              
              {isWorking ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          );
        })}
      </div>

      {!allWorking && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <XCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Atenção</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Alguns componentes do sistema não estão funcionando corretamente. 
                Isso pode afetar a funcionalidade da aplicação. Verifique as configurações 
                do Supabase e as políticas RLS.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemStatus;
