import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  Clock,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { TaxDocument, DocumentStatus } from '../types';
import { saveDocument, deleteDocument, formatDate, getRequestsByCase, fulfillAdditionalRequest, getCases, updateCaseStatus } from '../utils/storage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import './DocumentUpload.css';

interface DocumentUploadProps {
  caseId: string;
  userId: string;
  financialYear: string;
  folderName: string;
  documents: TaxDocument[];
  onDocumentChange: () => void;
  allowedDocTypes?: string[];
  isReadOnly?: boolean;
}

const DEFAULT_DOC_TYPES = [
  'PAN Card',
  'Aadhaar Card',
  'Form 16 (Part A & B)',
  'Bank Statements',
  'Investment Proofs (80C, 80D)',
  'Capital Gains / P&L Report',
  'Home Loan Interest Certificate',
  'Previous Year ITR-V Ack',
  'Other Supporting Document',
];

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  caseId,
  userId,
  financialYear,
  folderName,
  documents,
  onDocumentChange,
  allowedDocTypes = DEFAULT_DOC_TYPES,
  isReadOnly = false,
}) => {
  const [selectedDocType, setSelectedDocType] = useState<string>(allowedDocTypes[0] || 'PAN Card');
  const [isDragging, setIsDragging] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<TaxDocument | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<TaxDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileProcess = (file: File) => {
    // Validate file size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit. Please upload a compressed PDF or image.');
      return;
    }

    // Validate extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(extension || '')) {
      toast.error('Please upload a valid PDF, JPG, JPEG, or PNG file.');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const formattedSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const newDoc: TaxDocument = {
        id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        caseId,
        userId,
        financialYear,
        folderName,
        documentType: selectedDocType,
        fileName: file.name,
        fileSize: formattedSize,
        fileType: extension as 'pdf' | 'jpg' | 'jpeg' | 'png',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Uploaded',
        fileDataUrl: dataUrl,
      };

      saveDocument(newDoc);

      const pendingReqs = getRequestsByCase(caseId).filter(r => r.status === 'Pending');
      if (pendingReqs.length > 0) {
        pendingReqs.forEach(req => fulfillAdditionalRequest(req.id, newDoc.id));
      }

      // Check if we need to advance the case from DOCUMENTS_PENDING to CA_ASSIGNMENT_PENDING
      const cases = getCases();
      const currentCase = cases.find(c => c.id === caseId);
      if (currentCase && currentCase.status === 'DOCUMENTS_PENDING') {
        updateCaseStatus(caseId, 'CA_ASSIGNMENT_PENDING');
      }

      setIsUploading(false);
      toast.success(`${selectedDocType} uploaded successfully to ${folderName}.`);
      onDocumentChange();
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error('Failed to read document. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isReadOnly) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDelete = (doc: TaxDocument) => {
    deleteDocument(doc.id);
    setDeleteConfirmDoc(null);
    toast.info(`${doc.documentType} removed from vault.`);
    onDocumentChange();
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Approved':
        return <span className="status-badge badge-success">Approved</span>;
      case 'Under Review':
        return <span className="status-badge badge-info">Under Review</span>;
      case 'Rejected':
        return <span className="status-badge badge-danger">Rejected</span>;
      case 'Additional Document Required':
        return <span className="status-badge badge-warning">Action Req.</span>;
      default:
        return <span className="status-badge badge-neutral">Uploaded</span>;
    }
  };

  return (
    <div className="document-vault-component">
      {/* Upload Zone (if not read-only) */}
      {!isReadOnly && (
        <div className="upload-interactive-section">
          <div className="upload-config-row">
            <div className="form-group doc-type-select-group">
              <label className="form-label form-label-required">Select Document Category</label>
              <select
                className="form-select"
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
              >
                {allowedDocTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="upload-guidelines-box">
              <ShieldCheck size={16} className="text-accent" />
              <span>Target Vault Folder: <strong>{folderName}</strong> ({financialYear})</span>
            </div>
          </div>

          <div
            className={`dropzone-container ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
            />
            <div className="dropzone-icon-box">
              <UploadCloud size={36} />
            </div>
            <div className="dropzone-text">
              <h4>
                {isUploading ? 'Encrypting & Uploading...' : `Click or Drag & Drop ${selectedDocType} Here`}
              </h4>
              <p>Supported Formats: PDF, JPG, PNG (Max 10MB per document)</p>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" disabled={isUploading}>
              Browse Files
            </button>
          </div>
        </div>
      )}

      {/* Documents Vault Table */}
      <div className="uploaded-documents-list-section">
        <div className="vault-header-row flex-between">
          <div className="vault-title-group">
            <h4 className="vault-section-title">Encrypted Document Vault</h4>
            <span className="vault-count-pill">{documents.length} Files Uploaded</span>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="empty-vault-state">
            <FileText size={48} className="empty-vault-icon" />
            <h5>No Documents Uploaded in {folderName} Yet</h5>
            <p>Select your document type above and upload your files for CA evaluation.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table doc-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>File Name</th>
                  <th>File Size</th>
                  <th>Upload Date</th>
                  <th>CA Review Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-type-cell">
                        <FileText size={18} className="doc-icon" />
                        <div>
                          <strong>{doc.documentType}</strong>
                          {doc.isAdditionalDoc && (
                            <span className="addl-tag">Requested by CA</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="doc-filename" title={doc.fileName}>
                        {doc.fileName}
                      </span>
                    </td>
                    <td>
                      <span className="doc-meta-text">{doc.fileSize}</span>
                    </td>
                    <td>
                      <span className="doc-meta-text">{formatDate(doc.uploadDate)}</span>
                    </td>
                    <td>
                      {getStatusBadge(doc.status)}
                      {doc.rejectionReason && (
                        <div className="rejection-note" title={doc.rejectionReason}>
                          Reason: {doc.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="doc-actions-cell">
                        <button
                          className="btn-icon-action"
                          onClick={() => setPreviewDoc(doc)}
                          title="View / Preview Document"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon-action"
                          onClick={() => {
                            if (doc.fileDataUrl) {
                              const a = document.createElement('a');
                              a.href = doc.fileDataUrl;
                              a.download = doc.fileName;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            } else {
                              toast.error('Document file data not available for download.');
                            }
                          }}
                          title="Download Document"
                        >
                          <Download size={16} />
                        </button>
                        {!isReadOnly && (
                          <button
                            className="btn-icon-action text-danger"
                            onClick={() => setDeleteConfirmDoc(doc)}
                            title="Delete Document"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewDoc(null)}
          title={`Document Preview: ${previewDoc.documentType}`}
          subtitle={`File: ${previewDoc.fileName} • ${previewDoc.fileSize} • Uploaded on ${formatDate(previewDoc.uploadDate)}`}
          size="lg"
          footer={
            <button className="btn btn-secondary" onClick={() => setPreviewDoc(null)}>
              Close Preview
            </button>
          }
        >
          <div className="doc-preview-body">
            <div className="doc-preview-security-alert">
              <ShieldCheck size={18} className="text-success" />
              <div>
                <strong>Confidential Tax Filing Record</strong>
                <p>Protected by 256-Bit SSL Encryption. Authorized for CA evaluation only.</p>
              </div>
            </div>

            {previewDoc.fileDataUrl && previewDoc.fileType !== 'pdf' ? (
              <div className="doc-image-preview-wrapper">
                <img src={previewDoc.fileDataUrl} alt={previewDoc.documentType} />
              </div>
            ) : (
              <div className="doc-pdf-mock-view">
                <FileText size={64} className="pdf-view-icon" />
                <h4>{previewDoc.fileName}</h4>
                <p>Standard Protected Document ({previewDoc.fileType.toUpperCase()})</p>
                <div className="pdf-mock-details">
                  <div>Document Category: <strong>{previewDoc.documentType}</strong></div>
                  <div>Target Assessment Folder: <strong>{previewDoc.folderName}</strong></div>
                  <div>CA Review Status: <strong>{previewDoc.status}</strong></div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDoc && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirmDoc(null)}
          title="Confirm Document Removal"
          size="sm"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmDoc(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirmDoc)}
              >
                Delete File
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to delete <strong>{deleteConfirmDoc.fileName}</strong> ({deleteConfirmDoc.documentType}) from your secure vault?
          </p>
        </Modal>
      )}
    </div>
  );
};
