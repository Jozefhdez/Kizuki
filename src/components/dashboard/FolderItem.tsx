import { useState } from "react";
import PageItem from "./PageItem";
import type { Page } from "../../types/dashboard";

interface FolderItemProps {
  id: string;
  title: string;
  pages: Page[];
  onPageClick?: (pageId: string) => void;
  currentPageId?: string;
}

function FolderItem({ title, pages, onPageClick, currentPageId }: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="folder-item-container">
      <button 
        className={`folder-item ${isOpen ? 'active' : ''}`}
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
          <span className="folder-emoji">📁</span>
        </div>
        <span className="folder-title">{title}</span>
      </button>
      
      <div className={`folder-content ${isOpen ? 'open' : ''}`}>
        <div className="folder-items">
          {pages.map((page) => (
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
