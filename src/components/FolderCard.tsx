import React from 'react';
import { Folder, FolderCheck, FileText, ArrowRight, Clock } from 'lucide-react';
import './FolderCard.css';

export interface FolderCardProps {
  id: string;
  folderName: string;
  title: string;
  financialYear: string;
  assessmentYear: string;
  documentCount: number;
  status: string;
  isActive?: boolean;
  requiredDocs?: string;
  onOpen: (folderName: string) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  id,
  folderName,
  title,
  financialYear,
  assessmentYear,
  documentCount,
  status,
  isActive = false,
  requiredDocs,
  onOpen,
}) => {
  const getStatusClass = (st: string) => {
    switch (st) {
      case 'COMPLETED':
        return 'status-completed';
      case 'PAYMENT_PENDING':
      case 'PAID':
        return 'status-payment';
      default:
        return '';
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'COMPLETED':
        return <span className="status-badge badge-success">Completed</span>;
      case 'PAID':
        return <span className="status-badge badge-success">Paid • Ready to File</span>;
      case 'PAYMENT_PENDING':
        return <span className="status-badge badge-warning">Payment Pending</span>;
      case 'ADDITIONAL_DOCUMENT_REQUIRED':
      case 'ACTION_REQUIRED':
        return <span className="status-badge badge-danger">Action Required</span>;
      case 'DOCUMENTS_COMPLETED':
        return <span className="status-badge badge-success">Documents Completed</span>;
      case 'UNDER_REVIEW':
        return <span className="status-badge badge-info">Under Review</span>;
      case 'CA_ASSIGNED':
        return <span className="status-badge badge-info">CA Assigned</span>;
      default:
        return <span className="status-badge badge-neutral">Documents Pending</span>;
    }
  };

  return (
    <div
      id={`folder-card-${id}`}
      className={`folder-card ${isActive ? 'active-folder' : ''} ${getStatusClass(status)}`}
      onClick={() => onOpen(folderName)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpen(folderName);
        }
      }}
    >
      <div className="folder-card-top">
        <div className={`folder-icon-wrap ${documentCount > 0 ? 'has-docs' : ''}`}>
          {documentCount > 0 ? <FolderCheck size={28} /> : <Folder size={28} />}
        </div>
        <div>{getStatusBadge(status)}</div>
      </div>

      <div>
        <h3 className="folder-card-title">📁 {title}</h3>
        <p className="folder-card-subtitle">
          {financialYear} • {assessmentYear}
        </p>
        {requiredDocs && (
          <p className="folder-card-subtitle" style={{ color: 'red', marginTop: '4px', fontWeight: '500' }}>
            Required: {requiredDocs}
          </p>
        )}
      </div>

      <div className="folder-stats-row">
        <div className="folder-doc-count">
          <FileText size={16} />
          <span>Documents: <strong>{documentCount}</strong></span>
        </div>
        <small style={{ color: 'var(--text-muted)' }}>Vault Storage</small>
      </div>

      <div className="folder-card-footer">
        <span className="folder-open-btn">
          Open Folder <ArrowRight size={16} />
        </span>
      </div>
    </div>
  );
};
