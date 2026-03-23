'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  AlertCircle,
  X
} from 'lucide-react';
import Link from 'next/link';

interface PageStats {
  path: string;
  title: string;
  views: number;
  helpful: number;
  notHelpful: number;
  avgTimeOnPage: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  totalFeedback: number;
  satisfactionRate: number;
  topPages: PageStats[];
  needsAttention: PageStats[];
  recentFeedback: {
    id: string;
    pagePath: string;
    isHelpful: boolean;
    comment?: string;
    timestamp: string;
  }[];
}

const mockData: AnalyticsData = {
  totalViews: 12453,
  uniqueVisitors: 3421,
  avgSessionDuration: 245,
  totalFeedback: 186,
  satisfactionRate: 78,
  topPages: [
    { path: '/es/docs/primeros-pasos/seleccionar-plan', title: 'Seleccionar Plan', views: 2100, helpful: 45, notHelpful: 5, avgTimeOnPage: 180, lastUpdated: '2026-03-20', trend: 'up' },
    { path: '/es/docs/conectar-plataformas/meta-ads/conectar-facebook', title: 'Conectar Facebook', views: 1850, helpful: 52, notHelpful: 12, avgTimeOnPage: 320, lastUpdated: '2026-03-20', trend: 'up' },
    { path: '/es/docs/conectar-plataformas/meta-ads/seleccionar-business-manager', title: 'Seleccionar Business Manager', views: 1620, helpful: 38, notHelpful: 8, avgTimeOnPage: 290, lastUpdated: '2026-03-20', trend: 'stable' },
    { path: '/es/docs/lanzar-campana/lanzar-meta', title: 'Lanzar en Meta', views: 1340, helpful: 41, notHelpful: 6, avgTimeOnPage: 240, lastUpdated: '2026-03-20', trend: 'up' },
    { path: '/es/docs/primeros-pasos/crear-cuenta', title: 'Crear Cuenta', views: 1200, helpful: 28, notHelpful: 3, avgTimeOnPage: 150, lastUpdated: '2026-03-20', trend: 'stable' },
  ],
  needsAttention: [
    { path: '/es/docs/conectar-plataformas/google/conectar-google', title: 'Conectar Google Ads', views: 890, helpful: 12, notHelpful: 18, avgTimeOnPage: 410, lastUpdated: '2026-03-15', trend: 'down' },
    { path: '/es/docs/configurar-negocio/brief-audio', title: 'Crear Brief con Audio', views: 650, helpful: 8, notHelpful: 14, avgTimeOnPage: 380, lastUpdated: '2026-03-10', trend: 'down' },
  ],
  recentFeedback: [
    { id: '1', pagePath: '/es/docs/conectar-plataformas/google/conectar-google', isHelpful: false, comment: 'Los permisos de Google no están claros', timestamp: '2026-03-20T10:30:00Z' },
    { id: '2', pagePath: '/es/docs/primeros-pasos/seleccionar-plan', isHelpful: true, timestamp: '2026-03-20T09:15:00Z' },
    { id: '3', pagePath: '/es/docs/configurar-negocio/brief-audio', isHelpful: false, comment: 'Necesita más screenshots del proceso', timestamp: '2026-03-20T08:45:00Z' },
  ],
};

