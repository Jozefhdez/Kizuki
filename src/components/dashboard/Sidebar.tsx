import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import FolderItem from "./FolderItem";

interface SidebarProps {
  onPageSelect?: (pageId: string) => void;
  currentPageId?: string;
}

function Sidebar({ onPageSelect, currentPageId }: SidebarProps) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Datos de ejemplo - esto vendría de un estado global o API
  const folders = [
    {
      id: "folder-1",
      title: "Personal",
      pages: [
        { id: "page-1", title: "Daily Notes", icon: "📄" },
        { id: "page-2", title: "Ideas", icon: "💡" },
        { id: "page-3", title: "Goals", icon: "🎯" }
      ]
    },
    {
      id: "folder-2",
      title: "Work",
      pages: [
        { id: "page-4", title: "Meeting Notes", icon: "📝" },
        { id: "page-5", title: "Project Plans", icon: "📋" },
        { id: "page-6", title: "Task List", icon: "✅" }
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/src/assets/kizuki.svg" alt="Kizuki" className="logo" />
          <span className="logo-text">Kizuki</span>
        </div>
        <button className="sidebar-toggle">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M3 8h10M3 4h10M3 12h10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
      </div>

      <div className="sidebar-content">
        <div className="profile-section">
          <div className="profile-info">
            <div className="profile-avatar">
              <span>U</span>
            </div>
            <div className="profile-details">
              <div className="profile-name">Usuario</div>
              <div className="profile-email">user@example.com</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M10 3V1.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V13m0-10l4 4-4 4m4-4H6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-header">
              <span>Folders</span>
              <button className="add-btn">
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            <div className="folder-list">
              {folders.map((folder) => (
                <FolderItem
                  key={folder.id}
                  id={folder.id}
                  title={folder.title}
                  pages={folder.pages}
                  onPageClick={onPageSelect}
                  currentPageId={currentPageId}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="settings-btn">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>Settings</span>
          </button>
          <button className="trash-btn">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M3 4h10l-1 9H4L3 4zM5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M7 7v4M9 7v4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>Trash</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
