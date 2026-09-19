import React from 'react';
import {
  ShieldAlert,
  Server,
  AlertOctagon,
  Flame,
  GitFork,
  Radio,
  CheckCircle,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { KpiCard } from '../common/KpiCard';

export const PostureSummary: React.FC = () => {
  const {
    assets,
    findings,
    attackPaths,
    sensors,
    updateFilter,
    setCurrentView,
    setSelectedAsset,
    setSelectedFinding,
  } = usePlatform();

  const totalAssets = assets.length;
  const criticalFindings = findings.filter((f) => f.severity === 'critical');
  const exposedCrownJewels = assets.filter((a) => a.isCrownJewel && a.openAttackPathCount > 0);
  const activePaths = attackPaths.filter((p) => p.status === 'active');
  const healthySensors = sensors.filter((s) => s.status === 'healthy').length;
  const overallPostureScore = Math.max(12, 100 - (criticalFindings.length * 18 + activePaths.length * 15));

  return (
    <section aria-labelledby="posture-summary-heading" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 id="posture-summary-heading" className="card-title flex items-center gap-2">
          <ShieldAlert size={18} className="text-brand" aria-hidden="true" />
          <span>Security Posture & Executive Priorities</span>
        </h2>
        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          Continuous Purdue Level 0–4 Evaluation
        </span>
      </div>

      <div className="grid grid-cols-4 lg-grid-cols-2 md-grid-cols-1 gap-4">
        {/* KPI 1: Overall Security Posture */}
        <KpiCard
          label="Security Posture Index"
          value={`${overallPostureScore} / 100`}
          subtext={
            overallPostureScore > 75
              ? 'High operational resilience'
              : overallPostureScore > 50
              ? 'Moderate risk: 2 crown jewels exposed'
              : 'CRITICAL EXPOSURE DETECTED'
          }
          icon={ShieldAlert}
          accentType={overallPostureScore < 50 ? 'critical' : overallPostureScore < 75 ? 'warning' : 'healthy'}
          onClick={() => updateFilter('severity', 'critical')}
          drilldownHint="Click to filter critical security risks"
        />

        {/* KPI 2: Total OT Assets */}
        <KpiCard
          label="Monitored OT Assets"
          value={totalAssets.toString()}
          subtext={`${assets.filter((a) => a.isCrownJewel).length} Crown Jewels • ${assets.filter((a) => a.status === 'online').length} Online`}
          icon={Server}
          accentType="brand"
          onClick={() => {
            if (assets.length > 0) setSelectedAsset(assets[0]);
          }}
          drilldownHint="Click to inspect primary asset inventory"
        />

        {/* KPI 3: Critical Unmitigated Findings */}
        <KpiCard
          label="Critical Findings"
          value={criticalFindings.length.toString()}
          subtext={
            criticalFindings.length > 0
              ? `${criticalFindings.length} requires immediate OT triage`
              : 'Zero critical findings detected'
          }
          icon={AlertOctagon}
          accentType={criticalFindings.length > 0 ? 'critical' : 'healthy'}
          onClick={() => {
            if (criticalFindings.length > 0) {
              setSelectedFinding(criticalFindings[0]);
            } else {
              updateFilter('severity', 'critical');
            }
          }}
          drilldownHint="Click to open top critical finding details"
        />

        {/* KPI 4: Active Attack Paths */}
        <KpiCard
          label="Attack Paths to Crown Jewels"
          value={activePaths.length.toString()}
          subtext={
            exposedCrownJewels.length > 0
              ? `${exposedCrownJewels.map((c) => c.tag).join(', ')} reachable`
              : 'No lateral movement conduits active'
          }
          icon={GitFork}
          accentType={activePaths.length > 0 ? 'critical' : 'healthy'}
          onClick={() => setCurrentView('attack-path')}
          drilldownHint="Click to launch interactive Attack Path Map"
        />
      </div>
    </section>
  );
};
