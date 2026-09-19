import {
  Asset,
  Finding,
  AttackPath,
  NetworkZone,
  SensorHealth,
  TimelineEvent,
  GlobalFilters,
  SimulationMode,
  BlastRadiusResult,
} from '../types';
import {
  MOCK_ASSETS,
  MOCK_FINDINGS,
  MOCK_ATTACK_PATHS,
  MOCK_ZONES,
  MOCK_SENSORS,
  MOCK_TIMELINE,
} from './mockData';

export class MockSecurityService {
  /**
   * Returns filtered assets based on active filters and simulation mode
   */
  static getAssets(filters: GlobalFilters, simMode: SimulationMode): Asset[] {
    if (simMode === 'empty') return [];
    if (simMode === 'loading') return [];

    let assets = [...MOCK_ASSETS];

    if (simMode === 'unknown-uncertain') {
      // Elevate unknown/unidentified states
      assets = assets.map((a) => ({
        ...a,
        confidence: 'low',
        visibility: a.purdueLevel <= 1 ? 'unidentified' : a.visibility,
        vendor: a.purdueLevel <= 1 ? 'Unknown Protocol Handshake' : a.vendor,
      }));
    }

    if (simMode === 'degraded-sensor') {
      assets = assets.map((a) =>
        a.zone === 'zone-dmz'
          ? { ...a, status: 'degraded', confidence: 'low', lastSeen: '4 hours ago' }
          : a
      );
    }

    if (filters.site && filters.site !== 'all') {
      assets = assets.filter((a) => a.site === filters.site);
    }
    if (filters.zone && filters.zone !== 'all') {
      assets = assets.filter((a) => a.zone === filters.zone);
    }
    if (filters.criticality && filters.criticality !== 'all') {
      assets = assets.filter((a) => a.criticality === filters.criticality);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      assets = assets.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tag.toLowerCase().includes(q) ||
          a.ipAddress.includes(q) ||
          a.vendor.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q)
      );
    }

    return assets;
  }

  /**
   * Returns filtered findings based on active filters and simulation mode
   */
  static getFindings(filters: GlobalFilters, simMode: SimulationMode): Finding[] {
    if (simMode === 'empty') return [];
    if (simMode === 'loading') return [];
    if (simMode === 'normal') {
      // In normal mode, no critical unmitigated findings exist
      return MOCK_FINDINGS.filter((f) => f.severity !== 'critical').map((f) => ({
        ...f,
        status: 'acknowledged',
      }));
    }

    let findings = [...MOCK_FINDINGS];

    if (filters.site && filters.site !== 'all') {
      findings = findings.filter((f) => f.site === filters.site);
    }
    if (filters.zone && filters.zone !== 'all') {
      findings = findings.filter((f) => f.zone === filters.zone);
    }
    if (filters.severity && filters.severity !== 'all') {
      findings = findings.filter((f) => f.severity === filters.severity);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      findings = findings.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.assetName.toLowerCase().includes(q) ||
          (f.cveId && f.cveId.toLowerCase().includes(q)) ||
          f.description.toLowerCase().includes(q)
      );
    }

    return findings;
  }

  /**
   * Returns attack paths
   */
  static getAttackPaths(filters: GlobalFilters, simMode: SimulationMode): AttackPath[] {
    if (simMode === 'empty' || simMode === 'loading') return [];
    if (simMode === 'normal') {
      return []; // No active critical attack paths in nominal mode
    }

    let paths = [...MOCK_ATTACK_PATHS];

    if (simMode === 'unknown-uncertain') {
      paths = paths.map((p) => ({
        ...p,
        confidence: 'low',
        summary: `[UNCERTAIN CORRELATION] Potential movement hypothesized. Confidence degraded due to missing telemetry in L1 zone.`,
        edges: p.edges.map((e) => ({
          ...e,
          confidence: 'low',
          isSuspicious: true,
        })),
      }));
    }

    if (filters.severity && filters.severity !== 'all') {
      paths = paths.filter((p) => p.severity === filters.severity);
    }

    return paths;
  }

  /**
   * Returns sensor health data
   */
  static getSensors(simMode: SimulationMode): SensorHealth[] {
    if (simMode === 'loading') return [];
    if (simMode === 'normal') {
      return MOCK_SENSORS.map((s) => ({
        ...s,
        status: 'healthy',
        coveragePercentage: 99.2,
        droppedPacketsRate: 0.0,
        spanPortStatus: 'active',
        notes: undefined,
      }));
    }

    if (simMode === 'degraded-sensor') {
      return MOCK_SENSORS.map((s) =>
        s.id === 'sensor-sniff-03' || s.id === 'sensor-sniff-02'
          ? {
              ...s,
              status: 'degraded',
              coveragePercentage: 58.0,
              droppedPacketsRate: 24.6,
              notes: 'Severe switch buffer congestion; high risk of missed lateral movement telemetry.',
            }
          : s
      );
    }

    return MOCK_SENSORS;
  }

  /**
   * Returns timeline events
   */
  static getTimeline(filters: GlobalFilters, simMode: SimulationMode): TimelineEvent[] {
    if (simMode === 'empty' || simMode === 'loading') return [];
    let timeline = [...MOCK_TIMELINE];

    if (simMode === 'normal') {
      timeline = timeline.filter((e) => e.severity !== 'critical');
    }

    if (filters.zone && filters.zone !== 'all') {
      timeline = timeline.filter((e) => e.zone === filters.zone);
    }
    if (filters.severity && filters.severity !== 'all') {
      timeline = timeline.filter((e) => e.severity === filters.severity);
    }

    return timeline;
  }

  /**
   * Returns network zones
   */
  static getZones(): NetworkZone[] {
    return MOCK_ZONES;
  }

  /**
   * Calculate Blast Radius / Reachable Assets for a given asset ID
   */
  static calculateBlastRadius(sourceAssetId: string): BlastRadiusResult {
    const asset = MOCK_ASSETS.find((a) => a.id === sourceAssetId) || MOCK_ASSETS[0];

    // Find all attack paths traversing this asset
    const connectedPaths = MOCK_ATTACK_PATHS.filter((p) =>
      p.nodes.some((n) => n.assetId === sourceAssetId)
    );

    const reachableNodes = new Set<string>();
    const zones = new Set<string>();
    const purdueLevels = new Set<number>();
    const crownJewels: string[] = [];

    connectedPaths.forEach((path) => {
      path.nodes.forEach((node) => {
        reachableNodes.add(node.id);
        zones.add(node.zone);
        purdueLevels.add(node.purdueLevel);
        if (node.isCrownJewel) {
          crownJewels.push(node.name);
        }
      });
    });

    // Add immediate layer neighbours
    if (reachableNodes.size === 0) {
      reachableNodes.add('node-ews-014');
      reachableNodes.add('node-gw-03');
      reachableNodes.add('node-hmi-04');
      reachableNodes.add('node-plc-204');
      zones.add('Enterprise IT (L4)');
      zones.add('Industrial DMZ (L3.5)');
      zones.add('Supervisory Control (L2)');
      zones.add('Process Control (L1)');
      purdueLevels.add(4);
      purdueLevels.add(3.5);
      purdueLevels.add(2);
      purdueLevels.add(1);
      crownJewels.push('PLC-TURBINE-204', 'HMI-TURBINE-04');
    }

    return {
      sourceAssetId: asset.id,
      sourceAssetName: asset.tag,
      reachableNodeIds: Array.from(reachableNodes),
      reachableAssetCount: reachableNodes.size,
      criticalAssetsReachable: crownJewels.length,
      zonesInScope: Array.from(zones),
      purdueLevelsExposed: Array.from(purdueLevels).sort(),
      maxRiskScore: 98,
      potentialCrownJewels: Array.from(new Set(crownJewels)),
      summary: `Compromise of ${asset.tag} grants network and protocol conduits to ${reachableNodes.size} connected assets across Purdue Levels ${Array.from(purdueLevels).sort().join(', ')}, potentially exposing ${crownJewels.length} crown jewel systems.`,
    };
  }
}
