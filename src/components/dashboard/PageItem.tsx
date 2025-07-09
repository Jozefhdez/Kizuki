interface PageItemProps {
  id: string;
  title: string;
  icon: string;
  onClick?: () => void;
  isActive?: boolean;
}

function PageItem({ id, title, icon, onClick, isActive = false }: PageItemProps) {
  return (
    <button 
      className={`folder-sub-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      data-page-id={id}
    >
      <span className="page-icon">{icon}</span>
      <span className="page-title">{title}</span>
    </button>
  );
}

export default PageItem;
