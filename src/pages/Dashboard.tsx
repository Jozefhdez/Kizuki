import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import MainContent from "../components/dashboard/MainContent";
import "../styles/Dashboard.css";

function Dashboard() {
  const [currentPageId, setCurrentPageId] = useState<string | undefined>(undefined);

  const handlePageSelect = (pageId: string) => {
    setCurrentPageId(pageId);
  };

  return (
    <div className="dashboard-container">
      <Sidebar onPageSelect={handlePageSelect} currentPageId={currentPageId} />
      <MainContent currentPageId={currentPageId} />
    </div>
  );
}

export default Dashboard;
