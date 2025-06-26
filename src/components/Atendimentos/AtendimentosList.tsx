
import React, { useState } from 'react';
import { Search, Filter, Calendar, Phone, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAtendimentos } from '@/hooks/useAtendimentos';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AtendimentosList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const { atendimentos, loading, updateAtendimento } = useAtendimentos();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'respondido':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'em_andamento':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'sem_resposta':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'respondido':
        return <Badge variant="default" className="bg-green-100 text-green-800">Respondido</Badge>;
      case 'em_andamento':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Em Andamento</Badge>;
      case 'sem_resposta':
        return <Badge variant="destructive">Sem Resposta</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredAtendimentos = atendimentos.filter(atendimento => {
    const matchesSearch = 
      atendimento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.telefone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'todos' || atendimento.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando atendimentos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header com filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Lista de Atendimentos</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAtendimentos.length} atendimento{filteredAtendimentos.length !== 1 ? 's' : ''} encontrado{filteredAtendimentos.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-64"
              />
            </div>
            
            {/* Filtro de Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todos">Todos os Status</option>
              <option value="sem_resposta">Sem Resposta</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="respondido">Respondido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Última Interação</TableHead>
              <TableHead>Mensagens</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAtendimentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>{searchTerm || statusFilter !== 'todos' ? 'Nenhum atendimento encontrado com os filtros aplicados' : 'Nenhum atendimento encontrado'}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAtendimentos.map((atendimento) => (
                <TableRow key={atendimento.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(atendimento.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{atendimento.nome}</p>
                      <p className="text-sm text-gray-500">ID: {atendimento.id.slice(0, 8)}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-1" />
                      {atendimento.telefone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(atendimento.data)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDateTime(atendimento.ultima_interacao)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-sm font-medium">{atendimento.mensagens_count || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(atendimento.status)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AtendimentosList;
