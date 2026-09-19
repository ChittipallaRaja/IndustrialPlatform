import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { GraphControls } from './GraphControls';
import { GraphLegend } from './GraphLegend';
import { BlastRadiusOverlay } from './BlastRadiusOverlay';
import { PathComparisonModal } from './PathComparisonModal';
import { GraphNode, GraphEdge } from '../../types';
import {
  Server,
  Shield,
  Cpu,
  Flame,
  Radio,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AttackPathWorkspace: React.FC = () => {
  const {
    attackPaths,
    selectedPath,
    setSelectedPath,
    selectedNode,
    setSelectedNode,
    selectedEdge,
    setSelectedEdge,
    isMultiPathMode,
    blastRadiusTargetId,
    blastRadiusResult,
  } = usePlatform();

  // Pan & Zoom Canvas State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isClustered, setIsClustered] = useState(false);
  const [graphSearch, setGraphSearch] = useState('');

  const svgRef = useRef<SVGSVGElement>(null);

  // Active nodes & edges based on Single vs Multi Path mode
  const displayedNodes: GraphNode[] = useMemo(() => {
    if (!selectedPath) return [];
    if (!isMultiPathMode) {
      return selectedPath.nodes;
    }
    // Multi path: combine nodes from all attack paths without duplicates
    const map = new Map<string, GraphNode>();
    attackPaths.forEach((p) => {
      p.nodes.forEach((n) => {
        if (!map.has(n.id)) map.set(n.id, n);
      });
    });
    return Array.from(map.values());
  }, [selectedPath, isMultiPathMode, attackPaths]);

  const displayedEdges: GraphEdge[] = useMemo(() => {
    if (!selectedPath) return [];
    if (!isMultiPathMode) {
      return selectedPath.edges;
    }
    const map = new Map<string, GraphEdge>();
    attackPaths.forEach((p) => {
      p.edges.forEach((e) => {
        if (!map.has(e.id)) map.set(e.id, e);
      });
    });
    return Array.from(map.values());
  }, [selectedPath, isMultiPathMode, attackPaths]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(2.0, Number((z + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, Number((z - 0.15).toFixed(2))));
  const handleFitView = () => {
    setZoom(1);
    setPan({ x: 40, y: 30 });
  };

  // Mouse drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if left click and target is svg background
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch drag pan for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => Math.min(2.0, Math.max(0.4, Number((z + delta).toFixed(2)))));
  };

  // Find node position helper
  const getNodePos = (nodeId: string) => {
    const node = displayedNodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return node.coordinates;
  };

  return (
    <div className="graph-workspace animate-fade-in" role="region" aria-label="Interactive Attack Path Investigation Map">
      {/* Top Toolbar Controls */}
      <GraphControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        isClustered={isClustered}
        onToggleCluster={() => setIsClustered(!isClustered)}
        graphSearch={graphSearch}
        onGraphSearchChange={setGraphSearch}
      />

      {/* Blast Radius Floating Overlay */}
      <BlastRadiusOverlay />

      {/* Path Comparison Side-by-Side Modal */}
      <PathComparisonModal />

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="graph-viewport-svg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        aria-label="Attack Path Directed Graph"
      >
        <defs>
          {/* Directed Arrow Markers */}
          <marker
            id="arrow-default"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
          </marker>

          <marker
            id="arrow-critical"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>

          <marker
            id="arrow-selected"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" />
          </marker>
        </defs>

        {/* Scalable & Pannable Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Purdue Architecture Background Zones */}
          <g className="purdue-lanes">
            <rect x="60" y="80" width="220" height="520" className="purdue-lane-rect" />
            <text x="75" y="110" className="purdue-lane-header">L4 ENTERPRISE IT</text>

            <rect x="300" y="80" width="220" height="520" className="purdue-lane-rect" />
            <text x="315" y="110" className="purdue-lane-header">L3.5 INDUSTRIAL DMZ</text>

            <rect x="540" y="80" width="220" height="520" className="purdue-lane-rect" />
            <text x="555" y="110" className="purdue-lane-header">L2 SUPERVISORY (HMI)</text>

            <rect x="780" y="80" width="240" height="520" className="purdue-lane-rect" />
            <text x="795" y="110" className="purdue-lane-header">L1 CONTROL & SAFETY (PLCs)</text>
          </g>

          {/* Directed Edges */}
          <g className="graph-edges-layer">
            {displayedEdges.map((edge) => {
              const srcPos = getNodePos(edge.source);
              const dstPos = getNodePos(edge.target);

              // Calculate start and end connection points on node card borders (width 190, height 88)
              const startX = srcPos.x + 190;
              const startY = srcPos.y + 44;
              const endX = dstPos.x;
              const endY = dstPos.y + 44;

              // Cubic bezier control points for smooth industrial conduits
              const midX = (startX + endX) / 2;
              const pathD = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

              const isEdgeSelected = selectedEdge?.id === edge.id;
              const isSuspicious = edge.isSuspicious;

              return (
                <g
                  key={edge.id}
                  className={`graph-edge-group ${isEdgeSelected ? 'selected' : ''} ${
                    isSuspicious ? 'path-critical' : 'path-active'
                  } ${edge.confidence === 'low' ? 'uncertain' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEdge(edge);
                    setSelectedNode(null);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Conduit from ${edge.source} to ${edge.target} using ${edge.protocol}`}
                >
                  {/* Invisible broad hitbox for easy clicking */}
                  <path d={pathD} stroke="transparent" strokeWidth="20" fill="none" />

                  {/* Visual Edge Line */}
                  <path
                    d={pathD}
                    className={`graph-edge-path ${isSuspicious ? 'edge-flow-active' : ''}`}
                    markerEnd={
                      isEdgeSelected
                        ? 'url(#arrow-selected)'
                        : isSuspicious
                        ? 'url(#arrow-critical)'
                        : 'url(#arrow-default)'
                    }
                  />

                  {/* Centered Protocol Badge */}
                  <g transform={`translate(${midX}, ${(startY + endY) / 2 - 12})`}>
                    <rect
                      x="-55"
                      y="-10"
                      width="110"
                      height="20"
                      className="edge-pill-rect"
                      style={{
                        stroke: isEdgeSelected ? '#ffffff' : isSuspicious ? 'var(--severity-critical-border)' : 'var(--border-default)',
                      }}
                    />
                    <text x="0" y="4" className="edge-pill-text">
                      {edge.protocol} ({edge.service})
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Graph Nodes */}
          <g className="graph-nodes-layer">
            {displayedNodes.map((node) => {
              const isNodeSelected = selectedNode?.id === node.id;
              const isBlastHighlighted =
                blastRadiusResult?.reachableNodeIds.includes(node.id) ?? false;
              const isSearchMatched =
                !graphSearch ||
                node.name.toLowerCase().includes(graphSearch.toLowerCase()) ||
                node.tag.toLowerCase().includes(graphSearch.toLowerCase());

              return (
                <g
                  key={node.id}
                  className={`graph-node-group ${isNodeSelected ? 'selected' : ''} ${
                    node.role === 'source' ? 'is-source' : node.role === 'target' ? 'is-target' : ''
                  } ${isBlastHighlighted ? 'blast-highlighted' : ''} ${
                    !isSearchMatched ? 'dimmed' : ''
                  }`}
                  transform={`translate(${node.coordinates.x}, ${node.coordinates.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                    setSelectedEdge(null);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedNode(node);
                      setSelectedEdge(null);
                    }
                  }}
                  aria-label={`Node ${node.name} (${node.tag}), Role: ${node.role}, Risk: ${node.riskScore}`}
                >
                  {/* Target Pulsing Glow Circle for Crown Jewels */}
                  {node.isCrownJewel && (
                    <circle cx="95" cy="44" r="54" className="target-pulse-circle" />
                  )}

                  {/* Node Card Rectangle */}
                  <rect
                    x="0"
                    y="0"
                    width="190"
                    height="88"
                    className="node-card-rect"
                  />

                  {/* Node Header Row */}
                  <text x="12" y="22" className="node-title-text">
                    {node.tag}
                  </text>

                  {/* Role Tag in top right */}
                  <text
                    x="178"
                    y="20"
                    textAnchor="end"
                    style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fill:
                        node.role === 'source'
                          ? '#38bdf8'
                          : node.role === 'target'
                          ? 'var(--severity-critical-text)'
                          : 'var(--text-muted)',
                    }}
                  >
                    {node.role.toUpperCase()}
                  </text>

                  {/* Operational Name */}
                  <text x="12" y="40" className="node-subtitle-text">
                    {node.name.length > 24 ? `${node.name.substring(0, 22)}...` : node.name}
                  </text>

                  {/* Purdue Zone & Risk Score Row */}
                  <line x1="10" y1="52" x2="180" y2="52" stroke="var(--border-subtle)" strokeWidth="1" />

                  <text x="12" y="70" className="node-meta-text">
                    {node.zone}
                  </text>

                  <text
                    x="178"
                    y="70"
                    textAnchor="end"
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fill:
                        node.riskScore > 80
                          ? 'var(--severity-critical-text)'
                          : node.riskScore > 60
                          ? 'var(--severity-high-text)'
                          : 'var(--text-primary)',
                    }}
                  >
                    {node.riskScore}/100
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Bottom Floating Bar: Legend & Minimap */}
      <div className="graph-bottom-bar">
        <GraphLegend />

        {/* Interactive Minimap */}
        <div className="minimap-container" aria-label="Graph minimap viewport guide">
          <svg width="100%" height="100%" viewBox="0 0 1100 700">
            {/* Miniature zones */}
            <rect x="60" y="80" width="220" height="520" fill="rgba(255,255,255,0.03)" />
            <rect x="300" y="80" width="220" height="520" fill="rgba(255,255,255,0.03)" />
            <rect x="540" y="80" width="220" height="520" fill="rgba(255,255,255,0.03)" />
            <rect x="780" y="80" width="240" height="520" fill="rgba(255,255,255,0.03)" />

            {/* Miniature nodes */}
            {displayedNodes.map((n) => (
              <circle
                key={n.id}
                cx={n.coordinates.x + 95}
                cy={n.coordinates.y + 44}
                r="18"
                fill={n.role === 'target' ? 'var(--severity-critical)' : 'var(--color-brand-primary)'}
              />
            ))}

            {/* Viewport Frame */}
            <rect
              x={-pan.x / zoom + 40}
              y={-pan.y / zoom + 30}
              width={800 / zoom}
              height={500 / zoom}
              className="minimap-viewport-rect"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
