import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import FolderItem from "./FolderItem";
import { useEffect, useState } from "react";
import type { User, Folder, Page } from "../../types/dashboard";
import { FileService } from "../../services/fileService";

interface SidebarProps {
  onPageSelect?: (pageId: string) => void;
  currentPageId?: string;
}

function Sidebar({ onPageSelect, currentPageId }: SidebarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [creatingFolder, setCreatingFolder] = useState(false);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Obtener información del usuario
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          navigate("/");
          return;
        }

        setUser({
          id: authUser.id,
          email: authUser.email || "",
          created_at: authUser.created_at || "",
        });

        // Load user folders
        await loadFolders(authUser.id);
      } catch (err) {
        console.error("Error initializing dashboard:", err);
        setError("Error al cargar el dashboard");
      }
    };

    initializeDashboard();
  }, [navigate]);

  const loadFolders = async (userId: string) => {
    try {
      const userFolders = await FileService.getFoldersByUser(userId);
      setFolders(userFolders);
    } catch (fallbackErr) {
      console.error("Fallback error:", fallbackErr);
      setError("Error loading folders");
    }
  };

  const handleCreateFolder = async (
    userId: string,
    name: string,
    parentPath = ""
  ) => {
    try {
      await FileService.createFolder(userId, name, parentPath);
      await loadFolders(userId);
    } catch (err) {
      console.error("Error creating folder:", err);
      setError("Error creating folder");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const folderName = formData.get("folderName") as string;

    if (!folderName?.trim()) return;

    try {
      await handleCreateFolder(user.id, folderName.trim());
      setCreatingFolder(false);
    } catch (err) {
      console.error("Error creating folder:", err);
      setError("Error creating folder");
    }
  };

  const handlePagesUpdate = (folderId: string, pages: Page[]) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === folderId ? { ...folder, pages } : folder
      )
    );
  };

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="error-message">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (creatingFolder) {
    return (
      <div className="dashboard-container">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>New folder</h3>
              <button
                className="close-btn"
                onClick={() => setCreatingFolder(false)}
              >
                ✕
              </button>
            </div>

            <form className="create-folder-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="folderName">Folder name</label>
                <input
                  type="text"
                  id="folderName"
                  name="folderName"
                  placeholder="Insert folder name"
                  required
                  autoFocus
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCreatingFolder(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create folder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/src/assets/kizuki.svg" alt="Kizuki" className="logo" />
          <span className="logo-text">Kizuki</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width="18.5" 
            height="18.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </button>
      </div>

      <div className="sidebar-content">
        <div className="profile-section">
          <div className="profile-info">
            <div className="profile-avatar">
              <span>{user?.email[0]}</span>
            </div>
            <div className="profile-details">
              <div className="profile-email">{user?.email}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-header">
              <span>Folders</span>
              <button
                className="add-btn"
                onClick={() => setCreatingFolder(true)}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path
                    d="M6 1v10M1 6h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
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
                  user={user}
                  onPagesUpdate={handlePagesUpdate}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="settings-btn">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <span>Settings</span>
          </button>
          <button className="trash-btn">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                d="M3 4h10l-1 9H4L3 4zM5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M7 7v4M9 7v4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <span>Trash</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
