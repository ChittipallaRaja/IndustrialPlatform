import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Server,
  AlertTriangle,
  GitFork,
  ArrowRight,
  Shield,
  Cpu,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SeverityBadge, CriticalityBadge, PurdueBadge } from './Badges';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    assets,
    findings,
    attackPaths,
    setSelectedAsset,
    setSelectedFinding,
    setSelectedPath,
    setCurrentView,
  } = usePlatform();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredAssets = query.trim()
    ? assets.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.tag.toLowerCase().includes(query.toLowerCase()) ||
          a.ipAddress.includes(query) ||
          a.vendor.toLowerCase().includes(query.toLowerCase())
      )
    : assets.slice(0, 4);

  const filteredFindings = query.trim()
    ? findings.filter(
        (f) =>
          f.title.toLowerCase().includes(query.toLowerCase()) ||
          f.assetName.toLowerCase().includes(query.toLowerCase()) ||
          (f.cveId && f.cveId.toLowerCase().includes(query.toLowerCase()))
      )
    : findings.slice(0, 4);

  const filteredPaths = query.trim()
    ? attackPaths.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.targetAssetName.toLowerCase().includes(query.toLowerCase()) ||
          p.sourceAssetName.toLowerCase().includes(query.toLowerCase())
      )
    : attackPaths.slice(0, 2);

  const totalResults = filteredAssets.length + filteredFindings.length + filteredPaths.length;

  const handleSelectAsset = (asset: (typeof assets)[0]) => {
    setSelectedAsset(asset);
    setIsSearchOpen(false);
  };

  const handleSelectFinding = (finding: (typeof findings)[0]) => {
    setSelectedFinding(finding);
    setIsSearchOpen(false);
  };

  const handleSelectPath = (path: (typeof attackPaths)[0]) => {
    setSelectedPath(path);
    setCurrentView('attack-path');
    setIsSearchOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
      <div
        className="modal-content"
        style={{ width: '680px', maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global Security Object Search"
      >
        <div className="modal-header" style={{ padding: '12px 16px' }}>
          <div className="flex items-center gap-3 w-full">
            <Search size={18} className="text-brand" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              className="w-full"
              placeholder="Search assets, IP addresses, CVE IDs, PLCs, attack paths..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'inherit',
              }}
              aria-label="Search security query"
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '16px' }}>
          {totalResults === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
              <Search size={36} className="text-muted" />
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                No security objects match "{query}"
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Try searching by IP (e.g. 172.20), tag (e.g. PLC-204), or CVE (e.g. CVE-2024).
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Assets Section */}
              {filteredAssets.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="detail-section-title">
                    <Server size={12} /> Assets ({filteredAssets.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="timeline-item flex items-center justify-between"
                        onClick={() => handleSelectAsset(asset)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleSelectAsset(asset)}
                      >
                        <div className="flex items-center gap-3">
                          <Cpu size={16} className="text-brand" />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                                {asset.tag}
                              </span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                {asset.name}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {asset.ipAddress} • {asset.vendor}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <PurdueBadge level={asset.purdueLevel} />
                          <CriticalityBadge criticality={asset.criticality} />
                          <ArrowRight size={14} className="text-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings Section */}
              {filteredFindings.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="detail-section-title">
                    <AlertTriangle size={12} /> Findings & Vulnerabilities ({filteredFindings.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredFindings.map((finding) => (
                      <div
                        key={finding.id}
                        className="timeline-item flex items-center justify-between"
                        onClick={() => handleSelectFinding(finding)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleSelectFinding(finding)}
                      >
                        <div className="flex items-center gap-3">
                          <SeverityBadge severity={finding.severity} />
                          <div className="flex flex-col">
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.84rem' }}>
                              {finding.title}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Target: {finding.assetName} • Risk Score: {finding.riskScore}/100
                            </span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attack Paths Section */}
              {filteredPaths.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="detail-section-title">
                    <GitFork size={12} /> Attack Paths ({filteredPaths.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredPaths.map((path) => (
                      <div
                        key={path.id}
                        className="timeline-item flex items-center justify-between"
                        onClick={() => handleSelectPath(path)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleSelectPath(path)}
                      >
                        <div className="flex items-center gap-3">
                          <GitFork size={16} className="text-brand" />
                          <div className="flex flex-col">
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.84rem' }}>
                              {path.title}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {path.name}
                            </span>
                          </div>
                        </div>
                        <SeverityBadge severity={path.severity} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ padding: '8px 16px', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Use <kbd className="kbd-shortcut">ESC</kbd> to close • Click any item to inspect details
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Showing {totalResults} security objects
          </span>
        </div>
      </div>
    </div>
  );
};
