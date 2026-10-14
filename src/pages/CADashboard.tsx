import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  User as UserIcon,
  Eye,
  Check,
  X,
  UploadCloud,
  Send,
  Award,
  Folder,
  Receipt,
  Plus,
  ArrowRight,
  FileCheck,
  CreditCard,
} from 'lucide-react';
import {
  getCurrentUser,
  getCases,
  getDocuments,
  getInvoices,
  getUsers,
  saveInvoice,
  saveDocument,
  updateCaseStatus,
  updateDocumentStatus,
  formatCurrency,
  formatDate,
  STORAGE_EVENT,
} from '../utils/storage';
import { TaxCase, TaxDocument, TaxInvoice, User, DocumentStatus } from '../types';
import { RequestDocModal } from '../components/RequestDocModal';
import { Sidebar } from '../components/Sidebar';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import './CADashboard.css';

interface ITRFolderConfig {
  id: string;
  folderName: string;
  title: string;
  financialYear: string;
  assessmentYear: string;
}

const ITR_FOLDERS: ITRFolderConfig[] = [
  {
    id: 'itr-2025-26',
    folderName: 'ITR_2025_2026',
    title: 'ITR 2025-2026',
    financialYear: 'FY 2025-26',
    assessmentYear: 'AY 2026-27',
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

export const CADashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [assignedCases, setAssignedCases] = useState<TaxCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<TaxCase | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<ITRFolderConfig>(ITR_FOLDERS[0]);
  const [caseDocuments, setCaseDocuments] = useState<TaxDocument[]>([]);
  const [invoices, setInvoices] = useState<TaxInvoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  // Modals
  const [isRequestDocModalOpen, setIsRequestDocModalOpen] = useState(false);
  const [isReadyConfirmModalOpen, setIsReadyConfirmModalOpen] = useState(false);
  const [isUploadInvoiceModalOpen, setIsUploadInvoiceModalOpen] = useState(false);
  const [isUploadItrModalOpen, setIsUploadItrModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<TaxDocument | null>(null);
  const [rejectModalDoc, setRejectModalDoc] = useState<TaxDocument | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [itrFile, setItrFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = () => {
    const user = getCurrentUser();
    if (!user || user.role !== 'CA') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const allCases = getCases();
    // Filter cases assigned to this CA
    const myCases = allCases.filter(
      (c) => c.caId === user.id || c.caName?.includes(user.fullName.split(' ')[0]) || c.caId === 'ca-01'
    );
    setAssignedCases(myCases);

    if (myCases.length > 0) {
      const active = selectedCase
        ? myCases.find((c) => c.id === selectedCase.id) || myCases[0]
        : myCases[0];
      setSelectedCase(active);

      // Load docs for active case
      const allDocs = getDocuments();
      const docs = allDocs.filter(
        (d) => d.userId === active.userId && (d.folderName === selectedFolder.folderName || d.financialYear === selectedFolder.financialYear)
      );
      setCaseDocuments(docs);

      // Load invoices
      const allInvoices = getInvoices();
      const invs = allInvoices.filter((inv) => inv.userId === active.userId);
      setInvoices(invs);
    }
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
  }, [selectedCase?.id, selectedFolder.folderName]);

  const handleSelectCase = (c: TaxCase) => {
    setSelectedCase(c);
    const allDocs = getDocuments();
    const docs = allDocs.filter(
      (d) => d.userId === c.userId && (d.folderName === selectedFolder.folderName || d.financialYear === selectedFolder.financialYear)
    );
    setCaseDocuments(docs);
  };

  const handleFolderSelect = (folder: ITRFolderConfig) => {
    setSelectedFolder(folder);
    if (selectedCase) {
      const allDocs = getDocuments();
      const docs = allDocs.filter(
        (d) => d.userId === selectedCase.userId && (d.folderName === folder.folderName || d.financialYear === folder.financialYear)
      );
      setCaseDocuments(docs);
    }
  };

  const handleDocStatusChange = (docId: string, status: DocumentStatus, reason?: string) => {
    updateDocumentStatus(docId, status, reason);
    toast.success(`Document status updated to ${status}.`);
    loadData();
  };

  const handleConfirmWorkReady = () => {
    if (!selectedCase) return;
    updateCaseStatus(selectedCase.id, 'PAYMENT_PENDING');
    setIsReadyConfirmModalOpen(false);
    toast.success('Work marked as Ready. Client notified for payment.');
    loadData();
  };

  const handleUploadInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    const newInvoice: TaxInvoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      caseId: selectedCase.id,
      invoiceNumber: `TV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      userId: selectedCase.userId,
      userName: selectedCase.userName,
      userEmail: selectedCase.userEmail,
      userMobile: selectedCase.userMobile,
      userPan: 'AAAPL****K',
      userAddress: 'Bangalore, Karnataka - 560001',
      serviceTitle: selectedCase.serviceTitle,
      financialYear: selectedFolder.financialYear,
      assessmentYear: selectedFolder.assessmentYear,
      caName: selectedCase.caName || currentUser.fullName,
      caRegNumber: selectedCase.caRegNumber || 'FCA-48201',
      fee: selectedCase.fee,
      gstRate: 18,
      gstAmount: selectedCase.gst,
      totalAmount: selectedCase.totalAmount,
      paymentStatus: 'PAID',
      transactionId: `TXN-${Date.now()}`,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI / NetBanking',
      acknowledgementNumber: `ACK${Date.now().toString().slice(-10)}`,
    };

    saveInvoice(newInvoice);
    updateCaseStatus(selectedCase.id, 'COMPLETED', {
      acknowledgementNumber: newInvoice.acknowledgementNumber,
      paymentStatus: 'Paid',
    });
    setIsUploadInvoiceModalOpen(false);
    toast.success(`Invoice uploaded into ${selectedFolder.title} folder. Case marked COMPLETED.`);
    loadData();
  };

  const handleUploadItrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !itrFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    const extension = itrFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(extension || '')) {
      toast.error('Please upload a valid PDF, JPG, JPEG, or PNG file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const formattedSize = itrFile.size > 1024 * 1024
        ? `${(itrFile.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(itrFile.size / 1024)} KB`;

      const newDoc: TaxDocument = {
        id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        caseId: selectedCase.id,
        userId: selectedCase.userId,
        financialYear: selectedFolder.financialYear,
        folderName: selectedFolder.folderName,
        documentType: 'Final ITR Filing',
        fileName: itrFile.name,
        fileSize: formattedSize,
        fileType: (extension as 'pdf' | 'jpg' | 'jpeg' | 'png') || 'pdf',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Approved',
        fileDataUrl: dataUrl,
      };

      saveDocument(newDoc);
      setIsUploadItrModalOpen(false);
      setItrFile(null);
      toast.success(`Final ITR Document uploaded into ${selectedFolder.title} folder.`);
      loadData();
    };

    reader.onerror = () => {
      toast.error('Failed to read document. Please try again.');
    };

    reader.readAsDataURL(itrFile);
  };

  if (!currentUser) return null;

  // Search and status filter
  const filteredCases = assignedCases.filter((c) => {
    const matchesFilter =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && (c.status === 'UNDER_REVIEW' || c.status === 'CA_ASSIGNED' || c.status === 'DOCUMENTS_PENDING')) ||
      (statusFilter === 'ACTION_REQ' && c.status === 'ADDITIONAL_DOCUMENT_REQUIRED') ||
      (statusFilter === 'READY_PAYMENT' && c.status === 'PAYMENT_PENDING') ||
      (statusFilter === 'PAID' && c.status === 'PAID') ||
      (statusFilter === 'COMPLETED' && c.status === 'COMPLETED');

    const matchesSearch =
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Check if invoice exists in current folder for selected client
  const currentFolderInvoice = invoices.find(
    (inv) => inv.financialYear === selectedFolder.financialYear && (selectedCase && inv.userId === selectedCase.userId)
  );

  return (
    <div className="dashboard-layout-wrapper">
      {/* Left Sidebar */}
      <Sidebar
        user={currentUser}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
        badgeCounts={{
          cases: assignedCases.length,
        }}
      />

      {/* Main CA Workspace */}
      <main className="dashboard-main-content">
        <div className="dashboard-page ca-dashboard">
          {/* CA Header Banner */}
          <div className="dashboard-welcome-banner flex-between">
            <div className="welcome-left">
              <div className="user-avatar-badge ca-badge-icon">
                <Briefcase size={24} />
              </div>
              <div>
                <div className="welcome-title-row">
                  <h2>{currentUser.fullName}</h2>
                  <span className="role-pill role-ca">Empaneled CA (FCA-48201)</span>
                </div>
                <p className="welcome-meta">
                  ICAI Reg: <strong>FCA-48201</strong> • Assigned Caseload: <strong>{assignedCases.length} Tax Returns</strong> • Active AY: <strong>2024-25</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="ca-stats-row">
            <div className="ca-stat-card">
              <span className="stat-num">{assignedCases.length}</span>
              <span className="stat-lbl">Total Allocated Returns</span>
            </div>
            <div className="ca-stat-card">
              <span className="stat-num text-accent">
                {assignedCases.filter((c) => c.status === 'UNDER_REVIEW' || c.status === 'CA_ASSIGNED' || c.status === 'DOCUMENTS_PENDING').length}
              </span>
              <span className="stat-lbl">Pending Review</span>
            </div>
            <div className="ca-stat-card">
              <span className="stat-num text-warning">
                {assignedCases.filter((c) => c.status === 'ADDITIONAL_DOCUMENT_REQUIRED').length}
              </span>
              <span className="stat-lbl">Addl Docs Requested</span>
            </div>
            <div className="ca-stat-card">
              <span className="stat-num text-success">
                {assignedCases.filter((c) => c.status === 'COMPLETED' || c.status === 'PAID').length}
              </span>
              <span className="stat-lbl">Processed / Completed</span>
            </div>
          </div>

          {/* Two-Column Layout: Left Case List, Right Case Inspector */}
          <div className="ca-workspace-grid">
            {/* Left Column: Caseload Roster */}
            <div className="ca-cases-roster">
              <div className="roster-header">
                <h4 className="roster-title">Assigned Client Cases</h4>
                <div className="roster-controls">
                  <div className="input-with-icon">
                    <Search size={16} className="input-icon" />
                    <input
                      type="text"
                      className="form-input form-input-sm"
                      placeholder="Search client or case ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="form-select form-select-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses ({assignedCases.length})</option>
                    <option value="PENDING">Pending Review</option>
                    <option value="ACTION_REQ">Addl Docs Required</option>
                    <option value="READY_PAYMENT">Payment Pending</option>
                    <option value="PAID">Paid • Ready for Invoice</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="roster-list">
                {filteredCases.length === 0 ? (
                  <div className="empty-roster" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No cases matching filter
                  </div>
                ) : (
                  filteredCases.map((c) => {
                    const isSelected = selectedCase?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        className={`roster-item-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectCase(c)}
                      >
                        <div className="roster-item-top flex-between">
                          <span className="roster-case-id">#{c.id}</span>
                          <span className={`status-badge badge-${c.status === 'COMPLETED' ? 'success' : c.status.includes('ADDITIONAL') ? 'warning' : 'info'}`}>
                            {c.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h5 className="roster-client-name">{c.userName}</h5>
                        <p className="roster-service-title">{c.serviceTitle}</p>
                        <div className="roster-item-footer flex-between">
                          <small>{c.financialYear}</small>
                          <small>Fee: {formatCurrency(c.totalAmount)}</small>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Case Details & Review Desk */}
            <div className="ca-case-inspector">
              {selectedCase ? (
                <div className="inspector-card">
                  {/* Header Actions */}
                  <div className="inspector-header flex-between">
                    <div>
                      <span className="inspector-case-id">Case #{selectedCase.id}</span>
                      <h3 className="inspector-client-title">{selectedCase.userName}</h3>
                      <p className="inspector-subtitle">
                        {selectedCase.serviceTitle} • {selectedCase.financialYear} ({selectedCase.assessmentYear})
                      </p>
                    </div>

                    <div className="inspector-top-actions" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => setIsRequestDocModalOpen(true)}
                      >
                        <AlertCircle size={14} /> Request Addl Document
                      </button>

                      {selectedCase.status !== 'PAYMENT_PENDING' &&
                        selectedCase.status !== 'PAID' &&
                        selectedCase.status !== 'COMPLETED' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setIsReadyConfirmModalOpen(true)}
                          >
                            <CheckCircle2 size={14} /> Mark Work Ready
                          </button>
                        )}

                      {selectedCase.status === 'PAID' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => setIsUploadInvoiceModalOpen(true)}
                        >
                          <UploadCloud size={14} /> Upload Invoice into Current ITR Folder
                        </button>
                      )}

                      {selectedCase.status === 'COMPLETED' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setIsUploadItrModalOpen(true)}
                        >
                          <UploadCloud size={14} /> Upload Final ITR Document
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Client Quick Details Bar */}
                  <div className="client-details-strip">
                    <div>
                      <span>Client Email:</span> <strong>{selectedCase.userEmail}</strong>
                    </div>
                    <div>
                      <span>Mobile:</span> <strong>{selectedCase.userMobile}</strong>
                    </div>
                    <div>
                      <span>Fee (incl. 18% GST):</span> <strong>{formatCurrency(selectedCase.totalAmount)}</strong>
                    </div>
                    <div>
                      <span>Case Status:</span>{' '}
                      <strong className="text-accent">{selectedCase.status.replace(/_/g, ' ')}</strong>
                    </div>
                  </div>

                  {/* ITR Folders Selector for Client */}
                  <div style={{ marginTop: '1.5rem', marginBottom: '1.25rem' }}>
                    <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, marginBottom: '0.5rem' }}>
                      Select Client's ITR Assessment Folder:
                    </h5>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {ITR_FOLDERS.map((f) => (
                        <button
                          key={f.id}
                          className={`btn btn-sm ${selectedFolder.id === f.id ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => handleFolderSelect(f)}
                        >
                          📁 {f.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Documents Verification Section */}
                  <div className="inspector-section">
                    <div className="inspector-section-header flex-between">
                      <h4>Documents in 📁 {selectedFolder.title} ({caseDocuments.length} Files)</h4>
                      <small>Review, approve, or reject each submitted proof</small>
                    </div>

                    {currentFolderInvoice && (
                      <div className="folder-invoice-card" style={{ marginBottom: '1rem', padding: '1rem 1.25rem' }}>
                        <div className="invoice-card-left">
                          <Receipt size={20} className="text-success" />
                          <div>
                            <strong>Invoice #{currentFolderInvoice.invoiceNumber} Attached</strong>
                            <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                              Status: Invoice Available • {formatCurrency(currentFolderInvoice.totalAmount)}
                            </div>
                          </div>
                        </div>
                        <span className="status-badge badge-success">Invoice Available</span>
                      </div>
                    )}

                    {caseDocuments.length === 0 ? (
                      <div className="no-docs-box" style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                        <FileText size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                          No documents uploaded yet in {selectedFolder.title} for this client.
                        </p>
                      </div>
                    ) : (
                      <div className="table-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Document Category</th>
                              <th>File Name</th>
                              <th>Upload Date</th>
                              <th>Current Status</th>
                              <th style={{ textAlign: 'right' }}>Review Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {caseDocuments.map((doc) => (
                              <tr key={doc.id}>
                                <td>
                                  <strong>{doc.documentType}</strong>
                                  {doc.isAdditionalDoc && (
                                    <span className="addl-tag">Requested Doc</span>
                                  )}
                                </td>
                                <td>
                                  <span className="doc-filename">{doc.fileName}</span>
                                </td>
                                <td>{formatDate(doc.uploadDate)}</td>
                                <td>
                                  <span
                                    className={`status-badge badge-${doc.status === 'Approved' ? 'success' : doc.status === 'Rejected' ? 'danger' : 'neutral'}`}
                                  >
                                    {doc.status}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <div className="ca-doc-action-btns">
                                    <button
                                      className="btn-icon-action"
                                      onClick={() => setPreviewDoc(doc)}
                                      title="Preview Document"
                                    >
                                      <Eye size={16} />
                                    </button>
                                    <button
                                      className="btn-icon-action text-success"
                                      onClick={() => handleDocStatusChange(doc.id, 'Approved')}
                                      title="Approve Document"
                                    >
                                      <Check size={16} />
                                    </button>
                                    <button
                                      className="btn-icon-action text-danger"
                                      onClick={() => {
                                        setRejectModalDoc(doc);
                                        setRejectReason('');
                                      }}
                                      title="Reject Document"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="empty-inspector">
                  <FileText size={48} />
                  <h4>Select a tax case from the roster to start CA review</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal: Mark Work Ready */}
      {isReadyConfirmModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsReadyConfirmModalOpen(false)}
          title="Confirm Work Ready"
          subtitle="Notify client that computations are ready and fee payment is required"
          size="md"
        >
          <div style={{ padding: '0.5rem 0 1.5rem 0' }}>
            <p style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              Are you sure all required documents have been reviewed and the tax work is ready for payment?
            </p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              This will update the case status to <strong>PAYMENT_PENDING</strong> and trigger a payment prompt on the client's dashboard.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsReadyConfirmModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirmWorkReady}>
              Yes, Mark Work Ready
            </button>
          </div>
        </Modal>
      )}

      {/* Request Document Modal */}
      {selectedCase && (
        <RequestDocModal
          isOpen={isRequestDocModalOpen}
          onClose={() => setIsRequestDocModalOpen(false)}
          taxCase={selectedCase}
          caName={currentUser.fullName}
          onRequestSent={loadData}
        />
      )}

      {/* Reject Document Modal */}
      {rejectModalDoc && (
        <Modal
          isOpen={true}
          onClose={() => setRejectModalDoc(null)}
          title={`Reject Document: ${rejectModalDoc.documentType}`}
          subtitle={`File: ${rejectModalDoc.fileName}`}
          size="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (rejectReason.trim()) {
                handleDocStatusChange(rejectModalDoc.id, 'Rejected', rejectReason.trim());
                setRejectModalDoc(null);
              }
            }}
          >
            <div className="form-group">
              <label className="form-label form-label-required">Reason for Rejection</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Blurry scan, incorrect assessment year, missing digital signature..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setRejectModalDoc(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                Confirm Rejection
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Upload Invoice into Current ITR Folder Modal */}
      {isUploadInvoiceModalOpen && selectedCase && (
        <Modal
          isOpen={true}
          onClose={() => setIsUploadInvoiceModalOpen(false)}
          title="Upload Invoice into Current ITR Folder"
          subtitle={`Attach official tax invoice to ${selectedFolder.title} for ${selectedCase.userName}`}
          size="md"
        >
          <form onSubmit={handleUploadInvoiceSubmit}>
            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input type="text" className="form-input" value={selectedCase.userName} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Target ITR Folder</label>
              <input type="text" className="form-input" value={`📁 ${selectedFolder.title}`} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Total Professional Fee</label>
              <input type="text" className="form-input" value={formatCurrency(selectedCase.totalAmount)} disabled />
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Select Invoice File (PDF / JPG / PNG)</label>
              <input
                type="file"
                className="form-input"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setInvoiceFile(e.target.files ? e.target.files[0] : null)}
              />
              <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                If no file is selected, the platform will automatically generate a standard GST tax invoice for the client's vault.
              </small>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsUploadInvoiceModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                <UploadCloud size={16} /> Upload &amp; Complete Case
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Upload Final ITR Document Modal */}
      {isUploadItrModalOpen && selectedCase && (
        <Modal
          isOpen={true}
          onClose={() => setIsUploadItrModalOpen(false)}
          title="Upload Final ITR Filing Document"
          subtitle={`Attach official tax filing to ${selectedFolder.title} for ${selectedCase.userName}`}
          size="md"
        >
          <form onSubmit={handleUploadItrSubmit}>
            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input type="text" className="form-input" value={selectedCase.userName} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Target ITR Folder</label>
              <input type="text" className="form-input" value={`📁 ${selectedFolder.title}`} disabled />
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Select ITR Filing File (PDF / JPG / PNG)</label>
              <input
                type="file"
                className="form-input"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setItrFile(e.target.files ? e.target.files[0] : null)}
                required
              />
              <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                This file will be securely uploaded to the client's vault and marked as Approved.
              </small>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsUploadItrModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <UploadCloud size={16} /> Upload ITR Document
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewDoc(null)}
          title={`Document: ${previewDoc.documentType}`}
          subtitle={`File: ${previewDoc.fileName} (${previewDoc.fileSize})`}
          size="lg"
        >
          <div className="doc-preview-modal-inner">
            <div className="doc-pdf-mock-view">
              <FileText size={48} className="pdf-view-icon" />
              <h4>{previewDoc.fileName}</h4>
              <p>Uploaded by {selectedCase?.userName} on {formatDate(previewDoc.uploadDate)}</p>
              <div className="pdf-mock-details">
                <div>Document Status: <strong>{previewDoc.status}</strong></div>
                {previewDoc.rejectionReason && (
                  <div className="text-danger">Rejection Reason: {previewDoc.rejectionReason}</div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
