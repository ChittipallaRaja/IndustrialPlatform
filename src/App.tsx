import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { AppSidebar } from './components/common/AppSidebar';
import { AppHeader } from './components/common/AppHeader';
import { GlobalFilterBar } from './components/common/GlobalFilterBar';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { AttackPathWorkspace } from './components/attack-path/AttackPathWorkspace';
import { InvestigationDrawer } from './components/drawers/InvestigationDrawer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { DesignRationaleModal } from './components/modals/DesignRationaleModal';
import { ToastContainer } from './components/common/ToastContainer';
import './styles/global.css';
import './styles/components.css';
import './styles/graph.css';

const AppContent: React.FC = () => {
  const { currentView } = usePlatform();

  return (
    <div className="app-layout">
      {/* Left Navigation Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Top Header & Simulation State Switcher */}
        <AppHeader />

        {/* Global Filter Bar (Available on Dashboard) */}
        {currentView === 'dashboard' && <GlobalFilterBar />}

        {/* Primary Operational Views */}
        <main role="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {currentView === 'dashboard' && <MainDashboard />}
          {currentView === 'attack-path' && <AttackPathWorkspace />}
        </main>

        {/* Contextual Non-Modal Investigation Drawer (Preserves Graph & Dashboard Viewport) */}
        <InvestigationDrawer />

        {/* Global Search Dialog (Ctrl+K) */}
        <GlobalSearchModal />

        {/* Design Rationale & Documentation Modal */}
        <DesignRationaleModal />

        {/* Multi-Channel Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
};

export default App;
