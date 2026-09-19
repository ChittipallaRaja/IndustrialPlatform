import React from 'react';
import { Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { MOCK_SITES, MOCK_PLANTS, MOCK_AREAS, MOCK_ZONES } from '../../mock/mockData';

export const GlobalFilterBar: React.FC = () => {
  const { filters, updateFilter, resetFilters, activeFilterCount } = usePlatform();

  return (
    <div className="global-filter-bar" role="region" aria-label="Global security filters">
      <div className="filter-group">
        <div className="flex items-center gap-2" style={{ marginRight: '6px' }}>
          <SlidersHorizontal size={16} className="text-brand" aria-hidden="true" />
          <span className="filter-label">Filters</span>
          {activeFilterCount > 0 && (
            <span className="badge badge-high" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
              {activeFilterCount} ACTIVE
            </span>
          )}
        </div>

        {/* Site Filter */}
        <div className="flex items-center gap-1">
          <label htmlFor="filter-site" className="filter-label">Site:</label>
          <select
            id="filter-site"
            className={`filter-select ${filters.site !== 'all' ? 'has-value' : ''}`}
            value={filters.site}
            onChange={(e) => updateFilter('site', e.target.value)}
            aria-label="Filter by Site"
          >
            <option value="all">All Sites</option>
            {MOCK_SITES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plant Filter */}
        <div className="flex items-center gap-1">
          <label htmlFor="filter-plant" className="filter-label">Plant:</label>
          <select
            id="filter-plant"
            className={`filter-select ${filters.plant !== 'all' ? 'has-value' : ''}`}
            value={filters.plant}
            onChange={(e) => updateFilter('plant', e.target.value)}
            aria-label="Filter by Plant"
          >
            <option value="all">All Plants</option>
            {MOCK_PLANTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Area Filter */}
        <div className="flex items-center gap-1">
          <label htmlFor="filter-area" className="filter-label">Area:</label>
          <select
            id="filter-area"
            className={`filter-select ${filters.area !== 'all' ? 'has-value' : ''}`}
            value={filters.area}
            onChange={(e) => updateFilter('area', e.target.value)}
            aria-label="Filter by Area"
          >
            <option value="all">All Areas</option>
            {MOCK_AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Zone Filter */}
        <div className="flex items-center gap-1">
          <label htmlFor="filter-zone" className="filter-label">Zone:</label>
          <select
            id="filter-zone"
            className={`filter-select ${filters.zone !== 'all' ? 'has-value' : ''}`}
            value={filters.zone}
            onChange={(e) => updateFilter('zone', e.target.value)}
            aria-label="Filter by Purdue Zone"
          >
            <option value="all">All Zones (L0-L4)</option>
            {MOCK_ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} (L{z.purdueLevel})
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1">
          <label htmlFor="filter-severity" className="filter-label">Severity:</label>
          <select
            id="filter-severity"
            className={`filter-select ${filters.severity !== 'all' ? 'has-value' : ''}`}
            value={filters.severity}
            onChange={(e) => updateFilter('severity', e.target.value)}
            aria-label="Filter by Severity"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High & Critical</option>
            <option value="medium">Medium</option>
            <option value="low">Low / Info</option>
          </select>
        </div>

        {/* Criticality Filter */}
        <div className="flex items-center gap-1">
          <label htmlFor="filter-criticality" className="filter-label">Criticality:</label>
          <select
            id="filter-criticality"
            className={`filter-select ${filters.criticality !== 'all' ? 'has-value' : ''}`}
            value={filters.criticality}
            onChange={(e) => updateFilter('criticality', e.target.value)}
            aria-label="Filter by Asset Criticality"
          >
            <option value="all">All Criticalities</option>
            <option value="critical">Crown Jewels Only</option>
            <option value="high">High Criticality</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Time Range Pills & Reset */}
      <div className="flex items-center gap-3">
        <div className="time-pills-group" role="group" aria-label="Time range selector">
          {(['24h', '7d', '30d'] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`time-pill-btn ${filters.timeRange === t ? 'active' : ''}`}
              onClick={() => updateFilter('timeRange', t)}
              aria-pressed={filters.timeRange === t}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={resetFilters}
            aria-label="Reset all filters to defaults"
          >
            <RotateCcw size={13} aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
