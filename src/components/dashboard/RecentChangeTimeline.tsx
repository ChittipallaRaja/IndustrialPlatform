import React from 'react';
import {
  Clock,
  Radio,
  PlusCircle,
  AlertTriangle,
  FileCode,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SeverityBadge } from '../common/Badges';
import { TimelineEvent } from '../../types';

export const RecentChangeTimeline: React.FC = () => {
  const { timeline, setSelectedFinding, setSelectedAsset, findings, assets } = usePlatform();

  const handleEventClick = (event: TimelineEvent) => {
    if (event.assetId) {
      const matchAsset = assets.find((a) => a.id === event.assetId);
      if (matchAsset) {
        setSelectedAsset(matchAsset);
        return;
      }
    }
    if (findings.length > 0) {
      setSelectedFinding(findings[0]);
    }
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'risk_elevated':
      case 'new_finding':
        return <AlertTriangle size={12} className="text-brand" />;
      case 'new_asset':
        return <PlusCircle size={12} className="text-healthy" />;
      case 'sensor_degraded':
        return <Radio size={12} className="text-degraded" />;
      case 'operator_action':
      case 'firmware_change':
        return <UserCheck size={12} className="text-secondary" />;
      default:
        return <FileCode size={12} className="text-muted" />;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <Clock size={16} className="text-brand" aria-hidden="true" />
          <h3 className="card-title">Recent Operational & Security Timeline</h3>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Audit Trail & Telemetry Alerts
        </span>
      </div>

      <div className="card-body">
        {timeline.length === 0 ? (
          <div className="p-6 text-center text-muted">
            No recent events recorded in this time range.
          </div>
        ) : (
          <div className="timeline-list">
            {timeline.map((event) => (
              <div
                key={event.id}
                className="timeline-item"
                onClick={() => handleEventClick(event)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleEventClick(event)}
                aria-label={`Audit event ${event.title}`}
              >
                <div className="timeline-node-icon">
                  {getEventIcon(event.type)}
                </div>

                <div className="timeline-content">
                  <div className="timeline-header">
                    <div className="flex items-center gap-2">
                      <span className="timeline-title">{event.title}</span>
                      <SeverityBadge severity={event.severity} />
                    </div>
                    <span className="timeline-time">{event.timestamp}</span>
                  </div>

                  <p className="timeline-desc">{event.description}</p>

                  <div className="flex items-center gap-3 mt-1" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {event.assetName && <span>Asset: <strong>{event.assetName}</strong></span>}
                    {event.actor && <span>Source: {event.actor}</span>}
                  </div>
                </div>

                <div className="flex items-center">
                  <ChevronRight size={14} className="text-muted" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
