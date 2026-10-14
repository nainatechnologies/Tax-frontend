import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Briefcase,
  FileText,
  CreditCard,
  UserCheck,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Receipt,
  ExternalLink,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Folder,
} from 'lucide-react';
import {
  getCurrentUser,
  getCases,
  getUsers,
  getCAs,
  getInvoices,
  getDocuments,
  formatCurrency,
  formatDate,
  STORAGE_EVENT,
} from '../utils/storage';
import { TaxCase, User, CharteredAccountant, TaxInvoice, TaxDocument } from '../types';
import { AssignCAModal } from '../components/AssignCAModal';
import { Sidebar } from '../components/Sidebar';
import { useToast } from '../components/Toast';
import './AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [cases, setCases] = useState<TaxCase[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cas, setCas] = useState<CharteredAccountant[]>([]);
  const [invoices, setInvoices] = useState<TaxInvoice[]>([]);
  const [documents, setDocuments] = useState<TaxDocument[]>([]);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCaseForAssign, setSelectedCaseForAssign] = useState<TaxCase | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = () => {
    const user = getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    setCases(getCases());
    setUsers(getUsers());
    setCas(getCAs());
    setInvoices(getInvoices());
    setDocuments(getDocuments());
  };

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener(STORAGE_EVENT, handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!currentUser) return null;

  // 6 Required Metrics
  const totalUsersCount = users.filter((u) => u.role === 'USER').length || users.length;
  const pendingCAAssignmentCount = cases.filter(
    (c) => c.status === 'CA_ASSIGNMENT_PENDING' || !c.caId
  ).length;
  const activeCasesCount = cases.filter(
    (c) => c.status !== 'COMPLETED'
  ).length;
  const docsUnderReviewCount = cases.filter(
    (c) => c.status === 'UNDER_REVIEW' || c.status === 'CA_ASSIGNED' || c.status === 'DOCUMENTS_PENDING'
  ).length;
  const paymentPendingCount = cases.filter(
    (c) => c.status === 'PAYMENT_PENDING'
  ).length;
  const completedCasesCount = cases.filter(
    (c) => c.status === 'COMPLETED'
  ).length;

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING_CA' && (c.status === 'CA_ASSIGNMENT_PENDING' || !c.caId)) ||
      (statusFilter === 'UNDER_REVIEW' && (c.status === 'UNDER_REVIEW' || c.status === 'CA_ASSIGNED')) ||
      (statusFilter === 'PAYMENT_PENDING' && c.status === 'PAYMENT_PENDING') ||
      (statusFilter === 'PAID' && c.status === 'PAID') ||
      (statusFilter === 'COMPLETED' && c.status === 'COMPLETED');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-layout-wrapper">
      {/* Left Sidebar */}
      <Sidebar
        user={currentUser}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
        badgeCounts={{
          pendingCA: pendingCAAssignmentCount,
          users: users.length,
        }}
      />

      {/* Main Admin Content */}
      <main className="dashboard-main-content">
        <div className="dashboard-page admin-dashboard">
          {/* Admin Header Banner */}
          <div className="dashboard-welcome-banner flex-between">
            <div className="welcome-left">
              <div className="user-avatar-badge admin-badge-icon">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="welcome-title-row">
                  <h2>{currentUser.fullName}</h2>
                  <span className="role-pill role-admin">Super Administrator</span>
                </div>
                <p className="welcome-meta">
                  Platform Operations, Caseload Distribution &amp; CA Empanelment • TaxVantage HQ
                </p>
              </div>
            </div>
          </div>

          {/* 6 Metric Summary Cards */}
          <div className="admin-stats-grid-6">
            <div className="admin-stat-card">
              <div className="stat-icon-wrap icon-users">
                <Users size={20} />
              </div>
              <span className="stat-num">{totalUsersCount}</span>
              <span className="stat-lbl">Total Users</span>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-wrap icon-pending">
                <Clock size={20} />
              </div>
              <span className="stat-num text-warning">{pendingCAAssignmentCount}</span>
              <span className="stat-lbl">Pending CA Assignment</span>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-wrap icon-cases">
                <FileText size={20} />
              </div>
              <span className="stat-num text-accent">{activeCasesCount}</span>
              <span className="stat-lbl">Active Cases</span>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-wrap icon-review">
                <Folder size={20} />
              </div>
              <span className="stat-num">{docsUnderReviewCount}</span>
              <span className="stat-lbl">Documents Under Review</span>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-wrap icon-payment">
                <CreditCard size={20} />
              </div>
              <span className="stat-num text-warning">{paymentPendingCount}</span>
              <span className="stat-lbl">Payment Pending</span>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-wrap icon-completed">
                <CheckCircle2 size={20} />
              </div>
              <span className="stat-num text-success">{completedCasesCount}</span>
              <span className="stat-lbl">Completed Cases</span>
            </div>
          </div>

          {/* Main Table: Cases & CA Assignment */}
          <div className="dash-card">
            <div className="card-header-row flex-between">
              <div>
                <h4 className="dash-card-title">Tax Return Operations Ledger</h4>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', margin: 0 }}>
                  Manage workflow stages, assign Chartered Accountants, and monitor client returns
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <select
                  className="form-select form-select-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Stages ({cases.length})</option>
                  <option value="PENDING_CA">Pending CA Allocation ({pendingCAAssignmentCount})</option>
                  <option value="UNDER_REVIEW">Under CA Review</option>
                  <option value="PAYMENT_PENDING">Payment Pending ({paymentPendingCount})</option>
                  <option value="PAID">Paid • Ready for Filing</option>
                  <option value="COMPLETED">Completed ({completedCasesCount})</option>
                </select>

                <div className="input-with-icon search-box-inline">
                  <Search size={16} className="input-icon" />
                  <input
                    type="text"
                    className="form-input form-input-sm"
                    placeholder="Search cases, clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Taxpayer Name</th>
                    <th>Service &amp; ITR Year</th>
                    <th>Vault Docs</th>
                    <th>Assigned CA</th>
                    <th>Case Status</th>
                    <th style={{ textAlign: 'right' }}>Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((c) => {
                    const docCount = documents.filter((d) => d.userId === c.userId).length;
                    return (
                      <tr key={c.id}>
                        <td>
                          <span className="case-id-tag">#{c.id}</span>
                        </td>
                        <td>
                          <strong>{c.userName}</strong>
                          <small className="cell-sub">{c.userEmail}</small>
                        </td>
                        <td>
                          <div>{c.serviceTitle}</div>
                          <small className="cell-sub">{c.financialYear}</small>
                        </td>
                        <td>
                          <span className="ca-assigned-tag">
                            <Folder size={12} /> {docCount} Files
                          </span>
                        </td>
                        <td>
                          {c.caName ? (
                            <div className="ca-assigned-tag">
                              <Briefcase size={12} /> {c.caName}
                            </div>
                          ) : (
                            <span className="status-badge badge-warning">Unassigned</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`status-badge badge-${c.status === 'COMPLETED' ? 'success' : c.status.includes('ADDITIONAL') ? 'danger' : c.status === 'PAYMENT_PENDING' ? 'warning' : 'info'}`}
                          >
                            {c.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedCaseForAssign(c)}
                          >
                            <UserCheck size={14} /> {c.caName ? 'Reassign CA' : 'Assign CA'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Secondary Section: Empaneled CAs Roster */}
          <div className="dash-card" style={{ marginTop: '2rem' }}>
            <div className="card-header-row flex-between">
              <h4 className="dash-card-title">Empaneled Chartered Accountants Roster ({cas.length})</h4>
            </div>

            <div className="ca-admin-grid">
              {cas.map((ca) => (
                <div key={ca.id} className="ca-admin-card">
                  <div className="ca-admin-top flex-between">
                    <span className="ca-emp-id">{ca.employeeId}</span>
                    <span className={`status-badge badge-${ca.status === 'active' ? 'success' : 'warning'}`}>
                      {ca.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                  </div>

                  <h4 className="ca-admin-name">{ca.fullName}</h4>
                  <p className="ca-admin-spec">{ca.specialization}</p>

                  <div className="ca-admin-stats-row">
                    <div>
                      <small>Experience</small>
                      <strong>{ca.experience}</strong>
                    </div>
                    <div>
                      <small>Active Cases</small>
                      <strong>{ca.activeCases}</strong>
                    </div>
                    <div>
                      <small>Rating</small>
                      <strong className="text-warning">★ {ca.rating}</strong>
                    </div>
                  </div>

                  <div className="ca-admin-contact">
                    <small>Email: {ca.email}</small>
                    <small>Phone: {ca.phone}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Assign CA Modal */}
      {selectedCaseForAssign && (
        <AssignCAModal
          isOpen={true}
          onClose={() => setSelectedCaseForAssign(null)}
          taxCase={selectedCaseForAssign}
          onAssigned={loadData}
        />
      )}
    </div>
  );
};
