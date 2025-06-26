
import React, { useEffect, useState } from 'react';
import { Phone, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalAtendimentos: 0,
    conversasAtivas: 0,
    aprovadas: 0,
    pendentes: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total de atendimentos
        const { count: totalAtendimentos } = await supabase
          .from('atendimentos')
          .select('*', { count: 'exact', head: true });

        // Conversas ativas (pendentes + com mensagens recentes)
        const { count: conversasAtivas } = await supabase
          .from('conversas')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'reprovada');

        // Conversas aprovadas
        const { count: aprovadas } = await supabase
          .from('conversas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aprovada');

        // Conversas pendentes
        const { count: pendentes } = await supabase
          .from('conversas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pendente');

        setStats({
          totalAtendimentos: totalAtendimentos || 0,
          conversasAtivas: conversasAtivas || 0,
          aprovadas: aprovadas || 0,
          pendentes: pendentes || 0
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    {
      title: 'Total de Atendimentos',
      value: loading ? '...' : stats.totalAtendimentos.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: Phone,
      color: 'blue'
    },
    {
      title: 'Conversas Ativas',
      value: loading ? '...' : stats.conversasAtivas.toString(),
      change: '+5%',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'green'
    },
    {
      title: 'Aprovadas',
      value: loading ? '...' : stats.aprovadas.toString(),
      change: '+8%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      title: 'Pendentes',
      value: loading ? '...' : stats.pendentes.toString(),
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
      {statsConfig.map((stat, index) => {
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
