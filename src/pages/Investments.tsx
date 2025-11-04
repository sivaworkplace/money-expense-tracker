import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Investment } from '@/types';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import InvestmentForm from '@/components/InvestmentForm';
import PhotoView from '@/components/PhotoView';
import { Plus, TrendingUp, TrendingDown, Search, Filter, Edit2, Trash2, PieChart, LineChart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { INVESTMENT_TYPES } from '@/utils/constants';

const Investments: React.FC = () => {
  const { investments, settings, deleteInvestment } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Calculate total stats
  const stats = useMemo(() => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturns = totalCurrentValue - totalInvested;
    const avgReturnsPercentage = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalCurrentValue,
      totalReturns,
      avgReturnsPercentage,
      count: investments.length
    };
  }, [investments]);

  // Filter and search
  const filteredInvestments = useMemo(() => {
    return investments.filter(inv => {
      const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inv.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || inv.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [investments, searchTerm, filterType]);

  // Group by type
  const groupedInvestments = useMemo(() => {
    const groups: Record<string, Investment[]> = {};
    filteredInvestments.forEach(inv => {
      if (!groups[inv.type]) {
        groups[inv.type] = [];
      }
      groups[inv.type].push(inv);
    });
    return groups;
  }, [filteredInvestments]);

  const handleAdd = () => {
    setEditingInvestment(undefined);
    setShowModal(true);
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      await deleteInvestment(id);
    }
  };

  const getTypeInfo = (type: string) => {
    return INVESTMENT_TYPES.find(t => t.id === type) || INVESTMENT_TYPES[INVESTMENT_TYPES.length - 1];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Investments
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your investment portfolio and returns
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex justify-end items-center mb-4">
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4" />
            Add Investment
          </Button>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 md:p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Total Invested</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalInvested, settings.currency)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <PieChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {stats.count} investment{stats.count !== 1 ? 's' : ''}
          </p>
        </Card>

        <Card className="p-4 md:p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Current Value</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalCurrentValue, settings.currency)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Market value
          </p>
        </Card>

        <Card className="p-4 md:p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Total Returns</p>
              <p className={`text-xl md:text-2xl font-bold ${stats.totalReturns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stats.totalReturns >= 0 ? '+' : ''}{formatCurrency(stats.totalReturns, settings.currency)}
              </p>
            </div>
            <div className={`p-3 ${stats.totalReturns >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-lg`}>
              {stats.totalReturns >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Profit/Loss
          </p>
        </Card>

        <Card className="p-4 md:p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Returns</p>
              <p className={`text-xl md:text-2xl font-bold ${stats.avgReturnsPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stats.avgReturnsPercentage >= 0 ? '+' : ''}{stats.avgReturnsPercentage.toFixed(2)}%
              </p>
            </div>
            <div className={`p-3 ${stats.avgReturnsPercentage >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-lg`}>
              {stats.avgReturnsPercentage >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Performance
          </p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search investments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {INVESTMENT_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Investments List */}
      {Object.keys(groupedInvestments).length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <LineChart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No investments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start tracking your investment portfolio by adding your first investment.
            </p>
            <Button onClick={handleAdd} size="sm">
              <Plus className="w-4 h-4" />
              Add Your First Investment
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedInvestments).map(([type, invs]) => {
            const typeInfo = getTypeInfo(type);
            const typeTotal = invs.reduce((sum, inv) => sum + inv.currentValue, 0);
            const typeInvested = invs.reduce((sum, inv) => sum + inv.amount, 0);
            const typeReturns = typeTotal - typeInvested;

            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeInfo.icon}</span>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {typeInfo.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({invs.length})
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Value</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(typeTotal, settings.currency)}
                    </p>
                    <p className={`text-xs ${typeReturns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {typeReturns >= 0 ? '+' : ''}{formatCurrency(typeReturns, settings.currency)} ({typeInvested > 0 ? ((typeReturns / typeInvested) * 100).toFixed(2) : '0.00'}%)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {invs.map(investment => (
                    <Card key={investment.id} className="p-5 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {investment.name}
                          </h4>
                          {investment.platform && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              via {investment.platform}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(investment)}
                            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(investment.id)}
                            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {investment.imagePath && (
                        <div className="mb-3">
                          <PhotoView imagePath={investment.imagePath} size="md" />
                        </div>
                      )}

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Invested</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(investment.amount, settings.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Current Value</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(investment.currentValue, settings.currency)}
                          </span>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-3 rounded-lg ${investment.returns >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="flex items-center gap-2">
                          {investment.returns >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Returns
                          </span>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${investment.returns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {investment.returns >= 0 ? '+' : ''}{formatCurrency(investment.returns, settings.currency)}
                          </p>
                          <p className={`text-xs ${investment.returns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {investment.returnsPercentage >= 0 ? '+' : ''}{investment.returnsPercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      {investment.quantity && (
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                          Quantity: {investment.quantity}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Investment Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingInvestment ? 'Edit Investment' : 'Add Investment'}
        size="xl"
      >
        <InvestmentForm
          investmentId={editingInvestment?.id}
          onSuccess={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
      </div>
    </div>
  );
};

export default Investments;

