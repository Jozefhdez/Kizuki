import React from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { FileService } from "../../services/fileService";
import PDFRenderer from "./PDFRender";

interface MainContentProps {
  currentPageId?: string;
  onContentChange?: (content: string) => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

function MainContent({ currentPageId, onToggleSidebar }: MainContentProps) {
  const [value, setValue] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [initialContent, setInitialContent] = React.useState("");
  const [folderName, setFolderName] = React.useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const pdfRef = React.useRef<HTMLDivElement>(null);

  // Check if device is mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileMenuToggle = () => {
    if (isMobile && onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const handleSharePDF = () => {
    if (!currentPage || !value || !pdfRef.current) {
      alert("No content to export");
      return;
    }

    setIsGeneratingPDF(true);
    
    // Crear una nueva ventana para imprimir
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = pdfRef.current.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${currentPage.title}</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { margin: 1in; }
              }
              body {
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.6;
                color: #333;
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Esperar a que cargue y luego imprimir
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
        setIsGeneratingPDF(false);
      };
    } else {
      setIsGeneratingPDF(false);
    }
  };
  
  React.useEffect(() => {
    if (currentPageId) {
      loadPageContent(currentPageId);
    } else {
      setCurrentPage(null);
      setValue("");
      setInitialContent("");
      setHasUnsavedChanges(false);
      setFolderName("");
    }
  }, [currentPageId]);

  // Ctrl + s
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && currentPageId) {
          saveContent();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, currentPageId, value]);

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  React.useEffect(() => {
    if (!currentPageId || !hasUnsavedChanges) return;

    const timeoutId = setTimeout(async () => {
      saveContent();
    }, 30000);

    return () => clearTimeout(timeoutId);
  }, [value, currentPageId, hasUnsavedChanges]);

  const saveContent = async () => {
    if (!currentPageId || !hasUnsavedChanges) return;

    try {
      setIsSaving(true);
      console.log("Saving content for page:", currentPageId);
      
      await FileService.updatePageContent(currentPageId, value);
      console.log("Content saved successfully");
      setHasUnsavedChanges(false);
      setInitialContent(value);
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadPageContent = async (pageId: string) => {
    try {
      const page = await FileService.getPageById(pageId);
      setCurrentPage(page);
      setValue(page.content);
      setInitialContent(page.content);
      setHasUnsavedChanges(false);
      
      if (page.folderId) {
        const folderName = await FileService.getFolderById(page.folderId);
        setFolderName(folderName);
      }
    } catch (error) {
      console.error("Error loading page:", error);
      setCurrentPage(null);
      setValue("");
      setInitialContent("");
      setFolderName("");
    }
  };

  const handleEditorChange = (val: string | undefined) => {
    if (val !== undefined) {
      setValue(val);
      if (val !== initialContent) {
        setHasUnsavedChanges(true);
      } else {
        setHasUnsavedChanges(false);
      }
    }
  };

  const getPageContent = () => {
    if (!currentPageId) {
      return {
        title: "Getting Started",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ),
        content: "Welcome to Kizuki",
      };
    }

    if (currentPage) {
      return {
        title: currentPage.title,
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        ),
        content: currentPage.content,
      };
    }

    return { 
      title: "Loading...", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      ), 
      content: "" 
    };
  };

  const pageContent = getPageContent();

  // Handle clicks outside sidebar on mobile
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && onToggleSidebar && event.target instanceof Element) {
        const sidebar = document.querySelector('.sidebar');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (sidebar && !sidebar.contains(event.target) && 
            mobileMenuToggle && !mobileMenuToggle.contains(event.target)) {
          // Close sidebar if clicked outside
          const sidebarElement = document.querySelector('.sidebar.mobile-open');
          if (sidebarElement) {
            onToggleSidebar();
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, onToggleSidebar]);

  return (
    <div className="main-content">
      <div className="content-header">
        {isMobile && (
          <button className="mobile-menu-toggle" onClick={handleMobileMenuToggle}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        )}
        <div className="breadcrumb">
          <span className="breadcrumb-item">{folderName || "Kizuki"}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">{pageContent.title}</span>
        </div>
        <div className="save-status">
          <div className="save-indicator-dot" data-status={
            isSaving ? 'saving' : 
            hasUnsavedChanges ? 'unsaved' : 
            currentPageId ? 'saved' : 'none'
          }></div>
        </div>
        <div className="content-actions">
          <button 
            className={`save-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
            onClick={saveContent}
            disabled={isSaving}
            title={
              isSaving ? 'Saving...' :
              hasUnsavedChanges ? 'Save changes (Ctrl+S)' :
              'No changes to save'
            }
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                d="M3 2h8l2 2v9a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1zm1 1v10h8V5h-2V3H4zm5 0v2h2l-2-2z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button 
            className="action-btn"
            onClick={handleSharePDF}
            disabled={isGeneratingPDF || !currentPage}
            title={isGeneratingPDF ? 'Generating PDF...' : 'Export as PDF'}
          >
            {isGeneratingPDF ? (
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M8 2a6 6 0 100 12 6 6 0 000-12z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M8 2a6 6 0 015.29 8.71L12 10a4 4 0 10-5.29-5.29L8 2z"
                  fill="currentColor"
                  className="animate-spin"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M3 2h6l4 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm6 3V2l4 3h-4z"
                  fill="currentColor"
                />
              </svg>
            )}
            <span>{isGeneratingPDF ? 'Generating...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      <div className="content-body">
        <div className="page-header">
          <div className="page-icon-large">{pageContent.icon}</div>
          <h1 className="page-title">{pageContent.title}</h1>
        </div>

        <div className="editor-container">
          <div className="editor-content">
            <div className="content-block">
              {!currentPageId ? (
                <div className="welcome-content">
                  <div className="welcome-hero">
                    <div className="welcome-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                    </div>
                    <h2>Welcome to Kizuki!</h2>
                    <p>Your personal space to create, organize and share your ideas.</p>
                  </div>
                  
                  <div className="welcome-features">
                    <div className="feature-card">
                      <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                      </div>
                      <h3>Organize by folders</h3>
                      <p>Create folders to organize your pages and keep everything tidy.</p>
                    </div>
                    
                    <div className="feature-card">
                      <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10,9 9,9 8,9"/>
                        </svg>
                      </div>
                      <h3>Markdown Editor</h3>
                      <p>Write with Markdown syntax and see a real-time preview.</p>
                    </div>
                    
                    <div className="feature-card">
                      <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <line x1="12" y1="9" x2="8" y2="9"/>
                        </svg>
                      </div>
                      <h3>Export to PDF</h3>
                      <p>Convert your pages to PDF with a single click to share or print.</p>
                    </div>
                    
                    <div className="feature-card">
                      <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                      </div>
                      <h3>Auto-save</h3>
                      <p>Your changes are automatically saved every 30 seconds.</p>
                    </div>
                  </div>
                  
                  <div className="welcome-actions">
                    <div className="action-tip">
                      <strong>To get started:</strong> Create a new folder in the sidebar and then add pages inside it.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="custom-md-editor">
                  <MDEditor
                    value={value}
                    onChange={handleEditorChange}
                    data-color-mode="light"
                    height="100%"
                    hideToolbar={true}
                    visibleDragbar={false}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Componente oculto para renderizar el PDF */}
      <div style={{ display: 'none' }}>
        <PDFRenderer 
          ref={pdfRef}
          content={value}
          title={pageContent.title}
          folderName={folderName || "Kizuki"}
        />
      </div>
    </div>
  );
}

export default MainContent;
