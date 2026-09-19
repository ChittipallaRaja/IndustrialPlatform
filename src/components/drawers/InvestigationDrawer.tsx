import React, { useState } from 'react';
import {
  X,
  Shield,
  AlertTriangle,
  Server,
  Network,
  Cpu,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Radio,
  FileCode,
  Terminal,
  Activity,
  Layers,
  Lock,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import {
  SeverityBadge,
  CriticalityBadge,
  PurdueBadge,
  StatusBadge,
  ConfidenceBadge,
} from '../common/Badges';

export const InvestigationDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    selectedNode,
    selectedEdge,
    selectedFinding,
    selectedAsset,
    selectedPath,
    setBlastRadiusTargetId,
    executeTriageAction,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'remediation'>('overview');

  if (!isDrawerOpen) return null;

  const targetTitle = selectedNode
    ? selectedNode.name
    : selectedEdge
    ? `${selectedEdge.protocol} (${selectedEdge.service})`
    : selectedFinding
    ? selectedFinding.title
    : selectedAsset
    ? selectedAsset.tag
    : selectedPath?.title || 'Investigation Target';

  return (
    <>
      {/* Semi-transparent drawer panel on the right that keeps the graph and dashboard visible */}
      <div
        className="drawer-panel"
        role="dialog"
        aria-modal="false"
        aria-label="Investigation Context Panel"
      >
        <div className="drawer-header">
          <div className="flex items-center gap-2">
            {selectedNode && <Server size={18} className="text-brand" />}
            {selectedEdge && <Network size={18} className="text-brand" />}
            {selectedFinding && <AlertTriangle size={18} className="text-critical" />}
            {selectedAsset && <Cpu size={18} className="text-brand" />}
            {!selectedNode && !selectedEdge && !selectedFinding && !selectedAsset && selectedPath && (
              <Shield size={18} className="text-brand" />
            )}

            <div className="flex flex-col">
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {selectedNode
                  ? 'Node Context Analysis'
                  : selectedEdge
                  ? 'Edge / Relationship Analysis'
                  : selectedFinding
                  ? 'Vulnerability & Finding Context'
                  : selectedAsset
                  ? 'Asset Telemetry Detail'
                  : 'Attack Path Investigation'}
              </span>
              <h2
                style={{
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  maxWidth: '380px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={targetTitle}
              >
                {targetTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', borderRadius: 'var(--radius-md)' }}
            onClick={closeDrawer}
            aria-label="Close Investigation Drawer"
            title="Close Drawer (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className="flex items-center gap-2 px-5 pt-3 pb-2 border-bottom border-subtle"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-base)',
          }}
          role="tablist"
        >
          <button
            type="button"
            className={`time-pill-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            role="tab"
            aria-selected={activeTab === 'overview'}
          >
            Overview & Role
          </button>
          <button
            type="button"
            className={`time-pill-btn ${activeTab === 'evidence' ? 'active' : ''}`}
            onClick={() => setActiveTab('evidence')}
            role="tab"
            aria-selected={activeTab === 'evidence'}
          >
            Technical Evidence
          </button>
          <button
            type="button"
            className={`time-pill-btn ${activeTab === 'remediation' ? 'active' : ''}`}
            onClick={() => setActiveTab('remediation')}
            role="tab"
            aria-selected={activeTab === 'remediation'}
          >
            Mitigation Actions
          </button>
        </div>

        <div className="drawer-body">
          {/* TAB 1: OVERVIEW & ROLE */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-5">
              {/* 1. NODE DETAILS */}
              {selectedNode && (
                <>
                  <div className="flex items-center justify-between">
                    <PurdueBadge level={selectedNode.purdueLevel} />
                    <CriticalityBadge criticality={selectedNode.criticality} />
                    <StatusBadge status={selectedNode.status} />
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <Server size={12} /> Asset Metadata & Purdue Zone
                    </span>
                    <div className="key-value-grid">
                      <span className="key-name">Asset Tag:</span>
                      <span className="key-value font-mono font-bold">{selectedNode.tag}</span>

                      <span className="key-name">Graph Role:</span>
                      <span
                        className="key-value font-bold"
                        style={{
                          textTransform: 'uppercase',
                          color: 'var(--color-brand-primary)',
                        }}
                      >
                        {selectedNode.role} ({selectedNode.operationalRole})
                      </span>

                      <span className="key-name">Purdue Zone:</span>
                      <span className="key-value">{selectedNode.zone}</span>

                      <span className="key-name">Risk Score:</span>
                      <span
                        className="key-value font-mono"
                        style={{
                          color:
                            selectedNode.riskScore > 80
                              ? 'var(--severity-critical-text)'
                              : 'inherit',
                          fontWeight: 700,
                        }}
                      >
                        {selectedNode.riskScore}/100
                      </span>

                      <span className="key-name">Confidence:</span>
                      <span className="key-value">
                        <ConfidenceBadge confidence={selectedNode.confidence} />
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setBlastRadiusTargetId(selectedNode.assetId)}
                  >
                    <Radio size={14} className="text-brand" />
                    <span>Calculate Downstream Blast Radius from this Node</span>
                  </button>
                </>
              )}

              {/* 2. ASSET DETAILS (When clicked from inventory or search) */}
              {selectedAsset && !selectedNode && (
                <>
                  <div className="flex items-center justify-between">
                    <PurdueBadge level={selectedAsset.purdueLevel} />
                    <CriticalityBadge criticality={selectedAsset.criticality} />
                    <StatusBadge status={selectedAsset.status} />
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <Cpu size={12} /> Industrial Asset Specifications
                    </span>
                    <div className="key-value-grid">
                      <span className="key-name">Asset Tag / ID:</span>
                      <span className="key-value font-mono font-bold">{selectedAsset.tag}</span>

                      <span className="key-name">Asset Name:</span>
                      <span className="key-value">{selectedAsset.name}</span>

                      <span className="key-name">Operational Role:</span>
                      <span className="key-value">{selectedAsset.role}</span>

                      <span className="key-name">IP Address:</span>
                      <span className="key-value font-mono">{selectedAsset.ipAddress}</span>

                      <span className="key-name">MAC Address:</span>
                      <span className="key-value font-mono">{selectedAsset.macAddress}</span>

                      <span className="key-name">Hardware / OS:</span>
                      <span className="key-value">{selectedAsset.vendor} ({selectedAsset.model})</span>

                      <span className="key-name">Firmware Build:</span>
                      <span className="key-value font-mono">{selectedAsset.firmware}</span>

                      <span className="key-name">Protocols:</span>
                      <span className="key-value font-mono">{selectedAsset.protocols.join(', ')}</span>

                      <span className="key-name">System Owner:</span>
                      <span className="key-value">{selectedAsset.owner}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <Shield size={12} /> Operational Impact
                    </span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {selectedAsset.operationalImpact}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setBlastRadiusTargetId(selectedAsset.id)}
                  >
                    <Radio size={14} className="text-brand" />
                    <span>Calculate Downstream Blast Radius</span>
                  </button>
                </>
              )}

              {/* 3. EDGE DETAILS */}
              {selectedEdge && (
                <>
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={selectedEdge.riskContribution} />
                    <ConfidenceBadge confidence={selectedEdge.confidence} />
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <Network size={12} /> Conduit & Protocol Telemetry
                    </span>
                    <div className="key-value-grid">
                      <span className="key-name">Protocol / Service:</span>
                      <span className="key-value font-mono font-bold">
                        {selectedEdge.protocol} ({selectedEdge.service})
                      </span>

                      <span className="key-name">Destination Port:</span>
                      <span className="key-value font-mono">{selectedEdge.port}</span>

                      <span className="key-name">Relationship Type:</span>
                      <span className="key-value font-bold">
                        {selectedEdge.relationshipType.replace('_', ' ').toUpperCase()}
                      </span>

                      <span className="key-name">24h Flow Volume:</span>
                      <span className="key-value font-mono">
                        {selectedEdge.packetCount24h?.toLocaleString() || '1,240'} packets
                      </span>

                      <span className="key-name">Suspicious Flag:</span>
                      <span
                        className="key-value"
                        style={{
                          color: selectedEdge.isSuspicious
                            ? 'var(--severity-critical-text)'
                            : 'var(--state-healthy-text)',
                          fontWeight: 700,
                        }}
                      >
                        {selectedEdge.isSuspicious
                          ? 'YES — ANOMALOUS CONDUIT'
                          : 'NO — AUTHORIZED BASELINE'}
                      </span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <AlertTriangle size={12} /> Why This Conduit Contributes to Lateral Movement
                    </span>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                      }}
                    >
                      {selectedEdge.reason}
                    </p>
                  </div>
                </>
              )}

              {/* 4. FINDING DETAILS */}
              {selectedFinding && (
                <>
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={selectedFinding.severity} />
                    <PurdueBadge level={selectedFinding.purdueLevel} />
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <AlertTriangle size={12} /> Vulnerability & Operational Risk
                    </span>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.4,
                      }}
                    >
                      {selectedFinding.description}
                    </p>
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <Shield size={12} /> Operational Impact
                    </span>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                      }}
                    >
                      {selectedFinding.operationalImpact}
                    </p>
                  </div>

                  {selectedFinding.mitreTechnique && (
                    <div className="detail-section">
                      <span className="detail-section-title">
                        <Terminal size={12} /> MITRE ATT&CK for ICS
                      </span>
                      <div className="key-value-grid">
                        <span className="key-name">Tactic:</span>
                        <span className="key-value font-bold">{selectedFinding.mitreTactic}</span>
                        <span className="key-name">Technique:</span>
                        <span className="key-value font-mono font-bold">
                          {selectedFinding.mitreTechnique}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* 5. PATH DETAILS */}
              {!selectedNode && !selectedEdge && !selectedFinding && !selectedAsset && selectedPath && (
                <>
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={selectedPath.severity} />
                    <ConfidenceBadge confidence={selectedPath.confidence} />
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <Shield size={12} /> Path Summary
                    </span>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                      }}
                    >
                      {selectedPath.summary}
                    </p>
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <AlertTriangle size={12} /> Why It Matters
                    </span>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                      }}
                    >
                      {selectedPath.whyItMatters}
                    </p>
                  </div>

                  <div className="detail-section">
                    <span className="detail-section-title">
                      <Activity size={12} /> Lateral Movement Hop Sequence
                    </span>
                    <div className="flex flex-col gap-2">
                      {selectedPath.mitreSequence.map((seq) => (
                        <div
                          key={seq.step}
                          className="p-2"
                          style={{
                            backgroundColor: 'var(--bg-surface-base)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-default)',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                color: 'var(--color-brand-primary)',
                              }}
                            >
                              Step {seq.step}: {seq.tactic}
                            </span>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                fontFamily: 'var(--font-mono)',
                              }}
                            >
                              {seq.technique}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: '0.74rem',
                              color: 'var(--text-secondary)',
                              marginTop: '2px',
                            }}
                          >
                            {seq.description} ({seq.asset})
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: TECHNICAL EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="flex flex-col gap-4">
              <span className="detail-section-title">
                <FileCode size={12} /> Telemetry & Packet Captures
              </span>

              {selectedFinding?.evidence ? (
                selectedFinding.evidence.map((ev, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {ev.type} ({ev.timestamp})
                    </span>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      {ev.details}
                    </p>
                    {ev.observedValue && (
                      <div className="evidence-box">
                        [OBSERVED TELEMETRY]: {ev.observedValue}
                        {'\n'}[EXPECTED BASELINE]: {ev.expectedValue}
                      </div>
                    )}
                  </div>
                ))
              ) : selectedEdge?.evidence ? (
                <div className="evidence-box">{selectedEdge.evidence.join('\n')}</div>
              ) : (
                <div className="evidence-box">
                  {`[PCAP TELEMETRY STREAM]
Timestamp: 2026-09-18 16:42:10.892 UTC
Src: 192.168.100.15:48922 -> Dst: 172.20.100.204:502
Protocol: MODBUS-TCP (0x0000 0x0000 0x0006 0x01 0x10 0x9C58 0x0008)
Status: UNAUTHENTICATED_WRITE_HOLDING_REGISTER`}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MITIGATION ACTIONS */}
          {activeTab === 'remediation' && (
            <div className="flex flex-col gap-4">
              <span className="detail-section-title">
                <ShieldCheck size={12} /> Recommended Security Mitigations
              </span>

              <ul
                style={{
                  paddingLeft: '20px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {(
                  selectedFinding?.mitigationSteps ||
                  selectedPath?.recommendedActions || [
                    'Enforce Modbus TCP Access Control List on destination controller.',
                    'Isolate dual-homed jump host and revoke active engineering sessions.',
                    'Verify PLC key switch status is in PHYSICAL RUN mode.',
                  ]
                ).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              executeTriageAction(
                'finding',
                selectedFinding?.id || 'target-01',
                targetTitle,
                'suppressed',
                'Suppressed per operator change window'
              );
              closeDrawer();
            }}
          >
            Suppress
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              executeTriageAction(
                'finding',
                selectedFinding?.id || 'target-01',
                targetTitle,
                'assigned',
                'Assigned to Lead Controls Engineer'
              );
              closeDrawer();
            }}
          >
            <UserCheck size={13} /> Assign
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              executeTriageAction(
                'finding',
                selectedFinding?.id || 'target-01',
                targetTitle,
                'acknowledged',
                'Acknowledged by Shift Operator'
              );
              closeDrawer();
            }}
          >
            <CheckCircle2 size={13} /> Acknowledge
          </button>
        </div>
      </div>
    </>
  );
};
