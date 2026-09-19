import React from 'react';
import {
  GitFork,
  ArrowRight,
  ShieldAlert,
  Flame,
  AlertTriangle,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SeverityBadge, ConfidenceBadge } from '../common/Badges';

export const AttackPathPreview: React.FC = () => {
  const { attackPaths, setCurrentView, setSelectedPath } = usePlatform();

  const primaryPath = attackPaths[0];

  if (!primaryPath) {
    return (
      <div className="card" style={{ borderColor: 'var(--state-healthy-border)' }}>
        <div className="card-header">
          <div className="card-title-group">
            <CheckCircle size={18} className="text-healthy" />
            <h3 className="card-title">Attack Path Exposure Summary</h3>
          </div>
          <span className="badge badge-healthy">Nominal State</span>
        </div>
        <div className="card-body p-8 flex flex-col items-center justify-center text-center gap-3">
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            No Active Lateral Movement Conduits Detected
          </span>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '480px', lineHeight: 1.5 }}>
            All Purdue Level conduits (L4/L3.5 and L2/L1) are enforcing baseline segmentation policies.
          </p>
        </div>
      </div>
    );
  }

  const handleLaunchInvestigation = () => {
    setSelectedPath(primaryPath);
    setCurrentView('attack-path');
  };

  return (
    <div
      className="card"
      style={{
        borderLeft: '5px solid var(--severity-critical)',
        backgroundColor: 'var(--bg-surface-base)',
      }}
    >
      <div className="card-header">
        <div className="card-title-group">
          <GitFork size={18} className="text-brand" aria-hidden="true" />
          <h3 className="card-title">Critical Attack Path Requiring Investigation</h3>
        </div>
        <div className="flex items-center gap-3">
          <SeverityBadge severity={primaryPath.severity} />
          <ConfidenceBadge confidence={primaryPath.confidence} />
        </div>
      </div>

      <div className="card-body flex flex-col gap-6" style={{ padding: '28px' }}>
        {/* Title and Summary Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {primaryPath.title}
            </h4>
            <span className="badge badge-critical" style={{ fontSize: '0.82rem', padding: '5px 12px' }}>
              Risk Score: {primaryPath.riskScore}/100
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '4px' }}>
            {primaryPath.summary}
          </p>
        </div>

        {/* Path Visual Node Sequence */}
        <div
          className="flex items-center justify-between p-6"
          style={{
            backgroundColor: 'var(--bg-canvas)',
            border: '1px solid var(--border-default)',
            borderRadius: '14px',
            overflowX: 'auto',
            gap: '20px',
            margin: '8px 0',
            padding: '24px 28px',
          }}
          aria-label="Attack path node sequence"
        >
          {primaryPath.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div
                className="flex flex-col items-center text-center"
                style={{
                  minWidth: '170px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  border: node.isCrownJewel ? '1.5px solid var(--severity-critical)' : '1px solid var(--border-prominent)',
                  boxShadow: node.isCrownJewel ? '0 0 15px rgba(239, 68, 68, 0.25)' : 'var(--shadow-sm)',
                  flexShrink: 0,
                  padding: '16px 20px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: node.role === 'source' ? '#38bdf8' : node.role === 'target' ? 'var(--severity-critical-text)' : 'var(--text-muted)',
                  }}
                >
                  {node.role === 'source' ? 'ENTRY SOURCE' : node.role === 'target' ? 'CROWN JEWEL' : `PIVOT STEP ${index}`}
                </span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.94rem', margin: '6px 0 2px 0' }}>
                  {node.name}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {node.zone}
                </span>
              </div>

              {index < primaryPath.nodes.length - 1 && (
                <div className="flex flex-col items-center px-2" style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-brand-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '4px' }}>
                    {primaryPath.edges[index]?.protocol || 'TCP'}
                  </span>
                  <ArrowRight size={20} className="text-brand" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom CTA Row with clean borders & padding */}
        <div
          className="flex items-center justify-between flex-wrap gap-4 pt-5"
          style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '4px' }}
        >
          <div className="flex items-center gap-6 flex-wrap" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            <span><strong>Target:</strong> <span style={{ color: 'var(--severity-critical-text)', fontWeight: 700 }}>{primaryPath.targetAssetName}</span></span>
            <span><strong>Zones Traversed:</strong> {primaryPath.zonesTraversed.length} Purdue Layers</span>
            <span><strong>Dwell Velocity:</strong> 2 hrs</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: '11px 24px', fontSize: '0.88rem' }}
            onClick={handleLaunchInvestigation}
            aria-label="Launch interactive Attack Path Map"
          >
            <span>Investigate Attack Path</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
