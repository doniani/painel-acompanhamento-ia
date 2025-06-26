
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare } from 'lucide-react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import Sidebar from '../components/Layout/Sidebar';
import DashboardStats from '../components/Dashboard/DashboardStats';
import RecentActivity from '../components/Dashboard/RecentActivity';
import SystemStatus from '../components/SystemCheck/SystemStatus';
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

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <ForgotPasswordForm onBack={() => setAuthMode('login')} />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity />
              <SystemStatus />
            </div>
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
