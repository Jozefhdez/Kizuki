import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import MainContent from "../components/dashboard/MainContent";
import "../styles/Dashboard.css";

function Dashboard() {
  const [currentPageId, setCurrentPageId] = useState<string | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePageSelect = (pageId: string) => {
    setCurrentPageId(pageId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="dashboard-container">
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay active" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar 
        onPageSelect={handlePageSelect} 
        currentPageId={currentPageId}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        className={isMobile && sidebarOpen ? 'mobile-open' : ''}
      />
      <MainContent 
        currentPageId={currentPageId} 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}

export default Dashboard;
