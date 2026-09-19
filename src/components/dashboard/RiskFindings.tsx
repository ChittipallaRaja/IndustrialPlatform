import React from 'react';
import {
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Shield,
  Layers,
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
    <div className="grid grid-cols-12 gap-6 risk-findings-grid">
      {/* Left Column: Severity Distribution & Trends */}
      <div className="card risk-severity-card">
        <div className="card-header">
          <div className="card-title-group">
            <AlertTriangle size={18} className="text-brand" aria-hidden="true" />
            <h3 className="card-title">Risk & Severity Breakdown</h3>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Total: {findings.length} findings
          </span>
        </div>

        <div className="card-body flex flex-col gap-6" style={{ padding: '28px' }}>
          {/* Interactive Severity Stacked Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs text-muted">
              <span style={{ fontWeight: 600 }}>Severity Distribution</span>
              <span style={{ fontSize: '0.74rem' }}>Click segment to filter</span>
            </div>

            <div
              style={{
                height: '22px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                display: 'flex',
                backgroundColor: 'var(--bg-surface-highlight)',
                margin: '8px 0 10px 0',
              }}
              role="group"
              aria-label="Severity distribution bar"
            >
              <div
                style={{
                  width: `${(severityCounts.critical / total) * 100}%`,
                  backgroundColor: 'var(--severity-critical)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                title={`Critical: ${severityCounts.critical}`}
                onClick={() => updateFilter('severity', 'critical')}
              />
              <div
                style={{
                  width: `${(severityCounts.high / total) * 100}%`,
                  backgroundColor: 'var(--severity-high)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                title={`High: ${severityCounts.high}`}
                onClick={() => updateFilter('severity', 'high')}
              />
              <div
                style={{
                  width: `${(severityCounts.medium / total) * 100}%`,
                  backgroundColor: 'var(--severity-medium)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                title={`Medium: ${severityCounts.medium}`}
                onClick={() => updateFilter('severity', 'medium')}
              />
              <div
                style={{
                  width: `${(severityCounts.low / total) * 100}%`,
                  backgroundColor: 'var(--severity-low)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                title={`Low: ${severityCounts.low}`}
                onClick={() => updateFilter('severity', 'low')}
              />
            </div>

            {/* Severity Legend Grid */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm flex justify-between items-center"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: filters.severity === 'critical' ? '1.5px solid var(--severity-critical)' : '1px solid var(--border-default)',
                  padding: '12px 16px',
                }}
                onClick={() => updateFilter('severity', 'critical')}
              >
                <div className="flex items-center gap-2">
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--severity-critical)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Critical</span>
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
                  border: filters.severity === 'high' ? '1.5px solid var(--severity-high)' : '1px solid var(--border-default)',
                  padding: '12px 16px',
                }}
                onClick={() => updateFilter('severity', 'high')}
              >
                <div className="flex items-center gap-2">
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--severity-high)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>High</span>
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
                  border: filters.severity === 'medium' ? '1.5px solid var(--severity-medium)' : '1px solid var(--border-default)',
                  padding: '12px 16px',
                }}
                onClick={() => updateFilter('severity', 'medium')}
              >
                <div className="flex items-center gap-2">
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--severity-medium)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Medium</span>
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
                  border: filters.severity === 'low' ? '1.5px solid var(--severity-low)' : '1px solid var(--border-default)',
                  padding: '12px 16px',
                }}
                onClick={() => updateFilter('severity', 'low')}
              >
                <div className="flex items-center gap-2">
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--severity-low)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Low / Info</span>
                </div>
                <span className="font-mono font-bold" style={{ color: 'var(--severity-low-text)' }}>
                  {severityCounts.low}
                </span>
              </button>
            </div>
          </div>

          {/* Risk Velocity & Affected Zones */}
          <div
            className="flex flex-col gap-2"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              padding: '18px 20px',
              marginTop: '4px',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="detail-section-title" style={{ border: 'none', padding: 0 }}>
                <TrendingUp size={14} /> 7-Day Risk Velocity
              </span>
              <span className="badge badge-high">+14% Elevated</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '2px' }}>
              Cross-zone protocol anomalies elevated risk in <strong>Turbine Train A (L1/L2)</strong> following unauthorized Modbus write operations.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Major Active Unresolved Findings List */}
      <div className="card risk-findings-card">
        <div className="card-header">
          <div className="card-title-group">
            <Shield size={18} className="text-brand" aria-hidden="true" />
            <h3 className="card-title">Major Unresolved Security Findings</h3>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Click finding for evidence & mitigation
          </span>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {findings.length === 0 ? (
            <div className="p-8 text-center text-muted">
              No findings match the current filter selection.
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table" aria-label="Security Findings Table">
                <thead>
                  <tr>
                    <th style={{ width: '130px', padding: '14px 20px' }}>Severity</th>
                    <th style={{ minWidth: '280px', padding: '14px 20px' }}>Finding Title</th>
                    <th style={{ minWidth: '150px', padding: '14px 20px' }}>Asset Target</th>
                    <th style={{ width: '130px', padding: '14px 20px' }}>Purdue Zone</th>
                    <th style={{ width: '100px', padding: '14px 20px' }}>Risk</th>
                    <th style={{ width: '50px', padding: '14px 20px' }}>Action</th>
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
                      <td style={{ padding: '16px 20px' }}>
                        <SeverityBadge severity={finding.severity} />
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div className="flex flex-col gap-1">
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.86rem', lineHeight: 1.45 }}>
                            {finding.title}
                          </span>
                          {finding.cveId && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {finding.cveId}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                          {finding.assetName}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <PurdueBadge level={finding.purdueLevel} />
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className="font-mono font-bold" style={{ color: finding.riskScore > 80 ? 'var(--severity-critical-text)' : 'var(--text-primary)', fontSize: '0.88rem' }}>
                          {finding.riskScore}/100
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <ChevronRight size={16} className="text-muted" />
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
