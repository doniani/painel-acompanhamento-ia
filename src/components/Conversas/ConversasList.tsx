
import React, { useState } from 'react';
import { MessageSquare, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useConversas } from '@/hooks/useConversas';

interface ConversasListProps {
  onSelectConversa: (conversaId: string) => void;
  selectedConversaId?: string;
}

const ConversasList: React.FC<ConversasListProps> = ({ onSelectConversa, selectedConversaId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { conversas, loading } = useConversas();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovada':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'reprovada':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const filteredConversas = conversas.filter(conversa =>
    conversa.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversa.cliente_telefone.includes(searchTerm)
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Conversas</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversas.length === 0 ? (
          <div className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa disponível'}
            </p>
          </div>
        ) : (
          filteredConversas.map((conversa) => (
            <div
              key={conversa.id}
              onClick={() => onSelectConversa(conversa.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversaId === conversa.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">{conversa.avatar}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversa.cliente_nome}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(conversa.status)}
                      <span className="text-xs text-gray-500">{formatTimestamp(conversa.updated_at)}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-2">{conversa.cliente_telefone}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                      {conversa.ultimaMensagem}
                    </p>
                    {conversa.naoLidas > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversa.naoLidas}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversasList;
