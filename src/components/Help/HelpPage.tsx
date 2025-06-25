
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone, MessageSquare } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: 'Como funciona a aprovação de mensagens?',
      answer: 'Cada mensagem gerada pela IA pode ser aprovada ou reprovada individualmente. Clique nos ícones de check (✓) ou X ao lado de cada mensagem para aprovar ou reprovar. Você também pode aprovar ou reprovar a conversa inteira usando os botões na parte inferior da tela de chat.'
    },
    {
      id: 2,
      question: 'Como filtrar os atendimentos?',
      answer: 'Na página de Atendimentos, você pode usar os filtros disponíveis para buscar por nome do cliente, telefone, data específica ou status (Aprovado, Sem resposta, Rejeitado). Os filtros podem ser combinados para uma busca mais precisa.'
    },
    {
      id: 3,
      question: 'Como exportar o histórico de conversas?',
      answer: 'Na tela de conversa, clique no ícone de download no cabeçalho para exportar todo o histórico da conversa em formato PDF ou CSV. O arquivo incluirá timestamps, mensagens e status de aprovação.'
    },
    {
      id: 4,
      question: 'Como alterar o tema da aplicação?',
      answer: 'Vá para "Minha Conta" no menu lateral e nas preferências você pode escolher entre tema claro ou escuro. A alteração será aplicada imediatamente em toda a aplicação.'
    },
    {
      id: 5,
      question: 'Como recuperar minha senha?',
      answer: 'Na tela de login, clique em "Esqueceu a senha?" e insira seu e-mail. Você receberá um link para redefinir sua senha. Certifique-se de verificar sua caixa de spam.'
    },
    {
      id: 6,
      question: 'O que significa cada status de atendimento?',
      answer: 'Aprovado: A conversa foi revisada e aprovada. Sem resposta: O cliente ainda não respondeu ou a conversa está pendente. Rejeitado: A conversa foi reprovada e precisa de revisão ou melhoria.'
    }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Ajuda</h1>
        <p className="text-lg text-gray-600">Encontre respostas para suas dúvidas mais frequentes</p>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Perguntas Frequentes</h2>
          <p className="text-sm text-gray-600 mt-1">Clique nas perguntas para ver as respostas</p>
        </div>

        <div className="divide-y divide-gray-200">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-6">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between text-left focus:outline-none"
              >
                <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                {openFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openFaq === faq.id && (
                <div className="mt-4 pr-8">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Precisa de mais ajuda?</h2>
        <p className="text-gray-600 mb-6">
          Se você não encontrou a resposta que procurava, entre em contato conosco através dos canais abaixo:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">E-mail</h3>
            <p className="text-sm text-gray-600 mb-3">Resposta em até 24h</p>
            <a
              href="mailto:suporte@aisupport.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              suporte@aisupport.com
            </a>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Telefone</h3>
            <p className="text-sm text-gray-600 mb-3">Seg-Sex 9h às 18h</p>
            <a
              href="tel:+5511999999999"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              (11) 99999-9999
            </a>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Chat</h3>
            <p className="text-sm text-gray-600 mb-3">Atendimento online</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Iniciar chat
            </button>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Dicas Rápidas</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-blue-800">Use os filtros na página de Atendimentos para encontrar conversas específicas rapidamente</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-blue-800">Aprove mensagens individualmente para ter controle total sobre a qualidade do atendimento</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-blue-800">Exporte regularmente o histórico de conversas para backup e análise</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
