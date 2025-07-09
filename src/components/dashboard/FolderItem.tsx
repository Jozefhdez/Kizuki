import { useState, useEffect } from "react";
import PageItem from "./PageItem";
import type { Page, User } from "../../types/dashboard";
import { FileService } from "../../services/fileService";

interface FolderItemProps {
  id: string;
  title: string;
  pages: Page[];
  onPageClick?: (pageId: string) => void;
  currentPageId?: string;
  user?: User | null; 
  onPagesUpdate?: (folderId: string, pages: Page[]) => void;
}

function FolderItem({
  id,
  title,
  pages,
  onPageClick,
  currentPageId,
  user,
  onPagesUpdate,
}: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [creatingPage, setCreatingPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPages, setLocalPages] = useState<Page[]>(pages);

  useEffect(() => {
    setLocalPages(pages);
  }, [pages]);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  const loadPages = async (userId: string) => {
    if (!user?.id) return; 

    try {
      const userPages = await FileService.getPageByUserAndFolder(userId);
      setLocalPages(userPages);
      onPagesUpdate?.(id, userPages);
    } catch (fallbackErr) {
      console.error("Fallback error:", fallbackErr);
      setError("Error loading pages");
    }
  };

  const handleCreatePage = async (
    userId: string,
    title: string,
    slug: string,
    folderId: string
  ) => {
    try {
      await FileService.createPage(userId, title, slug, folderId);
      await loadPages(userId);
    } catch (err) {
      console.error("Error creating page:", err);
      setError("Error creating page");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const pageName = formData.get("PageName") as string;

    if (!pageName?.trim() || !user?.id) return;

    try {
      await handleCreatePage(user.id, pageName.trim(), "", id);
      setCreatingPage(false);
    } catch (err) {
      console.error("Error creating file:", err);
      setError("Error creating file");
    }
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

  if (creatingPage) {
    return (
      <div className="dashboard-container">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>New Page</h3>
              <button
                className="close-btn"
                onClick={() => setCreatingPage(false)}
              >
                ✕
              </button>
            </div>

            <form className="create-file-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="fileName">Page name</label>
                <input
                  type="text"
                  id="PageName"
                  name="PageName"
                  placeholder="Insert page name"
                  required
                  autoFocus
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCreatingPage(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create page
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="folder-item-container">
      <div className="folder-item-header">
        <button 
          className={`folder-item ${isOpen ? "active" : ""}`}
          onClick={toggleFolder}
        >
          <div className="folder-icon">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              className={`folder-chevron ${isOpen ? 'open' : ''}`}
            >
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span className="folder-emoji">󰉋</span>
          </div>
          <span className="folder-title">{title}</span>
        </button>
        
        <button 
          className="add-btn"
          onClick={(e) => {
            e.stopPropagation();
            setCreatingPage(true);
          }}
          title="Añadir página"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
      </div>
      
      <div className={`folder-content ${isOpen ? "open" : ""}`}>
        <div className="folder-items">
          {localPages.map((page) => (
            <PageItem
              key={page.id}
              id={page.id}
              title={page.title}
              onClick={() => onPageClick?.(page.id)}
              isActive={currentPageId === page.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FolderItem;
