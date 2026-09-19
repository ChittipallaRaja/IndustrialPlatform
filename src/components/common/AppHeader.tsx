import React from 'react';
import {
  Search,
  BookOpen,
  Sun,
  Moon,
  Radio,
  Sliders,
  AlertTriangle,
  HelpCircle,
  FolderOpen,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Menu,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SimulationMode } from '../../types';

export const AppHeader: React.FC = () => {
  const {
    currentView,
    simMode,
    setSimMode,
    theme,
    toggleTheme,
    toggleMobileSidebar,
    setIsSearchOpen,
    setIsDesignRationaleOpen,
    retryLoading,
  } = usePlatform();

  const titleMap = {
    dashboard: 'Industrial Security Operations Dashboard',
    'attack-path': 'Attack Path & Exposure Investigation Workspace',
  };

  const subtitleMap = {
    dashboard: 'Purdue Model Levels 0–4 Continuous Visibility & Risk Posture',
    'attack-path': 'Interactive Lateral Movement Graph & Crown Jewel Reachability Analysis',
  };

  const simModes: { mode: SimulationMode; label: string; icon: React.FC<{ size: number }> }[] = [
    { mode: 'high-risk', label: 'High Risk (Active)', icon: AlertTriangle },
    { mode: 'normal', label: 'Normal / Healthy', icon: ShieldCheck },
    { mode: 'degraded-sensor', label: 'Degraded Sensor', icon: Radio },
    { mode: 'unknown-uncertain', label: 'Uncertain / Low Conf', icon: HelpCircle },
    { mode: 'empty', label: 'Empty State', icon: FolderOpen },
    { mode: 'loading', label: 'Loading Skeleton', icon: Loader2 },
    { mode: 'error', label: 'Error / Failure', icon: RefreshCw },
  ];

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={toggleMobileSidebar}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          <div className="header-title-group">
            <h1>{titleMap[currentView]}</h1>
            <p className="header-subtitle">{subtitleMap[currentView]}</p>
          </div>
        </div>

        <div className="header-right">
          {/* Quick Search Launcher */}
          <button
            type="button"
            className="quick-search-btn"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search Assets, Findings, or Attack Paths. Press Control K"
          >
            <Search size={15} aria-hidden="true" />
            <span className="search-text-full">Search assets, CVEs, paths...</span>
            <span className="search-text-compact">Search...</span>
            <kbd className="kbd-shortcut">Ctrl+K</kbd>
          </button>

          {/* Design Rationale & Docs Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm header-doc-btn"
            onClick={() => setIsDesignRationaleOpen(true)}
            aria-label="Open Design Rationale & Product Architecture Documentation"
          >
            <BookOpen size={14} className="text-brand" aria-hidden="true" />
            <span>Rationale</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Interactive State Simulation Switcher Bar */}
      <div className="sim-state-banner" role="region" aria-label="Environment State Simulation Switcher">
        <div className="flex items-center gap-2 sim-label-box" style={{ flexShrink: 0 }}>
          <Sliders size={14} className="text-brand" aria-hidden="true" />
          <span style={{ fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Simulate State:
          </span>
        </div>

        <div className="sim-state-controls" role="radiogroup" aria-label="Simulate system state">
          {simModes.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              type="button"
              className={`sim-pill-btn ${simMode === mode ? 'active' : ''}`}
              onClick={() => {
                if (mode === 'loading') {
                  setSimMode('loading');
                  setTimeout(() => setSimMode('high-risk'), 1500);
                } else {
                  setSimMode(mode);
                }
              }}
              role="radio"
              aria-checked={simMode === mode}
            >
              <span className="flex items-center gap-1">
                <Icon size={12} />
                <span>{label}</span>
              </span>
            </button>
          ))}

          {simMode === 'error' && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ padding: '2px 8px', fontSize: '0.72rem' }}
              onClick={retryLoading}
            >
              <RefreshCw size={12} /> Retry
            </button>
          )}
        </div>
      </div>
    </>
  );
};
