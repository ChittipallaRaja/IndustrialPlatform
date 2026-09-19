import React from 'react';
import {
  ArrowRightLeft,
  X,
  GitFork,
  ShieldAlert,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SeverityBadge, ConfidenceBadge } from '../common/Badges';

export const PathComparisonModal: React.FC = () => {
  const { isCompareOpen, setIsCompareOpen, attackPaths, setSelectedPath } = usePlatform();

  if (!isCompareOpen || attackPaths.length < 2) return null;

  const pathA = attackPaths[0];
  const pathB = attackPaths[1];

  return (
    <div className="modal-overlay" onClick={() => setIsCompareOpen(false)}>
      <div
        className="modal-content"
        style={{ width: '820px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Attack Path Side-by-Side Comparison"
      >
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={18} className="text-brand" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Attack Path Differential Analysis
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsCompareOpen(false)}
            aria-label="Close Comparison"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="grid grid-cols-2 gap-6">
            {/* Column 1: Path A */}
            <div className="flex flex-col gap-3 p-4" style={{ backgroundColor: 'var(--bg-surface-base)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-prominent)' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '0.74rem', color: 'var(--color-brand-primary)', fontWeight: 700 }}>
                  PATH A (PRIMARY THREAT)
                </span>
                <SeverityBadge severity={pathA.severity} />
              </div>

              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {pathA.title}
              </h3>

              <div className="key-value-grid">
                <span className="key-name">Risk Score:</span>
                <span className="key-value font-mono" style={{ color: 'var(--severity-critical-text)', fontWeight: 800 }}>
                  {pathA.riskScore}/100
                </span>

                <span className="key-name">Confidence:</span>
                <span className="key-value">
                  <ConfidenceBadge confidence={pathA.confidence} />
                </span>

                <span className="key-name">Entry Source:</span>
                <span className="key-value">{pathA.sourceAssetName}</span>

                <span className="key-name">Crown Jewel Target:</span>
                <span className="key-value" style={{ color: 'var(--severity-critical-text)', fontWeight: 700 }}>
                  {pathA.targetAssetName}
                </span>

                <span className="key-name">Path Length:</span>
                <span className="key-value">{pathA.pathLength} Hops ({pathA.pivotCount} Pivots)</span>

                <span className="key-name">Purdue Layers:</span>
                <span className="key-value">{pathA.zonesTraversed.join(' ➔ ')}</span>

                <span className="key-name">Protocols:</span>
                <span className="key-value font-mono">
                  {pathA.edges.map((e) => e.protocol).join(', ')}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm mt-2"
                onClick={() => {
                  setSelectedPath(pathA);
                  setIsCompareOpen(false);
                }}
              >
                <GitFork size={13} /> Select Path A in Graph
              </button>
            </div>

            {/* Column 2: Path B */}
            <div className="flex flex-col gap-3 p-4" style={{ backgroundColor: 'var(--bg-surface-base)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  PATH B (SECONDARY VECTOR)
                </span>
                <SeverityBadge severity={pathB.severity} />
              </div>

              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {pathB.title}
              </h3>

              <div className="key-value-grid">
                <span className="key-name">Risk Score:</span>
                <span className="key-value font-mono" style={{ color: 'var(--severity-high-text)', fontWeight: 800 }}>
                  {pathB.riskScore}/100
                </span>

                <span className="key-name">Confidence:</span>
                <span className="key-value">
                  <ConfidenceBadge confidence={pathB.confidence} />
                </span>

                <span className="key-name">Entry Source:</span>
                <span className="key-value">{pathB.sourceAssetName}</span>

                <span className="key-name">Crown Jewel Target:</span>
                <span className="key-value" style={{ color: 'var(--severity-critical-text)', fontWeight: 700 }}>
                  {pathB.targetAssetName}
                </span>

                <span className="key-name">Path Length:</span>
                <span className="key-value">{pathB.pathLength} Hops ({pathB.pivotCount} Pivots)</span>

                <span className="key-name">Purdue Layers:</span>
                <span className="key-value">{pathB.zonesTraversed.join(' ➔ ')}</span>

                <span className="key-name">Protocols:</span>
                <span className="key-value font-mono">
                  {pathB.edges.map((e) => e.protocol).join(', ')}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm mt-2"
                onClick={() => {
                  setSelectedPath(pathB);
                  setIsCompareOpen(false);
                }}
              >
                <GitFork size={13} /> Select Path B in Graph
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
