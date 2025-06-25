
import React from 'react';
import { Clock, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'message',
      title: 'Nova mensagem de João Silva',
      description: 'Pergunta sobre disponibilidade de produto',
      time: '5 min atrás',
      status: 'pending',
      avatar: 'JS'
    },
    {
      id: 2,
      type: 'approval',
      title: 'Conversa aprovada',
      description: 'Atendimento para Maria Santos foi aprovado',
      time: '15 min atrás',
      status: 'approved',
      avatar: 'MS'
    },
    {
      id: 3,
      type: 'rejection',
      title: 'Conversa reprovada',
      description: 'Atendimento para Pedro Costa precisa de revisão',
      time: '1 hora atrás',
      status: 'rejected',
      avatar: 'PC'
    },
    {
      id: 4,
      type: 'message',
      title: 'Nova conversa iniciada',
      description: 'Ana Oliveira iniciou um novo atendimento',
      time: '2 horas atrás',
      status: 'pending',
      avatar: 'AO'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">{activity.avatar}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(activity.status)}
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
