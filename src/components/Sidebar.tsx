import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Folder,
  FileText,
  UserCheck,
  CreditCard,
  Receipt,
  Bell,
  User as UserIcon,
  LogOut,
  Users,
  Briefcase,
  Layers,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { User } from '../types';
import { logoutUser } from '../utils/storage';
import './Sidebar.css';

export interface SidebarBadgeCounts {
  documents?: number;
  paymentPending?: number;
  invoices?: number;
  notifications?: number;
  cases?: number;
  users?: number;
  pendingCA?: number;
  [key: string]: number | undefined;
}

export interface SidebarProps {
  user: User;
  activeSection: string;
  onSectionSelect: (section: string) => void;
  badgeCounts?: SidebarBadgeCounts;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { user, activeSection, onSectionSelect } = props;
  const badgeCounts: SidebarBadgeCounts = props.badgeCounts || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const renderNavItems = () => {
    if (user.role === 'USER') {
      return (
        <>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => onSectionSelect('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          </li>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'services' ? 'active' : ''}`}
              onClick={() => onSectionSelect('services')}
            >
              <Layers size={18} />
              <span>My Services</span>
            </button>
          </li>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'folders' || activeSection === 'documents' ? 'active' : ''}`}
              onClick={() => onSectionSelect('folders')}
            >
              <Folder size={18} />
              <span>ITR Documents</span>
              {badgeCounts.documents ? (
                <span className="sidebar-badge-count">{badgeCounts.documents}</span>
              ) : null}
            </button>
          </li>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => onSectionSelect('profile')}
            >
              <UserIcon size={18} />
              <span>Profile</span>
            </button>
          </li>
        </>
      );
    }

    if (user.role === 'CA') {
      return (
        <>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => onSectionSelect('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          </li>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'clients' ? 'active' : ''}`}
              onClick={() => onSectionSelect('clients')}
            >
              <Users size={18} />
              <span>Assigned Clients</span>
              {badgeCounts.cases ? (
                <span className="sidebar-badge-count">{badgeCounts.cases}</span>
              ) : null}
            </button>
          </li>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'documents' ? 'active' : ''}`}
              onClick={() => onSectionSelect('documents')}
            >
              <Folder size={18} />
              <span>ITR Documents</span>
            </button>
          </li>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'requests' ? 'active' : ''}`}
              onClick={() => onSectionSelect('requests')}
            >
              <AlertCircle size={18} />
              <span>Document Requests</span>
            </button>
          </li>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => onSectionSelect('notifications')}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </button>
          </li>
          <li className="sidebar-nav-item">
            <button
              className={`sidebar-nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => onSectionSelect('profile')}
            >
              <UserIcon size={18} />
              <span>Profile</span>
            </button>
          </li>
        </>
      );
    }

    // ADMIN Role
    return (
      <>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => onSectionSelect('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
        </li>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => onSectionSelect('users')}
          >
            <Users size={18} />
            <span>Users</span>
            {badgeCounts.users ? (
              <span className="sidebar-badge-count">{badgeCounts.users}</span>
            ) : null}
          </button>
        </li>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'cas' ? 'active' : ''}`}
            onClick={() => onSectionSelect('cas')}
          >
            <Briefcase size={18} />
            <span>CA Management</span>
          </button>
        </li>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'assign_ca' ? 'active' : ''}`}
            onClick={() => onSectionSelect('assign_ca')}
          >
            <UserCheck size={18} />
            <span>Assign CA</span>
            {badgeCounts.pendingCA ? (
              <span className="sidebar-badge-count badge-warn">{badgeCounts.pendingCA}</span>
            ) : null}
          </button>
        </li>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'cases' ? 'active' : ''}`}
            onClick={() => onSectionSelect('cases')}
          >
            <FileText size={18} />
            <span>Cases</span>
          </button>
        </li>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'documents' ? 'active' : ''}`}
            onClick={() => onSectionSelect('documents')}
          >
            <Folder size={18} />
            <span>Documents</span>
          </button>
        </li>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'payments' ? 'active' : ''}`}
            onClick={() => onSectionSelect('payments')}
          >
            <CreditCard size={18} />
            <span>Payments</span>
          </button>
        </li>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'invoices' ? 'active' : ''}`}
            onClick={() => onSectionSelect('invoices')}
          >
            <Receipt size={18} />
            <span>Invoices</span>
          </button>
        </li>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => onSectionSelect('notifications')}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </li>
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-btn ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => onSectionSelect('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </li>
      </>
    );
  };

  return (
    <aside className="dashboard-sidebar-container" id="dashboard-sidebar">
      <div className="sidebar-brand-badge">
        <div
          className={`sidebar-avatar-icon ${
            user.role === 'CA' ? 'ca-bg' : user.role === 'ADMIN' ? 'admin-bg' : ''
          }`}
        >
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-user-details">
          <h4 className="sidebar-user-name">{user.fullName}</h4>
          <span className="sidebar-user-role">
            {user.role === 'USER' ? 'Taxpayer' : user.role === 'CA' ? 'Chartered Acc.' : 'Super Admin'}
          </span>
        </div>
      </div>

      <ul className="sidebar-nav-list">{renderNavItems()}</ul>

      <button className="sidebar-nav-btn logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};
