interface MainContentProps {
  currentPageId?: string;
  onContentChange?: (content: string) => void;
}

function MainContent({ currentPageId }: MainContentProps) {
  // Aquí podrías cargar el contenido basado en currentPageId
  const getPageContent = (pageId?: string) => {
    if (!pageId) {
      return {
        title: "Getting Started",
        icon: "📄",
        content: "Welcome to Kizuki"
      };
    }

    return { title: "Page Not Found", icon: "❓", content: "Page not found" };
  };

  const pageContent = getPageContent(currentPageId);

  return (
    <div className="main-content">
      <div className="content-header">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Kizuki</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">{pageContent.title}</span>
        </div>
        <div className="content-actions">
          <button className="action-btn">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>Share</span>
          </button>
          <button className="action-btn">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="1" fill="currentColor"/>
              <circle cx="8" cy="4" r="1" fill="currentColor"/>
              <circle cx="8" cy="12" r="1" fill="currentColor"/>
            </svg>
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
              <h2>{pageContent.title}</h2>
              <p>{pageContent.content}</p>
            </div>
            
            {!currentPageId && (
              <>
                <div className="content-block">
                  <h3>Getting Started</h3>
                  <ul>
                    <li>Create new pages from the sidebar</li>
                    <li>Use the editor to write and format your content</li>
                    <li>Organize your pages with folders and tags</li>
                    <li>Share your work with others</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
