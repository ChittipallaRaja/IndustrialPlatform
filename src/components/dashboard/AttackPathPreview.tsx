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
            <CheckCircle size={16} className="text-healthy" />
            <h3 className="card-title">Attack Path Exposure Summary</h3>
          </div>
          <span className="badge badge-healthy">Nominal State</span>
        </div>
        <div className="card-body p-6 flex flex-col items-center justify-center text-center gap-2">
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            No Active Lateral Movement Conduits Detected
          </span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '440px' }}>
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
        borderLeft: '4px solid var(--severity-critical)',
        backgroundColor: 'var(--bg-surface-base)',
      }}
    >
      <div className="card-header">
        <div className="card-title-group">
          <GitFork size={16} className="text-brand" aria-hidden="true" />
          <h3 className="card-title">Critical Attack Path Requiring Investigation</h3>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={primaryPath.severity} />
          <ConfidenceBadge confidence={primaryPath.confidence} />
        </div>
      </div>

      <div className="card-body flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {primaryPath.title}
            </span>
            <span className="badge badge-critical" style={{ fontSize: '0.78rem' }}>
              Risk Score: {primaryPath.riskScore}/100
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {primaryPath.summary}
          </p>
        </div>

        {/* Path Visual Node Sequence */}
        <div
          className="flex items-center justify-between p-4"
          style={{
            backgroundColor: 'var(--bg-canvas)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            overflowX: 'auto',
          }}
          aria-label="Attack path node sequence"
        >
          {primaryPath.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div
                className="flex flex-col items-center p-2 text-center"
                style={{
                  minWidth: '130px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: node.isCrownJewel ? '1px solid var(--severity-critical)' : '1px solid var(--border-prominent)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: node.role === 'source' ? '#38bdf8' : node.role === 'target' ? 'var(--severity-critical-text)' : 'var(--text-muted)',
                  }}
                >
                  {node.role === 'source' ? 'ENTRY SOURCE' : node.role === 'target' ? 'CROWN JEWEL' : `PIVOT STEP ${index}`}
                </span>
                <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.86rem', marginTop: '2px' }}>
                  {node.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {node.zone}
                </span>
              </div>

              {index < primaryPath.nodes.length - 1 && (
                <div className="flex flex-col items-center px-2">
                  <span style={{ fontSize: '0.66rem', color: 'var(--color-brand-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {primaryPath.edges[index]?.protocol || 'TCP'}
                  </span>
                  <ArrowRight size={18} className="text-brand" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom CTA Row */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span><strong>Target:</strong> {primaryPath.targetAssetName}</span>
            <span><strong>Zones Traversed:</strong> {primaryPath.zonesTraversed.length} Purdue Layers</span>
            <span><strong>Dwell Velocity:</strong> 2 hrs</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLaunchInvestigation}
            aria-label="Launch interactive Attack Path Map"
          >
            <span>Investigate Attack Path</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
