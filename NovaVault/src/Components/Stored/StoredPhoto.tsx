import { useState } from "react";
import { FaImage, FaEllipsisVertical, FaArrowUpFromBracket, FaTrash } from "react-icons/fa6";
import "./StoredPhoto.css";

type PhotoFile = {
  id: string;
  name: string;
  meta: string;
  type: "Photos";
  url?: string;
};

interface StoredPhotosProps {
  photos: PhotoFile[];
  onUploadClick: () => void;
  onDelete: (id: string) => void;
}

const StoredPhotos = ({ photos, onUploadClick, onDelete }: StoredPhotosProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (photos.length === 0) {
    return (
      <div className="photos-empty-state">
        <div className="empty-illustration" aria-hidden="true">
          <span className="illustration-sheet sheet-back" />
          <span className="illustration-sheet sheet-front">
            <FaImage />
          </span>
          <span className="illustration-spark spark-one" />
          <span className="illustration-spark spark-two" />
        </div>
        <strong>No recent photos upload</strong>
        <p>Your newest photos will appear here once you upload them.</p>
        <button className="empty-upload-button" onClick={onUploadClick}>
          <FaArrowUpFromBracket /> Upload your first photo
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
    <div className="stored-photos-container">
      <div className="stored-photos-grid">
        {photos.map((photo) => (
          <article className="photo-card" key={photo.id}>
            <div className="photo-thumbnail">
              {photo.url ? (
                <img src={photo.url} alt={photo.name} className="photo-img" />
              ) : (
                <div className="photo-placeholder">
                  <FaImage />
                </div>
              )}
              <button
                className="photo-actions-btn"
                aria-label={`More options for ${photo.name}`}
                onClick={() => handleMenuToggle(photo.id)}
              >
                <FaEllipsisVertical />
              </button>
              {openMenuId === photo.id && (
                <div className="photo-dropdown-menu" role="menu">
                  <button
                    className="dropdown-menu-item delete-item"
                    role="menuitem"
                    onClick={(e) => handleDelete(photo.id, photo.name, e)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
            <div className="photo-details">
              <h3 className="photo-name" title={photo.name}>{photo.name}</h3>
              <p className="photo-meta">{photo.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default StoredPhotos;
