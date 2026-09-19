import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  accentType?: 'critical' | 'warning' | 'healthy' | 'brand';
  onClick?: () => void;
  drilldownHint?: string;
  testId?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  accentType = 'brand',
  onClick,
  drilldownHint = 'Click to drill down',
  testId,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <button
      type="button"
      className={`kpi-card ${isClickable ? 'clickable' : ''}`}
      onClick={onClick}
      aria-label={`${label}: ${value}. ${subtext}. ${isClickable ? drilldownHint : ''}`}
      data-testid={testId}
    >
      <div className={`kpi-accent-bar ${accentType}`} />
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        <Icon size={18} className={`text-muted ${accentType === 'critical' ? 'text-brand' : ''}`} aria-hidden="true" />
      </div>

      <div className="kpi-value-row">
        <span className="kpi-value">{value}</span>
      </div>

      <div className="kpi-subtext">
        <span>{subtext}</span>
        {isClickable && (
          <ArrowUpRight size={13} className="text-brand ml-auto" aria-hidden="true" />
        )}
      </div>
    </button>
  );
};
