import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  GitFork,
  Radio,
  Layers,
  Search,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface GraphControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  isClustered: boolean;
  onToggleCluster: () => void;
  graphSearch: string;
  onGraphSearchChange: (q: string) => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitView,
  isClustered,
  onToggleCluster,
  graphSearch,
  onGraphSearchChange,
}) => {
  const {
    attackPaths,
    selectedPath,
    setSelectedPath,
    isMultiPathMode,
    setIsMultiPathMode,
    blastRadiusTargetId,
    setBlastRadiusTargetId,
    setIsCompareOpen,
    assets,
  } = usePlatform();

  const handleBlastToggle = () => {
    if (blastRadiusTargetId) {
      setBlastRadiusTargetId(null);
    } else {
      // Pick first source node or crown jewel
      setBlastRadiusTargetId('asset-ews-014');
    }
  };

  return (
    <div className="graph-top-toolbar" role="toolbar" aria-label="Graph navigation and analysis controls">
      {/* Left Cluster: Path Selector & Mode */}
      <div className="graph-control-cluster">
        <label htmlFor="path-select" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '4px' }}>
          Active Path:
        </label>
        <select
          id="path-select"
          className="path-select-dropdown"
          value={selectedPath?.id || ''}
          onChange={(e) => {
            const found = attackPaths.find((p) => p.id === e.target.value);
            if (found) setSelectedPath(found);
          }}
          aria-label="Select attack path to analyze"
        >
          {attackPaths.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} (Risk {p.riskScore})
            </option>
          ))}
        </select>

        <button
          type="button"
          className={`graph-btn ${isMultiPathMode ? 'active' : ''}`}
          onClick={() => setIsMultiPathMode(!isMultiPathMode)}
          aria-pressed={isMultiPathMode}
          title="Toggle Multi-Path vs Single Focused Path View"
        >
          <GitFork size={13} />
          <span>{isMultiPathMode ? 'Multi-Path Mode' : 'Single Path Mode'}</span>
        </button>

        <button
          type="button"
          className={`graph-btn ${blastRadiusTargetId ? 'active' : ''}`}
          onClick={handleBlastToggle}
          aria-pressed={Boolean(blastRadiusTargetId)}
          title="Analyze Downstream Blast Radius and Reachable Assets"
        >
          <Radio size={13} />
          <span>Blast Radius / Reachability</span>
        </button>

        <button
          type="button"
          className="graph-btn"
          onClick={() => setIsCompareOpen(true)}
          title="Compare Attack Paths side-by-side"
        >
          <ArrowRightLeft size={13} />
          <span>Compare Paths</span>
        </button>
      </div>

      {/* Right Cluster: Zoom, Search inside Graph, Cluster */}
      <div className="graph-control-cluster">
        {/* Graph Search Input */}
        <div className="flex items-center gap-1" style={{ padding: '0 6px' }}>
          <Search size={13} className="text-muted" />
          <input
            type="text"
            placeholder="Search in graph..."
            value={graphSearch}
            onChange={(e) => onGraphSearchChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              width: '120px',
            }}
            aria-label="Search node inside attack path graph"
          />
        </div>

        <button
          type="button"
          className={`graph-btn ${isClustered ? 'active' : ''}`}
          onClick={onToggleCluster}
          title="Toggle Large-Scale Node Clustering / Group Collapse"
        >
          <Layers size={13} />
          <span>{isClustered ? 'Expand Clusters' : 'Collapse Groups'}</span>
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-default)', margin: '0 2px' }} />

        <button
          type="button"
          className="graph-btn graph-btn-icon-only"
          onClick={onZoomIn}
          aria-label="Zoom In"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>

        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: '38px', textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          className="graph-btn graph-btn-icon-only"
          onClick={onZoomOut}
          aria-label="Zoom Out"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          type="button"
          className="graph-btn graph-btn-icon-only"
          onClick={onFitView}
          aria-label="Fit Graph to View"
          title="Fit Graph to View"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
};
