import React from 'react';
import {
  BookOpen,
  X,
  CheckCircle2,
  Shield,
  Layers,
  Activity,
  AlertTriangle,
  Radio,
  Lock,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const DesignRationaleModal: React.FC = () => {
  const { isDesignRationaleOpen, setIsDesignRationaleOpen } = usePlatform();

  if (!isDesignRationaleOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsDesignRationaleOpen(false)}>
      <div
        className="modal-content"
        style={{ width: '880px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Design Rationale & Product Architecture Documentation"
      >
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-brand" aria-hidden="true" />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Product Design Rationale & Architectural Decisions
              </h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Industrial Cybersecurity Platform UX & Information Architecture
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsDesignRationaleOpen(false)}
            aria-label="Close Documentation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body flex flex-col gap-6" style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
          {/* Section 1 */}
          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 text-brand" style={{ fontSize: '0.98rem' }}>
              <Shield size={16} /> 1. Information Prioritization & Cognitive Hierarchy
            </h3>
            <p className="text-secondary">
              In high-stakes operational technology environments, critical decision-making must happen in seconds. The dashboard prioritizes <strong>Posture Index</strong>, <strong>Exposed Crown Jewels</strong>, and <strong>Active Attack Paths</strong> above the fold. Rather than presenting a flat grid of equivalent cards, primary business impact is surfaced immediately, while secondary distribution and telemetry metrics reside in interactive drill-downs.
            </p>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 text-brand" style={{ fontSize: '0.98rem' }}>
              <Layers size={16} /> 2. Multi-Persona Alignment (CISO, SOC, OT Analyst, Plant Operator)
            </h3>
            <ul className="text-secondary" style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong>CISO / Security Leadership:</strong> Posture Index KPI, crown jewel exposure metrics, 7-day risk velocity, and audit compliance status.
              </li>
              <li>
                <strong>SOC Analyst:</strong> Direct triage workflow (Acknowledge, Assign, Suppress), CVE mappings, and MITRE ATT&CK for ICS lateral movement sequences.
              </li>
              <li>
                <strong>OT Security Analyst:</strong> ISA/IEC 62443 Purdue Level zoning (L0–L4), protocol breakdowns (Modbus, S7Comm, CIP, OPC-UA), and SPAN/TAP sensor health.
              </li>
              <li>
                <strong>Plant / Shift Operator:</strong> Clear physical operational impacts (e.g. turbine shutdown hazards, $450k/hr downtime risks) described in plain language.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 text-brand" style={{ fontSize: '0.98rem' }}>
              <Activity size={16} /> 3. Preventing Attack-Path Visual Overload
            </h3>
            <p className="text-secondary">
              Graph visualizations often fail when rendering hundreds of equal nodes. We employ:
            </p>
            <ul className="text-secondary" style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Purdue Level Swimlanes:</strong> Physical structural zoning organizes nodes from enterprise L4 to field L1/L0.</li>
              <li><strong>Single-Path vs Multi-Path Modes:</strong> Allows the investigator to isolate the exact high-risk chain or view cross-system relationships.</li>
              <li><strong>Contextual Non-Modal Drawer:</strong> Selecting any node, edge, or path opens a detailed investigation panel without stripping the analyst of their graph position or zoom scale.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 text-brand" style={{ fontSize: '0.98rem' }}>
              <Radio size={16} /> 4. Handling Uncertainty: "No Issue Detected" vs "Data Degraded"
            </h3>
            <p className="text-secondary">
              A foundational UX tenet of industrial safety is that <strong>a lack of alerts must never be confused with safety when monitoring sensors are degraded</strong>. When SPAN packet loss occurs or sensors go offline, the UI surfaces a prominent Degraded Banner, tags affected conduits with dashed lines, and assigns explicit Confidence ratings (High, Medium, Low/Hypothesized).
            </p>
          </div>

          {/* Section 5 */}
          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 text-brand" style={{ fontSize: '0.98rem' }}>
              <Lock size={16} /> 5. Scalability & Architectural Assumptions
            </h3>
            <p className="text-secondary">
              The platform adheres to open industrial standards (ISA/IEC 62443, Purdue Enterprise Reference Architecture, and MITRE ATT&CK for ICS) without fabricating proprietary algorithms. All mock models reflect realistic OT assets, industrial protocols, and segmentation topologies.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsDesignRationaleOpen(false)}
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
