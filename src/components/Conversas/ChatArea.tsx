
import React, { useState, useEffect } from 'react';
import { XCircle, Download, Phone, MoreVertical, ArrowLeft, CheckCircle } from 'lucide-react';
import { useMensagens } from '@/hooks/useMensagens';
import { useConversas } from '@/hooks/useConversas';

interface ChatAreaProps {
  conversaId: string;
  onBack?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ conversaId, onBack }) => {
  const { mensagens, loading: loadingMensagens } = useMensagens(conversaId);
  const { conversas, updateConversaStatus } = useConversas();
  const [showReprovalModal, setShowReprovalModal] = useState(false);
  const [reprovalReason, setReprovalReason] = useState('');
  
  const conversa = conversas.find(c => c.id === conversaId);

  const handleAprovarConversa = async () => {
    const success = await updateConversaStatus(conversaId, 'aprovada');
    if (success) {
      console.log('Conversa aprovada');
    }
  };

  const handleReprovarConversa = () => {
    setShowReprovalModal(true);
  };

  const handleConfirmReproval = async () => {
    if (reprovalReason.trim()) {
      const success = await updateConversaStatus(conversaId, 'reprovada', reprovalReason);
      if (success) {
        console.log('Conversa reprovada:', reprovalReason);
        setShowReprovalModal(false);
        setReprovalReason('');
      }
    }
  };

  const handleCancelReproval = () => {
    setShowReprovalModal(false);
    setReprovalReason('');
  };

  const handleExportarHistorico = () => {
    if (mensagens.length === 0) return;
    
    const historicoTexto = mensagens.map(msg => 
      `[${msg.timestamp}] ${msg.is_ai ? 'IA' : conversa?.cliente_nome || 'Cliente'}: ${msg.texto}`
    ).join('\n');
    
    const blob = new Blob([historicoTexto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversa-${conversa?.cliente_nome || 'cliente'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!conversa) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Conversa não encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">{conversa.avatar}</span>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">{conversa.cliente_nome}</h3>
              <p className="text-sm text-gray-500 flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {conversa.cliente_telefone}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              conversa.status === 'aprovada' ? 'bg-green-100 text-green-700' :
              conversa.status === 'reprovada' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {conversa.status === 'aprovada' ? 'Aprovada' :
               conversa.status === 'reprovada' ? 'Reprovada' : 'Pendente'}
            </span>
            
            <button
              onClick={handleExportarHistorico}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Exportar histórico"
              disabled={mensagens.length === 0}
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingMensagens ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : mensagens.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Nenhuma mensagem encontrada.</p>
          </div>
        ) : (
          mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`flex ${mensagem.is_ai ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                mensagem.is_ai ? 'bg-blue-500 text-white' : 'bg-white'
              } rounded-lg px-4 py-3 shadow-sm`}>
                <p className="text-sm">{mensagem.texto}</p>
                <div className="flex items-center justify-end mt-2">
                  <span className={`text-xs ${
                    mensagem.is_ai ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {mensagem.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleReprovarConversa}
            disabled={conversa.status === 'reprovada'}
            className="flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Reprovar Conversa</span>
          </button>
          
          <button
            onClick={handleAprovarConversa}
            disabled={conversa.status === 'aprovada'}
            className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Aprovar Conversa</span>
          </button>
        </div>
      </div>

      {/* Modal de Reprovação */}
      {showReprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Motivo da Reprovação
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Por favor, informe o motivo da reprovação desta conversa:
            </p>
            <textarea
              value={reprovalReason}
              onChange={(e) => setReprovalReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Digite o motivo da reprovação..."
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelReproval}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReproval}
                disabled={!reprovalReason.trim()}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirmar Reprovação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
