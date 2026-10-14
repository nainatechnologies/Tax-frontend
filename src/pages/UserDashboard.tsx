import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  User as UserIcon,
  CreditCard,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  Download,
  Phone,
  Mail,
  Calendar,
  Layers,
  Clock,
  PlusCircle,
  Receipt,
  ExternalLink,
  Folder,
  ArrowLeft,
  Printer,
  Eye,
  Trash2,
} from 'lucide-react';
import {
  getCurrentUser,
  getCases,
  getDocuments,
  getAdditionalRequests,
  getInvoices,
  saveCase,
  saveDocument,
  deleteDocument,
  updateCaseStatus,
  formatCurrency,
  formatDate,
  formatDateTime,
  STORAGE_EVENT,
  fulfillAdditionalRequest,
} from '../utils/storage';
import { TaxCase, TaxDocument, AdditionalDocRequest, TaxInvoice, User } from '../types';
import { WorkflowTracker } from '../components/WorkflowTracker';
import { DocumentUpload } from '../components/DocumentUpload';
import { PaymentModal } from '../components/PaymentModal';
import { FolderCard } from '../components/FolderCard';
import { Sidebar } from '../components/Sidebar';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { TAX_SERVICES } from '../data/services';
import './UserDashboard.css';

interface ITRFolderConfig {
  id: string;
  folderName: string;
  title: string;
  financialYear: string;
  assessmentYear: string;
  requiredDocs?: string;
}

const ITR_FOLDERS: ITRFolderConfig[] = [
  {
    id: 'itr-2025-26',
    folderName: 'ITR_2025_2026',
    title: 'ITR 2025-2026',
    financialYear: 'FY 2025-26',
    assessmentYear: 'AY 2026-27',
    requiredDocs: 'Aadhar Card & PAN Card',
  },
  {
    id: 'itr-2024-25',
    folderName: 'ITR_2024_2025',
    title: 'ITR 2024-2025',
    financialYear: 'FY 2024-25',
    assessmentYear: 'AY 2025-26',
  },
  {
    id: 'itr-2023-24',
    folderName: 'ITR_2023_2024',
    title: 'ITR 2023-2024',
    financialYear: 'FY 2023-24',
    assessmentYear: 'AY 2024-25',
  },
  {
    id: 'itr-2022-23',
    folderName: 'ITR_2022_2023',
    title: 'ITR 2022-2023',
    financialYear: 'FY 2022-23',
    assessmentYear: 'AY 2023-24',
  },
  {
    id: 'itr-2021-22',
    folderName: 'ITR_2021_2022',
    title: 'ITR 2021-2022',
    financialYear: 'FY 2021-22',
    assessmentYear: 'AY 2022-23',
  },
];

