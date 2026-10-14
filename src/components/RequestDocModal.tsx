import React, { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import { TaxCase, AdditionalDocRequest } from '../types';
import { saveAdditionalRequest } from '../utils/storage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import './RequestDocModal.css';

interface RequestDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxCase: TaxCase;
  caName: string;
  onRequestSent: () => void;
}

export const RequestDocModal: React.FC<RequestDocModalProps> = ({
  isOpen,
  onClose,
  taxCase,
  caName,
  onRequestSent,
}) => {
  const [documentName, setDocumentName] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName.trim()) {
      toast.error('Please enter the name of the requested document.');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a legal or calculation reason.');
      return;
    }

    const newRequest: AdditionalDocRequest = {
      id: `req-${Date.now()}`,
      caseId: taxCase.id,
      documentName: documentName.trim(),
      reason: reason.trim(),
      description: description.trim() || 'Uploaded file must be clear and signed where applicable.',
      dueDate,
      priority,
      requestedBy: caName,
      requestedAt: new Date().toISOString(),
      status: 'Pending',
    };

    saveAdditionalRequest(newRequest);
    toast.success('Additional document request sent.');
    onRequestSent();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Additional Document"
      subtitle={`Client: ${taxCase.userName} • Case #${taxCase.id} • ${taxCase.serviceTitle}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="request-doc-form">
        <div className="form-group">
          <label className="form-label form-label-required">Requested Document Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Home Loan Interest Certificate, Foreign Remittance Advice, Form 26AS"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">Tax Compliance / Audit Reason</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. To claim Sec 24(b) interest deduction of ₹2,00,000"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Specific Instructions for Taxpayer</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="Specify required financial year, bank seal, or signature requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Submission Due Date</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
            >
              <option value="High">High (Filing Blocked)</option>
              <option value="Medium">Medium (Verification)</option>
              <option value="Low">Low (Optional)</option>
            </select>
          </div>
        </div>

        <div className="modal-actions-bar">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Send size={16} /> Request Document
          </button>
        </div>
      </form>
    </Modal>
  );
};
