
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare } from 'lucide-react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import Sidebar from '../components/Layout/Sidebar';
import DashboardStats from '../components/Dashboard/DashboardStats';
import RecentActivity from '../components/Dashboard/RecentActivity';
import AtendimentosList from '../components/Atendimentos/AtendimentosList';
import ConversasList from '../components/Conversas/ConversasList';
import ChatArea from '../components/Conversas/ChatArea';
import ProfileForm from '../components/Profile/ProfileForm';
import HelpPage from '../components/Help/HelpPage';

const Index = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedConversaId, setSelectedConversaId] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authMode === 'login' && (
            <LoginForm
              onToggleMode={() => setAuthMode('register')}
              onForgotPassword={() => setAuthMode('forgot')}
            />
          )}
          {authMode === 'register' && (
            <RegisterForm onToggleMode={() => setAuthMode('login')} />
          )}
          {authMode === 'forgot' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Recuperar Senha</h1>
              <p className="text-gray-600 mb-6">Funcionalidade em desenvolvimento</p>
              <button
                onClick={() => setAuthMode('login')}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Voltar para login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleSelectConversa = (conversaId: string) => {
    setSelectedConversaId(conversaId);
    setShowMobileChat(true);
  };

  const handleBackFromChat = () => {
    setShowMobileChat(false);
    setSelectedConversaId(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Visão geral dos seus atendimentos</p>
            </div>
            <DashboardStats />
            <RecentActivity />
          </div>
        );

      case 'atendimentos':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Atendimentos</h1>
              <p className="text-gray-600 mt-1">Gerencie todos os seus atendimentos</p>
            </div>
            <AtendimentosList />
          </div>
        );

      case 'conversas':
        return (
          <div className="h-[calc(100vh-2rem)] flex">
            {/* Mobile view */}
            <div className="lg:hidden w-full">
              {!showMobileChat ? (
                <ConversasList
                  onSelectConversa={handleSelectConversa}
                  selectedConversaId={selectedConversaId}
                />
              ) : selectedConversaId ? (
                <ChatArea
                  conversaId={selectedConversaId}
                  onBack={handleBackFromChat}
                />
              ) : null}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:flex w-full">
              <ConversasList
                onSelectConversa={handleSelectConversa}
                selectedConversaId={selectedConversaId}
              />
              {selectedConversaId ? (
                <ChatArea conversaId={selectedConversaId} />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
                    <p className="text-gray-500">Escolha uma conversa da lista para começar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'perfil':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Minha Conta</h1>
              <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
            </div>
            <ProfileForm />
          </div>
        );

      case 'ajuda':
        return (
          <div className="space-y-6">
            <HelpPage />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="flex-1 overflow-auto">
        <div className={`p-6 ${activeSection === 'conversas' ? 'h-full' : ''}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