export const UserDashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [userCases, setUserCases] = useState<TaxCase[]>([]);
  const [allUserDocs, setAllUserDocs] = useState<TaxDocument[]>([]);
  const [invoices, setInvoices] = useState<TaxInvoice[]>([]);
  const [pendingAddlRequests, setPendingAddlRequests] = useState<AdditionalDocRequest[]>([]);
  
  // Navigation & Folder State
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [openedFolder, setOpenedFolder] = useState<ITRFolderConfig | null>(null);

  // Modals & UI States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [newCaseServiceId, setNewCaseServiceId] = useState(TAX_SERVICES[0].id);
  const [newCaseFY, setNewCaseFY] = useState('FY 2025-26');
  const [viewingDoc, setViewingDoc] = useState<TaxDocument | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'USER') {
      if (user.role === 'CA') navigate('/ca/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
      return;
    }
    setCurrentUser(user);

    // Load user cases
    const allCases = getCases();
    const myCases = allCases.filter((c) => c.userId === user.id);
    setUserCases(myCases);

    // Load user documents
    const allDocs = getDocuments();
    const myDocs = allDocs.filter((d) => d.userId === user.id);
    setAllUserDocs(myDocs);

    // Load user invoices
    const allInvoices = getInvoices();
    const myInvoices = allInvoices.filter((inv) => inv.userId === user.id);
    setInvoices(myInvoices);

    // Load pending additional requests
    const allReqs = getAdditionalRequests();
    const myReqs = allReqs.filter(
      (r) => myCases.some((c) => c.id === r.caseId) && r.status === 'Pending'
    );
    setPendingAddlRequests(myReqs);
  };

  const handleQuickUpload = (file: File, req: AdditionalDocRequest) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(extension || '')) {
      toast.error('Please upload a valid PDF, JPG, JPEG, or PNG file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const formattedSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const matchedCase = userCases.find(c => c.id === req.caseId);
      const targetFolder = matchedCase ? matchedCase.folderName : 'ITR_2023_2024';
      const targetFY = matchedCase ? matchedCase.financialYear : 'FY 2023-24';

      const newDoc: TaxDocument = {
        id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        caseId: req.caseId,
        userId: currentUser!.id,
        financialYear: targetFY,
        folderName: targetFolder,
        documentType: req.documentName,
        fileName: file.name,
        fileSize: formattedSize,
        fileType: extension as 'pdf' | 'jpg' | 'jpeg' | 'png',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Uploaded',
        fileDataUrl: dataUrl,
      };

      saveDocument(newDoc);
      fulfillAdditionalRequest(req.id, newDoc.id);
      toast.success(`${req.documentName} submitted successfully!`);
      loadData();
    };

    reader.onerror = () => {
      toast.error('Failed to read document. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener(STORAGE_EVENT, handleStorage);
    window.addEventListener('storage', handleStorage);

    // Check if we came from Services page while logged in
    const params = new URLSearchParams(window.location.search);
    const newService = params.get('openNewCase');
    if (newService) {
      setNewCaseServiceId(newService);
      setIsNewCaseModalOpen(true);
      // Clean up URL without reloading
      window.history.replaceState({}, '', '/dashboard');
    }

    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!currentUser) return null;

  // Active current year case (default to 2023-24 if present)
  const currentCase =
    userCases.find((c) => c.financialYear.includes('2023-24')) || userCases[0] || null;

  const handleOpenFolder = (folderConfig: ITRFolderConfig) => {
    setOpenedFolder(folderConfig);
    setActiveSection('folders');
  };

  const handleBackToFolders = () => {
    setOpenedFolder(null);
  };

  const handleSectionSelect = (section: string) => {
    setActiveSection(section);
    if (section !== 'folders') {
      setOpenedFolder(null);
    }
  };

  const handleCreateNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const srv = TAX_SERVICES.find((s) => s.id === newCaseServiceId) || TAX_SERVICES[0];
    const fee = srv.startingPrice;
    const gst = Math.round(fee * 0.18);
    const totalAmount = fee + gst;

    const newCase: TaxCase = {
      id: `CASE-${Date.now().toString().slice(-6)}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      userMobile: currentUser.mobile,
      serviceId: srv.id,
      serviceTitle: srv.title,
      financialYear: newCaseFY,
      assessmentYear: newCaseFY === 'FY 2025-26' ? 'AY 2026-27' : newCaseFY === 'FY 2024-25' ? 'AY 2025-26' : 'AY 2024-25',
      folderName: `ITR_${newCaseFY.replace(/[^0-9]/g, '_')}`,
      status: 'DOCUMENTS_PENDING',
      fee,
      gst,
      totalAmount,
      paymentStatus: 'Unpaid',
      documentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCase(newCase);
    setIsNewCaseModalOpen(false);
    toast.success(`Tax return opened for ${srv.title} (${newCaseFY}).`);
    loadData();
  };

  // Get matching case and docs for an ITR folder
  const getFolderData = (folder: ITRFolderConfig) => {
    const matchedCase = userCases.find(
      (c) => c.folderName === folder.folderName || c.financialYear === folder.financialYear
    );
    const folderDocs = allUserDocs.filter(
      (d) => d.folderName === folder.folderName || d.financialYear === folder.financialYear
    );
    const folderInvoice = invoices.find(
      (inv) => inv.financialYear === folder.financialYear || (matchedCase && inv.caseId === matchedCase.id)
    );
    let folderStatus = matchedCase ? matchedCase.status : 'DOCUMENTS_PENDING';
    
    if (folderDocs.length > 0) {
      if (!matchedCase || !['PAID', 'COMPLETED', 'PAYMENT_PENDING'].includes(matchedCase.status)) {
        folderStatus = 'DOCUMENTS_COMPLETED';
      }
    } else {
      if (folder.requiredDocs) {
        folderStatus = 'ACTION_REQUIRED';
      } else {
        if (!matchedCase || !['PAID', 'COMPLETED', 'PAYMENT_PENDING'].includes(matchedCase.status)) {
          folderStatus = 'DOCUMENTS_PENDING';
        }
      }
    }

    return {
      taxCase: matchedCase,
      docs: folderDocs,
      invoice: folderInvoice,
      status: folderStatus,
    };
  };

  return (
    <div className="dashboard-layout-wrapper">
      {/* Left Sidebar */}
      <Sidebar
        user={currentUser}
        activeSection={activeSection}
        onSectionSelect={handleSectionSelect}
        badgeCounts={{
          documents: allUserDocs.length,
          paymentPending: currentCase?.status === 'PAYMENT_PENDING' ? 1 : 0,
          invoices: invoices.length,
          notifications: pendingAddlRequests.length,
        }}
      />

      {/* Main Dashboard Workspace */}
      <main className="dashboard-main-content">
        <div className="dashboard-page">
          {activeSection === 'dashboard' && (
            <>
              {/* Welcome Profile Bar */}
              <div className="dashboard-welcome-banner">
            <div className="welcome-left">
              <div className="user-avatar-badge">
                <UserIcon size={24} />
              </div>
              <div>
                <div className="welcome-title-row">
                  <h2>{currentUser.fullName}</h2>
                  <span className="role-pill role-user">Verified Taxpayer</span>
                </div>
                <p className="welcome-meta">
                  PAN: <strong>{currentUser.maskedPan}</strong> • Aadhaar: <strong>{currentUser.maskedAadhaar}</strong> • Employment: <strong>{currentUser.employmentType}</strong>
                </p>
              </div>
            </div>

            <div className="welcome-right-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsNewCaseModalOpen(true)}
              >
                <PlusCircle size={16} /> Open Another ITR Year
              </button>
            </div>
          </div>

          {/* ACTION REQUIRED: Additional Document Request Banner */}
          {pendingAddlRequests.length > 0 && (
            <div className="action-required-alert animate-fade-in">
              <div className="alert-icon-box">
                <AlertCircle size={26} />
              </div>
              <div className="alert-content-body" style={{ flex: 1 }}>
                <h4>Action Required: Your CA has requested additional documents</h4>
                <div className="pending-reqs-list">
                  {pendingAddlRequests.map((req) => (
                    <div key={req.id} className="req-item-card">
                      <div className="req-item-left">
                        <strong>{req.documentName}</strong>
                        <p>Reason: {req.reason}</p>
                        <small>Instructions: {req.description} • Due Date: {formatDate(req.dueDate)}</small>
                      </div>
                      <div className="req-item-right">
                        <label className="btn btn-warning btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <UploadCloud size={14} /> Upload Requested Document
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleQuickUpload(e.target.files[0], req);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTION REQUIRED: Payment Pending Banner */}
          {currentCase && currentCase.status === 'PAYMENT_PENDING' && (
            <div className="action-payment-alert animate-fade-in">
              <div className="alert-icon-box text-success">
                <CheckCircle2 size={32} />
              </div>
              <div className="alert-content-body">
                <h4>Your tax work is ready. Payment is now required.</h4>
                <p>
                  Your Chartered Accountant has completed the computation and review. Please complete payment of <strong>{formatCurrency(currentCase.totalAmount)}</strong> to proceed with filing.
                </p>
              </div>
              <div className="alert-action-col">
                <button
                  className="btn btn-success btn-lg"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  <CreditCard size={18} /> Pay {formatCurrency(currentCase.totalAmount)} &amp; File
                </button>
              </div>
            </div>
          )}

          {/* Assigned CA Section */}
          <div className="tax-pro-card">
            <div className="tax-pro-header">
              <h4 className="tax-pro-title">Your Tax Professional</h4>
              <span className="status-badge badge-success">
                {currentCase?.caName ? 'Assigned' : 'Assignment Pending'}
              </span>
            </div>
            <div className="tax-pro-body">
              <div className="tax-pro-info">
                <div className="tax-pro-avatar">
                  <Briefcase size={26} />
                </div>
                <div>
                  <h4 className="tax-pro-name">
                    {currentCase?.caName || 'Assignment Pending'}
                  </h4>
                  <p className="tax-pro-meta">
                    ICAI Membership: <strong>{currentCase?.caRegNumber || '-'}</strong> • Practice: <strong>Direct &amp; Indirect Tax Counsel</strong>
                  </p>
                </div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  toast.info('Direct inquiry sent to your assigned CA.');
                }}
              >
                <Mail size={14} /> Message Tax Professional
              </button>
            </div>
          </div>

          {/* Real-time Workflow Tracker for current case */}
          {currentCase && (
            <div style={{ marginBottom: '2rem' }}>
              <WorkflowTracker
                currentStatus={currentCase.status}
                hasAdditionalDocRequest={pendingAddlRequests.length > 0}
              />
            </div>
              )}
            </>
          )}

          {/* VIEW: Inside Specific ITR Folder */}
          {activeSection === 'folders' && (
            <>
              {openedFolder ? (
            <div className="inside-folder-view">
              {/* Folder Breadcrumb Header */}
              <div className="folder-view-header">
                <div className="folder-breadcrumbs">
                  <button className="btn-back-folders" onClick={handleBackToFolders}>
                    <ArrowLeft size={16} /> Back to ITR Folders
                  </button>
                  <span>/</span>
                  <span className="folder-breadcrumb-title">📁 {openedFolder.title}</span>
                </div>
                <div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const uploadEl = document.getElementById('folder-upload-area');
                      if (uploadEl) uploadEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <PlusCircle size={14} /> Upload Documents
                  </button>
                </div>
              </div>

              {/* Check if an invoice exists in this current ITR folder */}
              {(() => {
                const folderData = getFolderData(openedFolder);
                if (folderData.invoice) {
                  return (
                    <div className="folder-invoice-card animate-fade-in">
                      <div className="invoice-card-left">
                        <div className="invoice-icon-wrap">
                          <Receipt size={24} />
                        </div>
                        <div>
                          <h4 className="invoice-title">Tax Invoice #{folderData.invoice.invoiceNumber}</h4>
                          <p className="invoice-meta">
                            Stored in {openedFolder.title} • {formatCurrency(folderData.invoice.totalAmount)} (Paid)
                          </p>
                        </div>
                      </div>
                      <div className="invoice-card-actions">
                        <span className="status-badge badge-success">Invoice Available</span>
                        <Link to={`/invoice/${folderData.invoice.id}`} className="btn btn-secondary btn-sm">
                          <Eye size={14} /> View Invoice
                        </Link>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => window.print()}
                          title="Print / Save PDF"
                        >
                          <Printer size={14} /> Print
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Documents in this ITR Folder */}
              {(() => {
                const folderData = getFolderData(openedFolder);
                const matchedCase = folderData.taxCase || currentCase;

                if (folderData.docs.length === 0) {
                  return (
                    <div className="empty-folder-box">
                      <div className="empty-folder-icon">
                        <Folder size={32} />
                      </div>
                      <h4 className="empty-folder-title">No documents uploaded yet</h4>
                      <p className="empty-folder-desc">
                        Your documents for {openedFolder.title} will appear here after upload.
                      </p>
                      <div id="folder-upload-area" style={{ width: '100%', maxWidth: '720px' }}>
                        <DocumentUpload
                          caseId={matchedCase ? matchedCase.id : `CASE-${Date.now().toString().slice(-6)}`}
                          userId={currentUser.id}
                          financialYear={openedFolder.financialYear}
                          folderName={openedFolder.folderName}
                          documents={folderData.docs}
                          onDocumentChange={loadData}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="folder-content-body">
                    {/* Document Upload Widget */}
                    <div id="folder-upload-area" style={{ marginBottom: '2rem' }}>
                      <DocumentUpload
                        caseId={matchedCase ? matchedCase.id : `CASE-${Date.now().toString().slice(-6)}`}
                        userId={currentUser.id}
                        financialYear={openedFolder.financialYear}
                        folderName={openedFolder.folderName}
                        documents={folderData.docs}
                        onDocumentChange={loadData}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* VIEW: All 3 Core ITR Folders Grid */
            <div className="itr-folders-section">
              <div className="section-subheading-row">
                <h3>
                  <Folder size={22} className="text-accent" /> ITR Document Folders
                </h3>
                <small style={{ color: 'var(--text-muted)' }}>
                  Click a folder to view, upload, or download tax proofs
                </small>
              </div>

              <div className="itr-folders-grid">
                {ITR_FOLDERS.map((folder) => {
                  const folderData = getFolderData(folder);
                  return (
                    <FolderCard
                      key={folder.id}
                      id={folder.id}
                      folderName={folder.folderName}
                      title={folder.title}
                      financialYear={folder.financialYear}
                      assessmentYear={folder.assessmentYear}
                      documentCount={folderData.docs.length}
                      status={folderData.status}
                      requiredDocs={folder.requiredDocs}
                      onOpen={() => handleOpenFolder(folder)}
                    />
                  );
                })}
              </div>
            </div>
          )}
          </>
        )}

          {/* VIEW: Tab for Invoices / Receipts if selected from sidebar */}
          {activeSection === 'invoices' && (
            <div className="dash-card" style={{ marginTop: '2rem' }}>
              <div className="card-header-row flex-between">
                <h4 className="dash-card-title">Official Tax Invoices &amp; Receipts</h4>
              </div>

              {invoices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Receipt size={42} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                  <h5>No Invoices Generated Yet</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    Invoices are automatically generated and stored in your ITR folder once CA payment is completed.
                  </p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Date</th>
                        <th>ITR Folder</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td><strong>{inv.invoiceNumber}</strong></td>
                          <td>{formatDate(inv.invoiceDate)}</td>
                          <td>📁 {inv.financialYear}</td>
                          <td><strong>{formatCurrency(inv.totalAmount)}</strong></td>
                          <td><span className="status-badge badge-success">Invoice Available</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <Link to={`/invoice/${inv.id}`} className="btn btn-secondary btn-sm">
                              <Eye size={12} /> View Invoice
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW: Tab for My Services if selected from sidebar */}
          {activeSection === 'services' && (
            <div className="dash-card" style={{ marginTop: '2rem' }}>
              <h4 className="dash-card-title">Your Tax Filing Services</h4>
              <div className="table-container" style={{ marginTop: '1rem' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Service Plan</th>
                      <th>ITR Year</th>
                      <th>Assigned CA</th>
                      <th>Status</th>
                      <th>Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userCases.map((c) => (
                      <tr key={c.id}>
                        <td><strong>#{c.id}</strong></td>
                        <td>{c.serviceTitle}</td>
                        <td>{c.financialYear}</td>
                        <td>{c.caName || 'Assignment Pending'}</td>
                        <td>
                          <span className={`status-badge badge-${c.status === 'COMPLETED' ? 'success' : 'info'}`}>
                            {c.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>{formatCurrency(c.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: Tab for Profile */}
          {activeSection === 'profile' && (
            <div className="dash-card animate-fade-in" style={{ marginTop: '2rem' }}>
              <h4 className="dash-card-title">User Profile Details</h4>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Full Name</span>
                  <strong>{currentUser.fullName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Email Address</span>
                  <strong>{currentUser.email}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mobile Number</span>
                  <strong>{currentUser.mobile}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>PAN Number</span>
                  <strong>{currentUser.panNumber || currentUser.maskedPan}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Aadhaar Number</span>
                  <strong>{currentUser.aadhaarNumber || currentUser.maskedAadhaar}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Employment Type</span>
                  <strong style={{ textTransform: 'capitalize' }}>{currentUser.employmentType}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Address</span>
                  <strong style={{ textAlign: 'right' }}>{currentUser.address}, {currentUser.city}, {currentUser.state} - {currentUser.pincode}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {currentCase && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          taxCase={currentCase}
          onPaymentSuccess={() => {
            loadData();
          }}
        />
      )}

      {/* New Case Modal */}
      {isNewCaseModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsNewCaseModalOpen(false)}
          title="Open New Tax Return Folder"
          subtitle="Choose the financial year and filing package for your return"
          size="md"
        >
          <form onSubmit={handleCreateNewCase} className="new-case-form">
            <div className="form-group">
              <label className="form-label form-label-required">Financial Year / Assessment Year</label>
              <select
                className="form-select"
                value={newCaseFY}
                onChange={(e) => setNewCaseFY(e.target.value)}
              >
                <option value="FY 2025-26">FY 2025-26 (AY 2026-27) - Current Year</option>
                <option value="FY 2024-25">FY 2024-25 (AY 2025-26) - Updated Return</option>
                <option value="FY 2023-24">FY 2023-24 (AY 2024-25) - ITR-U</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Select Tax Filing Package</label>
              <select
                className="form-select"
                value={newCaseServiceId}
                onChange={(e) => setNewCaseServiceId(e.target.value)}
              >
                {TAX_SERVICES.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.title} ({formatCurrency(srv.startingPrice)})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions-bar" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsNewCaseModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Open ITR Folder
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
