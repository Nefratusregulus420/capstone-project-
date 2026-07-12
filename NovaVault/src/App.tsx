import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import Login from "./Components/Authentication/Login";
import Register from "./Components/Authentication/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import PhotosGallery from "./Components/PhotosGallery/PhotosGallery";
import ProfilePage from "./Components/Profile/ProfilePage";

type FileType = "All" | "Photos" | "Files";
export type RecentUpload = { id: string; name: string; meta: string; type: Exclude<FileType, "All">; url?: string };

const App = () => {
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const { user, loading } = useAuth();
  if (loading) return null;
  const secure = (element: React.ReactElement) => user ? element : <Navigate to="/" replace />;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route
        path="/dashboard"
        element={secure(<Dashboard recentUploads={recentUploads} setRecentUploads={setRecentUploads} />)}
      />
      <Route
        path="/photos-gallery"
        element={secure(<PhotosGallery recentUploads={recentUploads} setRecentUploads={setRecentUploads} />)}
      />
      <Route path="/profile" element={secure(<ProfilePage />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default App;
