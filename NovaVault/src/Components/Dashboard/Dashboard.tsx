import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  FaTableCellsLarge,
  FaXmark,
} from "react-icons/fa6";
import "./Dashboard.css";
import logo from "../../assets/images/logo.png";
import StoredPhotos from "../Stored/StoredPhoto";
import StoredFiles from "../Stored/StoredFiles";
import type { RecentUpload } from "../../App";
import { fileService } from "../../services/services";
import { useAuth } from "../../auth";

const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

interface DashboardProps {
  recentUploads: RecentUpload[];
  setRecentUploads: React.Dispatch<React.SetStateAction<RecentUpload[]>>;
}

const Dashboard = ({ recentUploads, setRecentUploads }: DashboardProps) => {
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = (searchParams.get("view") as "Overview" | "Photos" | "Files") || "Overview";
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const visibleUploads = useMemo(() => {
    const filterType = currentView === "Photos" ? "Photos" : currentView === "Files" ? "Files" : "All";
    return recentUploads.filter((file) =>
      (filterType === "All" || file.type === filterType) && file.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [currentView, query, recentUploads]);

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
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-topbar">
          <a className="brand" href="/dashboard" aria-label="NovaVault dashboard"><img src={logo} alt="" /><span>NovaVault</span></a>
          <div className="library-toggle" aria-label="Choose library view">
            <button className="" onClick={() => navigate("/photos-gallery")} aria-pressed={false}>
              <FaImage /> Photos
            </button>
            <button className="active" onClick={() => navigate("/dashboard")} aria-pressed={true}>
              <FaFile /> Files
            </button>
          </div>
          <div className="search-field"><FaMagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your vault" /></div>
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

        <div className={`dashboard-layout ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
          <aside className="dashboard-sidebar">
            <button className="upload-button" onClick={() => setIsUploadModalOpen(true)}><FaArrowUpFromBracket /> Upload</button>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen((isOpen) => !isOpen)} aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"} title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>{sidebarOpen ? <FaAnglesLeft /> : <FaAnglesRight />}</button>
            <nav className="sidebar-nav" aria-label="File navigation">
              <button className={`nav-item ${currentView === "Overview" ? "active" : ""}`} onClick={() => setSearchParams({})}><FaTableCellsLarge /> Overview</button>
              <button className={`nav-item ${currentView === "Photos" ? "active" : ""}`} onClick={() => setSearchParams({ view: "Photos" })}><FaImage /> Photos</button>
              <button className={`nav-item ${currentView === "Files" ? "active" : ""}`} onClick={() => setSearchParams({ view: "Files" })}><FaFile /> Files</button>
            </nav>
            <div className="storage-card"><div className="storage-icon"><FaFolderOpen /></div><strong>Keep it safe.</strong><p>Your files are encrypted and ready whenever you are.</p><div className="storage-meter"><span /></div><small>2.8 GB of 10 GB used</small></div>
          </aside>

          <section className="dashboard-content">
            <div className="content-heading">
              <div>
                <p className="eyebrow">YOUR PRIVATE SPACE</p>
                <h1>
                  {currentView === "Overview"
                    ? "Recent uploads"
                    : currentView === "Photos"
                    ? "Recent photos upload"
                    : "Recent files upload"}
                </h1>
                <p>
                  {currentView === "Overview"
                    ? "Everything you added to NovaVault, in one place."
                    : currentView === "Photos"
                    ? "Your secure gallery of uploaded photos."
                    : "Your secure collection of uploaded files."}
                </p>
              </div>
              <button className="view-button"><FaTableCellsLarge /> View all</button>
            </div>
            
            <div className="filter-tabs" role="tablist" aria-label="Upload filters">
              <button className={currentView === "Overview" ? "selected" : ""} onClick={() => setSearchParams({})} role="tab">All</button>
              <button className={currentView === "Photos" ? "selected" : ""} onClick={() => setSearchParams({ view: "Photos" })} role="tab">Photos</button>
              <button className={currentView === "Files" ? "selected" : ""} onClick={() => setSearchParams({ view: "Files" })} role="tab">Files</button>
            </div>

            {currentView === "Photos" ? (
              <StoredPhotos
                photos={visibleUploads.filter((file): file is RecentUpload & { type: "Photos" } => file.type === "Photos")}
                onUploadClick={() => setIsUploadModalOpen(true)}
              />
            ) : currentView === "Files" ? (
              <StoredFiles
                files={visibleUploads.filter((file): file is RecentUpload & { type: "Files" } => file.type === "Files")}
                onUploadClick={() => setIsUploadModalOpen(true)}
              />
            ) : (
              <div className="upload-list">
                {visibleUploads.length > 0 ? (
                  visibleUploads.map((file) => (
                    <article className="file-row" key={file.id}>
                      <span className={`file-icon ${file.type.toLowerCase()}`}>
                        {file.type === "Photos" ? <FaImage /> : <FaFile />}
                      </span>
                      <div>
                        <h2>{file.name}</h2>
                        <p>{file.meta}</p>
                      </div>
                      <button className="more-button" aria-label={`More options for ${file.name}`}><FaEllipsisVertical /></button>
                    </article>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-illustration" aria-hidden="true">
                      <span className="illustration-sheet sheet-back" />
                      <span className="illustration-sheet sheet-front"><FaArrowUpFromBracket /></span>
                      <span className="illustration-spark spark-one" /><span className="illustration-spark spark-two" />
                    </div>
                    <strong>{recentUploads.length ? "No matching uploads" : "No recent uploads"}</strong>
                    <p>{recentUploads.length ? "Try a different search or filter." : "Your newest photos and files will appear here once you upload them."}</p>
                    {!recentUploads.length && <button className="empty-upload-button" onClick={() => setIsUploadModalOpen(true)}><FaArrowUpFromBracket /> Upload your first file</button>}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
        <input ref={fileInputRef} className="file-input" type="file" multiple onChange={handleFileSelection} />
        {isUploadModalOpen && <div className="upload-modal-overlay" role="presentation" onMouseDown={() => setIsUploadModalOpen(false)}>
          <section className="upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close-button" onClick={() => setIsUploadModalOpen(false)} aria-label="Close upload dialog"><FaXmark /></button>
            <p className="eyebrow">ADD TO NOVAVAULT</p><h2 id="upload-modal-title">Upload files</h2><p className="upload-modal-copy">Choose how you would like to add files to your private vault.</p>
            <div className="upload-source-actions"><button className="browse-button" onClick={openFilePicker}><FaFile /> Browse files</button><button className="drive-button" type="button"><FaCloudArrowUp /> Upload from Drive</button></div>
            <div className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} onClick={openFilePicker} role="button" tabIndex={0}><span className="drop-zone-icon"><FaArrowUpFromBracket /></span><strong>Drag and drop files here</strong><p>or click this area to browse from your device</p></div>
          </section>
        </div>}
      </section>
    </main>
  );
};

export default Dashboard;
