import React from 'react';
import {
  Radio,
  X,
  AlertTriangle,
  Layers,
  Shield,
  Server,
  ArrowRight,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PurdueBadge, CriticalityBadge } from '../common/Badges';

export const BlastRadiusOverlay: React.FC = () => {
  const { blastRadiusResult, setBlastRadiusTargetId, setSelectedNode } = usePlatform();

  if (!blastRadiusResult) return null;

  return (
    <div className="blast-radius-floating-panel" role="region" aria-label="Blast radius reachability analysis">
      <div className="flex items-center justify-between pb-2 border-bottom border-subtle" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-brand" aria-hidden="true" />
          <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
            Blast Radius Analysis
          </span>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ padding: '2px' }}
          onClick={() => setBlastRadiusTargetId(null)}
          aria-label="Close blast radius overlay"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between" style={{ fontSize: '0.78rem' }}>
          <span className="text-muted">Origin Pivot Asset:</span>
          <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>
            {blastRadiusResult.sourceAssetName}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 my-1">
          <div className="p-2" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Potentially Reachable
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              {blastRadiusResult.reachableAssetCount} Assets
            </span>
          </div>

          <div className="p-2" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--severity-critical-border)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--severity-critical-text)', textTransform: 'uppercase', display: 'block' }}>
              Crown Jewels Exposed
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--severity-critical)' }}>
              {blastRadiusResult.criticalAssetsReachable} Systems
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {blastRadiusResult.summary}
        </p>

        <div className="flex flex-col gap-1 pt-1">
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Downstream Crown Jewels:
          </span>
          <div className="flex flex-wrap gap-1">
            {blastRadiusResult.potentialCrownJewels.map((name) => (
              <span
                key={name}
                className="badge badge-critical"
                style={{ fontSize: '0.68rem' }}
              >
                <Shield size={9} /> {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
