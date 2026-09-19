import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  HelpCircle,
  Shield,
  Activity,
} from 'lucide-react';
import { SeverityLevel, CriticalityLevel, AssetStatus, ConfidenceLevel, PurdueLevel } from '../../types';

export const SeverityBadge: React.FC<{ severity: SeverityLevel; showIcon?: boolean }> = ({
  severity,
  showIcon = true,
}) => {
  const config = {
    critical: { label: 'CRITICAL', icon: AlertOctagon, className: 'badge-critical' },
    high: { label: 'HIGH', icon: AlertTriangle, className: 'badge-high' },
    medium: { label: 'MEDIUM', icon: AlertCircle, className: 'badge-medium' },
    low: { label: 'LOW', icon: Info, className: 'badge-low' },
    info: { label: 'INFO', icon: Info, className: 'badge-info' },
  }[severity] || { label: severity.toUpperCase(), icon: Info, className: 'badge-info' };

  const IconComp = config.icon;

  return (
    <span className={`badge ${config.className}`} role="status" aria-label={`Severity ${config.label}`}>
      {showIcon && <IconComp size={12} strokeWidth={2.5} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};

export const CriticalityBadge: React.FC<{ criticality: CriticalityLevel }> = ({ criticality }) => {
  const config = {
    critical: { label: 'CRIT CROWN-JEWEL', className: 'badge-critical' },
    high: { label: 'HIGH CRITICAL', className: 'badge-high' },
    medium: { label: 'MED CRITICAL', className: 'badge-medium' },
    low: { label: 'LOW CRITICAL', className: 'badge-low' },
  }[criticality] || { label: criticality.toUpperCase(), className: 'badge-low' };

  return (
    <span className={`badge ${config.className}`} role="status" aria-label={`Asset Criticality ${config.label}`}>
      <Shield size={11} strokeWidth={2.5} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
  const config = {
    online: { label: 'ONLINE', icon: CheckCircle2, className: 'badge-healthy' },
    healthy: { label: 'HEALTHY', icon: CheckCircle2, className: 'badge-healthy' },
    degraded: { label: 'DEGRADED', icon: AlertTriangle, className: 'badge-degraded' },
    unknown: { label: 'UNKNOWN', icon: HelpCircle, className: 'badge-unknown' },
    offline: { label: 'OFFLINE', icon: Activity, className: 'badge-offline' },
    maintenance: { label: 'MAINTENANCE', icon: Activity, className: 'badge-info' },
  }[status] || { label: status.toUpperCase(), icon: HelpCircle, className: 'badge-unknown' };

  const IconComp = config.icon;

  return (
    <span className={`badge ${config.className}`} role="status" aria-label={`Status ${config.label}`}>
      <IconComp size={11} strokeWidth={2.5} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export const PurdueBadge: React.FC<{ level: PurdueLevel }> = ({ level }) => {
  const levelClassMap: Record<number, string> = {
    4: 'badge-purdue-l4',
    3.5: 'badge-purdue-l35',
    3: 'badge-purdue-l3',
    2: 'badge-purdue-l2',
    1: 'badge-purdue-l1',
    0: 'badge-purdue-l0',
  };

  const levelLabelMap: Record<number, string> = {
    4: 'L4 Enterprise IT',
    3.5: 'L3.5 DMZ',
    3: 'L3 Operations',
    2: 'L2 Supervisory',
    1: 'L1 Control PAC',
    0: 'L0 Field I/O',
  };

  const className = levelClassMap[level] || 'badge-purdue-l3';
  const label = levelLabelMap[level] || `L${level}`;

  return (
    <span className={`badge badge-purdue ${className}`} aria-label={`Purdue Model ${label}`}>
      {label}
    </span>
  );
};

export const ConfidenceBadge: React.FC<{ confidence: ConfidenceLevel }> = ({ confidence }) => {
  const config = {
    high: { label: 'CONFIDENCE: HIGH', className: 'badge-healthy' },
    medium: { label: 'CONFIDENCE: MED', className: 'badge-degraded' },
    low: { label: 'CONFIDENCE: LOW (UNCERTAIN)', className: 'badge-unknown' },
    unknown: { label: 'CONFIDENCE: UNKNOWN', className: 'badge-offline' },
  }[confidence] || { label: `CONFIDENCE: ${confidence}`, className: 'badge-unknown' };

  return (
    <span className={`badge ${config.className}`} role="status" aria-label={config.label}>
      <HelpCircle size={10} strokeWidth={2} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
