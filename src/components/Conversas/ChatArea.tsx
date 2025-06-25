
import React, { useState } from 'react';
import { CheckCircle, XCircle, Download, Phone, MoreVertical, ArrowLeft } from 'lucide-react';

interface Mensagem {
  id: string;
  texto: string;
  timestamp: string;
  isAI: boolean;
  aprovada?: boolean;
}

interface ChatAreaProps {
  conversaId: string;
  onBack?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ conversaId, onBack }) => {
  const [statusGeral, setStatusGeral] = useState<'aprovada' | 'reprovada' | 'pendente'>('pendente');
  
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
      isAI: true,
      aprovada: true
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
      isAI: true,
      aprovada: undefined
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
      isAI: true,
      aprovada: undefined
    }
  ];

  const handleAprovarMensagem = (mensagemId: string) => {
    console.log(`Mensagem ${mensagemId} aprovada`);
  };

  const handleReprovarMensagem = (mensagemId: string) => {
    console.log(`Mensagem ${mensagemId} reprovada`);
  };

  const handleAprovarConversa = () => {
    setStatusGeral('aprovada');
    console.log('Conversa aprovada');
  };

  const handleReprovarConversa = () => {
    setStatusGeral('reprovada');
    console.log('Conversa reprovada');
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
            className={`flex ${mensagem.isAI ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
              mensagem.isAI ? 'bg-white' : 'bg-blue-500 text-white'
            } rounded-lg px-4 py-3 shadow-sm`}>
              <p className="text-sm">{mensagem.texto}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${
                  mensagem.isAI ? 'text-gray-500' : 'text-blue-100'
                }`}>
                  {mensagem.timestamp}
                </span>
                
                {mensagem.isAI && (
                  <div className="flex items-center space-x-2 ml-3">
                    {mensagem.aprovada === true ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : mensagem.aprovada === false ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleAprovarMensagem(mensagem.id)}
                          className="p-1 hover:bg-green-100 rounded"
                          title="Aprovar mensagem"
                        >
                          <CheckCircle className="w-4 h-4 text-gray-400 hover:text-green-500" />
                        </button>
                        <button
                          onClick={() => handleReprovarMensagem(mensagem.id)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Reprovar mensagem"
                        >
                          <XCircle className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
    </div>
  );
};

export default ChatArea;
