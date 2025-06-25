
import React, { useState } from 'react';
import { Mail, ArrowLeft, MessageSquare } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Simular envio de email de recuperação
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setMessage('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
    } catch (error) {
      setMessage('Erro ao enviar e-mail de recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recuperar Senha</h1>
          <p className="text-gray-600 mt-2">
            {isSuccess 
              ? 'Enviamos um link para redefinir sua senha'
              : 'Digite seu e-mail para receber as instruções'
            }
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Não recebeu o e-mail?</p>
              <p>• Verifique sua caixa de spam</p>
              <p>• Aguarde alguns minutos</p>
              <p>• Tente novamente com outro e-mail</p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-500 font-medium mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
