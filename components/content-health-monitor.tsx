'use client';

import { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Eye,
  X,
  RefreshCw,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

interface ContentHealthCheck {
  id: string;
  path: string;
  title: string;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
  daysSinceUpdate: number;
  issues: string[];
  screenshotCount: number;
  hasVideo: boolean;
  viewCount: number;
}

interface HealthStats {
  total: number;
  healthy: number;
  warning: number;
  critical: number;
  avgDaysSinceUpdate: number;
  pagesWithoutScreenshots: number;
}

// Health thresholds
const HEALTH_THRESHOLDS = {
  healthy: 30,    // Updated within 30 days
  warning: 60,    // Updated within 60 days
  critical: 90,   // Not updated for 90+ days
};

export function ContentHealthMonitor() {
  const [isOpen, setIsOpen] = useState(false);
  const [checks, setChecks] = useState<ContentHealthCheck[]>([]);
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'warning' | 'critical'>('all');

  useEffect(() => {
    if (isOpen) {
      runHealthCheck();
    }
  }, [isOpen]);

  const runHealthCheck = async () => {
    setLoading(true);
    
    // In production, this would scan actual MDX files
    // For now, simulate with realistic data
    const mockChecks: ContentHealthCheck[] = [
      {
        id: '1',
        path: '/es/docs/primeros-pasos/seleccionar-plan',
        title: 'Seleccionar Plan',
        status: 'healthy',
        lastUpdated: '2026-03-20',
        daysSinceUpdate: 0,
        issues: [],
        screenshotCount: 2,
        hasVideo: true,
        viewCount: 2100,
      },
      {
        id: '2',
        path: '/es/docs/conectar-plataformas/meta-ads/conectar-facebook',
        title: 'Conectar Facebook',
        status: 'healthy',
        lastUpdated: '2026-03-20',
        daysSinceUpdate: 0,
        issues: [],
        screenshotCount: 3,
        hasVideo: true,
        viewCount: 1850,
      },
      {
        id: '3',
        path: '/es/docs/conectar-plataformas/google/conectar-google',
        title: 'Conectar Google Ads',
        status: 'warning',
        lastUpdated: '2026-03-15',
        daysSinceUpdate: 5,
        issues: ['Low satisfaction rate (40%)', 'Long time on page (6m 50s)'],
        screenshotCount: 4,
        hasVideo: false,
        viewCount: 890,
      },
      {
        id: '4',
        path: '/es/docs/configurar-negocio/brief-audio',
        title: 'Crear Brief con Audio',
        status: 'warning',
        lastUpdated: '2026-03-10',
        daysSinceUpdate: 10,
        issues: ['User feedback: needs more screenshots'],
        screenshotCount: 1,
        hasVideo: true,
        viewCount: 650,
      },
      {
        id: '5',
        path: '/es/docs/solucion-problemas/errores-meta',
        title: 'Errores Comunes de Meta',
        status: 'critical',
        lastUpdated: '2026-01-15',
        daysSinceUpdate: 64,
        issues: ['Outdated content', 'No screenshots', 'High bounce rate'],
        screenshotCount: 0,
        hasVideo: false,
        viewCount: 320,
      },
      {
        id: '6',
        path: '/es/docs/estrategias/configurar-estrategia',
        title: 'Configurar Estrategia',
        status: 'critical',
        lastUpdated: '2026-02-01',
        daysSinceUpdate: 47,
        issues: ['Missing lastModified date', 'No visual examples'],
        screenshotCount: 0,
        hasVideo: false,
        viewCount: 280,
      },
    ];

    // Calculate stats
    const healthy = mockChecks.filter(c => c.status === 'healthy').length;
    const warning = mockChecks.filter(c => c.status === 'warning').length;
    const critical = mockChecks.filter(c => c.status === 'critical').length;
    const avgDays = Math.round(mockChecks.reduce((acc, c) => acc + c.daysSinceUpdate, 0) / mockChecks.length);
    const noScreenshots = mockChecks.filter(c => c.screenshotCount === 0).length;

    setChecks(mockChecks);
    setStats({
      total: mockChecks.length,
      healthy,
      warning,
      critical,
      avgDaysSinceUpdate: avgDays,
      pagesWithoutScreenshots: noScreenshots,
    });
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'critical': return HeartPulse;
      default: return FileText;
    }
  };

  const filteredChecks = checks.filter(check => {
    if (filter === 'all') return true;
    return check.status === filter;
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
      >
        <HeartPulse className="h-4 w-4" />
        <span className="text-sm font-medium">Health</span>
        {stats && stats.critical > 0 && (
          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {stats.critical}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-fd-background rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <HeartPulse className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-lg font-semibold text-white">
                Content Health Monitor
              </h2>
              <p className="text-xs text-white/70">
                Automated content quality checks
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 p-4 bg-fd-accent/20 border-b">
            <div className="text-center">
              <div className="text-2xl font-bold text-fd-foreground">{stats.total}</div>
              <div className="text-xs text-fd-muted-foreground">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.healthy}</div>
              <div className="text-xs text-fd-muted-foreground">Healthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
              <div className="text-xs text-fd-muted-foreground">Warning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-xs text-fd-muted-foreground">Critical</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <span className="text-sm text-fd-muted-foreground">Filter:</span>
          {(['all', 'warning', 'critical'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === f
                  ? 'bg-fd-primary text-fd-primary-foreground'
                  : 'bg-fd-accent text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <button
            onClick={runHealthCheck}
            disabled={loading}
            className="ml-auto flex items-center gap-1 px-3 py-1 text-sm bg-fd-accent text-fd-foreground rounded-full hover:bg-fd-accent/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-fd-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredChecks.map((check) => {
                const StatusIcon = getStatusIcon(check.status);
                return (
                  <div
                    key={check.id}
                    className="border rounded-lg p-4 hover:border-fd-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(check.status)}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <Link
                            href={check.path}
                            className="text-sm font-medium text-fd-foreground hover:text-fd-primary transition-colors"
                          >
                            {check.title}
                          </Link>
                          <div className="flex items-center gap-3 mt-1 text-xs text-fd-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {check.daysSinceUpdate} days ago
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {check.viewCount.toLocaleString()} views
                            </span>
                            <span className="flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              {check.screenshotCount} screenshots
                            </span>
                            {check.hasVideo && (
                              <span className="text-blue-600">Video included</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(check.status)}`}>
                        {check.status}
                      </span>
                    </div>

                    {/* Issues */}
                    {check.issues.length > 0 && (
                      <div className="mt-3 pl-11 space-y-1">
                        {check.issues.map((issue, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400"
                          >
                            <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredChecks.length === 0 && (
                <div className="text-center py-12 text-fd-muted-foreground">
                  No pages match the selected filter
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-fd-accent/20 border-t text-sm text-fd-muted-foreground">
          <div className="flex items-center justify-between">
            <span>
              Health thresholds: Healthy ≤{HEALTH_THRESHOLDS.healthy}d | 
              Warning ≤{HEALTH_THRESHOLDS.warning}d | 
              Critical {'>'}{HEALTH_THRESHOLDS.critical}d
            </span>
            {stats && (
              <span>
                {stats.pagesWithoutScreenshots} pages need screenshots
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
