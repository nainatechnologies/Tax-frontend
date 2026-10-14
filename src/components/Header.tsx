import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Menu,
  X,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { logoImg } from '../assets/images';
import {
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  getUsers,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  STORAGE_EVENT,
} from '../utils/storage';
import { User, TaxNotification } from '../types';
import './Header.css';

export const Header: React.FC = () => {
  const [currentUser, setUser] = useState<User | null>(getCurrentUser());
  const [notifications, setNotifications] = useState<TaxNotification[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const syncState = () => {
    const u = getCurrentUser();
    setUser(u);
    const allNotifs = getNotifications();
    if (u) {
      const filtered = allNotifs.filter(
        (n) =>
          n.targetRole === u.role ||
          n.targetRole === 'ALL' ||
          (u.id && n.targetUserId === u.id)
      );
      setNotifications(filtered);
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    syncState();
    const handleStorage = () => syncState();
    window.addEventListener(STORAGE_EVENT, handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotifOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };


  const unreadCount = notifications.filter((n) => !n.read).length;

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'ADMIN') return '/admin/dashboard';
    if (currentUser.role === 'CA') return '/ca/dashboard';
    return '/dashboard';
  };

  return (
    <header className="site-header">

      {/* Main Navbar */}
      <div className="header-main">
        <div className="container header-container">
          {/* Left: Brand Logo */}
          <Link to="/" className="brand-logo" aria-label="TaxVantage Home">
            <img src={logoImg} alt="TaxVantage Logo" className="logo-image" />
          </Link>

          {/* Center: Navigation Links */}
          <nav className="desktop-nav" aria-label="Primary Navigation">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
            >
              Services
            </Link>
            <Link
              to="/how-it-works"
              className={`nav-link ${location.pathname === '/how-it-works' ? 'active' : ''}`}
            >
              How It Works
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* Right: Actions / User Profile */}
          <div className="header-actions">
            {currentUser ? (
              <div className="logged-in-actions">
                {/* Role Switcher Pill */}
                <div className="user-profile-dropdown" ref={userMenuRef}>
                  <button
                    className="role-badge-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    title="User Menu"
                  >
                    <span className={`role-pill role-${currentUser.role.toLowerCase()}`}>
                      {currentUser.role}
                    </span>
                    <span className="user-short-name">{currentUser.fullName.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="dropdown-menu role-menu animate-fade-in">
                      <div className="dropdown-header">
                        <span className="dropdown-subtitle">{currentUser.role === 'CA' ? 'Chartered Accountant' : currentUser.role === 'ADMIN' ? 'Administrator' : 'Client'}</span>
                        <p className="dropdown-title">{currentUser.fullName}</p>
                        <p className="dropdown-email" style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{currentUser.email}</p>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to={getDashboardPath()} className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <FileText size={16} /> Go to Dashboard
                      </Link>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="notif-dropdown" ref={notifRef}>
                  <button
                    className="notif-btn"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                  </button>

                  {isNotifOpen && (
                    <div className="dropdown-menu notif-menu animate-fade-in">
                      <div className="notif-header flex-between">
                        <h4 className="notif-title">Notifications</h4>
                        {unreadCount > 0 && (
                          <button
                            className="mark-all-btn"
                            onClick={() => {
                              markAllNotificationsRead(currentUser.role, currentUser.id);
                              syncState();
                            }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="notif-list">
                        {notifications.length === 0 ? (
                          <div className="notif-empty">No notifications yet</div>
                        ) : (
                          notifications.slice(0, 6).map((n) => (
                            <div
                              key={n.id}
                              className={`notif-card ${n.read ? 'read' : 'unread'}`}
                              onClick={() => {
                                markNotificationRead(n.id);
                                syncState();
                                if (n.link) navigate(n.link);
                                setIsNotifOpen(false);
                              }}
                            >
                              <div className="notif-card-icon">
                                {n.type === 'success' && <CheckCircle2 size={16} className="text-success" />}
                                {n.type === 'warning' && <AlertTriangle size={16} className="text-warning" />}
                                {n.type === 'info' && <FileText size={16} className="text-accent" />}
                              </div>
                              <div className="notif-card-body">
                                <h5>{n.title}</h5>
                                <p>{n.message}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Button */}
                <Link to={getDashboardPath()} className="btn btn-primary btn-sm">
                  Dashboard <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm login-btn">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm register-btn">
                  Register
                </Link>
                <Link to="/register" className="btn btn-accent btn-sm get-started-btn">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <div className="mobile-nav-links">
            <Link to="/" className="mobile-nav-link">Home</Link>
            <Link to="/services" className="mobile-nav-link">Services</Link>
            <Link to="/how-it-works" className="mobile-nav-link">How It Works</Link>
            <Link to="/contact" className="mobile-nav-link">Contact</Link>
          </div>

          <div className="mobile-auth-section">
            {currentUser ? (
              <div className="mobile-user-box">
                <div className="mobile-user-info">
                  <strong>{currentUser.fullName}</strong>
                  <span className={`role-pill role-${currentUser.role.toLowerCase()}`}>
                    {currentUser.role}
                  </span>
                </div>
                <Link to={getDashboardPath()} className="btn btn-primary btn-block">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-block text-danger">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mobile-guest-buttons">
                <Link to="/login" className="btn btn-secondary btn-block">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-block">
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
