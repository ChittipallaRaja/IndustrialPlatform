import React from 'react';
import {
  LayoutDashboard,
  GitFork,
  Shield,
  Radio,
  BookOpen,
  Activity,
  Layers,
  Server,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const AppSidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    findings,
    attackPaths,
    simMode,
    setIsDesignRationaleOpen,
  } = usePlatform();

  const criticalFindingsCount = findings.filter((f) => f.severity === 'critical').length;
  const activePathsCount = attackPaths.filter((p) => p.status === 'active').length;

  return (
    <aside className="app-sidebar" aria-label="Main Navigation">
      <div className="sidebar-header">
        <div className="brand-icon-box" aria-hidden="true">
          <Shield size={20} strokeWidth={2.5} />
        </div>
        <div className="brand-title">
          <span>CYBERGUARD</span>
          <span className="brand-sub">OT / ICS DEFENSE</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
          aria-current={currentView === 'dashboard' ? 'page' : undefined}
        >
          <LayoutDashboard size={18} aria-hidden="true" />
          <span>Dashboard</span>
          {criticalFindingsCount > 0 && (
            <span className="nav-badge badge-critical">
              {criticalFindingsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'attack-path' ? 'active' : ''}`}
          onClick={() => setCurrentView('attack-path')}
          aria-current={currentView === 'attack-path' ? 'page' : undefined}
        >
          <GitFork size={18} aria-hidden="true" />
          <span>Attack Path Map</span>
          {activePathsCount > 0 && (
            <span className="nav-badge badge-high">
              {activePathsCount} PATHS
            </span>
          )}
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <button
            type="button"
            className="nav-item"
            onClick={() => setIsDesignRationaleOpen(true)}
            aria-label="View Design Rationale Documentation"
          >
            <BookOpen size={18} className="text-brand" aria-hidden="true" />
            <span>Design Rationale</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              OT Telemetry Status
            </span>
            <span
              className={`badge ${
                simMode === 'degraded-sensor' ? 'badge-degraded' : 'badge-healthy'
              }`}
              style={{ padding: '1px 6px', fontSize: '0.64rem' }}
            >
              {simMode === 'degraded-sensor' ? 'DEGRADED' : 'ONLINE'}
            </span>
          </div>

          <div className="flex items-center gap-2" style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            <Radio size={13} className={simMode === 'degraded-sensor' ? 'text-brand' : 'text-healthy'} />
            <span>4 Industrial Sensors Active</span>
          </div>

          <div className="flex items-center gap-2" style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            <Layers size={13} className="text-muted" />
            <span>6 Purdue Zones Monitored</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
