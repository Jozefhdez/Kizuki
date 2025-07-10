import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import MainContent from "../components/dashboard/MainContent";
import "../styles/Dashboard.css";

function Dashboard() {
  const [currentPageId, setCurrentPageId] = useState<string | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handlePageSelect = (pageId: string) => {
    setCurrentPageId(pageId);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        onPageSelect={handlePageSelect} 
        currentPageId={currentPageId}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <MainContent currentPageId={currentPageId} sidebarCollapsed={sidebarCollapsed} />
    </div>
  );
}

export default Dashboard;
