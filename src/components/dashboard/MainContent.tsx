import React from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { FileService } from "../../services/fileService";
import PDFRenderer from "./PDFRender";

interface MainContentProps {
  currentPageId?: string;
  onContentChange?: (content: string) => void;
  sidebarCollapsed?: boolean;
}

function MainContent({ currentPageId }: MainContentProps) {
  const [value, setValue] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [initialContent, setInitialContent] = React.useState("");
  const [folderName, setFolderName] = React.useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const pdfRef = React.useRef<HTMLDivElement>(null);

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
        icon: "",
        content: "Welcome to Kizuki",
      };
    }

    if (currentPage) {
      return {
        title: currentPage.title,
        icon: "",
        content: currentPage.content,
      };
    }

    return { 
      title: "Loading...", 
      icon: "󱦟", 
      content: "" 
    };
  };

  const pageContent = getPageContent();

  return (
    <div className="main-content">
      <div className="content-header">
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
                    <div className="welcome-icon">🚀</div>
                    <h2>Welcome to Kizuki!</h2>
                    <p>Your personal space to create, organize and share your ideas.</p>
                  </div>
                  
                  <div className="welcome-features">
                    <div className="feature-card">
                      <div className="feature-icon">📁</div>
                      <h3>Organize by folders</h3>
                      <p>Create folders to organize your pages and keep everything tidy.</p>
                    </div>
                    
                    <div className="feature-card">
                      <div className="feature-icon">✍️</div>
                      <h3>Markdown Editor</h3>
                      <p>Write with Markdown syntax and see a real-time preview.</p>
                    </div>
                    
                    <div className="feature-card">
                      <div className="feature-icon">📄</div>
                      <h3>Export to PDF</h3>
                      <p>Convert your pages to PDF with a single click to share or print.</p>
                    </div>
                    
                    <div className="feature-card">
                      <div className="feature-icon">💾</div>
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
