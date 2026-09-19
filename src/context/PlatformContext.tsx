import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import type {
  Asset,
  Finding,
  AttackPath,
  GraphNode,
  GraphEdge,
  SensorHealth,
  TimelineEvent,
  NetworkZone,
  GlobalFilters,
  SimulationMode,
  BlastRadiusResult,
  TriageActivity,
} from '../types';
import { MockSecurityService } from '../mock/mockService';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface PlatformContextType {
  currentView: 'dashboard' | 'attack-path';
  setCurrentView: (view: 'dashboard' | 'attack-path') => void;
  filters: GlobalFilters;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;
  updateFilter: (key: keyof GlobalFilters, value: any) => void;
  resetFilters: () => void;
  activeFilterCount: number;

  simMode: SimulationMode;
  setSimMode: (mode: SimulationMode) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  assets: Asset[];
  findings: Finding[];
  attackPaths: AttackPath[];
  sensors: SensorHealth[];
  timeline: TimelineEvent[];
  zones: NetworkZone[];

  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  closeDrawer: () => void;
  selectedFinding: Finding | null;
  setSelectedFinding: (finding: Finding | null) => void;
  selectedAsset: Asset | null;
  setSelectedAsset: (asset: Asset | null) => void;
  selectedPath: AttackPath | null;
  setSelectedPath: (path: AttackPath | null) => void;
  selectedNode: GraphNode | null;
  setSelectedNode: (node: GraphNode | null) => void;
  selectedEdge: GraphEdge | null;
  setSelectedEdge: (edge: GraphEdge | null) => void;
  openPathDrawer: (path: AttackPath) => void;

  blastRadiusTargetId: string | null;
  setBlastRadiusTargetId: (id: string | null) => void;
  blastRadiusResult: BlastRadiusResult | null;

  isMultiPathMode: boolean;
  setIsMultiPathMode: (enabled: boolean) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isDesignRationaleOpen: boolean;
  setIsDesignRationaleOpen: (open: boolean) => void;

  toasts: ToastItem[];
  addToast: (title: string, message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;

  triageHistory: TriageActivity[];
  executeTriageAction: (
    targetType: 'finding' | 'asset' | 'path',
    targetId: string,
    targetTitle: string,
    action: 'acknowledged' | 'assigned' | 'reviewed' | 'suppressed' | 'remediated',
    notes?: string
  ) => void;

  retryLoading: () => void;
}

const defaultFilters: GlobalFilters = {
  site: 'site-gulf-coast',
  plant: 'plant-cogen',
  area: 'all',
  zone: 'all',
  timeRange: '24h',
  severity: 'all',
  criticality: 'all',
  searchQuery: '',
};

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'attack-path'>('dashboard');
  const [filters, setFilters] = useState<GlobalFilters>(defaultFilters);
  const [simMode, setSimMode] = useState<SimulationMode>('high-risk');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Interactive Investigation Drawer States (Default Closed)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedFinding, setFindingState] = useState<Finding | null>(null);
  const [selectedAsset, setAssetState] = useState<Asset | null>(null);
  const [selectedPath, setPathState] = useState<AttackPath | null>(null);
  const [selectedNode, setNodeState] = useState<GraphNode | null>(null);
  const [selectedEdge, setEdgeState] = useState<GraphEdge | null>(null);

  // Graph Options
  const [blastRadiusTargetId, setBlastRadiusTargetId] = useState<string | null>(null);
  const [isMultiPathMode, setIsMultiPathMode] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDesignRationaleOpen, setIsDesignRationaleOpen] = useState<boolean>(false);

  // Notifications & Audit Log
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [triageHistory, setTriageHistory] = useState<TriageActivity[]>([]);

  // Apply Theme Attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateFilter = (key: keyof GlobalFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    addToast('Filters Reset', 'All global filters restored to baseline.', 'info');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.site !== 'site-gulf-coast' && filters.site !== 'all') count++;
    if (filters.plant !== 'plant-cogen' && filters.plant !== 'all') count++;
    if (filters.area !== 'all') count++;
    if (filters.zone !== 'all') count++;
    if (filters.timeRange !== '24h') count++;
    if (filters.severity !== 'all') count++;
    if (filters.criticality !== 'all') count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters]);

  // Reactive Mock Queries
  const assets = useMemo(() => MockSecurityService.getAssets(filters, simMode), [filters, simMode]);
  const findings = useMemo(() => MockSecurityService.getFindings(filters, simMode), [filters, simMode]);
  const attackPaths = useMemo(() => MockSecurityService.getAttackPaths(filters, simMode), [filters, simMode]);
  const sensors = useMemo(() => MockSecurityService.getSensors(simMode), [simMode]);
  const timeline = useMemo(() => MockSecurityService.getTimeline(filters, simMode), [filters, simMode]);
  const zones = useMemo(() => MockSecurityService.getZones(), []);

  // Sync selected path default for graph without automatically opening drawer
  useEffect(() => {
    if (attackPaths.length > 0 && !selectedPath) {
      setPathState(attackPaths[0]);
    }
  }, [attackPaths, selectedPath]);

  // Specific selection handlers that open the drawer cleanly
  const setSelectedFinding = (finding: Finding | null) => {
    setFindingState(finding);
    setAssetState(null);
    setNodeState(null);
    setEdgeState(null);
    setIsDrawerOpen(Boolean(finding));
  };

  const setSelectedAsset = (asset: Asset | null) => {
    setAssetState(asset);
    setFindingState(null);
    setNodeState(null);
    setEdgeState(null);
    setIsDrawerOpen(Boolean(asset));
  };

  const setSelectedNode = (node: GraphNode | null) => {
    setNodeState(node);
    setEdgeState(null);
    setFindingState(null);
    setAssetState(null);
    setIsDrawerOpen(Boolean(node));
  };

  const setSelectedEdge = (edge: GraphEdge | null) => {
    setEdgeState(edge);
    setNodeState(null);
    setFindingState(null);
    setAssetState(null);
    setIsDrawerOpen(Boolean(edge));
  };

  const setSelectedPath = (path: AttackPath | null) => {
    setPathState(path);
  };

  const openPathDrawer = (path: AttackPath) => {
    setPathState(path);
    setNodeState(null);
    setEdgeState(null);
    setFindingState(null);
    setAssetState(null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFindingState(null);
    setAssetState(null);
    setNodeState(null);
    setEdgeState(null);
  };

  // Blast Radius Calculation
  const blastRadiusResult = useMemo(() => {
    if (!blastRadiusTargetId) return null;
    return MockSecurityService.calculateBlastRadius(blastRadiusTargetId);
  }, [blastRadiusTargetId]);

  const addToast = (title: string, message: string, type: ToastItem['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const executeTriageAction = (
    targetType: 'finding' | 'asset' | 'path',
    targetId: string,
    targetTitle: string,
    action: 'acknowledged' | 'assigned' | 'reviewed' | 'suppressed' | 'remediated',
    notes?: string
  ) => {
    const newActivity: TriageActivity = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      targetType,
      targetId,
      targetTitle,
      action,
      user: 'Operations Analyst (You)',
      notes,
    };
    setTriageHistory((prev) => [newActivity, ...prev]);

    const actionLabels: Record<string, string> = {
      acknowledged: 'Acknowledged',
      assigned: 'Assigned to Engineering Lead',
      reviewed: 'Marked as Reviewed',
      suppressed: 'Suppressed / Whitelisted',
      remediated: 'Remediation Verified',
    };

    addToast(
      `${actionLabels[action] || action.toUpperCase()}`,
      `Action recorded for ${targetTitle}`,
      action === 'suppressed' ? 'warning' : 'success'
    );
  };

  const retryLoading = () => {
    setSimMode('high-risk');
    addToast('Data Reloaded', 'Successfully refreshed live OT telemetry pipeline.', 'success');
  };

  // Keyboard shortcut listener for Ctrl+K and ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        closeDrawer();
        setIsCompareOpen(false);
        setIsSearchOpen(false);
        setIsDesignRationaleOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        currentView,
        setCurrentView,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        activeFilterCount,
        simMode,
        setSimMode,
        theme,
        toggleTheme,
        assets,
        findings,
        attackPaths,
        sensors,
        timeline,
        zones,
        isDrawerOpen,
        setIsDrawerOpen,
        closeDrawer,
        selectedFinding,
        setSelectedFinding,
        selectedAsset,
        setSelectedAsset,
        selectedPath,
        setSelectedPath,
        selectedNode,
        setSelectedNode,
        selectedEdge,
        setSelectedEdge,
        openPathDrawer,
        blastRadiusTargetId,
        setBlastRadiusTargetId,
        blastRadiusResult,
        isMultiPathMode,
        setIsMultiPathMode,
        isCompareOpen,
        setIsCompareOpen,
        isSearchOpen,
        setIsSearchOpen,
        isDesignRationaleOpen,
        setIsDesignRationaleOpen,
        toasts,
        addToast,
        removeToast,
        triageHistory,
        executeTriageAction,
        retryLoading,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
