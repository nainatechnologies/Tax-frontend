import React, { useState } from 'react';
import { UserCheck, Star, Award, Shield, Check } from 'lucide-react';
import { TaxCase, CharteredAccountant } from '../types';
import { getCAs, assignCAToCase } from '../utils/storage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import './AssignCAModal.css';

interface AssignCAModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxCase: TaxCase;
  onAssigned: () => void;
}

export const AssignCAModal: React.FC<AssignCAModalProps> = ({
  isOpen,
  onClose,
  taxCase,
  onAssigned,
}) => {
  const cas = getCAs();
  const [selectedCAId, setSelectedCAId] = useState<string>(cas[0]?.id || '');
  const toast = useToast();

  const handleAssign = () => {
    const selectedCA = cas.find((c) => c.id === selectedCAId);
    if (!selectedCA) {
      toast.error('Please select a Chartered Accountant to assign.');
      return;
    }

    assignCAToCase(taxCase.id, selectedCA);
    toast.success(`CA assigned successfully: ${selectedCA.fullName}.`);
    onAssigned();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Chartered Accountant"
      subtitle={`Case #${taxCase.id} • ${taxCase.userName} • ${taxCase.serviceTitle} (${taxCase.financialYear})`}
      size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleAssign}>
            <UserCheck size={16} /> Confirm &amp; Assign CA
          </button>
        </>
      }
    >
      <div className="assign-ca-modal-body">
        <p className="assign-instruction">
          Select an empaneled Chartered Accountant with matching specialization and current case bandwidth:
        </p>

        <div className="ca-selection-grid">
          {cas.map((ca) => {
            const isSelected = selectedCAId === ca.id;
            return (
              <div
                key={ca.id}
                className={`ca-select-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedCAId(ca.id)}
              >
                <div className="ca-card-top flex-between">
                  <div className="ca-id-badge">
                    <Shield size={12} /> {ca.employeeId}
                  </div>
                  <span className={`ca-avail-badge ${ca.status === 'active' ? 'avail' : 'busy'}`}>
                    {ca.status === 'active' ? 'Available' : 'High Load'}
                  </span>
                </div>

                <div className="ca-card-main">
                  <h4 className="ca-name">{ca.fullName}</h4>
                  <p className="ca-spec">{ca.specialization}</p>
                </div>

                <div className="ca-card-metrics">
                  <div>
                    <span className="metric-lbl">Experience:</span>
                    <strong>{ca.experience}</strong>
                  </div>
                  <div>
                    <span className="metric-lbl">Active Cases:</span>
                    <strong>{ca.activeCases} Active</strong>
                  </div>
                  <div>
                    <span className="metric-lbl">Rating:</span>
                    <strong className="text-warning">★ {ca.rating}</strong>
                  </div>
                </div>

                <div className="ca-select-indicator">
                  {isSelected ? (
                    <span className="selected-tag">
                      <Check size={14} /> Selected
                    </span>
                  ) : (
                    <span className="select-tag">Click to Select</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
