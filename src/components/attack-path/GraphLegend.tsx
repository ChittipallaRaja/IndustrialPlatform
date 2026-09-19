import React from 'react';
import {
  ShieldAlert,
  Flame,
  Radio,
  ArrowRight,
  HelpCircle,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export const GraphLegend: React.FC = () => {
  return (
    <div className="graph-legend-box" role="region" aria-label="Graph Visual Semantics Legend">
      <span className="legend-title">Attack Graph Visual Semantics</span>

      <div className="legend-items-grid">
        {/* Node Roles */}
        <div className="legend-item">
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', border: '1.5px solid #38bdf8', backgroundColor: '#141720' }} />
          <span>Source Entry Point (L4)</span>
        </div>

        <div className="legend-item">
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', border: '1.5px solid var(--border-prominent)', backgroundColor: '#141720' }} />
          <span>Intermediate Pivot Asset</span>
        </div>

        <div className="legend-item">
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid var(--severity-critical)', backgroundColor: '#141720' }} />
          <span>Crown Jewel Target (L1)</span>
        </div>

        {/* Edge Types */}
        <div className="legend-item">
          <span style={{ width: '16px', height: '2px', backgroundColor: 'var(--color-brand-primary)' }} />
          <span>Active Lateral Conduit</span>
        </div>

        <div className="legend-item">
          <span style={{ width: '16px', height: '2px', borderTop: '2px dashed #818cf8' }} />
          <span>Hypothesized / Uncertain Link</span>
        </div>

        <div className="legend-item">
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', border: '1.5px solid #eab308', backgroundColor: 'rgba(234, 179, 8, 0.2)' }} />
          <span>Blast Radius Reachable</span>
        </div>
      </div>
    </div>
  );
};
