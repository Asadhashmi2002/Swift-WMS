import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, MessageSquare, Eye, Reply } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { mockApi } from '../../../lib/mockApi';
import { AnalyticsData } from '../../../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const AnalyticsTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getAnalytics(
        new Date(dateRange.start),
        new Date(dateRange.end)
      );
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const kpiCards = analytics ? [
    {
      title: 'Messages Sent',
      value: analytics.kpis.sent.toLocaleString(),
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Delivered',
      value: analytics.kpis.delivered.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Read',
      value: analytics.kpis.read.toLocaleString(),
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Replied',
      value: analytics.kpis.replied.toLocaleString(),
      icon: Reply,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Recipients Reached',
      value: analytics.kpis.recipientsReached.toLocaleString(),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ] : [];

  const chartData = {
    labels: analytics?.broadcastHistory.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Broadcasts Sent',
        data: analytics?.broadcastHistory.map(item => item.count) || [],
        backgroundColor: 'rgba(0, 60, 255, 0.8)',
        borderColor: 'rgba(0, 60, 255, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Broadcast Activity Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Analytics</h2>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-auto"
            />
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-auto"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange({
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0],
              })}
            >
              30 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange({
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0],
              })}
            >
              7 Days
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${kpi.bgColor} mb-3`}>
                <Icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-1">
                {loading ? '...' : kpi.value}
              </h3>
              <p className="text-sm text-gray-500">{kpi.title}</p>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card>
        <div className="h-80">
          {analytics && !loading ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">
                {loading ? 'Loading chart data...' : 'No data available'}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Detailed Stats */}
      {analytics && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Delivery Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Delivery Rate</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {((analytics.kpis.delivered / analytics.kpis.sent) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Read Rate</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {((analytics.kpis.read / analytics.kpis.delivered) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Response Rate</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {((analytics.kpis.replied / analytics.kpis.read) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Period Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Broadcasts</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {analytics.broadcastHistory.reduce((sum, item) => sum + item.count, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Average per Day</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {(analytics.broadcastHistory.reduce((sum, item) => sum + item.count, 0) / analytics.broadcastHistory.length).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Peak Day</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {Math.max(...analytics.broadcastHistory.map(item => item.count))} broadcasts
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};