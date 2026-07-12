import { useState } from "react";
import { FaFile, FaEllipsisVertical, FaArrowUpFromBracket, FaTrash } from "react-icons/fa6";
import "./StoredFiles.css";

type DocFile = {
  id: string;
  name: string;
  meta: string;
  type: "Files";
};

interface StoredFilesProps {
  files: DocFile[];
  onUploadClick: () => void;
  onDelete: (id: string) => void;
}

const StoredFiles = ({ files, onUploadClick, onDelete }: StoredFilesProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (files.length === 0) {
    return (
      <div className="files-empty-state">
        <div className="empty-illustration" aria-hidden="true">
          <span className="illustration-sheet sheet-back" />
          <span className="illustration-sheet sheet-front">
            <FaFile />
          </span>
          <span className="illustration-spark spark-one" />
          <span className="illustration-spark spark-two" />
        </div>
        <strong>No recent files upload</strong>
        <p>Your newest files will appear here once you upload them.</p>
        <button className="empty-upload-button" onClick={onUploadClick}>
          <FaArrowUpFromBracket /> Upload your first file
        </button>
      </div>
    );
  }

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      onDelete(id);
    }
    setOpenMenuId(null);
  };

  return (
    <div className="stored-files-container">
      <div className="stored-files-list">
        {files.map((file) => (
          <article className="file-row-item" key={file.id}>
            <div className="file-icon-wrapper">
              <FaFile />
            </div>
            <div className="file-row-info">
              <h3 className="file-row-name" title={file.name}>{file.name}</h3>
              <p className="file-row-meta">{file.meta}</p>
            </div>
            <button
              className="file-row-actions-btn"
              aria-label={`More options for ${file.name}`}
              onClick={() => handleMenuToggle(file.id)}
            >
              <FaEllipsisVertical />
            </button>
            {openMenuId === file.id && (
              <div className="file-dropdown-menu" role="menu">
                <button
                  className="dropdown-menu-item delete-item"
                  role="menuitem"
                  onClick={(e) => handleDelete(file.id, file.name, e)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default StoredFiles;
