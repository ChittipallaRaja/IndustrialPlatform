import React from 'react';
import {
  Server,
  Layers,
  HelpCircle,
  AlertCircle,
  Cpu,
  Activity,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PurdueBadge, CriticalityBadge, StatusBadge } from '../common/Badges';

export const AssetVisibility: React.FC = () => {
  const { assets, setSelectedAsset, updateFilter } = usePlatform();

  const total = assets.length;
  const unknownCount = assets.filter((a) => a.visibility === 'unidentified').length;
  const crownJewelCount = assets.filter((a) => a.isCrownJewel).length;
  const degradedCount = assets.filter((a) => a.status === 'degraded' || a.status === 'offline').length;

  const purdueDistribution = {
    l4: assets.filter((a) => a.purdueLevel === 4).length,
    l35: assets.filter((a) => a.purdueLevel === 3.5).length,
    l3: assets.filter((a) => a.purdueLevel === 3).length,
    l2: assets.filter((a) => a.purdueLevel === 2).length,
    l1: assets.filter((a) => a.purdueLevel === 1).length,
    l0: assets.filter((a) => a.purdueLevel === 0).length,
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <Server size={16} className="text-brand" aria-hidden="true" />
          <h3 className="card-title">OT Asset Visibility & Inventory Completeness</h3>
        </div>
        <div className="flex items-center gap-2">
          {unknownCount > 0 && (
            <span className="badge badge-unknown">
              <HelpCircle size={10} /> {unknownCount} UNCLASSIFIED
            </span>
          )}
          {degradedCount > 0 && (
            <span className="badge badge-degraded">
              <AlertCircle size={10} /> {degradedCount} DEGRADED SIGHTINGS
            </span>
          )}
        </div>
      </div>

      <div className="card-body flex flex-col gap-6">
        {/* Purdue Level Distribution Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-muted">
            <span className="flex items-center gap-1 font-semibold">
              <Layers size={13} /> Purdue Model Architecture Segmentation
            </span>
            <span>Level 4 (Enterprise) ➔ Level 0 (Field Actuators)</span>
          </div>

          <div
            style={{
              height: '22px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              display: 'flex',
              backgroundColor: 'var(--bg-surface-highlight)',
              gap: '2px',
              margin: '6px 0 10px 0',
            }}
          >
            {([4, 3.5, 3, 2, 1, 0] as const).map((lvl) => {
              const count = assets.filter((a) => a.purdueLevel === lvl).length;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div
                  key={lvl}
                  style={{
                    width: `${pct}%`,
                    backgroundColor:
                      lvl === 4
                        ? 'rgba(99, 102, 241, 0.6)'
                        : lvl === 3.5
                        ? 'rgba(168, 85, 247, 0.6)'
                        : lvl === 3
                        ? 'rgba(14, 165, 233, 0.6)'
                        : lvl === 2
                        ? 'rgba(20, 184, 166, 0.6)'
                        : lvl === 1
                        ? 'rgba(245, 158, 11, 0.6)'
                        : 'rgba(239, 68, 68, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                  title={`Level ${lvl}: ${count} assets`}
                >
                  {count > 0 ? `L${lvl} (${count})` : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Asset Table */}
        <div className="data-table-wrapper">
          <table className="data-table" aria-label="Monitored OT Assets Table">
            <thead>
              <tr>
                <th>Asset Tag / Name</th>
                <th>Purdue Level</th>
                <th>Type & Role</th>
                <th>IP & MAC Address</th>
                <th>Vendor / Firmware</th>
                <th>Criticality</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedAsset(asset)}
                  aria-label={`Inspect asset ${asset.tag}`}
                >
                  <td>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                          {asset.tag}
                        </span>
                        {asset.isCrownJewel && (
                          <span className="badge badge-critical" style={{ fontSize: '0.62rem', padding: '0 4px' }}>
                            CROWN JEWEL
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {asset.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <PurdueBadge level={asset.purdueLevel} />
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                        {asset.role}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Protocols: {asset.protocols.join(', ')}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col font-mono" style={{ fontSize: '0.74rem' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{asset.ipAddress}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{asset.macAddress}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col" style={{ fontSize: '0.74rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{asset.vendor}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{asset.firmware}</span>
                    </div>
                  </td>
                  <td>
                    <CriticalityBadge criticality={asset.criticality} />
                  </td>
                  <td>
                    <StatusBadge status={asset.status} />
                  </td>
                  <td>
                    <ChevronRight size={15} className="text-muted" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
