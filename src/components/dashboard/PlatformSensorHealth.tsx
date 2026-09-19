import React from 'react';
import {
  Radio,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const PlatformSensorHealth: React.FC = () => {
  const { sensors, simMode } = usePlatform();

  const isDegraded = sensors.some((s) => s.status === 'degraded');
  const avgCoverage = (
    sensors.reduce((acc, s) => acc + s.coveragePercentage, 0) / Math.max(1, sensors.length)
  ).toFixed(1);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <Radio size={16} className="text-brand" aria-hidden="true" />
          <h3 className="card-title">Telemetry Health & SPAN/TAP Data Integrity</h3>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Network Monitoring Coverage:
          </span>
          <span
            className={`badge ${
              Number(avgCoverage) > 90
                ? 'badge-healthy'
                : Number(avgCoverage) > 75
                ? 'badge-degraded'
                : 'badge-critical'
            }`}
            style={{ fontWeight: 700 }}
          >
            {avgCoverage}% COVERAGE
          </span>
        </div>
      </div>

      <div className="card-body flex flex-col gap-4">
        {/* Critical Distinction Banner: No Issue vs Incomplete Data */}
        {isDegraded ? (
          <div className="degraded-alert-banner" role="alert">
            <AlertTriangle size={18} className="text-degraded" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div className="flex flex-col">
              <span className="degraded-title">
                WARNING: Telemetry Coverage Is Currently Degraded (Lack of Alerts ≠ Lack of Threats)
              </span>
              <p className="degraded-text">
                One or more SPAN mirror collectors are experiencing packet buffer overruns ({avgCoverage}% aggregate coverage). 
                Lateral movement or Modbus writes traversing degraded segments may not be fully observed.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-between p-3"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid var(--state-healthy-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-healthy" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--state-healthy-text)' }}>
                Full Telemetry Coverage Active — Zero Missed Packets Across L0–L4
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Last packet received 2s ago
            </span>
          </div>
        )}

        {/* Sensor Grid */}
        <div className="grid grid-cols-4 lg-grid-cols-2 md-grid-cols-1 gap-4">
          {sensors.map((sensor) => {
            const isSensorDegraded = sensor.status === 'degraded';
            return (
              <div
                key={sensor.id}
                className="flex flex-col gap-3"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: isSensorDegraded ? '1px solid var(--state-degraded-border)' : '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 18px',
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                    {sensor.name}
                  </span>
                  <span
                    className={`badge ${
                      isSensorDegraded ? 'badge-degraded' : 'badge-healthy'
                    }`}
                    style={{ fontSize: '0.64rem', padding: '2px 6px' }}
                  >
                    {isSensorDegraded ? 'DEGRADED' : 'HEALTHY'}
                  </span>
                </div>

                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {sensor.location}
                </span>

                <div className="flex items-center justify-between pt-1 font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <span>{sensor.packetsPerSec.toLocaleString()} pps</span>
                  <span style={{ color: sensor.droppedPacketsRate > 5 ? 'var(--severity-critical-text)' : 'inherit', fontWeight: 600 }}>
                    {sensor.droppedPacketsRate}% drop
                  </span>
                </div>

                {sensor.notes && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--state-degraded-text)', fontStyle: 'italic', marginTop: '2px', lineHeight: 1.4 }}>
                    {sensor.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
