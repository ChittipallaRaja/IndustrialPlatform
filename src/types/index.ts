// Strict TypeScript definitions for Industrial Cybersecurity Platform

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type CriticalityLevel = 'critical' | 'high' | 'medium' | 'low';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';
export type AssetStatus = 'online' | 'offline' | 'degraded' | 'unknown' | 'maintenance';
export type VisibilityState = 'complete' | 'partial' | 'unidentified' | 'degraded';
export type PurdueLevel = 0 | 1 | 2 | 3 | 3.5 | 4;

export type SimulationMode =
  | 'normal'
  | 'high-risk'
  | 'degraded-sensor'
  | 'unknown-uncertain'
  | 'empty'
  | 'error'
  | 'loading';

export interface Asset {
  id: string;
  name: string;
  tag: string;
  type: 'plc' | 'hmi' | 'scada-server' | 'historian' | 'engineering-workstation' | 'ot-gateway' | 'firewall' | 'vfd' | 'sis-controller' | 'rtu' | 'sensor';
  role: string;
  site: string;
  plant: string;
  area: string;
  zone: string;
  purdueLevel: PurdueLevel;
  ipAddress: string;
  macAddress: string;
  vendor: string;
  model: string;
  firmware: string;
  protocols: string[];
  criticality: CriticalityLevel;
  riskScore: number; // 0 - 100
  status: AssetStatus;
  visibility: VisibilityState;
  confidence: ConfidenceLevel;
  lastSeen: string;
  isCrownJewel: boolean;
  unresolvedFindingCount: number;
  openAttackPathCount: number;
  missingAttributes?: string[];
  operationalImpact: string;
  owner: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: SeverityLevel;
  status: 'active' | 'acknowledged' | 'assigned' | 'under_review' | 'suppressed' | 'remediated';
  category: 'vulnerability' | 'configuration' | 'protocol_anomaly' | 'unauthorized_access' | 'firmware_tampering' | 'segmentation_violation';
  assetId: string;
  assetName: string;
  site: string;
  plant: string;
  area: string;
  zone: string;
  purdueLevel: PurdueLevel;
  riskScore: number;
  cveId?: string;
  cvssScore?: number;
  firstSeen: string;
  lastSeen: string;
  description: string;
  operationalImpact: string;
  whyItMatters: string;
  evidence: {
    type: string;
    details: string;
    packetSample?: string;
    timestamp: string;
    observedValue?: string;
    expectedValue?: string;
  }[];
  mitigationSteps: string[];
  assignedTo?: string;
  mitreTechnique?: string;
  mitreTactic?: string;
}

export type GraphNodeRole = 'source' | 'pivot' | 'target';

export interface GraphNode {
  id: string;
  assetId: string;
  name: string;
  tag: string;
  assetType: Asset['type'];
  role: GraphNodeRole;
  zone: string;
  purdueLevel: PurdueLevel;
  criticality: CriticalityLevel;
  riskScore: number;
  status: AssetStatus;
  confidence: ConfidenceLevel;
  isCrownJewel: boolean;
  clusterGroup?: string;
  coordinates: { x: number; y: number };
  findingCount: number;
  unresolvedVulnerabilities: string[];
  operationalRole: string;
}

export interface GraphEdge {
  id: string;
  source: string; // Node id
  target: string; // Node id
  protocol: string;
  service: string;
  port: number | string;
  relationshipType: 'network_comm' | 'credential_reuse' | 'trust_dependency' | 'exploit_pivot' | 'unsegmented_link';
  isSuspicious: boolean;
  riskContribution: SeverityLevel;
  confidence: ConfidenceLevel;
  reason: string;
  direction: 'unidirectional' | 'bidirectional';
  packetCount24h?: number;
  lastObserved: string;
  evidence: string[];
}

export interface AttackPath {
  id: string;
  title: string;
  name: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceAssetName: string;
  targetAssetName: string;
  riskScore: number;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  zonesTraversed: string[];
  pathLength: number;
  pivotCount: number;
  crownJewelAtRisk: boolean;
  status: 'active' | 'mitigated' | 'monitoring' | 'under_review';
  firstDetected: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  summary: string;
  whyItMatters: string;
  potentialImpact: string;
  recommendedActions: string[];
  mitreSequence: {
    step: number;
    tactic: string;
    technique: string;
    description: string;
    asset: string;
  }[];
}

export interface NetworkZone {
  id: string;
  name: string;
  purdueLevel: PurdueLevel;
  site: string;
  assetCount: number;
  criticalAssetCount: number;
  riskScore: number;
  inboundFlows: number;
  outboundFlows: number;
  segmentationStatus: 'enforced' | 'partial' | 'unsegmented' | 'degraded';
  topProtocols: string[];
}

export interface SensorHealth {
  id: string;
  name: string;
  location: string;
  site: string;
  plant: string;
  zone: string;
  status: 'healthy' | 'degraded' | 'offline' | 'unknown';
  coveragePercentage: number;
  lastHeartbeat: string;
  packetsPerSec: number;
  droppedPacketsRate: number;
  dataRecencySeconds: number;
  firmwareVersion: string;
  spanPortStatus: 'active' | 'packet_loss' | 'down';
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'new_asset' | 'state_change' | 'new_finding' | 'risk_elevated' | 'comm_anomaly' | 'sensor_degraded' | 'operator_action' | 'firmware_change';
  severity: SeverityLevel;
  importance: 'critical' | 'high' | 'normal' | 'low';
  title: string;
  description: string;
  assetId?: string;
  assetName?: string;
  site: string;
  zone: string;
  actor?: string;
  details?: Record<string, any>;
}

export interface GlobalFilters {
  site: string;
  plant: string;
  area: string;
  zone: string;
  timeRange: '24h' | '7d' | '30d' | 'custom';
  severity: 'all' | 'critical' | 'high' | 'medium' | 'low';
  criticality: 'all' | 'critical' | 'high' | 'medium' | 'low';
  searchQuery: string;
}

export interface BlastRadiusResult {
  sourceAssetId: string;
  sourceAssetName: string;
  reachableNodeIds: string[];
  reachableAssetCount: number;
  criticalAssetsReachable: number;
  zonesInScope: string[];
  purdueLevelsExposed: number[];
  maxRiskScore: number;
  potentialCrownJewels: string[];
  summary: string;
}

export interface TriageActivity {
  id: string;
  timestamp: string;
  targetType: 'finding' | 'asset' | 'path';
  targetId: string;
  targetTitle: string;
  action: 'acknowledged' | 'assigned' | 'reviewed' | 'suppressed' | 'remediated';
  user: string;
  notes?: string;
}
