import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaArrowUpFromBracket,
  FaCloudArrowUp,
  FaEllipsisVertical,
  FaFile,
  FaFolderOpen,
  FaImage,
  FaMagnifyingGlass,
  FaRegBell,
  FaXmark,
  FaHeart,
  FaImages
} from "react-icons/fa6";
import "./PhotosGallery.css";
import logo from "../../assets/images/logo.png";
import type { RecentUpload } from "../../App";
import { fileService } from "../../services/services";
import { useAuth } from "../../auth";

const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

interface PhotosGalleryProps {
  recentUploads: RecentUpload[];
  setRecentUploads: React.Dispatch<React.SetStateAction<RecentUpload[]>>;
}

type GalleryTab = "All" | "Albums" | "Favorites";

const PhotosGallery = ({ recentUploads, setRecentUploads }: PhotosGalleryProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeGalleryTab, setActiveGalleryTab] = useState<GalleryTab>("All");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter only photos that match search query
  const photos = useMemo(() => {
    return recentUploads.filter((file) =>
      file.type === "Photos" && file.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [recentUploads, query]);

  const openFilePicker = () => fileInputRef.current?.click();
  
  const addRecentUploads = async (files: File[]) => {
    await fileService.upload(files);
    setRecentUploads((current) => [
      ...files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}-${Date.now()}`,
        name: file.name,
        meta: `${file.type.startsWith("image/") ? "Image" : "File"} · ${formatFileSize(file.size)}`,
        type: file.type.startsWith("image/") ? ("Photos" as const) : ("Files" as const),
        url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      })),
      ...current,
    ]);
    setIsUploadModalOpen(false);
  };

  const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    await addRecentUploads(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    await addRecentUploads(Array.from(event.dataTransfer.files));
  };

  return (
    <main className="gallery-page">
      <section className="gallery-shell">
        {/* Sync Header with Dashboard but Photos is Active */}
        <header className="gallery-topbar">
          <a className="brand" href="/dashboard" aria-label="NovaVault dashboard">
            <img src={logo} alt="" />
            <span>NovaVault</span>
          </a>
          <div className="library-toggle" aria-label="Choose library view">
            <button className="active" onClick={() => navigate("/photos-gallery")} aria-pressed={true}>
              <FaImage /> Photos
            </button>
            <button className="" onClick={() => navigate("/dashboard")} aria-pressed={false}>
              <FaFile /> Files
            </button>
          </div>
          <div className="search-field">
            <FaMagnifyingGlass />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your photos" />
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications"><FaRegBell /></button>
            <div className="profile-menu-wrap">
              <button className="profile-button" aria-label="Open profile menu" aria-expanded={isProfileMenuOpen} onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}>{user?.username.slice(0, 2).toUpperCase()}</button>
              {isProfileMenuOpen && <div className="profile-menu" role="menu">
                <button role="menuitem" onClick={() => navigate("/profile")}>Profile</button>
                <button className="logout-menu-item" role="menuitem" onClick={() => { logout(); navigate("/"); }}>Log out</button>
              </div>}
            </div>
          </div>
        </header>

        <div className={`gallery-layout ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
          {/* OneDrive style Photos sidebar */}
          <aside className="gallery-sidebar">
            <button className="upload-button" onClick={() => setIsUploadModalOpen(true)}>
              <FaArrowUpFromBracket /> Upload Photos
            </button>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen((isOpen) => !isOpen)} aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
              {sidebarOpen ? <FaAnglesLeft /> : <FaAnglesRight />}
            </button>
            
            <nav className="sidebar-nav" aria-label="Photos navigation">
              <button className={`nav-item ${activeGalleryTab === "All" ? "active" : ""}`} onClick={() => setActiveGalleryTab("All")}>
                <FaImage /> All photos
              </button>
              <button className={`nav-item ${activeGalleryTab === "Albums" ? "active" : ""}`} onClick={() => setActiveGalleryTab("Albums")}>
                <FaImages /> Albums
              </button>
              <button className={`nav-item ${activeGalleryTab === "Favorites" ? "active" : ""}`} onClick={() => setActiveGalleryTab("Favorites")}>
                <FaHeart /> Favorites
              </button>
              <button className="nav-item" onClick={() => navigate("/dashboard")}>
                <FaFolderOpen /> Back to Files
              </button>
            </nav>
          </aside>

          {/* Immersive OneDrive style main gallery content */}
          <section className="gallery-content">
            <div className="content-heading">
              <div>
                <p className="eyebrow">GALLERY SPACE</p>
                <h1>Photos</h1>
                <p>Browse and explore all images stored in your private vault.</p>
              </div>
              <button className="view-button" onClick={() => setIsUploadModalOpen(true)}>
                <FaArrowUpFromBracket /> Add photos
              </button>
            </div>

            {/* Pivot Tabs Toolbar */}
            <div className="gallery-tabs" role="tablist">
              <button className={activeGalleryTab === "All" ? "selected" : ""} onClick={() => setActiveGalleryTab("All")} role="tab">All photos</button>
              <button className={activeGalleryTab === "Albums" ? "selected" : ""} onClick={() => setActiveGalleryTab("Albums")} role="tab">Albums</button>
              <button className={activeGalleryTab === "Favorites" ? "selected" : ""} onClick={() => setActiveGalleryTab("Favorites")} role="tab">Favorites</button>
            </div>

            {/* Render Gallery Tabs content */}
            {activeGalleryTab === "All" ? (
              photos.length > 0 ? (
                <div className="timeline-gallery">
                  {/* OneDrive groups photos by dates. We'll group them into "Recently uploaded" */}
                  <div className="timeline-section">
                    <h2 className="timeline-date-header">Recently Uploaded</h2>
                    <div className="photos-masonry-grid">
                      {photos.map((photo) => (
                        <article className="photo-gallery-card" key={photo.id}>
                          <div className="photo-card-wrapper">
                            {photo.url ? (
                              <img src={photo.url} alt={photo.name} className="photo-gallery-img" />
                            ) : (
                              <div className="photo-gallery-placeholder">
                                <FaImage />
                              </div>
                            )}
                            <div className="photo-card-hover-overlay">
                              <button className="photo-action-btn" aria-label="Favorite"><FaHeart /></button>
                              <button className="photo-action-btn" aria-label="More options"><FaEllipsisVertical /></button>
                            </div>
                          </div>
                          <div className="photo-card-meta-details">
                            <span className="photo-meta-name" title={photo.name}>{photo.name}</span>
                            <span className="photo-meta-size">{photo.meta}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="gallery-empty-state">
                  <div className="empty-illustration" aria-hidden="true">
                    <span className="illustration-sheet sheet-back" />
                    <span className="illustration-sheet sheet-front">
                      <FaImage />
                    </span>
                    <span className="illustration-spark spark-one" />
                    <span className="illustration-spark spark-two" />
                  </div>
                  <strong>No photos here yet</strong>
                  <p>Drag and drop images, or click below to upload photos into your vault gallery.</p>
                  <button className="empty-upload-button" onClick={() => setIsUploadModalOpen(true)}>
                    <FaArrowUpFromBracket /> Upload photos
                  </button>
                </div>
              )
            ) : activeGalleryTab === "Albums" ? (
              <div className="gallery-empty-state">
                <div className="empty-illustration" aria-hidden="true">
                  <span className="illustration-sheet sheet-back" />
                  <span className="illustration-sheet sheet-front">
                    <FaImages />
                  </span>
                </div>
                <strong>No albums created yet</strong>
                <p>Group your photos together into custom folders and albums.</p>
                <button className="empty-upload-button" onClick={() => setActiveGalleryTab("All")}>
                  <FaImage /> Go to All Photos
                </button>
              </div>
            ) : (
              <div className="gallery-empty-state">
                <div className="empty-illustration" aria-hidden="true">
                  <span className="illustration-sheet sheet-back" />
                  <span className="illustration-sheet sheet-front">
                    <FaHeart />
                  </span>
                </div>
                <strong>No favorites marked</strong>
                <p>Tap the heart icon on any photo to save it in your favorites collection.</p>
                <button className="empty-upload-button" onClick={() => setActiveGalleryTab("All")}>
                  <FaImage /> Browse photos
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Upload Modal Dialog */}
        <input ref={fileInputRef} className="file-input" type="file" multiple onChange={handleFileSelection} accept="image/*" />
        {isUploadModalOpen && (
          <div className="upload-modal-overlay" role="presentation" onMouseDown={() => setIsUploadModalOpen(false)}>
            <section className="upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title" onMouseDown={(event) => event.stopPropagation()}>
              <button className="modal-close-button" onClick={() => setIsUploadModalOpen(false)} aria-label="Close upload dialog"><FaXmark /></button>
              <p className="eyebrow">ADD TO GALLERY</p>
              <h2 id="upload-modal-title">Upload photos</h2>
              <p className="upload-modal-copy">Add images to your private OneDrive-style photo vault.</p>
              <div className="upload-source-actions">
                <button className="browse-button" onClick={openFilePicker}><FaImage /> Browse device</button>
                <button className="drive-button" type="button"><FaCloudArrowUp /> Import cloud</button>
              </div>
              <div className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} onClick={openFilePicker} role="button" tabIndex={0}>
                <span className="drop-zone-icon"><FaArrowUpFromBracket /></span>
                <strong>Drag and drop photos here</strong>
                <p>or click this area to browse from your device</p>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
};

export default PhotosGallery;
