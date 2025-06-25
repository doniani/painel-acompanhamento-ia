
import React, { useState } from 'react';
import { Search, Filter, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Atendimento {
  id: string;
  nome: string;
  telefone: string;
  data: string;
  status: 'aprovado' | 'sem_resposta' | 'rejeitado';
  mensagens: number;
  ultimaInteracao: string;
}

const AtendimentosList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [dateFilter, setDateFilter] = useState<string>('');

  const atendimentos: Atendimento[] = [
    {
      id: '1',
      nome: 'João Silva',
      telefone: '(11) 99999-9999',
      data: '2024-01-15',
      status: 'aprovado',
      mensagens: 12,
      ultimaInteracao: '2 horas atrás'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      telefone: '(11) 88888-8888',
      data: '2024-01-15',
      status: 'sem_resposta',
      mensagens: 5,
      ultimaInteracao: '1 dia atrás'
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      telefone: '(11) 77777-7777',
      data: '2024-01-14',
      status: 'rejeitado',
      mensagens: 8,
      ultimaInteracao: '3 horas atrás'
    },
    {
      id: '4',
      nome: 'Ana Oliveira',
      telefone: '(11) 66666-6666',
      data: '2024-01-14',
      status: 'aprovado',
      mensagens: 15,
      ultimaInteracao: '30 min atrás'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejeitado':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      default:
        return 'Sem resposta';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredAtendimentos = atendimentos.filter(atendimento => {
    const matchesSearch = atendimento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atendimento.telefone.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || atendimento.status === statusFilter;
    const matchesDate = !dateFilter || atendimento.data === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Atendimentos</h2>
            <p className="text-sm text-gray-600 mt-1">Gerencie todos os seus atendimentos</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos os status</option>
              <option value="aprovado">Aprovado</option>
              <option value="sem_resposta">Sem resposta</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
            
            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mensagens
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Interação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAtendimentos.map((atendimento) => (
              <tr key={atendimento.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {atendimento.nome.split(' ').map(n => n.charAt(0)).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{atendimento.nome}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {atendimento.telefone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(atendimento.data).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(atendimento.status)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(atendimento.status)}`}>
                      {getStatusText(atendimento.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {atendimento.mensagens}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {atendimento.ultimaInteracao}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Ver conversa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAtendimentos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum atendimento encontrado</p>
        </div>
      )}
    </div>
  );
};

export default AtendimentosList;
