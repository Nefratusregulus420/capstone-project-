import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth";
import logo from "../../assets/images/logo.png";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
    const {register}=useAuth();const navigate=useNavigate();const [username,setUsername]=useState("");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [confirmPassword,setConfirm]=useState("");const [error,setError]=useState("");const [busy,setBusy]=useState(false);
    const submit=async(e:React.FormEvent)=>{e.preventDefault();setError("");setBusy(true);try{await register(username,email,password,confirmPassword);navigate("/dashboard");}catch(x){setError(x instanceof Error?x.message:"Registration failed.");}finally{setBusy(false);}};
    return (
        <div className="register-page">

            <div className="glass-card">

                <div className="logo-section">

                    <img
                        src={logo}
                        alt="NovaVault Logo"
                        className="logo-image"
                    />

                    <h1>NovaVault</h1>
                    <p>Create your secure cloud storage account</p>

                </div>

                <form className="register-form" onSubmit={submit}>

                    <div className="input-group">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username} onChange={e=>setUsername(e.target.value)} required
                        />
                    </div>

                    <div className="input-group">
                        <FaEnvelope className="icon" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email} onChange={e=>setEmail(e.target.value)} required
                        />
                    </div>

                    <div className="input-group">
                        <FaLock className="icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password} onChange={e=>setPassword(e.target.value)} required minLength={8}
                        />
                    </div>

                    <div className="input-group">
                        <FaLock className="icon" />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword} onChange={e=>setConfirm(e.target.value)} required minLength={8}
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}
                    <button className="register-btn" disabled={busy}>
                        {busy ? "Creating..." : "Create Account"}
                    </button>

                </form>

                <div className="login-link">

                  Already have an account?

                <Link to="/">
                    Login
                </Link>

                </div>

            </div>

        </div>
    );
};

export default Register;
