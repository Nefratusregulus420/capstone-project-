import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FaArrowLeft, FaCamera, FaCheck, FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./ProfilePage.css";
import { useAuth } from "../../auth";
import { userService } from "../../services/services";

const ProfilePage = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { user, refresh } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const previewProfileImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    if (image) { try { await userService.image(image); setProfileImage(URL.createObjectURL(image)); await refresh(); setMessage("Profile image updated."); } catch (e) { setMessage(e instanceof Error ? e.message : "Image upload failed."); } }
  };
  const save = async (event: React.FormEvent) => { event.preventDefault(); try { await userService.update(username); if (newPassword || currentPassword) await userService.changePassword(currentPassword, newPassword, newPassword); await refresh(); setMessage("Profile updated."); } catch (e) { setMessage(e instanceof Error ? e.message : "Could not update profile."); } };

  return (
    <main className="profile-page">
      <header className="profile-topbar">
        <button className="profile-back" onClick={() => navigate("/dashboard")}><FaArrowLeft /> Back to vault</button>
        <a className="profile-brand" href="/dashboard"><img src={logo} alt="" /><span>NovaVault</span></a>
        <span className="profile-placeholder" aria-hidden="true" />
      </header>

      <section className="profile-card" aria-labelledby="profile-title">
        <div className="profile-card-heading">
          <p className="profile-eyebrow">ACCOUNT SETTINGS</p>
          <h1 id="profile-title">Your profile</h1>
          <p>Manage your personal information and profile picture.</p>
        </div>

        <div className="profile-photo-section">
          <div className="profile-avatar-large">
            {profileImage ? <img src={profileImage} alt="Selected profile" /> : <span>{user?.username.slice(0,2).toUpperCase()}</span>}
          </div>
          <div><h2>Profile picture</h2><p>Upload a photo to personalize your account.</p>
            <button className="change-photo-button" onClick={() => imageInputRef.current?.click()}><FaCamera /> Upload image</button>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={previewProfileImage} hidden />
          </div>
        </div>

        <form className="profile-form" onSubmit={save}>
          <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required /></label>
          <label>Email <span>(unchangeable)</span><input type="email" value={user?.email ?? ""} disabled /></label>
          <label>Current password<div className="password-input"><input type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} /><FaLock /></div></label>
          <label>New password<div className="password-input"><input type="password" minLength={8} value={newPassword} onChange={e=>setNewPassword(e.target.value)} /><FaLock /></div></label>
          {message && <p className="form-error">{message}</p>}
          <button className="complete-profile-button" type="submit"><FaCheck /> Complete</button>
        </form>
      </section>
    </main>
  );
};

export default ProfilePage;
