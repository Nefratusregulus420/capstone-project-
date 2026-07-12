// @ts-ignore: Allow importing CSS in TSX without global type declarations
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth";
import { FaUser, FaLock } from "react-icons/fa";
import logo from "../../assets/images/logo.png";

const Login = () => {
  const { login } = useAuth(); const navigate = useNavigate();
  const [identity,setIdentity]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError("");setBusy(true);try{await login(identity,password);navigate("/dashboard");}catch(x){setError(x instanceof Error?x.message:"Login failed.");}finally{setBusy(false);}};
  return (
    <div className="login-page">
      <div className="glass-card">

        <div className="logo-section">

    <img
        src={logo}
        alt="NovaVault Logo"
        className="logo-image"
    />

    <h1>NovaVault</h1>

    <p>Secure File Storage</p>

</div>

        <form className="login-form" onSubmit={submit}>

          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Username or Email"
              value={identity} onChange={e=>setIdentity(e.target.value)} required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password} onChange={e=>setPassword(e.target.value)} required
            />
          </div>

          <div className="remember-row">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <span className="forgot-password">
              Forgot Password?
            </span>
          </div>

          {error && <p className="form-error">{error}</p>}
          <button className="login-btn" disabled={busy}>
            {busy ? "Logging in..." : "Login"}
          </button>

        </form>

       <div className="register-link">
    Don't have an account?

    <Link to="/register">
        Register
    </Link>

</div>

      </div>
    </div>
  );
};

export default Login;
