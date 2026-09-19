import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { PostureSummary } from './PostureSummary';
import { AttackPathPreview } from './AttackPathPreview';
import { RiskFindings } from './RiskFindings';
import { AssetVisibility } from './AssetVisibility';
import { NetworkTopologyInsight } from './NetworkTopologyInsight';
import { RecentChangeTimeline } from './RecentChangeTimeline';
import { PlatformSensorHealth } from './PlatformSensorHealth';
import { AlertTriangle, RefreshCw, FolderOpen, ShieldCheck } from 'lucide-react';

export const MainDashboard: React.FC = () => {
  const { simMode, retryLoading, resetFilters, findings, assets } = usePlatform();

  if (simMode === 'loading') {
    return (
      <div className="content-wrapper">
        <div className="grid grid-cols-4 gap-4">
          <div className="skeleton skeleton-kpi" />
          <div className="skeleton skeleton-kpi" />
          <div className="skeleton skeleton-kpi" />
          <div className="skeleton skeleton-kpi" />
        </div>
        <div className="skeleton skeleton-card" style={{ height: '180px' }} />
        <div className="grid grid-cols-2 gap-6">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      </div>
    );
  }

  if (simMode === 'error') {
    return (
      <div className="content-wrapper flex flex-col items-center justify-center p-12 text-center gap-4">
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--severity-critical-bg)',
            border: '1px solid var(--severity-critical-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertTriangle size={28} className="text-critical" />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Unable to Retrieve OT Telemetry Pipeline
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Connection to the industrial sensor correlation daemon timed out. Network telemetry may be unavailable.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={retryLoading}>
          <RefreshCw size={15} />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  if (simMode === 'empty') {
    return (
      <div className="content-wrapper flex flex-col items-center justify-center p-12 text-center gap-4">
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FolderOpen size={28} className="text-muted" />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            No Assets or Findings Match Current Filter
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Try adjusting your Site, Plant, Zone, or Severity criteria.
          </p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={resetFilters}>
          <RefreshCw size={15} />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="content-wrapper animate-fade-in">
      {/* Priority 1: Executive / Posture Summary */}
      <PostureSummary />

      {/* Priority 2: Attack Path Exposure Preview */}
      <AttackPathPreview />

      {/* Priority 3: Risk & Findings Breakdown */}
      <RiskFindings />

      {/* Priority 4: Asset Visibility Inventory */}
      <AssetVisibility />

      {/* Priority 5: Network Topology & Zone Matrix */}
      <NetworkTopologyInsight />

      {/* Priority 6 & 7: Recent Timeline & Sensor Health */}
      <div className="grid grid-cols-2 lg-grid-cols-1 gap-6">
        <RecentChangeTimeline />
        <PlatformSensorHealth />
      </div>
    </div>
  );
};
