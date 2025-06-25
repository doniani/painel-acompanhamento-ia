
import React from 'react';
import { Phone, MessageSquare, CheckCircle, Clock } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Total de Atendimentos',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Phone,
      color: 'blue'
    },
    {
      title: 'Conversas Ativas',
      value: '324',
      change: '+5%',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'green'
    },
    {
      title: 'Aprovadas',
      value: '892',
      change: '+8%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      title: 'Pendentes',
      value: '31',
      change: '-15%',
      changeType: 'negative',
      icon: Clock,
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
