import React from 'react';
import {
  AlertTriangle,
  TrendingUp,
  MapPin,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SeverityBadge, PurdueBadge } from '../common/Badges';

export const RiskFindings: React.FC = () => {
  const { findings, setSelectedFinding, updateFilter, filters } = usePlatform();

  const severityCounts = {
    critical: findings.filter((f) => f.severity === 'critical').length,
    high: findings.filter((f) => f.severity === 'high').length,
    medium: findings.filter((f) => f.severity === 'medium').length,
    low: findings.filter((f) => f.severity === 'low').length,
  };

  const total = Math.max(1, findings.length);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column: Severity Distribution & Trends */}
      <div className="card" style={{ gridColumn: 'span 5' }}>
        <div className="card-header">
          <div className="card-title-group">
            <AlertTriangle size={16} className="text-brand" aria-hidden="true" />
            <h3 className="card-title">Risk & Severity Breakdown</h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Total: {findings.length} findings
          </span>
        </div>

        <div className="card-body flex flex-col gap-5">
          {/* Interactive Severity Stacked Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-muted">
              <span>Severity Distribution</span>
              <span>Click segment to filter</span>
            </div>

            <div
              style={{
                height: '14px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                display: 'flex',
                backgroundColor: 'var(--bg-surface-highlight)',
              }}
              role="group"
              aria-label="Severity distribution bar"
            >
              <div
                style={{
                  width: `${(severityCounts.critical / total) * 100}%`,
                  backgroundColor: 'var(--severity-critical)',
                  cursor: 'pointer',
                }}
                title={`Critical: ${severityCounts.critical}`}
                onClick={() => updateFilter('severity', 'critical')}
              />
              <div
                style={{
                  width: `${(severityCounts.high / total) * 100}%`,
                  backgroundColor: 'var(--severity-high)',
                  cursor: 'pointer',
                }}
                title={`High: ${severityCounts.high}`}
                onClick={() => updateFilter('severity', 'high')}
              />
              <div
                style={{
                  width: `${(severityCounts.medium / total) * 100}%`,
                  backgroundColor: 'var(--severity-medium)',
                  cursor: 'pointer',
                }}
                title={`Medium: ${severityCounts.medium}`}
                onClick={() => updateFilter('severity', 'medium')}
              />
              <div
                style={{
                  width: `${(severityCounts.low / total) * 100}%`,
                  backgroundColor: 'var(--severity-low)',
                  cursor: 'pointer',
                }}
                title={`Low: ${severityCounts.low}`}
                onClick={() => updateFilter('severity', 'low')}
              />
            </div>

            {/* Severity Legend Grid */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm flex justify-between items-center"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: filters.severity === 'critical' ? '1px solid var(--severity-critical)' : '1px solid var(--border-default)',
                }}
                onClick={() => updateFilter('severity', 'critical')}
              >
                <div className="flex items-center gap-2">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--severity-critical)' }} />
                  <span style={{ fontSize: '0.74rem' }}>Critical</span>
                </div>
                <span className="font-mono font-bold" style={{ color: 'var(--severity-critical-text)' }}>
                  {severityCounts.critical}
                </span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm flex justify-between items-center"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: filters.severity === 'high' ? '1px solid var(--severity-high)' : '1px solid var(--border-default)',
                }}
                onClick={() => updateFilter('severity', 'high')}
              >
                <div className="flex items-center gap-2">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--severity-high)' }} />
                  <span style={{ fontSize: '0.74rem' }}>High</span>
                </div>
                <span className="font-mono font-bold" style={{ color: 'var(--severity-high-text)' }}>
                  {severityCounts.high}
                </span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm flex justify-between items-center"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: filters.severity === 'medium' ? '1px solid var(--severity-medium)' : '1px solid var(--border-default)',
                }}
                onClick={() => updateFilter('severity', 'medium')}
              >
                <div className="flex items-center gap-2">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--severity-medium)' }} />
                  <span style={{ fontSize: '0.74rem' }}>Medium</span>
                </div>
                <span className="font-mono font-bold" style={{ color: 'var(--severity-medium-text)' }}>
                  {severityCounts.medium}
                </span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm flex justify-between items-center"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: filters.severity === 'low' ? '1px solid var(--severity-low)' : '1px solid var(--border-default)',
                }}
                onClick={() => updateFilter('severity', 'low')}
              >
                <div className="flex items-center gap-2">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--severity-low)' }} />
                  <span style={{ fontSize: '0.74rem' }}>Low / Info</span>
                </div>
                <span className="font-mono font-bold" style={{ color: 'var(--severity-low-text)' }}>
                  {severityCounts.low}
                </span>
              </button>
            </div>
          </div>

          {/* Risk Velocity & Affected Zones */}
          <div className="flex flex-col gap-2 pt-2 border-top border-subtle" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-between">
              <span className="detail-section-title" style={{ border: 'none', padding: 0 }}>
                <TrendingUp size={13} /> 7-Day Risk Velocity
              </span>
              <span className="badge badge-high">+14% Elevated</span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Cross-zone protocol anomalies elevated risk in <strong>Turbine Train A (L1/L2)</strong> following unauthorized Modbus write operations.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Major Active Unresolved Findings List */}
      <div className="card" style={{ gridColumn: 'span 7' }}>
        <div className="card-header">
          <div className="card-title-group">
            <Shield size={16} className="text-brand" aria-hidden="true" />
            <h3 className="card-title">Major Unresolved Security Findings</h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Click finding for evidence & mitigation
          </span>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {findings.length === 0 ? (
            <div className="p-6 text-center text-muted">
              No findings match the current filter selection.
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table" aria-label="Security Findings Table">
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Finding Title</th>
                    <th>Asset Target</th>
                    <th>Purdue Zone</th>
                    <th>Risk</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {findings.map((finding) => (
                    <tr
                      key={finding.id}
                      onClick={() => setSelectedFinding(finding)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedFinding(finding)}
                      aria-label={`Inspect finding ${finding.title}`}
                    >
                      <td>
                        <SeverityBadge severity={finding.severity} />
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>
                            {finding.title}
                          </span>
                          {finding.cveId && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {finding.cveId}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                          {finding.assetName}
                        </span>
                      </td>
                      <td>
                        <PurdueBadge level={finding.purdueLevel} />
                      </td>
                      <td>
                        <span className="font-mono font-bold" style={{ color: finding.riskScore > 80 ? 'var(--severity-critical-text)' : 'var(--text-primary)' }}>
                          {finding.riskScore}/100
                        </span>
                      </td>
                      <td>
                        <ChevronRight size={15} className="text-muted" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
