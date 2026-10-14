import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  User as UserIcon,
  Briefcase,
  KeyRound,
  ShieldAlert,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getUsers, setCurrentUser } from '../utils/storage';
import { useToast } from '../components/Toast';
import './Login.css';

export const Login: React.FC = () => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrMobile.trim() || !password.trim()) {
      toast.error('Please enter your registered email/mobile and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === emailOrMobile.trim().toLowerCase() ||
          u.mobile === emailOrMobile.trim()
      );

      if (!user) {
        setIsLoading(false);
        toast.error('Invalid credentials. You can use the Quick Demo Logins below.');
        return;
      }

      setCurrentUser(user);
      setIsLoading(false);
      toast.success(`Welcome back, ${user.fullName}!`);

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'CA') {
        navigate('/ca/dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 600);
  };

  const handleQuickDemoLogin = (role: 'USER' | 'CA' | 'ADMIN') => {
    const users = getUsers();
    const user = users.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      toast.success(`Logged in as ${user.fullName} (${role})`);
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'CA') navigate('/ca/dashboard');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container-grid">
          {/* Left Column: Login Form */}
          <div className="auth-card-main">
            <div className="auth-header">
              <span className="auth-badge">
                <Lock size={14} /> 256-Bit SSL Encrypted Login
              </span>
              <h1 className="auth-title">Sign In to TaxVantage</h1>
              <p className="auth-subtitle">
                Access your encrypted ITR documents, active tax cases, and CA reviews.
              </p>
            </div>

            {/* 1-Click Quick Demo Accounts Box */}
            <div className="demo-accounts-card">
              <div className="demo-header flex-between">
                <span className="demo-badge">1-Click Fast Demo Login</span>
                <small className="demo-note">Instant Role Switching</small>
              </div>
              <div className="demo-buttons-grid">
                <button
                  type="button"
                  className="demo-role-btn btn-demo-user"
                  onClick={() => handleQuickDemoLogin('USER')}
                >
                  <UserIcon size={16} />
                  <div>
                    <strong>Client / User</strong>
                    <small>user@example.com</small>
                  </div>
                </button>

                <button
                  type="button"
                  className="demo-role-btn btn-demo-ca"
                  onClick={() => handleQuickDemoLogin('CA')}
                >
                  <Briefcase size={16} />
                  <div>
                    <strong>Chartered Acc.</strong>
                    <small>ca@example.com</small>
                  </div>
                </button>

                <button
                  type="button"
                  className="demo-role-btn btn-demo-admin"
                  onClick={() => handleQuickDemoLogin('ADMIN')}
                >
                  <ShieldCheck size={16} />
                  <div>
                    <strong>Administrator</strong>
                    <small>admin@example.com</small>
                  </div>
                </button>
              </div>
            </div>

            <div className="auth-separator">
              <span>Or sign in with credentials</span>
            </div>

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label form-label-required">Email Address or Mobile Number</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. user@example.com or 9876543210"
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="flex-between">
                  <label className="form-label form-label-required">Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info('For this demo, please use the 1-click login buttons above.'); }} className="forgot-link">
                    Forgot Password?
                  </a>
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group form-checkbox-row">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-footer-link">
              <span>Don't have a tax filing account yet?</span>{' '}
              <Link to="/register" className="auth-link-bold">
                Register for Free
              </Link>
            </div>
          </div>

          {/* Right Column: Security Banner */}
          <div className="auth-banner-col">
            <div className="banner-content">
              <span className="banner-tag">Enterprise Security Standard</span>
              <h3>Bank-Grade Encryption for Confidential Tax Records</h3>
              <p>
                Every tax return is filed with dual-layer Chartered Accountant scrutiny under strict statutory compliance.
              </p>

              <div className="banner-points">
                <div className="banner-point-item">
                  <ShieldCheck size={20} className="text-success" />
                  <div>
                    <strong>Masked PAN &amp; Aadhaar Vault</strong>
                    <p>Identity credentials are stored with tokenized hashing.</p>
                  </div>
                </div>
                <div className="banner-point-item">
                  <Lock size={20} className="text-accent" />
                  <div>
                    <strong>Confidential Document Storage</strong>
                    <p>Form 16, Bank statements, and ledgers remain encrypted.</p>
                  </div>
                </div>
                <div className="banner-point-item">
                  <UserIcon size={20} className="text-warning" />
                  <div>
                    <strong>ICAI Code of Ethics</strong>
                    <p>Direct review by empaneled senior Chartered Accountants.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
