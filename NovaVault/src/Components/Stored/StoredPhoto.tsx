import { FaImage, FaEllipsisVertical, FaArrowUpFromBracket } from "react-icons/fa6";
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
}

const StoredPhotos = ({ photos, onUploadClick }: StoredPhotosProps) => {
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
              <button className="photo-actions-btn" aria-label={`More options for ${photo.name}`}>
                <FaEllipsisVertical />
              </button>
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