export function AnalyticsDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'feedback'>('overview');

  useEffect(() => {
    if (isOpen && !data) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    // In production, this would fetch from an API
    // const response = await fetch('/api/analytics');
    // const result = await response.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setData(mockData);
    setLoading(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-fd-accent text-fd-foreground rounded-full shadow-lg hover:bg-fd-accent/80 transition-all"
      >
        <BarChart3 className="h-4 w-4" />
        <span className="text-sm font-medium">Analytics</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-fd-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-fd-primary to-fd-primary/80 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-fd-primary-foreground" />
            <div>
              <h2 className="text-lg font-semibold text-fd-primary-foreground">
                Analytics Dashboard
              </h2>
              <p className="text-xs text-fd-primary-foreground/70">
                Content performance & user insights
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-fd-primary-foreground/80 hover:text-fd-primary-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-fd-accent/30 flex-shrink-0">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'pages', label: 'Pages', icon: BookOpen },
            { id: 'feedback', label: 'Feedback', icon: ThumbsUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-fd-primary border-b-2 border-fd-primary bg-fd-background'
                  : 'text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-fd-primary border-t-transparent rounded-full" />
            </div>
          ) : !data ? (
            <div className="text-center text-fd-muted-foreground py-12">
              Failed to load analytics data
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KPICard
                      icon={Eye}
                      label="Total Views"
                      value={data.totalViews.toLocaleString()}
                      trend="+12%"
                      trendUp={true}
                    />
                    <KPICard
                      icon={Users}
                      label="Unique Visitors"
                      value={data.uniqueVisitors.toLocaleString()}
                      trend="+8%"
                      trendUp={true}
                    />
                    <KPICard
                      icon={Clock}
                      label="Avg Session"
                      value={formatDuration(data.avgSessionDuration)}
                      trend="+5%"
                      trendUp={true}
                    />
                    <KPICard
                      icon={ThumbsUp}
                      label="Satisfaction"
                      value={`${data.satisfactionRate}%`}
                      trend="-2%"
                      trendUp={false}
                    />
                  </div>

                  {/* Top Performing Pages */}
                  <div className="bg-fd-accent/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-fd-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Top Performing Pages
                    </h3>
                    <div className="space-y-3">
                      {data.topPages.slice(0, 3).map((page) => (
                        <PageRow key={page.path} page={page} formatDate={formatDate} />
                      ))}
                    </div>
                  </div>

                  {/* Needs Attention */}
                  {data.needsAttention.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                      <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Needs Attention
                      </h3>
                      <div className="space-y-3">
                        {data.needsAttention.map((page) => (
                          <PageRow key={page.path} page={page} formatDate={formatDate} attention />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-fd-foreground">All Pages</h3>
                    <span className="text-xs text-fd-muted-foreground">
                      {data.topPages.length + data.needsAttention.length} pages tracked
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[...data.topPages, ...data.needsAttention]
                      .sort((a, b) => b.views - a.views)
                      .map((page) => (
                        <PageRow key={page.path} page={page} formatDate={formatDate} detailed />
                      ))}
                  </div>
                </div>
              )}

              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-fd-foreground">Recent Feedback</h3>
                    <span className="text-xs text-fd-muted-foreground">
                      {data.totalFeedback} total responses
                    </span>
                  </div>
                  <div className="space-y-3">
                    {data.recentFeedback.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="bg-fd-accent/30 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {feedback.isHelpful ? (
                              <ThumbsUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <ThumbsDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm font-medium text-fd-foreground">
                              {feedback.isHelpful ? 'Helpful' : 'Not Helpful'}
                            </span>
                          </div>
                          <span className="text-xs text-fd-muted-foreground">
                            {formatDate(feedback.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-fd-muted-foreground mb-2">
                          {feedback.pagePath}
                        </p>
                        {feedback.comment && (
                          <p className="text-sm text-fd-foreground bg-fd-background rounded p-2">
                            "{feedback.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  trendUp 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-fd-accent/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-fd-muted-foreground" />
        <span className="text-xs text-fd-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold text-fd-foreground">{value}</div>
      <div className={`text-xs flex items-center gap-1 mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {trend}
      </div>
    </div>
  );
}

function PageRow({ 
  page, 
  formatDate, 
  attention = false,
  detailed = false 
}: { 
  page: PageStats; 
  formatDate: (d: string) => string;
  attention?: boolean;
  detailed?: boolean;
}) {
  const satisfaction = page.helpful + page.notHelpful > 0
    ? Math.round((page.helpful / (page.helpful + page.notHelpful)) * 100)
    : 0;

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${
      attention ? 'bg-red-100/50 dark:bg-red-900/30' : 'bg-fd-background'
    }`}>
      <div className="flex-1 min-w-0">
        <Link 
          href={page.path}
          className="text-sm font-medium text-fd-foreground hover:text-fd-primary truncate block"
        >
          {page.title}
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-fd-muted-foreground">
            <Eye className="h-3 w-3 inline mr-1" />
            {page.views.toLocaleString()}
          </span>
          <span className="text-xs text-fd-muted-foreground">
            <Clock className="h-3 w-3 inline mr-1" />
            {Math.floor(page.avgTimeOnPage / 60)}m
          </span>
          <span className={`text-xs ${satisfaction >= 70 ? 'text-green-600' : satisfaction >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            <ThumbsUp className="h-3 w-3 inline mr-1" />
            {satisfaction}%
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        {detailed && (
          <span className="text-xs text-fd-muted-foreground">
            Updated {formatDate(page.lastUpdated)}
          </span>
        )}
        {page.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
        {page.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
      </div>
    </div>
  );
}
