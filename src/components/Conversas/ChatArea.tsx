
import React, { useState } from 'react';
import { XCircle, Download, Phone, MoreVertical, ArrowLeft, CheckCircle } from 'lucide-react';

interface Mensagem {
  id: string;
  texto: string;
  timestamp: string;
  isAI: boolean;
}

interface ChatAreaProps {
  conversaId: string;
  onBack?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ conversaId, onBack }) => {
  const [statusGeral, setStatusGeral] = useState<'aprovada' | 'reprovada' | 'pendente'>('pendente');
  const [showReprovalModal, setShowReprovalModal] = useState(false);
  const [reprovalReason, setReprovalReason] = useState('');
  
  const conversaInfo = {
    clienteNome: 'João Silva',
    clienteTelefone: '(11) 99999-9999',
    avatar: 'JS'
  };

  const mensagens: Mensagem[] = [
    {
      id: '1',
      texto: 'Olá! Gostaria de saber mais sobre seus produtos.',
      timestamp: '14:25',
      isAI: false
    },
    {
      id: '2',
      texto: 'Olá! Claro, temos uma linha completa de produtos para atender suas necessidades. Que tipo de produto você está procurando?',
      timestamp: '14:26',
      isAI: true
    },
    {
      id: '3',
      texto: 'Estou interessado em produtos para casa e jardim.',
      timestamp: '14:27',
      isAI: false
    },
    {
      id: '4',
      texto: 'Perfeito! Temos excelentes opções para casa e jardim. Posso te mostrar nossos produtos mais populares: ferramentas de jardinagem, decoração para ambientes externos e produtos de limpeza ecológicos. Qual categoria te interessa mais?',
      timestamp: '14:28',
      isAI: true
    },
    {
      id: '5',
      texto: 'As ferramentas de jardinagem me interessam bastante.',
      timestamp: '14:29',
      isAI: false
    },
    {
      id: '6',
      texto: 'Ótima escolha! Temos um kit completo com: tesoura de poda, enxada, rastelo e regadores. O preço promocional está R$ 189,90 com frete grátis. Gostaria de mais detalhes?',
      timestamp: '14:30',
      isAI: true
    }
  ];

  const handleAprovarConversa = () => {
    setStatusGeral('aprovada');
    console.log('Conversa aprovada');
  };

  const handleReprovarConversa = () => {
    setShowReprovalModal(true);
  };

  const handleConfirmReproval = () => {
    if (reprovalReason.trim()) {
      setStatusGeral('reprovada');
      console.log('Conversa reprovada:', reprovalReason);
      setShowReprovalModal(false);
      setReprovalReason('');
    }
  };

  const handleCancelReproval = () => {
    setShowReprovalModal(false);
    setReprovalReason('');
  };

  const handleExportarHistorico = () => {
    console.log('Exportando histórico...');
  };

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
              <span className="text-sm font-medium text-blue-600">{conversaInfo.avatar}</span>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">{conversaInfo.clienteNome}</h3>
              <p className="text-sm text-gray-500 flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {conversaInfo.clienteTelefone}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusGeral === 'aprovada' ? 'bg-green-100 text-green-700' :
              statusGeral === 'reprovada' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {statusGeral === 'aprovada' ? 'Aprovada' :
               statusGeral === 'reprovada' ? 'Reprovada' : 'Pendente'}
            </span>
            
            <button
              onClick={handleExportarHistorico}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Exportar histórico"
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
        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={`flex ${mensagem.isAI ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
              mensagem.isAI ? 'bg-blue-500 text-white' : 'bg-white'
            } rounded-lg px-4 py-3 shadow-sm`}>
              <p className="text-sm">{mensagem.texto}</p>
              <div className="flex items-center justify-end mt-2">
                <span className={`text-xs ${
                  mensagem.isAI ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {mensagem.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleReprovarConversa}
            disabled={statusGeral === 'reprovada'}
            className="flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Reprovar Conversa</span>
          </button>
          
          <button
            onClick={handleAprovarConversa}
            disabled={statusGeral === 'aprovada'}
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
