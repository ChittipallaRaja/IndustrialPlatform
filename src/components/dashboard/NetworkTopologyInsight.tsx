import React from 'react';
import {
  Network,
  Activity,
  ArrowRightLeft,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Lock,
  Unlock,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PurdueBadge } from '../common/Badges';

export const NetworkTopologyInsight: React.FC = () => {
  const { zones, updateFilter, filters } = usePlatform();

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <Network size={16} className="text-brand" aria-hidden="true" />
          <h3 className="card-title">Network Segmentation & Zone Conduits</h3>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          ISA/IEC 62443 Zone & Conduit Matrix
        </span>
      </div>

      <div className="card-body flex flex-col gap-4">
        <div className="grid grid-cols-3 lg-grid-cols-2 md-grid-cols-1 gap-5">
          {zones.map((zone) => {
            const isSelected = filters.zone === zone.id;
            const isUnsegmented = zone.segmentationStatus === 'unsegmented';
            const isPartial = zone.segmentationStatus === 'partial';

            return (
              <div
                key={zone.id}
                className="kpi-card"
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--color-brand-primary)' : isUnsegmented ? 'var(--severity-critical-border)' : 'var(--border-default)',
                  backgroundColor: isSelected ? 'var(--color-brand-subtle)' : 'var(--bg-surface-elevated)',
                }}
                onClick={() => updateFilter('zone', isSelected ? 'all' : zone.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && updateFilter('zone', isSelected ? 'all' : zone.id)}
                aria-label={`Zone ${zone.name}. Click to filter`}
              >
                <div className="flex items-center justify-between">
                  <PurdueBadge level={zone.purdueLevel} />
                  <span
                    className={`badge ${
                      isUnsegmented
                        ? 'badge-critical'
                        : isPartial
                        ? 'badge-high'
                        : 'badge-healthy'
                    }`}
                    style={{ fontSize: '0.64rem', padding: '1px 5px' }}
                  >
                    {isUnsegmented ? 'UNSEGMENTED' : isPartial ? 'PARTIAL ENFORCEMENT' : 'ENFORCED'}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {zone.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {zone.assetCount} Assets ({zone.criticalAssetCount} Crown Jewels)
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-top border-subtle" style={{ borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}>
                  <span className="flex items-center gap-1 text-secondary">
                    <ArrowRightLeft size={12} className="text-brand" />
                    <span>{zone.inboundFlows + zone.outboundFlows} Flows/min</span>
                  </span>
                  <span className="font-mono text-muted">
                    {zone.topProtocols.slice(0, 2).join(', ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
